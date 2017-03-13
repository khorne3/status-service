/* jshint node: true */
// var _ = require('lodash');
var path = require('path');
var validate = require('express-jsonschema').validate;

module.exports = function (app) {
    "use strict";
    var _services = [];
    /**
     *  JSON Schema For /api/status post
     * @type {{type: string, properties: {host: {type: string, required: boolean}, services: {type: string, items: {type: string, properties: {name: {type: string, required: boolean}, is_online: {type: string, required: boolean}, update_at: {type: string, required: boolean}, mesg: {type: string}}}}}}}
     */
    var statusSchema = {
        type: 'object',
        properties: {
            host: {
                type: 'string',
                required: true
            },
            services: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            required: true
                        },
                        is_online: {
                            type: 'integer',
                            required: true
                        },
                        update_at: {
                            type: 'string',
                            required: true
                        },
                        mesg: {
                            type: 'string'
                        }
                    }
                }
            }
        }
    };

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
        res.json({data: _services});
    });

    /**
     * @api {post} /api/status Update status
     * @apiGroup Status
     * @apiName status
     */
    app.post('/api/status', validate({body: statusSchema}), function (req, res) {
        var serviceIsOnline = "";
        var newService = [];
        //Set Online Value
        for (var i = 0; i < req.body.services.length; i++) {
            if (req.body.services[i].is_online === 1) {
                serviceIsOnline = "Online";
            } else if (req.body.services[i].is_online === 0) {
                serviceIsOnline = "Offline";
            } else {
                return res.status(400).send({
                    error: 'Post syntax has an invalid isOnline value.',
                    data: req.body.services[i]
                });
            }
            newService.push({
                "name": req.body.services[i].name,
                "is_online": serviceIsOnline,
                "update_at": req.body.services[i].update_at,
                "mesg": req.body.services[i].mesg
            });
        }
        var serviceUpdate = {
            "host": req.body.host,
            "services": newService
        };

        _services.push(serviceUpdate);

        // json needs to be returned rather than a random string
        res.status(200).json({message: 'Status submission successful', payload: newService});
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
                return s.host === req.params.hostName;
            })[0];
            if (typeof service === 'undefined') {
                throw new Error(undefined);
            } else {
                res.status(200).send(service);
            }

        }
        catch (e) {
            res.status(404).send({'error': 'No data found for host ' + req.params.hostName,
            'status': 404});
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

        function removeObj(obj, prop, id) {
            return obj.filter(function (val) {
                return val[prop] !== id;
            });
        }

        if (hostID === 'undefined') {
            res.status(404).send({'error': 'Delete parameter invalid, no host found',
            'status': 404});
        } else {
            _services = removeObj(_services, 'host', hostID);
            res.status(200).send({'data': 'Deleted ' + hostID + ' successfully',
            'status': 200});
        }
    });
};