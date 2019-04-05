$(document).keyup(function (e) {
    if (e.keyCode == 13) {
        resetpass();
    }
});
function resetpass(){
    var matkhau = document.getElementById('matkhau').value;
    var newmatkhau = document.getElementById('newmatkhau').value;
    var nhaplaimk = document.getElementById('nhaplaimk').value;
    if (newmatkhau === nhaplaimk) {
        $.ajax({
            method: 'POST',
            url: '/resetpass/resetpass',
            data: {
                matkhau,
                newmatkhau
            },
            success: (data) => {
                if (data.success) {
                    alert("Đổi thành công")
                    window.location.replace('/home');
                }
            }
        })
    }
}
document.getElementById('changepsw').onclick = () => {
    resetpass();
}
$('#cancelbtn').click(()=>{
    window.location.replace('/home');
})