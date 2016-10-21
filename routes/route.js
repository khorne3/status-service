var _ = require('lodash');
var uuid = require('node-uuid');

module.exports = function (app){
    _services = [];
    /**
    * @api {get} / Request homepage
    * @apiName Homepage
    * @apiGroup Homepage
    */
    app.get('/', function (req, res){
        res.send('Hello World');
    })

    /**
    * @api {get} /api/status Status
    * @apiName status
    * @apiGroup Status
    * @apiSuccess {Array} _ all data in `_services`
    * @apiSuccess {String} _.0.id ID of the service update
    * @apiSuccess {String} _.0.serviceName Name of the service
    * @apiSuccess {any} _.0.value Information contained in the update.
    */
    app.get('/api/status', function(req, res){
        res.send(_services);
    });

    /**
    * @api {post} /api/status Update status
    * @apiGroup Status
    * @apiName SendStatus
    * @apiParam {String} serviceName Mandatory service name
    * @apiParam {any} value Mandatory service status [1,0, compiled, on, off]
    * @apiParam {String} hostName Mandatory endpoint hostname
    */
    app.post('/api/status',function(req, res){
        if(!req.body.hasOwnProperty('serviceName') ||
           !req.body.hasOwnProperty('value') || 
           !req.body.hasOwnProperty('hostName')) {
               res.statusCode = 400;
               return res.send('Error 400: Post syntax incorrect.');
           } else {
               var newService = {
                   id : req.body.hostName,
                   serviceName : req.body.serviceName,
                   value : req.body.value
               };
               _services.push(newService);
               res.json(true);
           }
    });

    /**
    * @api {get} /api/status/:id Request service information by hostName
    * @apiGroup Host
    * @apiName GetHost
    * @apiParam {String} id Service Hostname ID.
    */
    app.get('/api/status/:id', function(req, res){
        var service = _services.filter( function (s){
            return s.id == req.params.id;
        })[0];

        res.json(service);
    });

/**
    * @api {delete} /api/status/:id Request service information by Service Hostname ID
    * @apiGroup Host
    * @apiName DeleteHost
    * @apiParam {String} id Service Hostname ID.
    */
    app.delete('/api/status/:id', function(req, res){
      if (!req.body.hasOwnProperty('id')) {
           res.statusCode = 400;
           return res.send('Error 400: Delete syntax incorrect.');
      } else {
        var service = _services.filter( function (s){
            return s.id == req.params.id;
        })[0];
        res.json(true);
      }
    });
}
