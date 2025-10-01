var money;
var app;
var dough = [];
var rate = [];
var Symbol = 'ZAR';
var itemSearch;
var bar = 0;

var total = 0;
var gtotal = 0;
var qty0 = 1;
var qty1 = 1;
var qty2 = 1;
var qty3 = 1;
var qty4 = 1;
var aDel = 0;

function dropDownBar(){
    var drop = document.getElementById("dropList");
    for(var i =0; i < dough.length; i++){
        drop.innerHTML += "<li><a href='#' onclick='updateSymbol(" + JSON.stringify(dough[i]) + ")'>" + dough[i] + "</a></li>";
    }
}

function inc(x){
    if(x == 'qty0'){
        qty0 += 1;
    }
    if(x == 'qty1'){
        qty1 += 1;
    }
    if(x == 'qty2'){
        qty2 += 1;
    }
    if(x == 'qty3'){
        qty3 += 1;
    }
    if(x == 'qty4'){
        qty4 += 1;
    }

    total = 0;
    gtotal = 0;

    var amt = "ammount";
    var qty = "qty";
    var d = "d"
    var table = document.getElementById("Cart_Table");
    table.deleteRow(1);
    for(let k = 0; k < app.data.length+1; k++){
        if(table.rows.length > 1){
         table.deleteRow(1);
        }
    }
    var substitute = 'cost';
    for(var i = 0; i < app.data.length; i++){
        qty = "qty" + i;
        amt = "ammount" + i;
        substitute = 'cost' + i;
        d = d + i;
        table.innerHTML += "<tr><td>" + "<h3>" + app.data[i].title + "</h3>" + //Heading
        "<a href='View.html'>"+ "<img src=" + app.data[i].image_url + " alt=" + app.data[i].title + ">" + "</a>"  + "<br>" + //Image
        "<p id=" + substitute + "> Price: " + conversion(app.data[i].currency, app.data[i].initial_price) + " " + Symbol + "</p><br>" + // Prices please implement the price API later 
        "<p> Quantity: " + eval(qty) + "<\p>" + "<br>" +
        "<p id=" + amt + "> Ammount: "+ eval(qty) * conversion(app.data[i].currency, app.data[i].initial_price) + " " + Symbol + "</p>" + 
        "<button  onclick='inc(" + JSON.stringify(qty) + ")'> Increase Qty </button> <br><br>  <button onclick='dec(" + JSON.stringify(qty) + ")'> Decrease Qty  </button> <br><br>  <button id= '" + d + "' onclick='del(" + app.data[i].id + ")'> Delete Product  </button> <br><br>" 
        + "</tr></td>";
        total += eval(qty) * conversion(app.data[i].currency, app.data[i].initial_price)
        gtotal += eval(qty) * conversion(app.data[i].currency, app.data[i].final_price)
    }
    table.innerHTML += "<tr><td> Subtotal: " + total + " " + Symbol + "<br><br> Total: "+ (gtotal*(115/100)).toFixed(2) + " " + Symbol +"</tr></td>";
}

function dec(x){
    if(x == 'qty0'){
        qty0 = qty0 - 1;
    }
    if(x == 'qty1'){
        qty1 = qty1 - 1;
    }
    if(x == 'qty2'){
        qty2 = qty2 - 1;
    }
    if(x == 'qty3'){
        qty3 = qty3 - 1;
    }
    if(x == 'qty4'){
        qty4 = qty4 - 1;
    }

    total = 0;
    gtotal = 0;

    var amt = "ammount";
    var qty = "qty";
    var d = "d"
    var table = document.getElementById("Cart_Table");
    table.deleteRow(1);
    for(let k = 0; k < app.data.length+1; k++){
        if(table.rows.length > 1){
         table.deleteRow(1);
        }
    }
    var substitute = 'cost';
    for(var i = 0; i < app.data.length; i++){
        qty = "qty" + i;
        amt = "ammount" + i;
        substitute = 'cost' + i;
        d = d + i;
        table.innerHTML += "<tr><td>" + "<h3>" + app.data[i].title + "</h3>" + //Heading
        "<a href='View.html'>"+ "<img src=" + app.data[i].image_url + " alt=" + app.data[i].title + ">" + "</a>"  + "<br>" + //Image
        "<p id=" + substitute + "> Price: " + conversion(app.data[i].currency, app.data[i].initial_price) + " " + Symbol + "</p><br>" + // Prices please implement the price API later 
        "<p> Quantity: " + eval(qty) + "<\p>" + "<br>" +
        "<p id=" + amt + "> Ammount: "+ eval(qty) * conversion(app.data[i].currency, app.data[i].initial_price) + " " + Symbol + "</p>" + 
        "<button  onclick='inc(" + JSON.stringify(qty) + ")'> Increase Qty </button> <br><br>  <button onclick='dec(" + JSON.stringify(qty) + ")'> Decrease Qty  </button> <br><br>  <button id= '" + d + "' onclick='del(" + app.data[i].id + ")'> Delete Product  </button> <br><br>" 
        + "</tr></td>";
        total += eval(qty) * conversion(app.data[i].currency, app.data[i].initial_price)
        gtotal += eval(qty) * conversion(app.data[i].currency, app.data[i].final_price)
    }
    table.innerHTML += "<tr><td> Subtotal: " + total + " " + Symbol + "<br><br> Total: "+ (gtotal*(115/100)).toFixed(2) + " " + Symbol +"</tr></td>";
}

