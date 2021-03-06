'use strict';

const proxyquire = require('proxyquire');
const chai = require('chai');
const sinon = require('sinon');
const assert = chai.assert;
const expect = chai.expect;
const testHelper = require('../../util/testHelper');
const jwt = require('jsonwebtoken');
const constants = require('../../lib/constants');
const getSession = require('./getSession');

describe('getSession', function() {
    beforeEach(function() {
        this.sinon = sinon.sandbox.create();        
    });

    afterEach(function() {
        this.sinon.restore();        
    });

    it('should return time left until expiration of valid access token', function(done) {
        //setup
        let d = new Date();
        d.setFullYear(d.getFullYear() + 1);
        let expiration = Math.floor(d / 1000);
        let token = jwt.sign({}, 'secret', { expiresIn: expiration });

        let headers = {};
        headers[constants.AUTHORIZATION_HEADER] = `Bearer ${token}`;

        let event = {
            headers: headers
        };

        //run
        getSession(event, {}, (err, data) => {
            //verify
            testHelper.check(done, () => {                
                assert.equal(err, null);
                assert.equal(data.statusCode, 200);
                let body = JSON.parse(data.body);
                expect(body).to.have.property('access_token_expires_in');
                expect(body.access_token_expires_in).to.be.a('number');
                //subtracting 5 seconds to account for any latency in test run
                expect(body.access_token_expires_in).to.be.within(expiration - 5, expiration);
            });

        });

    });
});