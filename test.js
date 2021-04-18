const Tuya = require('./index.js');
const auth = require('./auth.json');

var myTuya = new Tuya(auth.email, auth.password, "eu", "33", "smart_life");
myTuya.auth(function(err) {
    console.log("auth err ", err);
    myTuya.discover(function(err, body) {
        console.log("discover err ", err);
        console.log("discover body ", body)
    });
})