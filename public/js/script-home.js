function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

var list_Friends = []

var userName = JSON.parse(b64_to_utf8(sessionStorage.getItem('auth')))[0].userName;
$(document).ready(() => {
    var peerID = "";
    socket.emit('user-login', { userName, peerID });
    loadListchat();
})
function loadListchat() {
    $.ajax({
        method: 'POST',
        url: '/home/listmesgs',
        success: (data) => {
            if (data.success) {
                var listmesgs = "";
                var count = 0;
                var abc = " ";
                $.each(data.result, (key, value) => {
                    count++;
                    if (count == 1) {
                        abc = "active_chat"
                    } else {
                        abc = ""
                    }
                    if (data.userName === value.nguoiNhan) {
                        if (count == 1) {
                            startChat(value.nguoiGui, value.hoTenGui);
                        }
                        listmesgs += `<a onclick="startChat('` + value.nguoiGui + `', '` + value.hoTenGui + `')">
                                            <div class="list-friends `+ abc + `" id = "div` + value.nguoiGui + `">
                                                <div class="div-friend" id="div-friend">
                                                    <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png"
                                                            alt="sunil"> </div>
                                                    <div class="end-mesgs">
                                                        <h5>`+ value.hoTenGui + `</h5>
                                                        <span id = `+ value.nguoiGui + `>
                                                        </span>
                                                        <p id="nd` + value.nguoiGui + `">` + value.noiDung + `</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>`;
                    } else {
                        if (count == 1) {
                            startChat(value.nguoiNhan, value.hoTenNhan);
                        }
                        listmesgs += `<a onclick="startChat('` + value.nguoiNhan + `', '` + value.hoTenNhan + `')">
                                            <div class="list-friends `+ abc + `" id = "div` + value.nguoiNhan + `">
                                                <div class="div-friend" id="div-friend">
                                                    <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png"
                                                            alt="sunil"> </div>
                                                    <div class="end-mesgs">
                                                        <h5>`+ value.hoTenNhan + `</h5>
                                                        <span id = `+ value.nguoiNhan + `>
                                                        </span>
                                                        <p id="nd` + value.nguoiNhan + `">Bạn: ` + value.noiDung + `</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>`;
                    }
                });
                $('#inbox_chat').html(listmesgs);
                $('#recent_heading').html("Tin nhắn");
            }
        }
    })
}

socket.on("user-onl", function (data) {
    $.each(data, (key, value) => {
        $('#' + value.name).html(`<span class = "fa fa-circle onl1"></span>`)
    })
})

socket.on("user-disconnect", function(data){
    $('#' + data).html('')
    console.log(data)
})

function startChat(nguoiNhan, hoTen) {
    $('.list-friends').removeClass("active_chat")
    $("#div" + nguoiNhan).addClass("active_chat");
    $('#hoTen').html(hoTen);
    $('#idusername').val(nguoiNhan);
    $.ajax({
        method: 'POST',
        url: '/home/showmesgs',
        data: {
            nguoiNhan
        },
        success: (data) => {
            if (data.success) {
                var htmlShowmesgs = "";
                var timenow = new Date();
                timenow = moment(timenow);
                $.each(data.arr, (key, value) => {
                    var thoigian;
                    var time = moment(value.thoiGian);
                    if (timenow.diff(time, 'day') == 0) {
                        thoigian = time.startOf('minutes').fromNow()
                    } else if (timenow.diff(time, 'day') > 0) {
                        thoigian = timenow.diff(time, 'day') + ' ngày'
                    } else if (timenow.diff(time, 'day') > 7) {
                        thoigian = timenow.diff(time, 'week') + ' tuần'
                    } else if (timenow.diff(time, 'week') > 4) {
                        thoigian = moment(value.thoiGian).format('L LT a');
                    }
                    if (value.nguoiGui === nguoiNhan) {
                        htmlShowmesgs += `<div class="incoming_msg">
                                                <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png"
                                                        alt="sunil"> </div>
                                                <div class="received_msg">
                                                    <div class="received_withd_msg">
                                                        <p>`+ value.noiDung + `</p>
                                                        <span class="time_date">`+ thoigian + `</span>
                                                    </div>
                                                </div>
                                            </div>`;
                    } else {
                        htmlShowmesgs += `<div class="outgoing_msg">
                                                <div class="sent_msg">
                                                    <p>`+ value.noiDung + `</p>
                                                    <span class="time_date">`+ thoigian + `</span>
                                                </div>
                                            </div>`;
                    }
                })
                $('#msg_history').html(htmlShowmesgs);
                $('#msg_history').scrollTop($('#msg_history')[0].scrollHeight);
            }
        }
    })
}

