/**
 * Created by npeitek on 01/27/14.
 *
 * this file tests if the user handling works as expected
 */

// set up environment
//var http = require('http');
//var app = require('../server/app')();
var should = require('should');

// get customer api
var UserSchema = require('../server/schemas/users');
var userApi = require("../server/api/user-api");

var helper = require('../server/modules/helper');

describe("User Account Functionality", function(){
    var dummyUser = new UserSchema.userModel({
        email: "tests@futurestud.io",
        phone: "123456789",
        password: "password",
        auth_token: helper.createRandomString(32),
        auth_token_issued: new Date(),
        register_date: new Date(),
        subscriptions: [],
        role: "Customer"
    });

    // save the dummy user before starting the tests
    before(function(done){
        dummyUser.save(function (err) {
            if (err) {
                throw(err)
            }
            else {
                done();
            }
        });
    });

    // remove everything at the end
    after(function(done){
        UserSchema.userModel.remove(function() {
            done();
        });
    });

    /*
    // try to register a new user
    it("register new user - valid data", function(done){
        var mockReq = {};
        mockReq.body = {};
        mockReq.body.email = "info@futurestud.io";
        mockReq.body.password = "testtest";
        mockReq.body.phone = "123456789"

        userApi.signupUser(mockReq, function(result){
            if (!result.successful) {
                throw(result.error);
            }

            currentUser = result.result;
            done();
        });
    });
    */

    it("register new user - password too short", function(done){
        var mockReq = {};
        mockReq.body = {};
        mockReq.body.email = "info@futurestud.io";
        mockReq.body.password = "123";
        mockReq.body.phone = "123456789"

        userApi.signupUser(mockReq, function(err, result){
            if (err) {
                return done();
            }

            throw("registration should be declined");
        });
    });

    it("register new user - no valid email", function(done){
        var mockReq = {};
        mockReq.body = {};
        mockReq.body.email = "@futurestud.io";
        mockReq.body.password = "123456789";
        mockReq.body.phone = "123456789"

        userApi.signupUser(mockReq, function(err, result){
            if (err) {
                return done();
            }

            throw("registration should be declined");
        });
    });

    it("get user by auth_token", function(done){
        var mockReq = {};
        mockReq.headers = {};
        mockReq.headers.auth_token = dummyUser.auth_token;

        userApi.checkAuthToken(mockReq, function(err, user){
            if (err) {
                throw("check auth token failed");
            }

            if (user == undefined) {
                throw("no user returned");
            }

            if (user.email !== dummyUser.email) {
                throw("email is incorrect");
            }

            done();
        });
    });

    it("get user by invalid auth_token", function(done){
        var mockReq = {};
        mockReq.headers = {};
        mockReq.headers.auth_token = "some_random_non_existing_auth_token";

        userApi.checkAuthToken(mockReq, function(err, user){
            if (!err) {
                throw("this should not return a user");
            }

            done();
        });
    });


    // todo add login check
    /*
     it("dummy user - login", function(done){
     var mockReq = {};
     mockReq.body = {};
     mockReq.body.email = "@futurestud.io";
     mockReq.body.password = "123456789";
     mockReq.body.phone = "123456789"

     userApi.signupUser(mockReq, function(result){
     if (!result.successful) {
     done();
     }

     throw("registration should be declined");
     });
     });
     */
});