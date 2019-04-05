function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}


$(document).keyup(function (e) {
    if (e.keyCode == 13) {
        login();
    }
});

document.getElementById('btn-login').onclick = () => {
    login();
}

function login() {
    var taikhoan = document.getElementById('taikhoan').value;
    var matkhau = document.getElementById('matkhau').value;
    $.ajax({
        method: 'POST',
        url: '/signin',
        data: {
            taikhoan,
            matkhau
        },
        success: (data) => {
            if (data.success) {
                var encode = utf8_to_b64(JSON.stringify(data.result, 'utf8'));
                if (typeof (Storage) !== "undefined") {
                    sessionStorage.setItem('auth', encode);
                } else {
                    alert('Trình duyệt của bạn đã quá cũ. Hãy nâng cấp trình duyệt ngay!');
                }
                window.location.replace('/home');
            }
        }
    })
}