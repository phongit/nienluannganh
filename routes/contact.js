var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var conn = require('../database/connetion');
var bodyParser = require('body-parser');
var moment = require('moment');
router.use(bodyParser.json());

/* GET home page. */
router.get('/', function (req, res) {
    res.render('contact');
});

router.post('/showmesgs', (req, res) => {
    var token = req.cookies[`webchatRTC`];
    var tokenkey = jwt.verify(token, "cookiewebchat");
    var taikhoan = tokenkey.userName;
    var sql = "select * from tinnhan tn join nguoidung nd on tn.nguoiGui = nd.userName join nguoidung ngd on tn.nguoiNhan = ngd.userName where (nguoiGui = ? and nguoiNhan = ?) or (nguoiNhan = ? and nguoiGui = ?) order by idTinNhan";
    conn.query(sql, [taikhoan, req.body.nguoiNhan, taikhoan, req.body.nguoiNhan], (err, result) => {
        if (err) {

        } else {
            var arr = result.map(element => {
                element[`thoiGian`] = moment(element.thoiGian).format();
                return element;
            });
            res.json({
                success: true,
                arr
            })
        }
    })
})

router.post('/listFriends', (req, res) => {
    var token = req.cookies[`webchatRTC`];
    var tokenkey = jwt.verify(token, "cookiewebchat");
    var taikhoan = tokenkey.userName;
    var sql = "select hoTen, nd.userName from nguoidung nd join dsban ds on nd.userName = ds.userName1 where ds.userName = ? and trangThai = 1 union all select hoTen, nd.userName from nguoidung nd join dsban ds on nd.userName = ds.userName where ds.userName1 = ? and trangThai = 1 order by hoTen";
    conn.query(sql, [taikhoan, taikhoan], (err, result) => {
        if (err) {

        } else {
            res.json({
                success: true,
                result
            });
        }
    })
})

router.post('/listAddFriend', (req, res) => {
    var token = req.cookies[`webchatRTC`];
    var tokenkey = jwt.verify(token, "cookiewebchat");
    var taikhoan = tokenkey.userName;
    var sql = "Select hoTen, anh, idBan, ds.userName from nguoidung nd  join dsban ds on nd.userName = ds.userName where (ds.userName1 = ? and ds.trangThai = 0)";
    conn.query(sql, [taikhoan], (err, result) => {
        if (err) {

        } else {
            res.json({
                success: true,
                result
            });
        }
    })
})

router.post('/denyAddFriend', (req, res) => {
    var token = req.cookies[`webchatRTC`];
    var tokenkey = jwt.verify(token, "cookiewebchat");
    var taikhoan = tokenkey.userName;
    var sql = "delete from dsban where idBan = ?"
    conn.query(sql, [req.body.idBan], (err, result) => {
        if (err) {

        } else {
            res.json({
                success: true,
                result
            })
        }
    })
})

router.post('/acceptAddFriend', (req, res) => {
    var token = req.cookies[`webchatRTC`];
    var tokenkey = jwt.verify(token, "cookiewebchat");
    var taikhoan = tokenkey.userName;
    var sql = "Update dsban set trangThai = 1 where idBan = ?";
    conn.query(sql, [req.body.idBan], (err, result) => {
        if (err) {

        } else {
            res.json({
                success: true,
            })
        }
    })
})

router.post('/listRecommendFriends', (req, res) => {
    var token = req.cookies[`webchatRTC`];
    var tokenkey = jwt.verify(token, "cookiewebchat");
    var taikhoan = tokenkey.userName;
    var sql = "SELECT hoTen, userName FROM nguoidung nd WHERE nd.userName NOT IN(select nd.userName from nguoidung nd join dsban ds on nd.userName = ds.userName1 where ds.userName = ? union all select nd.userName from nguoidung nd join dsban ds on nd.userName = ds.userName where ds.userName1 = ? union all SELECT userName FROM nguoidung WHERE userName = ?) order by hoTen";
    conn.query(sql, [taikhoan, taikhoan, taikhoan], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.json({
                success: true,
                result
            });
        }
    })
})

router.post('/addFriends', (req, res) => {
    var token = req.cookies[`webchatRTC`];
    var tokenkey = jwt.verify(token, "cookiewebchat");
    var taikhoan = tokenkey.userName;
    var sql = "Insert into dsban(userName, userName1, trangThai) value(?,?,0)";
    conn.query(sql, [taikhoan, req.body.userName], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.json({
                success: true,
                result
            });
        }
    })
})

module.exports = router;