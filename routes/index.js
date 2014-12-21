/**
 * Created by harveydf on 20/12/14.
 */

var express     = require('express'),
    message     = require('./message'),
    router      = express.Router();

router.route('/messages')
    .get(function (req, res) {
        message.findAll(function (data) {
            res.json(data);
        });
    })
    .post(function (req, res) {
        message.save(req.body, function () {
            res.send('Message created!');
        });
    });

module.exports = router;
