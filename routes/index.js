/**
 * Created by harveydf on 20/12/14.
 */

var express     = require('express'),
    message     = require('./message'),
    router      = express.Router();

router.route('/messages')
    .get(function (req, res) {
        console.log('GET');
        message.findAll(function (data) {
            res.json(data);
        });
    });

module.exports = router;
