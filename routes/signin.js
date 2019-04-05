var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var conn = require('../database/connetion');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
router.use(bodyParser.json());

/* GET home page. */
router.get('/', function (req, res) {
    res.clearCookie('webchatRTC');
    res.render('signin');
});
router.post('/signin', function (req, res) {
    var sql = 'select * from nguoidung where userName=?';
    conn.query(sql, [req.body.taikhoan], (err, result) => {
        if (err) {
            console.log(err)
        } else if (result.length == 0) {
            res.json({
                success: false
            });
        } else {
            if (bcrypt.compareSync(req.body.matkhau, result[0].passWord)) {
                delete result[0].passWord;
                var rs = JSON.stringify(result[0]);
                const token = jwt.sign(rs, "cookiewebchat");
                res.clearCookie('webchatRTC');
                res.cookie('webchatRTC', token, {
                    maxAge: 1000 * 60 * 60 * 24
                });
                res.json({
                    success: true,
                    result
                })
            } else {
                res.json({
                    success: false
                });
            }
        }
    })
});

module.exports = router;