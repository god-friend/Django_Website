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