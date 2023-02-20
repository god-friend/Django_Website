// Get CSRF Token from cookie
function get_csrf(){
    var csrf = document.cookie.split(" ");
    for(i=0; i<csrf.length;i++){
        if(csrf[i].indexOf("csrftoken=") != -1){
            csrf = csrf[i].replace("csrftoken=", "");
            csrf = csrf.replace(";", "");
            return csrf;
        }
    }
}

// Convert Form Data to JSON
function convertFormtoJSON(string){
    string = string.split("&");
    json_data = {}
    options = []
    $.each(string, (key, value) => {
        var spiltted = value.split("=");
        if(spiltted[0].indexOf("choice") != -1){
            options.push(decodeURIComponent(spiltted[1]));
        }else{
            json_data[spiltted[0]] = decodeURIComponent(spiltted[1]);
        }
    })
    if(options.length > 0){
        json_data['choices'] = options;
    }
    return json_data;
}

// Single Input Element in div
function single_input_Element(e_name, input_name, def="", required=true, read_only=false, form=""){
    // console.log(def);
    var row = document.createElement("div");
    row.className = "row";
    
    var row_col = document.createElement("label");
    row_col.className = "col-sm-2";
    row_col.innerHTML = e_name;
    row_col.style = "font-weight: bold";
    
    var row_col2 = document.createElement("div");
    row_col2.className = "col-sm-10";
    
    var row_col2_input = document.createElement("input");
    row_col2_input.type = "text";
    row_col2_input.className = "form-control";
    row_col2_input.name = input_name;
    row_col2_input.required = required;
    // row_col2_input.placeholder = def;
    row_col2_input.value = def;
    row_col2_input.readOnly = read_only;
    row_col2_input.form = form;

    row_col2.appendChild(row_col2_input);
    row.appendChild(row_col);
    row.appendChild(row_col2);

    return row;
}

// Add Button Only in Form or As a Row
function add_buttonInForm(text, type="button", value=""){
    // Add Button
    var row = document.createElement("div");
    row.className = "row";

    var row_col = document.createElement("div");
    row_col.className = "col-sm-12";

    var row_col_btn = document.createElement("button");
    row_col_btn.className = "btn btn-primary";
    row_col_btn.innerText = text;
    row_col_btn.type = type;
    row_col_btn.style = "width: 100%;"
    row_col_btn.value = value;
    
    
    row_col.appendChild(row_col_btn);
    row.appendChild(row_col);

    return row;
}

// Get All Categories
function all_categories(){
    var categories = null;
    $.ajax({
        url: "../../api/cat/",
        type: 'get',
        async: false,
        success: (response) => {
            categories = response;
        },
    })
    return categories;
}

// Get Article from Id
// end: no. of points to go back
// eg. 127.0.0.1/end1/end2 in this case end will be 2
// b'cause api is at localhost/api
function get_article(id, end){
    var ends = "";
    for(i=0;i<end;i++){
        ends += "../";
    }
    var result = null;
    $.ajax({
        url: ends + 'api/articles/' + String(id) + '/',
        type: 'GET',
        async: false,
        success: (res)=>{
            result = res;
        }
    })
    return result;
}

// Get Full Name of User with
// user==username
function get_fullname(user){
    var result = null;
    // http://127.0.0.1:8000/fullname/beena
    $.ajax({
        url: "http://" + window.location.host + "/fullname/" + user,
        type: 'GET',
        async: false,
        success: (res)=> {
            result = res;
        }
    })
    return result['fullname']
}