var request = require('supertest');
describe('Testing HTML response', function () {
    var server = require('../server');

    it('Checking for null HTML responses', function testPath(done) {
        var checkRsp = function (res) {
            // In this case, a text would be returned, and it is the HTML that gets rendered
            /* Sample HTML response attached below
             * <!DOCTYPE html><html><head><title>Service Status</title><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/flatly/bootstrap.min.css"><link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700" rel="stylesheet"><link rel="stylesheet" href="../style.css"></head><body><nav class="navbar navbar-inverse"><div class="container-fluid"><div class="navbar-header"><a class="navbar-brand" href="/">Service Status</a></div></div></nav><div class="container"><div class="row"><div class="col-lg-12"><div class="well"><span class="text-success">All Services Operational</span><span class="small pull-right">Refreshed less than a minute ago</span></div></div></div><div class="row"><div class="col-lg-12"><ul class="list-group"></ul></div></div><div class="row"><div class="col-lg-12"><a class="btn btn-default pull-right" href="/api/status">Refresh</a></div></div></div></body></html>*/
            if (!res.text) throw new Error("unexpected results, HTML text should have been returned");

        };

        request(server)
            .get('/')
            .expect(200)
            .expect(checkRsp)
            .end(done);
    });

    it('Checking root document for expected content type', function (done) {

        request(server)
            .get('/')
            .expect(200)
            .expect('content-type', 'text/html; charset=UTF-8')
            .expect('content-length', '2423')
            .end(done);
    });
});