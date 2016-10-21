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
      res.redirect('/api/status');
    });

    /**
    * @api {get} /api/status Status
    * @apiName status
    * @apiGroup Status
    * @apiSuccess {Array} _ all data in `_services`
    * @apiSuccess {String} _.0.hostName hostName of the service update
    * @apiSuccess {String} _.0.serviceName Name of the service
    * @apiSuccess {any} _.0.value Information contained in the update.
    */
    app.get('/api/status', function(req, res){
        res.render('status', { services: _services });
    });

    /**
    * @api {post} /api/status Update status
    * @apiGroup Status
    * @apiName status
    */
    app.post('/api/status',function(req, res){
        var serviceValue = "";
        if(!req.body.hasOwnProperty('hostName') ||
           !req.body.hasOwnProperty('serviceName') ||
           !req.body.hasOwnProperty('value')) {
               res.statusCode = 400;
               return res.send('Error 400: Post syntax incorrect.');
           } else {
               if(req.body.value === 1){
                    serviceValue = "Online";
               } else if(req.body.value === 0) {
                    serviceValue = "Offline";
               } else {
                   res.statusCode = 400;
                   return res.send('Error 401: Post syntax invalid.');
               }
               var newService = {
                   hostName : req.body.hostName,
                   serviceName : req.body.serviceName,
                   value : serviceValue
               };
               _services.push(newService);

              // json needs to be returned rather than a random string
               res.status(200).json({ message: 'Status submission successful', payload: _services });
           }
    });

    /**
    * @api {get} /api/status/:hostName Request service information
    * @apiGroup Host
    * @apiName GetHost
    * @apiParam {String} hostName Service hostName.
    */
    app.get('/api/status/:hostName', function(req, res){
        var service = _services.filter( function (s){
            return s.hostName == req.params.hostName;
        })[0];
        _services.push(service);

        res.render('status', { services: _services });
    });

    /**
    * @api {delete} /api/status/:id Request service information by Service Hostname ID
    * @apiGroup Host
    * @apiName DeleteHost
    * @apiParam {String} id Service Hostname ID.
    */
    app.delete('/api/status/:id', function(req, res){
      if (!req.body.hasOwnProperty('hostName')) {
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
