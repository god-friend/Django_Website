var username = "";
var data = null;

// Send Get request to /api/quiz
function get_userQuiz(quiz_name){
    var quiz = null;
    $.ajax(
        {
            url: "../api/quiz/" + quiz_name + "/",
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
function update_userQuiz(quiz_data, title=""){
    if(title == ""){
        title = quiz_data['title'];
    }
    $.ajax({
        url: "../api/quiz/" + title + "/",
        async: false,
        type: 'PUT',
        data: quiz_data,
        headers: {
            "X-Csrftoken": get_csrf(),
        },
        success: (response)=>{
            data = response;
            // console.log("response",response, "data", data);
            alert("Updated Quiz");
            return;
        }
    })
}

// Delete Quiz
function delete_userQuiz(title){
    $.ajax({
        url: '../api/quiz/' + title + '/',
        async: false,
        type: 'delete',
        headers: {
            "X-Csrftoken": get_csrf(),
        }
    })
}

// Edit Buttons
function editQuiz(title){
    data = get_userQuiz(title);
    document.getElementById("edit-btns").innerHTML = "";
    document.getElementById("edit-div").innerHTML = "";

    var card = document.createElement("div");
    card.className = "card";

    var title = document.createElement("div");
    title.className = "card-header";
    title.innerHTML = data['title'];

    var card_body = document.createElement("div");
    card_body.className = "card-body";

    // 'Add Question' Button
    var add_question_btn = document.createElement("button");
    add_question_btn.className = "btn btn-primary";
    add_question_btn.innerHTML = "Add Question";
    add_question_btn.onclick = () => {
        add_questions();
    }
    card_body.appendChild(add_question_btn);
    
    // 'Change Question' Button
    var change_question_btn = document.createElement("button");
    change_question_btn.className = "btn btn-primary";
    change_question_btn.innerHTML = "Change Question";
    change_question_btn.onclick = () => {
        change_question();
    }
    card_body.appendChild(change_question_btn);

    // 'Delete Question' Button
    var delete_question_btn = document.createElement("button");
    delete_question_btn.className = "btn btn-danger";
    delete_question_btn.innerHTML = "Delete Question";
    delete_question_btn.onclick = () => {
        delete_question_btns();
    }
    card_body.appendChild(delete_question_btn);

    // 'Change Title' Button
    var change_title_btn = document.createElement("button");
    change_title_btn.className = 'btn btn-primary';
    change_title_btn.innerHTML = "Change Title";
    change_title_btn.onclick = () => {
        change_title();
    }
    card_body.appendChild(change_title_btn);

    // 'Change Category' Button
    var change_cat_btn = document.createElement("button");
    change_cat_btn.className = 'btn btn-primary';
    change_cat_btn.innerHTML = "Change Category";
    change_cat_btn.onclick = () => {
        change_cat();
    }
    card_body.appendChild(change_cat_btn);

    // 'Delete Quiz' Button
    var delete_btn = document.createElement("button");
    delete_btn.className = 'btn btn-danger';
    delete_btn.innerHTML = "Delete Quiz";
    delete_btn.onclick = (e) => {
        if(confirm("Are you sure You want to Delete\n" + data['title'])){
            delete_userQuiz(data['title']);
            alert("Quiz Deleted");
            window.location.reload();
        }

    }
    card_body.appendChild(delete_btn);

    card.appendChild(title);
    card.appendChild(card_body);
    document.getElementById("edit-btns").appendChild(card);
    
}

// Change Category
function change_cat(){
    document.getElementById("edit-div").innerHTML = "";
    var form = document.createElement("form");
    form.method = 'post';
    form.id = 'for-cat';

    var title = single_input_Element("Category :: ", 'category', data['category']);
    form.appendChild(title);

    var save_btn = add_buttonInForm("Save", "submit");
    form.appendChild(save_btn);

    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        var title = $("#for-cat").serialize();
        var in_json = convertFormtoJSON(title);
        // var old_title = data['category'];
        data['category'] = in_json['category'];
        update_userQuiz(data);
        // delete_userQuiz(old_title);
        alert("Category Changed to\n"+data['category']);

        window.location.reload();
    })

    document.getElementById("edit-div").appendChild(form);
}

// Change Title
function change_title(){
    document.getElementById("edit-div").innerHTML = "";
    var form = document.createElement("form");
    form.method = 'post';
    form.id = 'for-title';

    var title = single_input_Element("Title :: ", 'title', data['title']);
    form.appendChild(title);

    var save_btn = add_buttonInForm("Save", "submit");
    form.appendChild(save_btn);

    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        var title = $("#for-title").serialize();
        var in_json = convertFormtoJSON(title);
        var old_title = data['title'];
        data['title'] = in_json['title'];
        update_userQuiz(data, old_title);
        delete_userQuiz(old_title);
        alert("Title Changed to\n"+data['title']);

        window.location.reload();
    })

    document.getElementById("edit-div").appendChild(form);
}

