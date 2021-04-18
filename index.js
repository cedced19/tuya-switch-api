const got = require('got');

function Tuya(email, password, region, countryCode, platform) {
    this.email = email;
    this.password = password;
    this.region = region;
    this.platform = platform;
    this.from = 'tuya';
    this.countryCode = countryCode;
    this.expireDate = new Date();
    this.accessToken = '';
    this.refreshToken = '';
    this.url = `https://px1.tuya${region}.com/homeassistant/`; // use homeassistant api
}
Tuya.prototype.auth = async function(cb) {
    if (typeof cb == 'undefined') {
        cb = function() {};
    }
    var searchParams = new URLSearchParams({
        userName: this.email,
        password: this.password,
        from: this.from,
        countryCode: this.countryCode,
        bizType: this.platform
    });
    var { body } = await got.post(this.url + 'auth.do', { searchParams });
    body = JSON.parse(body);
    if (body.hasOwnProperty('responseStatus') && body.responseStatus == 'error') {
        return cb(body.errorMsg)
    }
    this.refreshToken = body.refresh_token;
    this.accessToken = body.access_token;
    var date = new Date();
    date.setTime(new Date().getTime() + 8640000);
    this.expireDate = date;
    cb(null);
}
Tuya.prototype.isConnected = function() {
    var date = new Date();
    return this.expireDate > date;
}
Tuya.prototype.refresh = async function(cb) {
    if (typeof cb == 'undefined') {
        cb = function() {};
    }
    var searchParams = new URLSearchParams({
        refresh_token: this.refreshToken,
        grant_type: 'refresh_token'
    });
    var { body } = await got.post(this.url + 'access.do', { searchParams });
    body = JSON.parse(body);
    if (body.hasOwnProperty('responseStatus') && body.responseStatus == 'error') {
        return cb(body.errorMsg)
    }
    this.refreshToken = body.refresh_token;
    this.accessToken = body.access_token;
    date = new Date();
    date.setTime(new Date().getTime() + 8640000);
    this.expireDate = date;
    cb(null);
}
Tuya.prototype.connect = function(cb) {
    if (typeof cb == 'undefined') {
        cb = function() {};
    }
    if (this.isConnected()) {
        cb(null);
    } else {
        if (this.refreshToken == '') {
            this.auth(cb);
        } else {
            this.refresh(cb)
        }
    }
}
Tuya.prototype.discover = async function(cb) {
    if (typeof cb == 'undefined') {
        cb = function() {};
    }

    var { body } = await got.post(this.url + 'skill', {
        json: {
            header: { name: 'Discovery', namespace: 'discovery', payloadVersion: 1 },
            payload: { accessToken: this.accessToken }
        }
    });
    try {
        body = JSON.parse(body);
    } catch (error) {
        return cb(error)
    }
    cb(null, body.devices);
}

module.exports = Tuya;