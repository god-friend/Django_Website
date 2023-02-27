function searchQuiz(type){
    var query = $("#search-form").serialize();
    var in_json = convertFormtoJSON(query);

    if (type == 'quiz'){
        location.href = "http://" + location.host + "/allQuiz/?search=" + in_json['search'];
    }
    else if(type == 'article'){
        location.href = "http://" + location.host + "/article/?search=" + in_json['search'];
    }
}


function readNotification(id, aid){
    $.ajax({
        url: "http://" + location.host + "/notification/",
        type: 'patch',
        data: {"id": id, "mark_all": '0'},
        async: false,
        headers: {
            'X-Csrftoken': get_csrf(),
        },
        success: (res) => {
            location.href = "http://" + location.host + "/article/" + aid;
        }
    })
}

function showRead(){
    var btns = document.getElementsByClassName("not-btns");

    for(i=0; i<btns.length;i++){
        btns[i].className = "not-btns btn btn-sm btn-light";
    }
    var read = document.getElementById("show-read");
    var read_div = document.getElementById("s-read");
    var unread_div = document.getElementById("s-unread");

    read.className = "not-btns btn btn-sm btn-light active";
    read_div.style.display = "block";
    unread_div.style.display = "none";

}

function showUnread(){
    var btns = document.getElementsByClassName("not-btns");

    for(i=0; i<btns.length;i++){
        btns[i].className = "not-btns btn btn-sm btn-light";
    }
    var unread = document.getElementById("show-unread");
    var read_div = document.getElementById("s-read");
    var unread_div = document.getElementById("s-unread");

    unread.className = "not-btns btn btn-sm btn-light active";
    read_div.style.display = "none";
    unread_div.style.display = "block";

}

function markAllRead(user){
    $.ajax({
        url: "http://" + location.host + "/notification/",
        type: 'patch',
        data: {"id": '-1', "mark_all": '1', "user": user},
        async: false,
        headers: {
            'X-Csrftoken': get_csrf(),
        },
        success: (res) => {
            location.reload();
        } 
    })
}