// Add Questions
function add_questions(){
    document.getElementById("edit-div").innerHTML = "";

    var form = document.createElement("form");
    form.id = "add-form";
    form.method = 'post';
    // For Question
    var row = single_input_Element("Question :: ", "question");
    form.appendChild(row);
    // For Choices
    var row2 = choice_input();
    form.appendChild(row2);
    // For Answer
    var row3 = single_input_Element("Answer :: ", "answer");
    form.appendChild(row3);
    // For Button
    var row4 = add_buttonInForm("Add", "submit");
    form.appendChild(row4);

    form.addEventListener("submit", add_new_question);
    document.getElementById("edit-div").appendChild(form);
}
// Input Element for choice 
function choice_input(){
    var row2 = document.createElement("div");
    row2.className = "row";

    var row2_col1 = document.createElement("label");
    row2_col1.className = "col-sm-2";
    row2_col1.innerHTML = "Choices :: ";
    row2_col1.style = "font-weight: bold;";

    
    row2.appendChild(row2_col1);
    for(i=0;i<4;i++){
        var row2_col = document.createElement("div");
        row2_col.className = "col-sm-2";
        
        var row2_col_input = document.createElement("input");
        row2_col_input.type = "text";
        row2_col_input.className = "form-control";
        row2_col_input.name = "choice" + String(i+1);
        row2_col_input.required = true;

        row2_col.appendChild(row2_col_input);
        row2.appendChild(row2_col);
    }
    return row2;
}
// Send New Question to Backend
function add_new_question(e){
    e.preventDefault();
    
    var new_question = $("#add-form").serialize();
    var question = convertFormtoJSON(new_question);
    // var update_quiz = get_userQuiz(data['title']);
    var all_question = data['questions'];
    var total_questions = Object.keys(all_question).length;
    
    all_question[total_questions+1] = question;
    // console.log(all_question);
    data['questions'] = JSON.stringify(all_question);
    // console.log(update_quiz);
    update_userQuiz(data);
    $("#add-form").trigger('reset'); 
}
// Printing Question as Drowndown Button With change form inside the dropdown
function print_questions_in_dropdowns(){
    var questions = data['questions'];
    var total = Object.keys(questions).length;

    for(i=0; i<total; i++){
        var dropdown = document.createElement("div");
        dropdown.className = "dropdown";
        
        var button = document.createElement("button");
        button.className = "btn btn-secondary dropdown-toggle w-100";
        button.innerHTML = String(i+1) + ". " + questions[String(i+1)]['question'];
        button.setAttribute("data-toggle", "dropdown");
        button.setAttribute("aria-expanded", "true");
        button.id = "b"+String(i+1);

        var d_menu = document.createElement("div");
        d_menu.className = "dropdown-menu w-100";
        
        var form = document.createElement("form");
        form.id = String(i+1);
        form.method = 'post';

        var ques = single_input_Element("Question :: ", "question", questions[String(i+1)]['question'], false);
        form.appendChild(ques);

        var choice1 = single_input_Element("Choice 1. ", "choice1", questions[String(i+1)]['choices'][0], false);
        form.appendChild(choice1);

        var choice2 = single_input_Element("Choice 2. ", "choice2", questions[String(i+1)]['choices'][1], false);
        form.appendChild(choice2);

        var choice3 = single_input_Element("Choice 3. ", "choice3", questions[String(i+1)]['choices'][2], false);
        form.appendChild(choice3);

        var choice4 = single_input_Element("Choice 4. ", "choice4", questions[String(i+1)]['choices'][3], false);
        form.appendChild(choice4);
        
        var ans = single_input_Element("Answer :: ", "answer", questions[String(i+1)]['answer'], false);
        form.appendChild(ans);

        var change_btn = add_buttonInForm("Change", "submit", String(i+1));
        form.appendChild(change_btn);

        form.addEventListener("submit", change_form);
        d_menu.appendChild(form);
        
        dropdown.appendChild(button);
        dropdown.appendChild(d_menu);
        document.getElementById("edit-div").appendChild(dropdown);
    }
}
// Changing form value to new values and send request to update question
function change_form(e){
   e.preventDefault();
   // Get Question
   var question = e.srcElement[0].value;
   // Update Value
   e.srcElement[0].value = question;
   // Getting choices and puttin them in Array
   var options = [];
   for(i=1; i<=4; i++){
        options.push(e.srcElement[i].value);
        e.srcElement[i].value = e.srcElement[i].value ;
   }
   // Getting Answer
   var ans = e.srcElement[5].value;
   // Updating Value
   e.srcElement[5].value = ans;
   // Key of Question eg. Question number
   var key = e.srcElement[6].value;
   
   var all_questions = data['questions'];
   all_questions[key]['question'] = question;
   all_questions[key]['choices'] = options;
   all_questions[key]['answer'] = ans;

   data['questions'] = JSON.stringify(all_questions);

   update_userQuiz(data);
   $("#b"+key).html(question); 
   $("#b"+key).click();
}
// Change Question
function change_question(){
    document.getElementById("edit-div").innerHTML = "";
    print_questions_in_dropdowns();
}
// Button for every question to delete
function delete_question_btns(){
    document.getElementById("edit-div").innerHTML = "";
    var questions = data['questions'];
    var len = Object.keys(questions).length;
    for(i=0;i<len;i++){
        var button = document.createElement("button");
        button.innerHTML = String(i+1) + ". " + questions[String(i+1)]['question'];
        button.className = "btn btn-danger w-100";
        button.value = String(i+1);
        button.id = String(i+1);
        button.onclick = (e) => {
            if (confirm("Press Ok to delete this Question\n" + e.target.innerHTML)){
                delete_quizQuestion(e.target.value, len);
            }
        }

        document.getElementById("edit-div").appendChild(button);
    }
}
// For Delteing the Question and Updating Quiz
function delete_quizQuestion(key, total){
    var questions = data['questions'];
    
    for(i=parseInt(key);i<total;i++){
        var new_value = questions[String(i+1)];
        questions[String(i)] = new_value;
    }
    delete questions[String(total)];
    
    data['questions'] = JSON.stringify(questions);
    document.getElementById(key).remove();
    
    update_userQuiz(data);
    delete_question_btns();
    
}