function update_userArticle(id, updated){
    $.ajax({
        url: "http://"+ location.host + "/api/articles/" + id + '/',
        type: 'patch',
        async: false,
        data: updated,
        headers: {
            'X-Csrftoken': get_csrf(),
        },
        success: (res)=>{
            alert("Article Updated");
        }
    })
}

function deleteArticle(id, title){
    if(confirm("Are You sure you want to Delete the Article\n"+title)){
        $.ajax({
            url: "http://"+ location.host + "/api/articles/" + id + '/',
            type: 'delete',
            async: false,
            headers:{
                'X-Csrftoken': get_csrf(),
            },
            success:(res)=>{
                alert("Deleted Article");
            }
        })
        location.href = "http://" + location.host + "/article/";
    }
    
}

function update_comment(updated){
    var response = null;
    $.ajax({
        url: "http://" + location.host + "/comment/",
        type: 'patch',
        data: updated,
        headers: {
            'X-Csrftoken': get_csrf(),
        },
        async: false,
        success: (res) => {
            response = res;
            
        }
    })
    return response;
}

$(document).ready(
    (e) => {
        // Form Edit Title
        $("#edit-title").on("submit", (e)=>{
            e.preventDefault();
            var data = $("#edit-title").serialize();
            var in_json = convertFormtoJSON(data);
            var id = in_json['id'];
            delete in_json['id'];
            update_userArticle(id, in_json);
            location.reload();
        })

        // Form Edit Category
        $("#edit-category").on("submit", (e)=>{
            e.preventDefault();
            var data = $("#edit-category").serialize();
            var in_json = convertFormtoJSON(data);
            var id = in_json['id'];
            delete in_json['id'];
            update_userArticle(id, in_json);
            location.reload();
        })

        // Form Edit Body
        $("#edit-body").on("submit", (e)=>{
            e.preventDefault();
            var data = $("#edit-body").serialize();
            var in_json = convertFormtoJSON(data);
            var id = in_json['id'];
            delete in_json['id'];
            update_userArticle(id, in_json);
            location.reload();
        })
    }
)

function deleteComment(e){
    e.preventDefault();
    var comment_id = e.target.value;
    var data = {
        "id": comment_id,
    }

    if(confirm("You sure you want to delete this comment")){
        $.ajax({
            url: "http://" + location.host + "/comment/",
            type: 'delete',
            async: false,
            data: data,
            headers: {
                "X-Csrftoken": get_csrf(),
            },
            success: (data)=>{
                alert(data);
            } 
        })
        location.reload();
    }
}

function editComment(id){
    var form_id = "#edit-comment" + id;
    var data = $(form_id).serialize();
    var in_json = convertFormtoJSON(data);
    var comment = update_comment(data);

    document.getElementById(in_json['cid']).innerHTML = comment['comment'];
    var eid = "#e"+in_json['cid'];
    $(eid).collapse("hide");

}