$(document).keyup(function (e) {
    if (e.keyCode == 13) {
        editprofile();
    }
});

function editprofile(){
    var hoten = document.getElementById('hoten').value;
    var ngaysinh = document.getElementById('ngaysinh').value;
    var gioitinh = "";
    var checkbox = document.getElementsByName("gioitinh");
    for (var i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked) {
            gioitinh = checkbox[i].value;
        }
    }
    $.ajax({
        method: 'POST',
        url: '/editprofile/editprofile',
        data: {
            hoten,
            ngaysinh,
            gioitinh
        },
        success: (data) => {
            if (data.success) {
                alert("Đổi thành công")
                window.location.replace('/home');
            }
        }
    })
}
 
document.getElementById('btnDoi').onclick = () => {
    editprofile();
}


$('.btnHuy').click(() => {
    window.location.replace('/home');
})