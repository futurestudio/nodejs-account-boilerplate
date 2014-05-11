/**
 * Created by npeitek on 12/18/13.
 */

var http = require('http');
var app = require('../server/app')('test');
var supertest = require('supertest');
var should = require('should');

describe('Server - HTTP tests without data', function() {

    describe('GET start page', function() {
        it('should return a 200 status code',
            function (done) {

                supertest(app)
                    .get('/')
                    .expect(200)
                    .end(function (err, res) {
                        res.status.should.equal(200);
                        done();
                    });

            });
    });

    describe('GET /signup', function() {
        it('should return a 200 status code',
            function (done) {

                supertest(app)
                    .get('/signup')
                    .expect(200)
                    .end(function (err, res) {
                        res.status.should.equal(200);
                        done();
                    });

            });
    });

    describe('GET /login', function() {
        it('should return a 200 status code',
            function (done) {

                supertest(app)
                    .get('/login')
                    .expect(200)
                    .end(function (err, res) {
                        res.status.should.equal(200);
                        done();
                    });

            });
    });

    describe('GET /notthere', function() {
        it('should return a 404 status code',
            function (done) {

                supertest(app)
                    .get('/notthere')
                    .expect(404)
                    .end(function (err, res) {
                        res.status.should.equal(404);
                        done();
                    });

            });
    });
});