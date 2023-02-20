$(document).ready(
    () => {
        $("#new-article").on("submit", 
            (e) => {
                e.preventDefault();
                var data = $("#new-article").serialize();
                var article_data = convertFormtoJSON(data);
                $.ajax({
                    url: "../../api/articles/",
                    type: 'POST',
                    async: false,
                    data: article_data,
                    headers: {
                        "X-Csrftoken": get_csrf(),
                    },
                    success: (res) => {
                        alert("Article Created\n" + res['title']);
                        $("#new-article").trigger('reset');
                    }
                })
            }
        )
    }
)