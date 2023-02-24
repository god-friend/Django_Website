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
