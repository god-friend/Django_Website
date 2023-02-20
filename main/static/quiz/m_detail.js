$(document).ready(
    () => {
        $("#user-detail").on("submit", (e) => {
            e.preventDefault();
            var d = $("#user-detail").serialize()
            var new_data = convertFormtoJSON(d);
            var user = new_data['username'];
            $.ajax({
                url: "../" + user + "/",
                async: false,
                method: 'PATCH',
                data: new_data,
                headers: {
                    "X-Csrftoken": get_csrf(),
                },
                success: (response) => {
                    // console.log(response);
                    window.location.reload();
                },
            })
        })
    }
)