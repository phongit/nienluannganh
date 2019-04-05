function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

var list_Friends = []

$(document).ready(() => {
    var userName = JSON.parse(b64_to_utf8(sessionStorage.getItem('auth')))[0].userName;
    var peerID = "";
    socket.emit('user-login', { userName, peerID });
    loadListfriend();
    loadAddFriend();
    loadRecommendFriend();
})
 
function loadListfriend() {
    $.ajax({
        method: 'POST',
        url: '/contact/listFriends',
        success: (data) => {
            if (data.success) {
                var listFriends = "";
                $.each(data.result, (key, value) => {
                    var obj = {
                        id: value.userName,
                        name: value.hoTen
                    };
                    list_Friends.push(obj);
                    listFriends += `<a onclick="showChat('` + value.userName + `', '` + value.hoTen + `')">
                                        <div class="list-friends">
                                            <div class="div-friend" id="div-friend">
                                                <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png"
                                                        alt="sunil"> </div>
                                                <div class="name-friend">
                                                    <h5>`+ value.hoTen + `</h5>
                                                    <span id = `+ value.userName + `>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </a>`;
                });
                $('#inbox_chat1').html(listFriends);
                $('#recent_heading').html("Danh bạ");
            }
        }
    })
}
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
window.addEventListener('mouseup',function(event){
    var pol = document.getElementById('dropdown-content');
    if(event.target != pol && event.target.parentNode != pol){
        pol.style.display = 'none';
    }
});  

function showChat(nguoiNhan, hoTen){
    $('#contactFriend').css("display", "none")
    $('#startChatContact').css("display", "block")
    startChat(nguoiNhan, hoTen);
}

function loadAddFriend() {
    $.ajax({
        method: 'POST',
        url: '/contact/listAddFriend',
        success: (data) => {
            if (data.success) {
                var listAddFriend = "";
                $.each(data.result, (key, value) => {
                    listAddFriend += `<div class="newFriend" id="` + value.idBan + `">
                                        <div class="new_chat_img"> <img src="https://ptetutorials.com/images/user-profile.png"
                                                alt="sunil"> </div>
                                        <div class="new_userName"> `+ value.hoTen + `<div>
                                                <button class="btn-add-friend" onclick="denyAddFriend('`+ value.idBan + `','`+ value.userName + `')">Từ chối</button>
                                                <button class="btn-add-friend" onclick="acceptAddFriend('`+ value.idBan + `','`+ value.userName + `')">Đồng ý</button>
                                            </div>
                                        </div>
                                    </div>`;
                });
                $('#content-newFriend').html(listAddFriend);
                $('#reponsive-newFriend').html(listAddFriend);
            }
        }
    })
}

function loadRecommendFriend() {
    $.ajax({
        method: 'POST',
        url: '/contact/listRecommendFriends',
        success: (data) => {
            if (data.success) {
                var listRecommendFriends = "";
                $.each(data.result, (key, value) => {
                    listRecommendFriends += `<div class="newFriend">
                                                <div class="new_chat_img"> 
                                                    <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> 
                                                </div>
                                                <div class="new_userName">`+ value.hoTen + `
                                                    <div id = "div_`+value.userName+`"> 
                                                        <button class="btn-add-friend" onclick="addFriend('`+ value.userName + `')" id="btn_`+value.userName+`">Thêm bạn</button>
                                                    </div>
                                                </div>
                                            </div>`;
                });
                $('#content-recommendFriends').html(listRecommendFriends);
                $('#reponsive-recommendFriends').html(listRecommendFriends);
            }
        }
    })
}

function addFriend(userName) {
    $.ajax({
        method: 'POST',
        url: '/contact/addFriends',
        data: {
            userName
        },
        success: (data) => {
            if(data.success){
                socket.emit('add-friend', userName);
                loadRecommendFriend();
            }
        }
    })
}

function acceptAddFriend(idBan, userName) {
    $.ajax({
        method: 'POST',
        url: '/contact/acceptAddFriend',
        data: {
            idBan
        },
        success: (data) => {
            if(data.success){
                socket.emit('accept-add-friend', userName);
                loadListfriend();
                loadAddFriend();
            }
        }
    })
}

function denyAddFriend(idBan, userName) {
    $.ajax({
        method: 'POST',
        url: '/contact/denyAddFriend',
        data: {
            idBan
        },
        success: (data) => {
            if(data.success){
                socket.emit('deny-add-friend', userName);
                loadAddFriend();
            }
        }
    })
}

socket.on("user-onl", function (data) {
    $.each(data, (key, value) => {
        $('#' + value.name).html(`<span class = "fa fa-circle onl"></span>`)
    })
})

socket.on("user-add", function (data){
    loadRecommendFriend();
    loadAddFriend();
})

socket.on("user-deny-add", function (data){
    loadRecommendFriend();
    loadAddFriend();
})

socket.on("user-accept-add", function (data){
    loadAddFriend();
    loadListfriend();
})

$('#btn-setting').click(() => {
    $('#btn-contact').removeClass("active_icon")
    $('#btn-contact').addClass("icon")
    $('#btn-setting').removeClass("icon")
    $('#btn-setting').addClass("active_icon")
    $('.dropdown-content').css('display', 'block')
})

$('#btn-list-friends').click(() => {
    window.location.replace('/home');
})