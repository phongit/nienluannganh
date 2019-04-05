var express = require('express');
var router = express.Router();
var conn = require('../database/connetion');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
router.use(bodyParser.json());

/* GET home page. */
router.get('/', function (req, res) {
    res.render('resetpass');
});

router.post('/resetpass', function (req, res) {
    var token = req.cookies[`webchatRTC`];
    var tokenkey = jwt.verify(token, "cookiewebchat");
    var taikhoan = tokenkey.userName;
    var sql = 'select * from nguoidung where userName = ?';
    conn.query(sql, [taikhoan], (err, result) => {
        if (err) {

        } else if (result.length == 0) {

        } else {
            if (bcrypt.compareSync(req.body.matkhau, result[0].passWord)) {
                var newpassWord = bcrypt.hashSync(req.body.newmatkhau, bcrypt.genSaltSync(9))
                var sql1 = 'update nguoidung set passWord=? where userName = ?';
                conn.query(sql1, [newpassWord, taikhoan], (err1, result1) => {
                    if (err1) {
                        console.log(err1)
                    } else {
                        res.json({
                            success: true,
                            // result: result[0]
                        })
                    }
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