var _ = require('lodash');
var path = require('path');

module.exports = function (app) {
    var _services = [];
    /**
     * @api {get} / Request homepage
     * @apiName Homepage
     * @apiGroup Homepage
     */
    app.get('/', function (req, res) {
        res.sendFile('views/index.html', {root: path.join(__dirname, '../static')});
    });

    /**
     * @api {get} /api/status Status
     * @apiName status
     * @apiGroup Status
     * @apiSuccess {Array} _ all data in `_services`
     * @apiSuccess {String} _.0.hostName hostName of the service update
     * @apiSuccess {String} _.0.serviceName Name of the service
     * @apiSuccess {any} _.0.isOnline Information contained in the update.
     */
    app.get('/api/status', function (req, res) {
        res.json({services: _services});
    });

    /**
     * @api {post} /api/status Update status
     * @apiGroup Status
     * @apiName status
     */
    app.post('/api/status', function (req, res) {
        var serviceIsOnline = "";
        if (!req.body.hasOwnProperty('hostName') || !req.body.hasOwnProperty('serviceName') || !req.body.hasOwnProperty('isOnline')) {
            res.statusCode = 400;
            return res.send('Error 400: Post syntax incorrect.');
        } else {
            if (req.body.isOnline === 1) {
                serviceIsOnline = "Online";
            } else if (req.body.isOnline === 0) {
                serviceIsOnline = "Offline";
            } else {
                res.statusCode = 401;
                return res.send('Error 401: Post syntax has an invalid isOnline value.');
            }
            var newService = {
                hostName: req.body.hostName,
                serviceName: req.body.serviceName,
                isOnline: serviceIsOnline
            };
            _services.push(newService);

            // json needs to be returned rather than a random string
            res.status(200).json({message: 'Status submission successful', payload: _services});
        }
    });

    /**
     * @api {get} /api/status/:hostName Request service information
     * @apiGroup Host
     * @apiName GetHost
     * @apiParam {String} hostName Service hostName.
     */
    app.get('/api/status/:hostName', function (req, res) {

        try {
            var service = _services.filter(function (s) {
                return s.hostName == req.params.hostName;
            })[0];
            if (typeof service === 'undefined') {
                throw new Error(undefined);
            } else {
                res.statusCode = 200;
                res.send(service);
            }

        }
        catch (e) {
            res.statusCode = 404;
            res.send('Error: No data found for host ' + req.params.hostName);
        }
    });

    /**
     * @api {delete} /api/status/:id Request service information by Service Hostname ID
     * @apiGroup Host
     * @apiName DeleteHost
     * @apiParam {String} id Service Hostname ID.
     */
    app.delete('/api/status/:id', function (req, res) {
        var hostID = req.params.id;
        var isDeleted = 0;

        function removeObj(obj, prop, id){
            return obj.filter(function(val){
                return val[prop] !== id;
            });
        }

        if (hostID === 'undefined'){
            res.statusCode = 404;
            res.send('Error 404: Delete parameter invalid, no host found');
            return;
        } else {
            _services = removeObj(_services, 'hostName', hostID);
            res.statusCode = 200;
            res.send('Deleted ' + hostID + ' successfully');
        }
    });
};