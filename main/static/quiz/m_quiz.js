// Send Get request to /api/quiz
function get_userQuiz(title){
    var quiz = null;
    $.ajax(
        {
            url:"http://" + location.host + "/api/quiz/" + title + "/",
            async: false,
            type: 'GET',
            success: (response)=>{
                quiz = response;
            }
        }
    )
    return quiz;
}
// Send put request to /api/quiz/<quiz_title>
function update_userQuiz(quiz_data, title){
    $.ajax({
        url: "http://" + location.host + "/api/quiz/" + title + "/",
        async: false,
        type: 'PUT',
        data: quiz_data,
        headers: {
            "X-Csrftoken": get_csrf(),
        },
        success: (response)=>{
            alert("Updated Quiz");
            return;
        }
    })
}
// Delete Quiz
function delete_userQuiz(title){
    $.ajax({
        url: "http://" + location.host + "/api/quiz/" + title + "/",
        async: false,
        type: 'delete',
        headers: {
            "X-Csrftoken": get_csrf(),
        }
    })
}
// Form Submit
$(document).ready(
    () => {
        // Form Add Question Form
        $("#append-question").on("submit", (e)=> {
            e.preventDefault();
            var data = $("#append-question").serialize();
            var json_data = convertFormtoJSON(data);
            var quiz = get_userQuiz(json_data['title']);

            var quiz_questions = quiz['questions'];
            var total = Object.keys(quiz_questions).length;

            var new_question = {
                "question": json_data['question'],
                "choices": json_data['choices'],
                "answer": json_data['answer']
            }
            quiz_questions[String(total+1)] = new_question;
            quiz['questions'] = JSON.stringify(quiz_questions);

            update_userQuiz(quiz, quiz['title']);
            location.reload();
        })

        // Form Change Title
        $("#set-title").on("submit", (e)=>{
            e.preventDefault();
            var data = $("#set-title").serialize();
            var in_json = convertFormtoJSON(data);
            console.log(in_json);
            var quiz = get_userQuiz(in_json['old_title']);
            quiz['title'] = in_json['title'];

            update_userQuiz(quiz, in_json['old_title']);
            delete_userQuiz(in_json['old_title']);
            location.href = "http://" + location.host + "/allQuiz/edit/" + quiz['title'] + "/";
        })

        // Form Change Title
        $("#set-category").on("submit", (e)=>{
            e.preventDefault();
            var data = $("#set-category").serialize();
            var in_json = convertFormtoJSON(data);
            var quiz = get_userQuiz(in_json['title']);
            quiz['category'] = in_json['category'];

            update_userQuiz(quiz, quiz['title']);

            location.reload();
        })
    }
)

function update_question(e){
    e.preventDefault();
    var id = e.target.id;
    var form_id = "#update-question" + id;
    var data = $(form_id).serialize();
    var json_data = convertFormtoJSON(data);

    var quiz = get_userQuiz(json_data['title']);

    var questions = quiz['questions'];

    questions[id]['question'] = json_data['question'];
    questions[id]['choices'] = json_data['choices'];
    questions[id]['answer'] = json_data['answer'];

    quiz['questions'] = JSON.stringify(questions);
    update_userQuiz(quiz, quiz['title']);

    location.reload();    
}

function delete_question(key, title){
    var quiz = get_userQuiz(title);
    var selected_Q = quiz['questions'][key]['question'];

    if(confirm("Do you Want to Delete\n"+selected_Q)){
        var questions = quiz['questions'];
        var total = Object.keys(questions).length;

        for(i=parseInt(key); i<total; i++){
            var new_value = questions[String(i+1)];
            questions[String(i)] = new_value;
        }

        delete questions[String(total)];

        quiz['questions'] = JSON.stringify(questions);
        update_userQuiz(quiz, quiz['title']);

        location.reload();
    }

}

function deleteQuiz(title){
    if(confirm("Are You sure you want to Delete\n"+title)){
        delete_userQuiz(title);
        location.href = "http://" + location.host + "/allQuiz/";
    }
}
