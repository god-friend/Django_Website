function getCategories(URL=null){
    if (URL == null){
        URL = '../api/cat/';
    }
    var result = null;
    $.ajax({
        url: URL,
        async: false,
        type: 'GET',
        success: (response)=>{
            result = response;
            // console.log(response);
        }
    })
    return result;
}

function getQuizByCategory(cat, URL=null){
    if(URL==null){
        URL = "../api/all/?category=" + cat;
    }
    var result = null;
    $.ajax({
        url: URL,
        async: false,
        success: (res) => {
            result = res;
        },
        type: 'GET',
    })
    return result;
}

function getTeachers(URL=null){
    if (URL == null){
        URL = "../api/teach/";
    }
    var result = null;

    $.ajax({
        url: URL,
        type: 'GET',
        async: false,
        success: (res) => {
            result = res;
        }
    })

    return result;
}

function getQuizByTeacher(teacher, URL=null){
    if(URL==null){
        URL = "../api/all/?teacher=" + teacher;
    }
    var result = null;
    $.ajax({
        url: URL,
        async: false,
        type: 'GET',
        success: (res) => {
            result = res;
        }
    })
    return result;
}

// data: response from api
// op:1 is to Show Availabel quiz of category or teacher where you provide the value of cat(category) 
// or teach(teacher) in arg from inside the function 
// op:2 is to Show Available categories you dont need to provide cat arg
// op:3 is to Show Available Teachers you dont need to provide teach arg
function filterHTML(data, op, cat="", teach=""){
    document.getElementById("quiz").innerHTML = "";
    document.getElementById("filter").innerHTML = "";

    var card = document.createElement("div");
    card.className = "card text-center border-dark mb-3";

    var card_header = document.createElement("div");
    card_header.className = "card-header";
    card_header.style = "font-size: 26px; font-weight: bold;";
    // For Quiz
    if(op == 1){
        if(cat){
            card_header.innerHTML = "Quiz of Category " + cat;
        }
        else if(teach){
            card_header.innerHTML = "Quiz of Teacher " + teach;
        }
    }
    // For Category
    if(op == 2){
        card_header.innerHTML = "Categories";
    }
    // For Teacher
    if(op == 3){
        card_header.innerHTML = "Teachers";
    }
    

    card.appendChild(card_header);

    var list = document.createElement("ul");
    list.className = "list-group list-group-flush";

    var result = data['result'];
    for(i=0;i<result.length;i++){
        var button = document.createElement("button");
        button.className = "btn btn-light btn-lg";
        button.type = "button";
        // For Quiz
        if(op == 1){
            button.innerHTML = result[i]['title'];
            button.onclick = (e) => {
                select_quiz(current_user, role, e.target.innerHTML);
            }
        }
        // For Category
        if(op == 2){
            button.innerHTML = result[i];
            button.onclick = (e) => {
                var quiz_data = getQuizByCategory(e.target.innerHTML);
                filterHTML(quiz_data, 1, e.target.innerHTML);
            }
        }
        // For Teacher
        if(op == 3){
            button.innerHTML = result[i][1];
            button.value = result[i][0];
            button.onclick = (e) => {
                var quiz_data = getQuizByTeacher(e.target.value);
                filterHTML(quiz_data, 1, "", e.target.value);
            }
        }
        
        list.appendChild(button);
    }
    card.appendChild(list);
    document.getElementById("filter").appendChild(card);

    if(data['prev']){
        var prev_button = document.createElement("a");
        prev_button.className = "btn btn-dark btn-lg";
        prev_button.innerHTML = "Previous";
        prev_button.type = "button";
        prev_button.onclick = (e) => {
            // For Quiz
            if(op == 1){
                if(cat){
                    var quiz_data = getQuizByCategory(cat, data['prev']);
                    filterHTML(quiz_data, 1, cat);
                }
                else if(teach){
                    var quiz_data = getQuizByTeacher(teach, data['prev']);
                    filterHTML(quiz_data, 1, cat, teach);
                }    
            }
            // For Category
            if(op == 2){
                var cat_data = getCategories(data['prev']);
                filterHTML(cat_data, 2);
            }
            // For Teacher
            if(op == 3){
                var t_data = getTeachers(data['prev']);
                filterHTML(t_data, 3);
            }
        }
        document.getElementById("filter").appendChild(prev_button);
    }
    if(data['next']){
        var next_button = document.createElement("a");
        next_button.className = "btn btn-dark btn-lg";
        next_button.innerHTML = "Next";
        next_button.type = "button";
        next_button.onclick = (e) => {
            // For Quiz
            if(op == 1){
                if(cat){
                    var quiz_data = getQuizByCategory(cat, data['next']);
                    filterHTML(quiz_data, 1, cat);
                }
                else if(teach){
                    var quiz_data = getQuizByTeacher(teach, data['next']);
                    filterHTML(quiz_data, 1, cat, teach);
                }
                    
            }
            // For Category
            if(op == 2){
                var cat_data = getCategories(data['next']);
                filterHTML(cat_data, 2);
            }
            if(op == 3){
                var t_data = getTeachers(data['next']);
                filterHTML(t_data, 3);
            }
        }
        document.getElementById("filter").appendChild(next_button);
    }
}

function show_categories(){
    var data = getCategories();
    filterHTML(data, 2);
}


function show_teachers(){
    var data = getTeachers();
    filterHTML(data, 3);
}