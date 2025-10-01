var money;
var app;
var dough = [];
var rate = [];
var Symbol = 'ZAR';
var sortBy = 'title';
var DistinctFilter = 'Brand';
var distinct1;
var bar = 0;
var itemSearch;

function dropDownBar(){
    var drop = document.getElementById("dropList");
    for(var i =0; i < dough.length; i++){
        drop.innerHTML += "<li><a href='#' onclick='updateSymbol(" + JSON.stringify(dough[i]) + ")'>" + dough[i] + "</a></li>";
    }
}

function dropCategoryList(){
    //console.log(distinct1);
    var drop = document.getElementById("categoryList");
    for(var i =0; i < distinct1.data.length; i++){
        drop.innerHTML += "<li><a href='#' onclick='filterSort(" + JSON.stringify(distinct1.data[i]) + ")'>" + distinct1.data[i] + "</a></li>";
    }
}

function dropBrandList(){
    var drop = document.getElementById("brandList");
    for(var i =0; i < distinct1.data.length; i++){
        drop.innerHTML += "<li><a href='#' onclick='filterSort(" + JSON.stringify(distinct1.data[i]) + ")'>" + distinct1.data[i] + "</a></li>";
    }
}

function dropCountryList(){
    var drop = document.getElementById("countryList");
    for(var i =0; i < distinct1.data.length; i++){
        drop.innerHTML += "<li><a href='#' onclick='filterSort(" + JSON.stringify(distinct1.data[i]) + ")'>" + distinct1.data[i] + "</a></li>";
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
        sort: sortBy,
        order: "ASC",
        return: ["brand", "title","image_url","department", "final_price", "currency", "initial_price", "features", "id", "categories", "manufacturer", "department", "description", "country_of_origin"],
        limit: 50
    });

    req1.onreadystatechange = function()
    {
        if(req1.readyState == 4 && req1.status == 200){
            app = JSON.parse(req1.responseText);
            var table = document.getElementById("Products_Table");
            table.deleteRow(1);
            var substitute = 'cost';
            for(var i = 0; i < app.data.length; i++){
                substitute = 'cost' + i;
               var step1 = ((app.data[i].final_price/app.data[i].initial_price)*100);
               if(step1 <= 90){
                table.innerHTML += "<tr><td>" + "<h3>" + app.data[i].title + "</h3>" + //Heading
                "<a href='View.html'>"+ "<img src=" + app.data[i].image_url + " alt=" + app.data[i].title + ">" + "</a>"  + "<br>" + //Image
                "<p id=" + substitute + "> Price: " + conversion(app.data[i].currency, app.data[i].final_price) + " " + Symbol + "</p>" // Prices please implement the price API later 
                + "<br> <button> Add to Cart </button>" + "<button> Wishlist </button>" 
                + "</tr></td>";
               }
            }
            document.getElementById('hideButtons').style.display = 'none';
            document.getElementById('showButtons').style.display = 'block';
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
                dropDownBar();
            }
            bar = bar + 1;
        }
    }

    req2.open("POST", "https://wheatley.cs.up.ac.za/api/", true);
    req2.send(moneyRequest);

    filter("brand");
    filter("categories");
    filter("country_of_origin");
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

function search(){
    var found = 0;
    var substitute = 'cost';
    var x = document.getElementById("searchButton").value;
    var table = document.getElementById("Products_Table");
    for(var i = 0; i < app.data.length; i++){
        if(x == app.data[i].title){
           found = 1;
           for(let k = 0; k < app.data.length; k++){
               if(table.rows.length > 1){
                table.deleteRow(1);
               }
           }
           substitute = 'cost' + i;
           table.innerHTML += "<tr><td>" + "<h3>" + app.data[i].title + "</h3>" + //Heading
           "<a href='View.html'>"+ "<img src=" + app.data[i].image_url + " alt=" + app.data[i].title + ">" + "</a>"  + "<br>" + //Image
           "<p id=" + substitute + "> Price: " + conversion(app.data[i].currency, app.data[i].final_price) + " " + Symbol + "</p>" // Prices please implement the price API later 
           + "<br> <button> Add to Cart </button>" + "<button> Wishlist </button>" 
           + "</tr></td>";
        }
    }
    if(found == 0){
        alert("Product Does Not Exsist");
    }else{
      
    }
}

