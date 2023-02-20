var quiz = null;
var username = ""
var right_answer = 0;
var current_time = null;

function get_quiz(title){
    var data = null;
    $.ajax(
        {
            url: "../api/all/" + title + "/",
            type: 'GET',
            async: false,
            success: (response) => {
                data = response;
            }
        }
    )
    return data;
}

function select_quiz(user, role, title){
    if (user != "AnonymousUser" && role != ""){
        username = user;
        console.log(username);
        quiz = get_quiz(title),
        window.onload = show_quiz(role);
    }else{
        // console.log(role);
        alert("Please Login To see Quiz");
    }
    
}

function get_stddata(){
    var api_data = null;
    $.ajax(
        {
            url: "../api/std/" + username,
            type: 'GET',
            success: (response) =>{
                api_data = response['data'];
            },
            async: false,
        }
    );
    return api_data;
}

function send_stddata(api_data){
    $.ajax(
        {
            url: "../api/std/" + username + "/",
            type: 'PUT',
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

function show_quiz(role, key=1){
        var data = quiz;
        
        if (current_time == null){
            current_time = new Date();
        }
        
        // Student has Completed the Quiz thats why key is greater than total questions
        var total_question = Object.keys(data['questions']).length;
        if (key > total_question){
            document.getElementById("quiz").innerHTML = "<b>Quiz Completed</b>";
            var cleared_time = new Date();
            var apidata = get_stddata();
            apidata['attempted'].push([quiz['title'], current_time.toISOString()]);
            apidata['cleared'].push([quiz['title'], cleared_time.toISOString()]);
            if (right_answer != 0 && (right_answer / total_question) * 100 > 45){
                apidata['passed'].push([quiz['title'], cleared_time.toISOString()]);
            }else{
                apidata['failed'].push([quiz['title'], cleared_time.toISOString()]);
            }
            update_data = {
                "student": username,
                "data": JSON.stringify(apidata)
            }
            send_stddata(update_data);
            return;
        }
       
        var title = document.createElement("div");
        var card_body = document.createElement("div");
        var question = document.createElement("h5");
        var btn_group = document.createElement("div");
        
        title.className = "card-header";
        title.style = "font-size: 24px; font-weight: bold;";
        
        card_body.className = "card-body";
        
        question.className = "card-title";
        
        btn_group.className = "btn-group-vertical";
        
        title.innerHTML = data['title'];
        
        question.innerHTML = data['questions'][String(key)]['question'];
        
        // Only when user is Student Choices have onclick functionality
        choices = data['questions'][String(key)]['choices'];
        for (i=0; i<choices.length; i++){
            var btn = document.createElement("button");
            btn.className = "btn btn-secondary text-left";
            btn.innerHTML = String(i+1) + "." + " " + choices[i];
            btn.type = "button";
            // If User is Student
            if (role == "ST"){
                btn.value = choices[i];
                btn.onclick = (event) => {
                    var rans = data['questions'][String(key)]['answer'];
                    var uans = event.target.value;
                    if (rans == uans){
                        right_answer += 1;
                    }
                    if (key <= total_question){
                        show_quiz(role, key+1);
                    }
                }
            }
            btn_group.appendChild(btn);
        }
        
        card_body.appendChild(question);
        card_body.appendChild(btn_group);
        
        // If User is Teacher
        // Teacher can see All Questions in a Quiz with their Answer
        if (role == "TE"){
            var answer = document.createElement("p")
            var next_question_btn = document.createElement("button");
            var prev_question_btn = document.createElement("button");
            answer.className = "card-text"
            answer.style = "font-size: 18px; font-weight: bold; color: green;"
            next_question_btn.className = "btn btn-primary"
            prev_question_btn.className = "btn btn-primary"
            
            answer.innerHTML = "Answer :: " + data['questions'][String(key)]['answer'];
            next_question_btn.innerHTML = "Next Question";
            prev_question_btn.innerHTML = "Previous Question";

            card_body.appendChild(answer);
            if (key < total_question){
                next_question_btn.onclick = () => {
                    show_quiz(role, key+1);
                };
                card_body.appendChild(next_question_btn);
            }
            if (key > 1){
                prev_question_btn.onclick = () => {
                    show_quiz(role, key-1);
                }
    
                if (card_body.lastChild == next_question_btn){
                    card_body.insertBefore(prev_question_btn, next_question_btn);
                }
                else{
                    card_body.appendChild(prev_question_btn); 
                }
            }
        }
        document.getElementById("quiz").innerHTML = "";
        document.getElementById("quiz").appendChild(title);
        document.getElementById("quiz").appendChild(card_body);
        // Student can choose to leave the Quiz
        if (role == "ST" ){
            var leave_btn = document.createElement("button");
            leave_btn.className = "btn btn-danger";
            leave_btn.innerHTML = "Leave";
            leave_btn.onclick = () => {
                document.getElementById("quiz").innerHTML = "";
                var apidata = get_stddata();
                console.log(apidata);
                apidata['leaved'].push([quiz['title'], current_time.toISOString()]);
                update_data = {
                    "student": username,
                    "data": JSON.stringify(apidata)
                }
                send_stddata(update_data);
            }
            document.getElementById("quiz").appendChild(leave_btn);
        }

       
        
}