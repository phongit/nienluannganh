document.getElementById('dangky').onclick = () => {
    var taikhoan = document.getElementById('taikhoan').value;
    var matkhau = document.getElementById('matkhau').value;
    var nhaplaimk = document.getElementById('nhaplaimk').value;
    var hoten = document.getElementById('hoten').value;
    var ngaysinh = document.getElementById('ngaysinh').value;
    var gioitinh = "";
    var checkbox = document.getElementsByName("gioitinh");
                for (var i = 0; i < checkbox.length; i++){
                    if (checkbox[i].checked === true){
                        gioitinh = checkbox[i].value;
                    }
                }
    if (matkhau === nhaplaimk) {
        $.ajax({
            method: 'POST',
            url: '/signup/signup',
            data: {
                taikhoan,
                matkhau,
                hoten,
                ngaysinh,
                gioitinh
            },
            success: (data) => {
                if (data.success) {
                    window.location.replace('/');
                }
            }
        })
    }
}