function del(x){
    aDel = aDel + 1;
    var found = 0;
    var thing = x;
    var table = document.getElementById("Cart_Table");

    for(var i = 0; i < app.data.length; i++){
        if(thing == app.data[i].id){
           found = 1;
           for(let k = 0; k < app.data.length+1; k++){
               if(table.rows.length > 1){
                table.deleteRow(1);
               }
           }

           total = 0;
           gtotal = 0;
           
           var amt = "ammount";
           var qty = "qty";
           var d = "d"
           var table = document.getElementById("Cart_Table");
           var substitute = 'cost';
           for(var i = 0; i < app.data.length-aDel+1; i++){
            if(thing != app.data[i].id){
                qty = "qty" + i;
                amt = "ammount" + i;
                substitute = 'cost' + i;
                d = d + i;
                table.innerHTML += "<tr><td>" + "<h3>" + app.data[i].title + "</h3>" + //Heading
                "<a href='View.html'>"+ "<img src=" + app.data[i].image_url + " alt=" + app.data[i].title + ">" + "</a>"  + "<br>" + //Image
                "<p id=" + substitute + "> Price: " + conversion(app.data[i].currency, app.data[i].initial_price) + " " + Symbol + "</p><br>" + // Prices please implement the price API later 
                "<p> Quantity: " + eval(qty) + "<\p>" + "<br>" +
                "<p id=" + amt + "> Ammount: "+ eval(qty) * conversion(app.data[i].currency, app.data[i].initial_price) + " " + Symbol + "</p>" + 
                "<button  onclick='inc(" + JSON.stringify(qty) + ")'> Increase Qty </button> <br><br>  <button onclick='dec(" + JSON.stringify(qty) + ")'> Decrease Qty  </button> <br><br>  <button id= '" + d + "' onclick='del(" + app.data[i].id + ")'> Delete Product  </button> <br><br>" 
                + "</tr></td>";
                total += eval(qty) * conversion(app.data[i].currency, app.data[i].initial_price)
                gtotal += eval(qty) * conversion(app.data[i].currency, app.data[i].final_price)
            }
           }
           table.innerHTML += "<tr><td> Subtotal: " + total + " " + Symbol + "<br><br> Total: "+ (gtotal*(115/100)).toFixed(2) + " " + Symbol +"</tr></td>";
        }
    }
    if(found == 0){
        alert("Product Does Not Exsist");
    }else{
      
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
        limit: 5
    });

    req1.onreadystatechange = function()
    {
        if(req1.readyState == 4 && req1.status == 200){
            var amt = "ammount";
            var qty = "qty";
            var d = "d"
            app = JSON.parse(req1.responseText);
            var table = document.getElementById("Cart_Table");
            table.deleteRow(1);
            var substitute = 'cost';
            for(var i = 0; i < app.data.length; i++){
                qty = "qty" + i;
                amt = "ammount" + i;
                substitute = 'cost' + i;
                d = d + i;
                table.innerHTML += "<tr><td>" + "<h3>" + app.data[i].title + "</h3>" + //Heading
                "<a href='View.html'>"+ "<img src=" + app.data[i].image_url + " alt=" + app.data[i].title + ">" + "</a>"  + "<br>" + //Image
                "<p id=" + substitute + "> Price: " + conversion(app.data[i].currency, app.data[i].initial_price) + " " + Symbol + "</p><br>" + // Prices please implement the price API later 
                "<p> Quantity: " + eval(qty) + "<\p>" + "<br>" +
                "<p id=" + amt + "> Ammount: "+ eval(qty) * conversion(app.data[i].currency, app.data[i].initial_price) + " " + Symbol + "</p>" + 
                "<button  onclick='inc(" + JSON.stringify(qty) + ")'> Increase Qty </button> <br><br>  <button onclick='dec(" + JSON.stringify(qty) + ")'> Decrease Qty  </button> <br><br>  <button id= '" + d + "' onclick='del(" + app.data[i].id + ")'> Delete Product  </button> <br><br>" 
                + "</tr></td>";
                total += eval(qty) * conversion(app.data[i].currency, app.data[i].initial_price)
                gtotal += eval(qty) * conversion(app.data[i].currency, app.data[i].final_price)
            }
            table.innerHTML += "<tr><td> Subtotal: " + total + " " + Symbol + "<br><br> Total: "+ (gtotal*(115/100)).toFixed(2) + " " + Symbol +"</tr></td>";
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
    total = 0;
    gtotal = 0;
    var temp = 'qty';
    var smth = 'ammount0';
    var substitute = 'cost0';
    var para = document.getElementById(substitute);
    var table = document.getElementById('Cart_Table');
    var admit = document.getElementById(smth);
    table.deleteRow(app.data.length);
    for(var i = 0; i < app.data.length; i++){
        smth = 'ammount' + i;
        temp = 'qty' + i;
        substitute = 'cost' + i;
        if(para != null){
            para.innerHTML = "Price: " + conversion(app.data[i].currency, app.data[i].initial_price) + " " + Symbol;
            admit.innerHTML =  "Ammount: "+ eval(temp) * conversion(app.data[i].currency, app.data[i].initial_price) + " " + Symbol;
            total += eval(temp) * conversion(app.data[i].currency, app.data[i].initial_price)
            gtotal += eval(temp) * conversion(app.data[i].currency, app.data[i].final_price)
        }
        para = document.getElementById(substitute);
    }
    if(para != null){
        para.innerHTML = "Price: " + conversion(app.data[app.data.length-1].currency, app.data[app.data.length-1].final_price) + " " + Symbol;
    }
    table.innerHTML += "<tr><td> Subtotal: " + total + " " + Symbol + "<br><br> Total: "+ (gtotal*(115/100)).toFixed(2) + " " + Symbol +"</tr></td>";
}