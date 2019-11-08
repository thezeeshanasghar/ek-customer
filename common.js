$(document).ready(function () {
    /* Authentication */
    toggleLogInOut();
    selectCities();

    // Login popup
    $(".loginBtn").click(function () {
        $(".login-overlay").fadeIn();
    });
    $(".login-overlay").on('click', function (event) {
        $(this).fadeOut();
        $("#Email , #Password").val("");
    });

    $(".login-box").on('click', function (event) {
        event.stopPropagation();
    });

    $(".login-box-header .right-panel").click(function () {
        $(".login-overlay").fadeOut();
        $("#Email , #Password").val("");
    });



    // Signup Popup
    $(".signupBtn").click(function () {
        $(".signup-overlay").fadeIn();
    });
    $(".signup-overlay").on('click', function (event) {
        $(this).fadeOut();
        // $("#name , #mobNum , #email , #password , #password2 , Address").val("");
    });

    $(".signup-box").on('click', function (event) {
        event.stopPropagation();
    });

    $(".signup-box-header .right-panel").click(function () {
        $(".signup-overlay").fadeOut();
        // $("#name , #mobNum , #email , #password , #password2 , Address").val("");
    });





    $(".logoutLi").on('click', function () {
        localStorage.clear();
        toggleLogInOut();
        location.reload(true);
    });
    toggleCart();
    toggleProfileAndOrders();
});

function login() {
    obj = {
        "Email": $("#Email").val(),
        "Password": $("#Password").val()
    }
    $.ajax({
        url: SERVER + "customer/login",
        type: "POST",
        data: JSON.stringify(obj),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (result) {
            // if (result.IsSuccess) {
               // localStorage.setItem("Customer", JSON.stringify(result.ResponseData));
               localStorage.setItem("Customer", JSON.stringify(result));
                $(".login-overlay").fadeOut();
                toggleLogInOut();
                toggleProfileAndOrders();
            // } else {
            //     alert(result.Message);
            // }
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}

function SignUp() {

    obj = {
        "Name": $("#name").val(),
        "Email": $("#email").val(),
        "Password": $("#password").val(),
        "MobileNumber": $("#mobNum").val(),
        "Address": $("#Address").val(),
        "CityId": $("#selectCities").val()
    }
console.log (obj);
    $.ajax({
        url: SERVER + "customer",
        type: "POST",
        data: JSON.stringify(obj),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (result) {
               localStorage.setItem("Customer", JSON.stringify(result));
               location.reload();
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getValueFromLocalStorage(key) {
    var value = localStorage.getItem(key);
    return value;
}
function getObjsFromLocalStorage(key) {
    var value = JSON.parse(localStorage.getItem(key));
    return value;
}

function toggleLogInOut() {
    if (isLoggedIn()) {
        $(".logoutLi").show();
        $(".signupLi").hide();
        $(".loginLi").hide();
    } else {
        $(".loginLi").show();
        $(".signupLi").show();
        $(".logoutLi").hide();
    }
}

function isLoggedIn() {
    var customer = getObjsFromLocalStorage("Customer");
    if (customer) {
        return true;
    } else {
        return false;
    }
}

function toggleCart() {
    var cartItems = getObjsFromLocalStorage("items");
    var html = '';
    html += '<a class="nav-item header-cart-icon" href="order.html">';
    html += '<img src="img/cart-icon.png">';
    if (cartItems && cartItems.length > 0) {
        html += '<span>' + cartItems.length + '</span> Items';
    } else {
        html += '<span>0</span> Items';
    }
    html += '</a>';
    $(".cart").html(html);
}
function toggleProfileAndOrders() {
    if (isLoggedIn()) {

        var html = '';
        html += '<li>';
        html += '<a class="nav-item header-cart-icon" href="profile.html">';
        html += '<img src="img/edit-photo.png">Profile';
        html += '</a>';
        html += '</li>';

        html += '<li>';
        html += '<a class="nav-item header-cart-icon" href="orders.html">';
        html += '<img src="img/order-icon-3.jpg">My Orders';
        html += '</a>';
        html += '</li>';
        $(".myProfileOrders").html(html);
    }
}

function quoteAndEscape(str) {
    return ''
        + '&#39;'                      // open quote '
        + ('' + str)                     // force string
            .replace(/\\/g, '\\\\')    // double \
            .replace(/"/g, '\\&quot;') // encode "
            .replace(/'/g, '\\&#39;')  // encode '
        + '&#39;';                     // close quote '
}



function cartGlow() {
    
    console.log("hello");

    $(".header-cart-icon").addClass("ace");

    setTimeout(function(){
    
        $(".header-cart-icon").removeClass("ace");

    },1500);

}


function selectCities() {

    $.ajax({
        url: SERVER + "city",
        type: "GET",
        dataType: "JSON",
        contentType: "application/json;charset=utf-8",
        success: function (result) {
            var html='';
            
             if(result) {
                $.each(result, function(index,city){
                    html += '<option selected hidden>Please Choose your city</option>';
                    html += '<option value='+city.Id+'>' + city.Name + '</option>';
                }); 
                $("#selectCities").html(html);
            }
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
          }
    });
}