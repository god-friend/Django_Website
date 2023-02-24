var right_answer = 0;
var current_time = null;
var attempted_q = 0;

function get_stddata(user){
    var api_data = null;
    $.ajax(
        {
            url: "http://" + location.host + "/api/std/" + user,
            type: 'GET',
            success: (response) =>{
                api_data = response['data'];
            },
            async: false,
        }
    );
    return api_data;
}

function send_stddata(api_data, user){
    $.ajax(
        {
            url: "http://" + location.host + "/api/std/" + user + "/",
            type: 'PATCH',
            data: api_data,
            success: (res) =>{
                return;
            },
            async: false,
            headers:{
                "X-Csrftoken": get_csrf(),
            }
        }
    )
}

function leavedQuiz(title, user){
    var time = new Date();
    var t_text = time.toISOString();
    var studentData = get_stddata(user);
    studentData['leaved'].push([title, t_text]);

    var update = {
        "data": JSON.stringify(studentData),
    }
    send_stddata(update, user);
    history.back();
}

function check_answer(answer, choice, event){
    if (current_time == null){
        current_time = new Date();
    }
    var e_class = event.target.className;
    var Class = e_class.split(" ")[2];

    var elements = document.getElementsByClassName(Class);
    for(i=0; i<elements.length; i++){
        var btn = elements[i];
        btn.setAttribute('disabled', 'disabled');
    }
    
    if(choice == answer){
        right_answer += 1;
    }
    event.target.className = "btn btn-success";
    attempted_q += 1;
}

function submitQuiz(title, user, total){
    var time = new Date();
    var t_text = time.toISOString();
    var studentData = get_stddata(user);
    studentData['attempted'].push([title, current_time.toISOString()]);
    studentData['cleared'].push([title, t_text]);
    
    if(attempted_q == total){
        if (right_answer != 0 && (right_answer / total) * 100 > 45){
            studentData['passed'].push([title, t_text]);
        }
        else{
            studentData['failed'].push([title, t_text]);
        }
        var update = {
            "data": JSON.stringify(studentData)
        }
        send_stddata(update, user);
        history.back();
    }else{
        alert("Please Answer All Questions Before Submitting");
    }
    
    
}