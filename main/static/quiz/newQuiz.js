
function postQuiz(quiz){
    $.ajax({
        url: '../../api/quiz/',
        type: 'POST',
        async: false,
        headers: {
            'X-Csrftoken': get_csrf(),
        },
        data: quiz,
        success: (res) => {
            console.log(res);
        }
    })
}

function createFormtoJSON(form_data, total){
    var data = {};
    var fdata = form_data;
    var questions = {};

    for(i=0;i<total;i++){
        questions[String(i+1)] = {
            "question": "",
            "choices": [],
            "answer": "",
        }
    }
    for(i=0;i<fdata.length;i++){
        var name = fdata[i]['name'];
        var value = fdata[i]['value'];
        if( name.indexOf("question") != -1){
            questions[name.slice(-1)]['question'] = value;
        }
        else if (name.indexOf("choice") != -1){
            questions[name.slice(-1)]['choices'].push(value);
        }
        else if (name.indexOf("answer") != -1){
            questions[name.slice(-1)]['answer'] = value;
        }
        else if(name == "title"){
            data['title'] = value;
        }
        else if(name == "category"){
            data['category'] = value;
        }
    }
    data['questions'] = JSON.stringify(questions);
    return data;
}

// Dropdown Buttons for each Question with form inside for question, choices, answer.
function questions_form(n){
    var qFormsElements = []
    for(i=0;i<n;i++){
        var dropdown = document.createElement("div");
        dropdown.className = "dropdown";

        var question_button = document.createElement("button");
        question_button.className = "btn btn-secondary dropdown-toggle w-100";
        question_button.innerHTML = "Question " + String(i+1);
        question_button.setAttribute("data-toggle", "dropdown");
        question_button.setAttribute("aria-expanded", "true");

        var d_menu = document.createElement("div");
        d_menu.className = "dropdown-menu w-100";

        var qn_string = "question" + String(i+1);
        var question = single_input_Element("Question :: ", qn_string, "", false, false, "createQuiz-form");
        d_menu.appendChild(question);

        var c1n_string = "choice1_" + String(i+1); 
        var choice1 = single_input_Element("Choice 1. ", c1n_string, "", false, false, "createQuiz-form");
        d_menu.appendChild(choice1);

        var c2n_string = "choice2_" + String(i+1); 
        var choice2 = single_input_Element("Choice 2. ", c2n_string, "", false, false, "createQuiz-form");
        d_menu.appendChild(choice2);

        var c3n_string = "choice3_" + String(i+1); 
        var choice3 = single_input_Element("Choice 3. ", c3n_string, "", false, false, "createQuiz-form");
        d_menu.appendChild(choice3);

        var c4n_string = "choice4_" + String(i+1); 
        var choice4 = single_input_Element("Choice 4. ", c4n_string, "", false, false, "createQuiz-form");
        d_menu.appendChild(choice4);

        var an_string = "answer" + String(i+1); 
        var answer = single_input_Element("Answer :: ", an_string, "", false, false, "createQuiz-form");
        d_menu.appendChild(answer);

        dropdown.appendChild(question_button);
        dropdown.appendChild(d_menu);

        qFormsElements.push(dropdown);
    }
    return qFormsElements;
}


function quizCreateForm(total, user){
    document.getElementById("create-div").innerHTML = "";
    var form = document.createElement("form");
    form.id = "createQuiz-form"

    var row_title = single_input_Element("Title :: ", 'title', "", true);
    form.appendChild(row_title);

    var row_category = single_input_Element("Category :: ", 'category', "", true);
    form.appendChild(row_category);

    var q_Elements = questions_form(total);
    for(i=0;i<q_Elements.length;i++){
        form.appendChild(q_Elements[i]);
    }

    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        var form_values = $("#createQuiz-form").serializeArray();
        var data = createFormtoJSON(form_values, total);
        data['teacher'] = user;
        console.log(data);
        alert("Quiz Created\n"+data['title']);
        postQuiz(data);
        window.location.reload();
    })

    var submit_btn = add_buttonInForm("Create", "submit");
    form.appendChild(submit_btn);

    document.getElementById("create-div").appendChild(form);
    

}

$(document).ready(
    () => {
        $("#max-questions").on("submit", (e) => {
            e.preventDefault();
            var data = convertFormtoJSON($("#max-questions").serialize());
            var total = data['num'];
            if(isNaN(total) || total==''){
                document.getElementById("max-questions").reset();
            }else{
            quizCreateForm(parseInt(total), data['username']);
            }
        })
    }
);
