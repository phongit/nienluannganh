var express = require('express');
var router = express.Router();
var conn = require('../database/connetion');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
router.use(bodyParser.json());

/* GET home page. */
router.get('/', function (req, res) {
    res.render('signup');
});

router.post('/signup', (req, res)=>{
    // console.log('toi đây rồi');
    var matkhau = bcrypt.hashSync(req.body.matkhau, bcrypt.genSaltSync(9))
    var sql = "Insert into nguoidung(userName, passWord, hoTen, ngaySinh, gioiTinh) values(?,?,?,?,?)";
    conn.query(sql, [req.body.taikhoan, matkhau, req.body.hoten, req.body.ngaysinh, req.body.gioitinh], (err, result)=>{
        if(err){
            // console.log(err)
        }else{
            res.json({
                success: true,
                mes: "thành công rồi"
            })
        }
    })
})

module.exports = router;
