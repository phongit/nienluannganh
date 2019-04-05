var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var conn = require('../database/connetion');
var bodyParser = require('body-parser');
var moment = require('moment');
router.use(bodyParser.json());

router.get('/', function (req, res) {
    res.render('home');
});

router.post('/showmesgs', (req, res)=>{
    var token = req.cookies[`webchatRTC`];
    var tokenkey = jwt.verify(token, "cookiewebchat");
    var taikhoan = tokenkey.userName;
    var sql = "select * from tinnhan tn join nguoidung nd on tn.nguoiGui = nd.userName join nguoidung ngd on tn.nguoiNhan = ngd.userName where (nguoiGui = ? and nguoiNhan = ?) or (nguoiNhan = ? and nguoiGui = ?) order by idTinNhan";
    conn.query(sql, [taikhoan, req.body.nguoiNhan, taikhoan, req.body.nguoiNhan], (err, result)=>{
        if(err){

        }else{
            var arr = result.map(element => {
                element[`thoiGian`] = moment(element.thoiGian).format();
                console.log(element[`thoiGian`])
                return element;
            });
            res.json({
                success: true,
                arr
            })
        }
    })
})

router.post('/sendchat', (req, res)=>{
    var token = req.cookies[`webchatRTC`];
    var tokenkey = jwt.verify(token, "cookiewebchat");
    var taikhoan = tokenkey.userName;
    var time = new Date();
    time = moment(time).format();
    console.log(time)
    var sql = "insert into tinnhan(nguoiGui, nguoiNhan, noiDung, trangThai, thoiGian) values(?,?,?,0,?)";
    conn.query(sql, [taikhoan, req.body.nguoiNhan, req.body.noiDung, time], (err, result)=>{
        if(err){

        }else{
            var sql1 = "select MAX(idTinNhan) idTinNhan from tinnhan where (nguoiGui = ? and nguoiNhan = ?) or (nguoiNhan = ? and nguoiGui = ?)";
            conn.query(sql1, [taikhoan, req.body.nguoiNhan, taikhoan, req.body.nguoiNhan], (err1, result1) =>{
                if (!err1) {
                    var sql2 = "update tinnhan set trangThai = 1 where ((nguoiGui = ? and nguoiNhan = ?) or (nguoiNhan = ? and nguoiGui = ?)) and idTinNhan != ?";
                    conn.query(sql2, [taikhoan, req.body.nguoiNhan, taikhoan, req.body.nguoiNhan, result1[0].idTinNhan]);
                }
            });
            res.json({
                success: true,
                taikhoan
            })
        }
    })
})

router.post('/listmesgs', (req, res) =>{
    var token = req.cookies[`webchatRTC`];
    var tokenkey = jwt.verify(token, "cookiewebchat");
    var taikhoan = tokenkey.userName;

    var sql = "select nguoiGui, nguoiNhan, noiDung, thoiGian, nd.hoTen hoTenGui, ngd.hoTen hoTenNhan from tinnhan tn join nguoidung nd on tn.nguoiGui = nd.userName join nguoidung ngd on tn.nguoiNhan = ngd.userName where (nguoiGui = ? or nguoiNhan = ?) and trangThai = 0 order by idTinNhan DESC";
    conn.query(sql, [taikhoan, taikhoan], (err, result)=>{
        if(err){

        }else{
            res.json({
                success: true,
                result,
                userName: taikhoan
            })
        }
    });

})


module.exports = router;
