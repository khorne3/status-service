var request = require('supertest');
describe('Testing express server', function () {
    var server;
    beforeEach(function () {
        server = require('../server');
    });
    afterEach(function () {
        server.close();
    });
    it('Responds to /', function testRoot(done) {
        request(server)
            .get('/')
            .expect(302, done);
    });
    it('Returns 404 for everything else', function testPath(done) {
        request(server)
            .get('/api/no/endpoint')
            .expect(404, done);
    });
    it('Returns empty array for api/status', function testPath(done) {
        request(server)
            .get('/api/status')
            .expect(200, [], done);
    });
    it('Returns empty array if no service added', function testPath(done) {
        request(server)
            .get('/api/status')
            .expect(200, [], done);
    });
    it('Returns 404 if posting service without serviceName', function testPath(done) {
        request(server)
            .post('/api/status')
            .send({hostName: 'localhost', value: 1})
            .expect(400, 'Error 400: Post syntax incorrect.', done);
    });
    it('Returns 404 if posting service without value', function testPath(done) {
        request(server)
            .post('/api/status')
            .send({serviceName: 'service name'})
            .expect(400, 'Error 400: Post syntax incorrect.', done);
    });

    it('Returns true service when deleting it by id', function testPath(done) {
        var serviceId;
        var getServiceId = function (res) {
            if (!('serviceName' in res.body[0])) throw new Error("missing serviceName key");
            if (!('value' in res.body[0])) throw new Error("missing value key");
            serviceId = res.body[0].id;
        };
        var checkRsp = function (res) {
            if (false) throw new Error("Not deleted correctly");
        };

        request(server)
            .get('/api/status')
            .expect(200)
            .expect(getServiceId)
            .end(function () {
                request(server)
                    .delete('/api/status/' + serviceId)
                    .expect(checkRsp)
                    .end(done);
            });
    });

    it('Returns 404 if deleting service without id', function testPath(done) {
        var serviceId;
        var getServiceId = function (res) {
            if (!('serviceName' in res.body[0])) throw new Error("missing serviceName key");
            if (!('value' in res.body[0])) throw new Error("missing value key");
            serviceId = res.body[0].id;
        };
        var checkRsp = function (res) {
            if (false) throw new Error("Not deleted correctly");
        };

        request(server)
            .get('/api/status')
            .expect(200)
            .expect(getServiceId)
            .end(function () {
                request(server)
                    .delete('/api/status/' + serviceId)
                    .expect(400, 'Error 400: Delete syntax incorrect.')
                    .end(done);
            });
    });
});

describe('Testing HTML response', function () {
    var server = require('../server');

    it('Checking HTML responses', function testPath(done) {
        var checkRsp = function (res) {
            // In this case, a text would be returned, and it is the HTML that gets rendered
            /* Sample HTML response attached below
            * <!DOCTYPE html><html><head><title>Service Status</title><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/flatly/bootstrap.min.css"><link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700" rel="stylesheet"><link rel="stylesheet" href="../style.css"></head><body><nav class="navbar navbar-inverse"><div class="container-fluid"><div class="navbar-header"><a class="navbar-brand" href="/">Service Status</a></div></div></nav><div class="container"><div class="row"><div class="col-lg-12"><div class="well"><span class="text-success">All Services Operational</span><span class="small pull-right">Refreshed less than a minute ago</span></div></div></div><div class="row"><div class="col-lg-12"><ul class="list-group"></ul></div></div><div class="row"><div class="col-lg-12"><a class="btn btn-default pull-right" href="/api/status">Refresh</a></div></div></div></body></html>*/
            if (!res.text) throw new Error("unexpected results, HTML text should have been returned");

        };

        request(server)
            .get('/api/status')
            .expect(200)
            .expect(checkRsp)
            .end(done);
    });

    it('Checking hostName endpoint', function(done) {
        var checkRsp = function (res) {
            if (!res.text) throw new Error("unexpected results, HTML text should have been returned");
        };

        request(server)
            .get('/api/status/hello')
            .expect(200)
            .expect(checkRsp)
            .end(done);
    });


});
