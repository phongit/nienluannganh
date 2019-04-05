var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var conn = require('../database/connetion');
var bodyParser = require('body-parser');
var moment = require('moment');
router.use(bodyParser.json());

router.get('/', function (req, res) {
    var token = req.cookies[`webchatRTC`];
    var tokenkey = jwt.verify(token, "cookiewebchat");
    var taikhoan = tokenkey.userName;
    var sql = 'select hoTen, ngaySinh, gioiTinh from nguoidung where userName=?';
    conn.query(sql, [taikhoan], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            var String = result[0].ngaySinh.toString();
            var day = String.slice(8, 10)
            var month = String.slice(4, 7)
            var year = String.slice(11, 15)
            switch (month) {
                case month = 'Jan':
                    month = '-01-'
                    break;
                case month = 'Feb':
                    month = '-02-'
                    break;
                case month = 'Mar':
                    month = '-03-'
                    break;
                case month = 'Apr':
                    month = '-04-'
                    break;
                case month = 'May':
                    month = '-05-'
                    break;
                case month = 'Jun':
                    month = '-06-'
                    break;
                case month = 'Jul':
                    month = '-07-'
                    break;
                case month = 'Aug':
                    month = '-08-'
                    break;
                case month = 'Sep':
                    month = '-09-'
                    break;
                case month = 'Oct':
                    month = '-10-'
                    break;
                case month = 'Nov':
                    month = '-11-'
                    break;
                case month =  'Dec':
                    month = '-12-'
                    break;
            }
            var date = year + month + day
            var gioiTinh = result[0].gioiTinh;
            if(gioiTinh === 'nam'){
                gioiTinh = 'Nam';
            }else{
                gioiTinh = 'Nữ';
            }
            res.render('editprofile', {
                hoTen: result[0].hoTen,
                ngaySinh: date,
                gioiTinh: gioiTinh
            });
        }
    })
});

router.post('/editprofile', (req, res)=>{
    var token = req.cookies[`webchatRTC`];
    var tokenkey = jwt.verify(token, "cookiewebchat");
    var taikhoan = tokenkey.userName;
    var sql = "Update nguoidung set hoTen = ?, ngaySinh = ?, gioiTinh = ? where userName = ?";
    conn.query(sql, [req.body.hoten, req.body.ngaysinh, req.body.gioitinh, taikhoan], (err, result)=>{
        if(err){
            console.log(err)
        }else{
            res.json({
                success: true,
                mes: "thành công"
            })
        }
    })
})

module.exports = router;