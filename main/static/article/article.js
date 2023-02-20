

function show_article(id, fname=""){
    document.getElementById("article").innerHTML = "";
    var article = get_article(id, 1);

    var card = document.createElement("div");
    card.className = "card";

    var card_header_title = document.createElement("div");
    card_header_title.className = "card-header";
    card_header_title.innerHTML = article['title'];
    card_header_title.style = "font-weight: bold; font-size: 32px;"

    var card_header_by = document.createElement("div");
    card_header_by.className = "card-title text-right";
    card_header_by.innerHTML = "by " + fname;
    card_header_by.style = "font-weight: italic; font-size: 22px;"

    var card_text = document.createElement("p");
    card_text.className = "card-text";
    card_text.innerHTML = article['article'];
    card_text.style = "font-size: 26px";

    card.appendChild(card_header_title);
    card.appendChild(card_header_by);
    card.appendChild(card_text);
    document.getElementById("article").appendChild(card);

}
