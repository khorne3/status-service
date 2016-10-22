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

describe('Testing adding a service', function () {
    var server;
    beforeEach(function () {
        server = require('../server');
        // Adding mock data to POST endpoint
        request(server)
            .post('/api/status')
            .send({hostName: 'localhost', serviceName: 'service name', value: 0})
            .expect(200, '{"message":"Status submission successful","payload":[{"hostName":"localhost","serviceName":"service name","value":"Offline"}]}', done);

    });

    afterEach(function () {
        server.close();
    });


    it.skip('Returns added service after one was added', function testPath(done) {
        var checkRsp = function (res) {
            if (!('serviceName' in res.body[0])) throw new Error("missing serviceName key");
            if (!('value' in res.body[0])) throw new Error("missing value key");
        };

        request(server)
            .get('/api/status')
            .expect(200)
            .expect(checkRsp)
            .end(done);
    });

    it.skip('Returns added service when requesting it by id', function testPath(done) {
        var serviceId;
        var getServiceId = function (res) {
            if (!('serviceName' in res.body[0])) throw new Error("missing serviceName key");
            if (!('value' in res.body[0])) throw new Error("missing value key");
            serviceId = res.body[0].id;
        };
        var checkRsp = function (res) {
            if (!('serviceName' in res.body)) throw new Error("missing serviceName key");
            if (!('value' in res.body)) throw new Error("missing value key");
        };

        request(server)
            .get('/api/status')
            .expect(200)
            .expect(getServiceId)
            .end(done);
    });
});
