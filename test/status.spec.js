var request = require('supertest');

describe('Testing /api/status endpoint', function () {
    beforeEach(function () {
        server = require('../server');
    });
    afterEach(function () {
        server.close();
    });
    it('Responds to /', function testRoot(done) {
        request(server)
            .get('/')
            .expect(200, done);
    });
    it('Returns 404 for everything else', function testPath(done) {
        request(server)
            .get('/api/no/endpoint')
            .expect(404, done);
    });
    it('Returns 200 for /api/status', function testPath(done) {
        request(server)
            .get('/api/status')
            .expect(200, done);
    });
    it('Returns empty array for /api/status', function testPath(done) {
        request(server)
            .get('/api/status')
            .expect(200, {"services": []}, done);
    });
    it('Returns 404 if posting service without serviceName', function testPath(done) {
        request(server)
            .post('/api/status')
            .send({
                hostName: 'localhost',
                value: 1
            })
            .expect(400, 'Error 400: Post syntax incorrect.', done);
    });
    it('Returns 404 if posting service without value', function testPath(done) {
        request(server)
            .post('/api/status')
            .send({
                serviceName: 'service name'
            })
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
            .expect(checkRsp)
            .end(function () {
                request(server)
                    .delete('/api/status/' + serviceId)
                    .expect(404, 'Error 404: Delete parameter invalid, no host found')
                    .end(done);
            });
    });
});

describe('Testing /api/status post endpoint responses', function () {
    beforeEach(function () {
        server = require('../server', { bustCache: true });
    });
    afterEach(function () {
        server.close();
    });

    it('Checking successful post requests, online', function (done) {
        request(server)
            .post('/api/status')
            .send({
                serviceName: 'testService',
                hostName: 'localhost',
                value: 1
            })
            .expect(200)
            .end(done);
    });

    it('Checking successful post requests, offline', function (done) {
        request(server)
            .post('/api/status')
            .send({
                serviceName: 'testService',
                hostName: 'localhost',
                value: 0
            })
            .expect(200)
            .end(done);
    });

    it('Checking for invalid isOnline value', function testPath(done) {
        request(server)
            .post('/api/status')
            .send({
                hostName: 'nyc01.domain.com',
                serviceName: 'spark',
                value: 2
            })
            .expect(401, 'Error 401: Post syntax has an invalid isOnline value.')
            .end(done);
    });
});

describe('Testing /api/status passing a parameter', function () {
    beforeEach(function () {
        delete require.cache[require.resolve('../server')];
        server = require('../server');
    });
    afterEach(function () {
        server.close();
    });

    it('Checking for params does not exist', function (done) {
        request(server)
            .post('/api/status')
            .send({
                hostName: 'sfo010.domain.com',
                serviceName: '/api/brickyard',
                value: 1
            })
            .expect(200, {
                "message": "Status submission successful",
                "payload": [
                    {
                        "hostName": "sfo010.domain.com",
                        "serviceName": "/api/brickyard",
                        "value": "Online"
                    }
                ]
            })
            .end(function () {
                request(server)
                    .get('/api/status/sfo020.domain.com')
                    .expect(404, 'Error: No data found for host sfo020.domain.com')
                    .end(done);
            });
    });

    it('Checking for params exist', function (done) {
        request(server)
            .post('/api/status')
            .send({
                hostName: 'sfo010.domain.com',
                serviceName: '/api/brickyard',
                value: 1
            })
            .expect(200, {
                "message": "Status submission successful",
                "payload": [
                    {
                        "hostName": "sfo010.domain.com",
                        "serviceName": "/api/brickyard",
                        "value": "Online"
                    }
                ]
            })
            .end(function () {
                request(server)
                    .get('/api/status/sfo010.domain.com')
                    .expect(200, {
                        "hostName": "sfo010.domain.com",
                        "serviceName": "/api/brickyard",
                        "value": "Online"
                    })
                    .end(done);
            });
    });

    it('Delete data from /api/status', function (done) {
        request(server)
            .post('/api/status')
            .send({
                hostName: 'sfo010.domain.com',
                serviceName: '/api/brickyard',
                value: 1
            })
            .send({
                hostName: 'sfo020.domain.com',
                serviceName: '/api/shipyard',
                value: 2
            })
            .send({
                hostName: 'sfo030.domain.com',
                serviceName: '/api/stoneyard',
                value: 1
            })
            .expect(200)
            .end(function () {
                request(server)
                    .delete('/api/status/sfo020.domain.com')
                    .expect(200, 'Deleted sfo020.domain.com successfully')
                    .end(function () {
                        request(server)
                            .get('/api/status')
                            .expect(200, {
                                "services": [
                                    {
                                        "hostName": "sfo030.domain.com",
                                        "serviceName": "/api/stoneyard",
                                        "value": "Online"
                                    }
                                ]
                            })
                            .end(done);
                    })
            });
    });

    it('Attempt to delete host not in array', function (done) {
        request(server)
            .delete('/api/status/sfo010.domain.com')
            .expect(404, 'Error 404: No data found for host sfo010.domain.com')
            .end(done);
    });
});