function filterSort(x){
    var found = 0;
    var substitute = 'cost';
    var table = document.getElementById("Products_Table");
    for(var i = 0; i < app.data.length; i++){
        if(x == app.data[i].brand){
           found = 1;
           for(let k = 0; k < app.data.length; k++){
               if(table.rows.length > 1){
                table.deleteRow(1);
               }
           }
           substitute = 'cost' + i;
           table.innerHTML += "<tr><td>" + "<h3>" + app.data[i].title + "</h3>" + //Heading
           "<a href='View.html'>"+ "<img src=" + app.data[i].image_url + " alt=" + app.data[i].title + ">" + "</a>"  + "<br>" + //Image
           "<p id=" + substitute + "> Price: " + conversion(app.data[i].currency, app.data[i].final_price) + " " + Symbol + "</p>" // Prices please implement the price API later 
           + "<br> <button> Add to Cart </button>" + "<button> Wishlist </button>" 
           + "</tr></td>";
        }
        //console.log(eval("app.data[0]." + JSON.stringify(DistinctFilter)))
    }
    for(var i = 0; i < app.data.length; i++){
        if(x == app.data[i].country_of_origin){
           found = 1;
           for(let k = 0; k < app.data.length; k++){
               if(table.rows.length > 1){
                table.deleteRow(1);
               }
           }
           substitute = 'cost' + i;
           table.innerHTML += "<tr><td>" + "<h3>" + app.data[i].title + "</h3>" + //Heading
           "<a href='View.html'>"+ "<img src=" + app.data[i].image_url + " alt=" + app.data[i].title + ">" + "</a>"  + "<br>" + //Image
           "<p id=" + substitute + "> Price: " + conversion(app.data[i].currency, app.data[i].final_price) + " " + Symbol + "</p>" // Prices please implement the price API later 
           + "<br> <button> Add to Cart </button>" + "<button> Wishlist </button>" 
           + "</tr></td>";
        }
        //console.log(eval("app.data[0]." + JSON.stringify(DistinctFilter)))
    }
    for(var i = 0; i < app.data.length; i++){
        if(x == app.data[i].categories){
           found = 1;
           for(let k = 0; k < app.data.length; k++){
               if(table.rows.length > 1){
                table.deleteRow(1);
               }
           }
           substitute = 'cost' + i;
           table.innerHTML += "<tr><td>" + "<h3>" + app.data[i].title + "</h3>" + //Heading
           "<a href='View.html'>"+ "<img src=" + app.data[i].image_url + " alt=" + app.data[i].title + ">" + "</a>"  + "<br>" + //Image
           "<p id=" + substitute + "> Price: " + conversion(app.data[i].currency, app.data[i].final_price) + " " + Symbol + "</p>" // Prices please implement the price API later 
           + "<br> <button> Add to Cart </button>" + "<button> Wishlist </button>" 
           + "</tr></td>";
        }
        //console.log(eval("app.data[0]." + JSON.stringify(DistinctFilter)))
    }
    if(found == 0){
        alert("Product Does Not Exsist");
    }else{
      
    }
}

function sorter(x){
    sortBy = x;
    var table = document.getElementById("Products_Table");
    for(let k = 0; k < app.data.length; k++){
        if(table.rows.length > 1){
         table.deleteRow(1);
        }
    }
    table.innerHTML += "<tr><td>" + "<h3> Loading </h3><br>" + "<p class='loadingBar'></p></td></tr>"
    loadFunction();
}

function filter(x){
    DistinctFilter = x;
    var req3 = new XMLHttpRequest();
    const request = JSON.stringify({
        studentnum:"u24603199",
        apikey:"a8b15bb71e5f3d56b4af555f1c985dbb",
        type: "GetDistinct",
        field: DistinctFilter,
        limit: 20
    });

    req3.onreadystatechange = function()
    {
        if(req3.readyState == 4 && req3.status == 200){
            distinct1 = JSON.parse(req3.responseText);
            if(x == 'brand'){
                dropBrandList();
            }
            if(x == 'categories'){
                dropCategoryList();
            }
            if(x == 'country_of_origin'){
                dropCountryList();
            }
        }
       
    }

    req3.open("POST", "https://wheatley.cs.up.ac.za/api/", true);
    req3.send(request);

}