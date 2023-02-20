
function get_categories(URL=null){
    if(URL==null){
        URL = '../api/a_cat/';
    }
    var result = null;
    $.ajax({
        url: URL,
        type: 'GET',
        async: false,
        success:(res)=> {
            result = res;
        }
    })
    return result;
}

function get_ArticlebyCategory(category, URL=null){
    if(URL==null){
        URL = '../api/articles/?category=' + category;
    }
    var result = null;
    $.ajax({
        url: URL,
        type: 'GET',
        async: false,
        success: (res) => {
            result = res;
        }
    });
    return result;
}

function get_users(URL=null){
    if (URL==null){
        URL = "../api/a_users/";
    }
    var result = null;
    $.ajax({
        url: URL,
        async: false,
        type: 'GET',
        success: (res)=>{
            result = res;
        }
    });
    return result;
}

function getArticlebyUser(user, URL=null){
    if (URL==null){
        URL = "../api/articles/?created_by=" + user;
    }
    var result = null;
    $.ajax({
        url: URL,
        type: 'GET',
        async: false,
        success: (res)=>{
            result = res;
        }
    })
    return result;
}

// data: Response from api
// op=1: Show All Availabel Articles by cat=(category) or user=(username)
// op=2: Show All Available categories
// op=3: Show All User who have created Articles
function filterHtml(data, op, cat="", user=""){
    document.getElementById("article").innerHTML = "";
    document.getElementById("filter").innerHTML = "";

    var card = document.createElement("div");
    card.className = "card text-center border-dark mb-3";

    var card_header = document.createElement("div");
    card_header.style = "font-size: 26px; font-weight:bold;";
    card_header.className = "card-header";
    if(op == 1){
        if(cat){
            card_header.innerHTML = "All Articles of Category " + cat;
        }
        else if(user){
            var fullname = get_fullname(user);
            card_header.innerHTML = "All Articles of " + fullname;
        }
    }
    else if(op==2){
        card_header.innerHTML = "All Categories";
    }
    else if(op == 3){
        card_header.innerHTML = "All Users";
    }
    card.appendChild(card_header);

    var list = document.createElement("ul");
    list.className = "list-group list-group-flush";

    var result = data['result'];
    for(i=0;i<result.length;i++){
        var button = document.createElement("button");
        button.className = "btn btn-light btn-lg";
        button.type = 'button';
        if(op==1){
            button.innerHTML = result[i]['title'];
            button.value = result[i]['id'] + "=" + result[i]['created_by'];
            button.onclick = (e) => {
                var id_user = e.target.value.split("=");
                var user = get_fullname(id_user[1]);
                show_article(id_user[0], user);
            }
        }
        else if(op == 2){
            button.innerHTML = result[i];
            button.value = result[i];
            button.onclick = (e) => {
                var article = get_ArticlebyCategory(e.target.value);
                filterHtml(article, 1, e.target.value);
            }
        }
        else if(op == 3){
            var fullname = get_fullname(result[i]);
            button.innerHTML = fullname;
            button.value = result[i];
            button.onclick = (e) => {
                var article = getArticlebyUser(e.target.value);
                filterHtml(article, 1, "", e.target.value);
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
        prev_button.type = 'button';
        prev_button.onclick = () => {
            if(op == 1){
                var a_data = get_ArticlebyCategory(cat, data['prev']);
                filterHtml(a_data, 1, cat);
            }

            if(op == 2){
                var a_data = get_categories(data['prev']);
                filterHtml(a_data, 2);
            }
            if (op == 3){
                var a_data = get_users(data['prev']);
                filterHtml(a_data, 3);
            }
        }
       document.getElementById("filter").appendChild(prev_button);
    }
    

    if(data['next']){
        var next_button = document.createElement("a");
        next_button.className = "btn btn-dark btn-lg";
        next_button.innerHTML = "Next";
        next_button.type = 'button';
        next_button.onclick = () => {
            if(op == 1){
                var a_data = get_ArticlebyCategory(cat, data['next']);
                filterHtml(a_data, 1, cat);
            }

            if(op == 2){
                var a_data = get_categories(data['next']);
                filterHtml(a_data, 2);
            }
            if (op == 3){
                var a_data = get_users(data['next']);
                filterHtml(a_data, 3);
            }
        }
        
        
        document.getElementById("filter").appendChild(next_button);
    }

    
}



function show_categories(){
    var data = get_categories();
    filterHtml(data, 2);
}

function show_users(){
    var data = get_users();
    filterHtml(data, 3);
}