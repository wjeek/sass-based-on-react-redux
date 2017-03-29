var express = require('express');
var request = require('request').defaults({
    baseUrl: 'http://localhost:' + (process.env.PORT || 8000),
    json: true
});

module.exports = {
    fileUpload : function (params, callback) {
        request(params, function (err, res, body) {
            callback( err , body ) ;
        });
    },
};