socket.on('server-send-chat', function (data) {
    var htmlShowmesgs = `<div class="incoming_msg">
                                <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png"
                                        alt="sunil"> </div>
                                <div class="received_msg">
                                    <div class="received_withd_msg">
                                        <p>`+ data.noiDung + `</p>
                                        <span class="time_date">`+ moment(data.thoiGian).startOf('minutes').fromNow() + `</span>
                                    </div>
                                </div>
                            </div>`;
    $('#msg_history').append(htmlShowmesgs);
    $('#nd' + data.nguoiGui).text(data.noiDung);
    $('#msg_history').scrollTop($('#msg_history')[0].scrollHeight);
})
var nguoiGui = ''
function sendchat(){
    var nguoiNhan = $('#idusername').val();
    var noiDung = $('#noiDung').val();
    var thoiGian = new Date();
    if(noiDung!=""){
        $.ajax({
            method: "POST",
            url: '/home/sendchat',
            data: {
                nguoiNhan,
                noiDung
            },
            success: (data) => {
                $('#noiDung').val("");
                if (data.success) {
                    nguoiGui = data.taikhoan
                    var htmlShowmesgs = `<div class="outgoing_msg">
                                                    <div class="sent_msg">
                                                        <p>`+ noiDung + `</p>
                                                        <span class="time_date">`+ moment(thoiGian).startOf('minutes').fromNow() + `</span>
                                                    </div>
                                                </div>`;
                    $('#msg_history').append(htmlShowmesgs);
                    $('#nd' + nguoiNhan).text('Bạn: ' + noiDung);
                    $('#msg_history').scrollTop($('#msg_history')[0].scrollHeight);
                    socket.emit('user-send-chat', { nguoiNhan, noiDung, nguoiGui, thoiGian });
                }
            }
        })
    }
}
$('#btn-sendChat').click(() => {
    sendchat();
})
$(document).keyup(function (e) {
    if (e.keyCode == 13) {
        sendchat();
    }
});

$('#btn-setting').click(() => {
    $('#btn-list-friends').removeClass("active_icon")
    $('#btn-list-friends').addClass("icon")
    $('#btn-setting').removeClass("icon")
    $('#btn-setting').addClass("active_icon")
    $('.dropdown-content').css('display', 'block')
})

$('#btn-contact').click(() => {
    window.location.replace('/contact');
})
$('#btn-video-call').click(() => {
    var nguoiNhan = $('#idusername').val();
    window.open("videocall?nguoiNhan=" + nguoiNhan + "&check=1", "", "top=70px,left=300px,width=766px,height=550px");
})
$('#btn-call').click(() => {
    var nguoiNhan = $('#idusername').val();
    window.open("videocall?nguoiNhan=" + nguoiNhan + "&check=2", "", "top=70px,left=300px,width=766px,height=550px");
})

window.addEventListener('mouseup',function(event){
    var pol = document.getElementById('dropdown-content');
    if(event.target != pol && event.target.parentNode != pol){
        pol.style.display = 'none';
    }
});  
socket.on('server-videocall', (data) => {
    if(data.checkCall == 1){
        window.open("videocall?nguoiNhan=" + data.userName + "&check=0", "", "top=70px,left=300px,width=766px,height=550px");
    }else{
        window.open("videocall?nguoiNhan=" + data.userName + "&check=3", "", "top=70px,left=300px,width=766px,height=550px");
    }
    //ngược lại
    //Gửi socket từ chối
})
