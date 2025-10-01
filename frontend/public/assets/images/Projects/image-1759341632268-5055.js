var money;
var app;
var dough = [];
var rate = [];
var Symbol = 'ZAR';
var itemSearch;
var bar = 0;
var slideIndex = 1;

function dropDownBar(){
    var drop = document.getElementById("dropList");
    for(var i =0; i < dough.length; i++){
        drop.innerHTML += "<li><a href='#' onclick='updateSymbol(" + JSON.stringify(dough[i]) + ")'>" + dough[i] + "</a></li>";
    }
}


function loadFunction(){
    var variableName= 'ZAR';

    //Products
    var req1 = new XMLHttpRequest();
    const request = JSON.stringify({
        studentnum:"u24603199",
        apikey:"a8b15bb71e5f3d56b4af555f1c985dbb",
        type: "GetAllProducts",
        sort: "title",
        order: "ASC",
        return: ["brand", "title","image_url","department", "final_price", "currency", "initial_price", "features", "id", "categories", "manufacturer", "department", "description", "country_of_origin"],
        limit: 50
    });

    req1.onreadystatechange = function()
    {
        if(req1.readyState == 4 && req1.status == 200){
            app = JSON.parse(req1.responseText);
            var table = document.getElementById("View_Table");
            table.deleteRow(1);
            var substitute = 'cost';
            for(var i = 0; i < app.data.length; i++){
                document.getElementById('View_Table_Slide').innerHTML += "<div class='mySlides'>" + "<img src=" + app.data[i].image_url + " alt=" + app.data[i].title + ">" + "</div>";
                document.getElementById('View_Table_Information').innerHTML += "<div class='mySlides2'> <h4> Title: </h4>" + "<h3>" + app.data[i].title + "</h3>" 
                + "<h4> Description: </h4>" + app.data[i].description
                + "<h4> Features: </h4>" + app.data[i].features
                + "<h4> Initial Price: </h4>" + app.data[i].initial_price + " " + Symbol
                + "<h4> Final Price: </h4>" + app.data[i].final_price + " " + Symbol
                + "<h4> Categories: </h4>" + app.data[i].categories
                + "<h4> Country of Origin: </h4>" + app.data[i].country_of_origin
                + "</div>";
            }

            document.getElementById('View_Table_Slide').innerHTML += '<a class="prev" onclick="plusSlides(-1)"> &#10094; </a> <a class="next" onclick="plusSlides(1)"> &#10095; </a>'
            showSlides(slideIndex);
        }
    }

    req1.open("POST", "https://wheatley.cs.up.ac.za/api/", true);
    req1.send(request);

    //Products

    //Currency
    var req2 = new XMLHttpRequest();

    const moneyRequest = JSON.stringify({
        studentnum:"u24603199",
        apikey:"a8b15bb71e5f3d56b4af555f1c985dbb",
        type: "GetCurrencyList",
    });

    req2.onreadystatechange = function()
    {
        if(req2.readyState == 4 && req2.status == 200){
            money = JSON.parse(req2.responseText);

            var count = 0;
            for(const key in money.data){
                dough[count] = (`${key}: ${money.data[key]}`).substring(0,3);
                count++;
            }

            for(var k =0; k < dough.length; k++){
                rate[k] = eval('money.data.' + dough[k]);
            }
            if(bar == 0){
                //dropDownBar();
            }
            bar = bar + 1;
        }
    }

    req2.open("POST", "https://wheatley.cs.up.ac.za/api/", true);
    req2.send(moneyRequest);

    //Currency
}

function getRate(x){
    for(var i =0; i < dough.length; i++){
        if(x == dough[i]){
            //console.log(rate[i]);
            return rate[i];
        }
    }
    return 1;
}

function conversion(Moolah, Ammount){
    //console.log(Moolah);
    var result;
    if(Moolah != Symbol){
        result = (Ammount/getRate(Moolah)) * getRate(Symbol);
    }else{
        result = Ammount;
    }
    return result.toFixed();
}

function updateSymbol(x){
    Symbol = x;
    var substitute = 'cost0';
    var para = document.getElementById(substitute);
    for(var i = 0; i < app.data.length; i++){
        substitute = 'cost' + i;
        if(para != null){
            para.innerHTML = "Price: " + conversion(app.data[i].currency, app.data[i].final_price) + " " + Symbol;
        }
        para = document.getElementById(substitute);
    }
    if(para != null){
        para.innerHTML = "Price: " + conversion(app.data[app.data.length-1].currency, app.data[app.data.length-1].final_price) + " " + Symbol;
    }
}

function plusSlides(n){
    showSlides(slideIndex += n);
}

function currentSlide(n){
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides1 = document.getElementsByClassName("mySlides");
    let slides2 = document.getElementsByClassName("mySlides2");
    if (n > slides1.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides1.length}
    for (i = 0; i < slides1.length; i++) {
      slides1[i].style.display = "none";
      slides2[i].style.display = "none";
    }
    slides1[slideIndex-1].style.display = "block";
    slides2[slideIndex-1].style.display = "block";
}