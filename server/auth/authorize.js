'use strict'

const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJWT = passportJWT.ExtractJwt
const JWTStrategy = passportJWT.Strategy
const AppDBHandler = require('../db/api/appdbhandler.js')


/**
 * [JWT Strategy validate function which validates the app routes which are protected by the 
 * JWT strategy]
 * @param  {Object} passport [takes passport as a object]
 */
module.exports = (passport) =>{
    var jwtOptions = {}
    jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken()
    jwtOptions.secretOrKey = 'secret'
    jwtOptions.algorithms = 'HS256'
    passport.use(new JWTStrategy( jwtOptions, (jwt_payload, done)=>{
        new AppDBHandler().getAppByClientID(jwt_payload.clientid).then((app)=>{
            var oApp = app
            delete oApp.credentials
            if (app.credentials.clientid != jwt_payload.clientid){
                return done(null, false)
            }else {                
                return done(null, oApp)
            }
        }).catch((err)=>{
            return done(err, false)
        })
    }))
}
