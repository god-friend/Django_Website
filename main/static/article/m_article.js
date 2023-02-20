function update_userArticle(id, updated){
    $.ajax({
        url: "../../api/articles/" + id + '/',
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

function deleteArticle(id){
    $.ajax({
        url: '../../api/articles/' + id +'/',
        type: 'delete',
        async: false,
        headers:{
            'X-Csrftoken': get_csrf(),
        },
        success:(res)=>{
            alert("Deleted Article");
        }
    })
}

// Update Article
// op==1 is for title updation
// op==2 is for category
// op==3 is for body
function update(id, op, article){
    document.getElementById("edit-article").innerHTML = "";
    var form = document.createElement("form");
    form.id = 'update-form';

    if(op == 1){
        var title = single_input_Element("Title :: ", 'title', article['title'], true);
        form.appendChild(title);
    }
    else if(op == 2){
        var cat = single_input_Element("Category :: ", 'category', article['category'], true);
        form.appendChild(cat);
    }
    else if(op == 3){
        var body = document.createElement("textarea");
        body.className = 'form-control';
        body.style = "height: 500px";
        body.name = 'article';
        body.required = true;
        body.value = article['article'];
        form.appendChild(body);
    }

    var save_button = add_buttonInForm("Save", "submit");
    form.appendChild(save_button);

    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        var new_title = $("#update-form").serialize();
        var in_json = convertFormtoJSON(new_title);
        update_userArticle(id, in_json);
        window.location.reload();
    })
    document.getElementById('edit-article').appendChild(form);
}

// Buttons for Editing Article
function edit_article(id){
    document.getElementById("edit-article").innerHTML = "";
    document.getElementById("edit-btns").innerHTML = "";
    var article = get_article(id, 2);

    var selected_article = document.createElement("p");
    selected_article.innerHTML = article['title'];
    selected_article.style = "font-size: 24px; font-weight: bold;";

    // 'Edit Title' Button
    var edit_title_btn = document.createElement("button");
    edit_title_btn.className = "btn btn-primary ml-1";
    edit_title_btn.type = "button";
    edit_title_btn.innerHTML = "Edit Title";
    edit_title_btn.onclick = ()=>{
        update(id, 1, article);
    }
    
    // 'Edit Category' Button
    var edit_cat_btn = document.createElement("button");
    edit_cat_btn.className = "btn btn-primary ml-1";
    edit_cat_btn.type = "button";
    edit_cat_btn.innerHTML = "Edit Category";
    edit_cat_btn.onclick = () => {
        update(id, 2, article);
    }
    
    // 'Edit Body' Button
    var edit_body_btn = document.createElement("button");
    edit_body_btn.className = "btn btn-primary ml-1";
    edit_body_btn.type = "button";
    edit_body_btn.innerHTML = "Edit Body";
    edit_body_btn.onclick = () => {
        update(id, 3, article);
    }

    // 'Delete Article' Button
    var delete_btn = document.createElement("button");
    delete_btn.className = "btn btn-danger ml-1";
    delete_btn.type = "button";
    delete_btn.innerHTML = "Delete Article";
    delete_btn.onclick = () => {
        if(confirm("Are you sure you want to Delete\n"+article['title'])){
            deleteArticle(id);
            window.location.reload();
        }
    }

    document.getElementById("edit-btns").appendChild(selected_article);
    document.getElementById("edit-btns").appendChild(edit_title_btn);
    document.getElementById("edit-btns").appendChild(edit_cat_btn);
    document.getElementById("edit-btns").appendChild(edit_body_btn);
    document.getElementById("edit-btns").appendChild(delete_btn);
}
