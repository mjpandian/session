'use strict';
var jwt = require('jsonwebtoken'); //https://www.npmjs.com/package/jsonwebtoken
var log = require('../../lib/log');
var token = require('../../lib/token');
var response = require('../../lib/response');
var config = require(`../../config/${process.env.NODE_ENV}.json`);
var constants = require('../../lib/constants');

module.exports = function(event, context, cb) {    
    
    token.parseAuthorizationHeader(event.headers[constants.AUTHORIZATION_HEADER])
        .then(token => {
            let at_expiresIn = 0;
            try {
                at_expiresIn = jwt.decode(token).exp - Math.floor(Date.now() / 1000);        
            } catch (e) {
                log.error(e);
                return cb(null, response.create(500, {
                    message:'Error in getting accessToken Expiry date' 
                }, true));
            } 

            if(at_expiresIn < 0) {
                log.info('received expired token');
                return cb(null, response.create(401, {
                        message : 'Token expired'                    
                    }, true));

            } else {    
                return cb(null, response.create(200, { access_token_expires_in: at_expiresIn }, true));
            }        
        })
        .catch(err => {

            return cb(null, response.create(500, {
                        message : err.message
                    }, true));
        });    
};