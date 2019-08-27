$(document).ready(function () {
    /* Authentication */
    toggleLogInOut();
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

    $(".logoutLi").on('click', function () {
        localStorage.clear();
        toggleLogInOut();
        location.reload(true);
    });
    toggleCart();
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
            if (result.IsSuccess) {
                localStorage.setItem("Customer", JSON.stringify(result.ResponseData));
                $(".login-overlay").fadeOut();
                toggleLogInOut();
            } else {
                alert(result.Message);
            }
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
        $(".loginLi").hide();
    } else {
        $(".loginLi").show();
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

function quoteAndEscape(str) {
    return ''
        + '&#39;'                      // open quote '
        + ('' + str)                     // force string
            .replace(/\\/g, '\\\\')    // double \
            .replace(/"/g, '\\&quot;') // encode "
            .replace(/'/g, '\\&#39;')  // encode '
        + '&#39;';                     // close quote '
}