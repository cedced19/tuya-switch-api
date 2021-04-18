# tuya-switch-api
A module to control my Tuya switch.

## tuya = new Tuya(email, password, region, countryCode, platform)

This function will enter all data you need to auth.

## tuya.auth(cb)

Auth to Tuya API

cb(err) (*optional*): callback 

## tuya.refresh(cb)

Auth to Tuya API (again)

cb(err) (*optional*): callback 

## tuya.discover(cb)

Discover all your device connected

cb(err, devices) (*optional*): callback: **devices** list

## tuya.isConnected()

Return a boolean, true if there is no need to refresh authentication

## tuya.connect(cb)

Auth to Tuya API (or check if authenticated) with `tuya.auth` or `tuya.refresh`

cb(err) (*optional*): callback 