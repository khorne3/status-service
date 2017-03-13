var request = require('supertest');
serverSetup = function (delCache) {
    server = require('../server', delCache);
};
serverClose = function (done) {
    server.close(done);
};

server = require('../server')

describe('Testing /api/status endpoint', function () {
    beforeEach(function () {
        serverSetup();
    });
    afterEach(function () {
        serverClose();
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
            .expect(200, {"data": []}, done);
    });
    it('Returns 500 if schema validation fails', function testPath(done) {
        request(server)
            .post('/api/status')
            .send({
                hostName: 'localhost',
                value: 1
            })
            .expect(500, done);
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
            if (!('isOnline' in res.body[0])) throw new Error("missing isOnline key");
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
                    .expect(404,{"error":"Delete parameter invalid, no host found","status":404})
                    .end(done);
            });
    });
});

describe('Testing /api/status post endpoint responses', function () {
    beforeEach(function () {
        delete require.cache[require.resolve('../server')];
        serverSetup();
    });
    afterEach(function () {
        serverClose();
    });

    it('Checking successful post requests, online', function (done) {
        request(server)
            .post('/api/status')
            .send({
                "host": "nyc010.domain.com",
                "services": [
                    {
                        "name": "boxy",
                        "is_online": 1,
                        "update_at": "2014-11-14T16:36:31Z",
                        "mesg": "OutOfMemory system crashed"
                    },
                    {
                        "name": "mongo",
                        "is_online": 1,
                        "update_at": "2014-11-14T16:36:31Z",
                        "mesg": "System healthy"
                    }
                ]
            })
            .expect(200,{
                "message": "Status submission successful",
                "payload": [
                    {
                        "name": "boxy",
                        "is_online": "Online",
                        "update_at": "2014-11-14T16:36:31Z",
                        "mesg": "OutOfMemory system crashed"
                    },
                    {
                        "name": "mongo",
                        "is_online": "Online",
                        "update_at": "2014-11-14T16:36:31Z",
                        "mesg": "System healthy"
                    }
                ]
            })
            .end(done);
    });

    it('Checking successful post requests, offline', function (done) {
        request(server)
            .post('/api/status')
            .send({
                "host": "nyc010.domain.com",
                "services": [
                    {
                        "name": "boxy",
                        "is_online": 0,
                        "update_at": "2014-11-14T16:36:31Z",
                        "mesg": "OutOfMemory system crashed"
                    },
                    {
                        "name": "mongo",
                        "is_online": 0,
                        "update_at": "2014-11-14T16:36:31Z",
                        "mesg": "System healthy"
                    }
                ]
            })
            .expect(200,{
                "message": "Status submission successful",
                "payload": [
                    {
                        "name": "boxy",
                        "is_online": "Offline",
                        "update_at": "2014-11-14T16:36:31Z",
                        "mesg": "OutOfMemory system crashed"
                    },
                    {
                        "name": "mongo",
                        "is_online": "Offline",
                        "update_at": "2014-11-14T16:36:31Z",
                        "mesg": "System healthy"
                    }
                ]
            })
            .end(done);
    });

    it('Checking for invalid isOnline value', function testPath(done) {
        request(server)
            .post('/api/status')
            .send({
                "host": "nyc010.domain.com",
                "services": [
                    {
                        "name": "boxy",
                        "is_online": 2,
                        "update_at": "2014-11-14T16:36:31Z",
                        "mesg": "OutOfMemory system crashed"
                    },
                    {
                        "name": "mongo",
                        "is_online": 1,
                        "update_at": "2014-11-14T16:36:31Z",
                        "mesg": "System healthy"
                    }
                ]
            })
            .expect(400,{
                "error": "Post syntax has an invalid isOnline value.",
                "data": {
                    "name": "boxy",
                    "is_online": 2,
                    "update_at": "2014-11-14T16:36:31Z",
                    "mesg": "OutOfMemory system crashed"
                }
            })
            .end(done);
    });
});

describe('Testing /api/status passing a parameter', function () {
    beforeEach(function () {
        serverSetup('{ bustCache: true }');
    });
    afterEach(function () {
        serverClose();
    });

    it('Checking for params does not exist', function (done) {
        request(server)
            .post('/api/status')
            .send({
                "host": "nyc010.domain.com",
                "services": [
                    {
                        "name": "boxy",
                        "is_online": 1,
                        "update_at": "2014-11-14T16:36:31Z",
                        "mesg": "OutOfMemory system crashed"
                    },
                    {
                        "name": "mongo",
                        "is_online": 1,
                        "update_at": "2014-11-14T16:36:31Z",
                        "mesg": "System healthy"
                    }
                ]
            })
            .expect(200, {
                "message": "Status submission successful",
                "payload": [
                    {
                        "name": "boxy",
                        "is_online": "Online",
                        "update_at": "2014-11-14T16:36:31Z",
                        "mesg": "OutOfMemory system crashed"
                    },
                    {
                        "name": "mongo",
                        "is_online": "Online",
                        "update_at": "2014-11-14T16:36:31Z",
                        "mesg": "System healthy"
                    }
                ]
            })
            .end(function () {
                request(server)
                    .get('/api/status/sfo020.domain.com')
                    .expect(404,{
                        "error": "No data found for host sfo020.domain.com",
                        "status": 404
                    })
                    .end(done);
            });
    });

    it('Checking for params exist', function (done) {
        request(server)
            .post('/api/status')
            .send({
                "host": "nyc010.domain.com",
                "services": [
                    {
                        "name": "boxy",
                        "is_online": 1,
                        "update_at": "2014-11-14T16:36:31Z",
                        "mesg": "OutOfMemory system crashed"
                    },
                    {
                        "name": "mongo",
                        "is_online": 1,
                        "update_at": "2014-11-14T16:36:31Z",
                        "mesg": "System healthy"
                    }
                ]
            })
            .expect(200, {
                "message": "Status submission successful",
                "payload": [
                    {
                        "name": "boxy",
                        "is_online": "Online",
                        "update_at": "2014-11-14T16:36:31Z",
                        "mesg": "OutOfMemory system crashed"
                    },
                    {
                        "name": "mongo",
                        "is_online": "Online",
                        "update_at": "2014-11-14T16:36:31Z",
                        "mesg": "System healthy"
                    }
                ]
            })
            .end(function () {
                request(server)
                    .get('/api/status/nyc010.domain.com')
                    .expect(200,{
                        "host": "nyc010.domain.com",
                        "services": [
                            {
                                "name": "boxy",
                                "is_online": "Online",
                                "update_at": "2014-11-14T16:36:31Z",
                                "mesg": "OutOfMemory system crashed"
                            },
                            {
                                "name": "mongo",
                                "is_online": "Online",
                                "update_at": "2014-11-14T16:36:31Z",
                                "mesg": "System healthy"
                            }
                        ]
                    })
                    .end(done);
            });
    });

    it('Attempt to delete host not in array', function (done) {
        request(server)
            .delete('/api/status/sfo010.domain.com')
            .expect(200,{ data: 'Deleted sfo010.domain.com successfully', status: 200 })
            .end(done);
    });
});