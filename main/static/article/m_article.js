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
