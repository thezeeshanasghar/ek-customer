$(document).ready(function () {
    /* Authentication */
    toggleLogInOut();
    //selectCities();

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
        $(".otp-overlay").fadeOut();
    });

     $("#loginLink").click(function () {
        $(".signup-overlay").fadeOut();
        $(".login-overlay").fadeIn();
        $("#Email , #Password").val("");
    });

     $("#otploginLink").click(function () {
        $(".otp-overlay").fadeOut();
        $(".login-overlay").fadeIn();
        $("#Email , #Password").val("");
    });

     $("#signLink").click(function () {
        $(".login-overlay").fadeOut();
        $(".signup-overlay").fadeIn();
        $("#Email , #Password").val("");
    });

    $("#otpLink").click(function () {
        $(".login-overlay").fadeOut();
        $(".otp-overlay").fadeIn();
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



    $(".nonReg-overlay, .login-box-header .right-panel").on('click', function (event) {
        $(".nonReg-overlay").fadeOut();
        // $("#name , #mobNum , #email , #password , #password2 , Address").val("");
    });




    // OTP function

     $(".otp-overlay").on('click', function (event) {
        $(this).fadeOut();
        // $("#name , #mobNum , #email , #password , #password2 , Address").val("");
    });

    $(".web-otp li").click(function(){
        var dot = $(this).find(".otpDot");
        var num = $(this).find(".otpNum");

        $(dot).hide();
        $(num).show();
        $(num).focus();
    });

    $(".otpNum").focusout(function(){
        console.log("focusOut");
        var val = $(this).val();
        if (val.length == 0) {
        $(this).hide();
        $(this).prev(".otpDot").show();   
        }
    })





    $(".logoutLi").on('click', function () {
        localStorage.clear();
        toggleLogInOut();
        location.reload(true);
    });
    toggleCart();
    toggleProfileAndOrders();
});

function nonReg() {
    $(".otp-overlay").fadeOut();
    $(".nonReg-overlay").fadeIn();
}

function freeReg() {
    $(".nonReg-overlay").fadeOut();
    $(".signup-overlay").fadeIn();
}



 
function login() {
    obj = {
        "MobileNumber": $("#txtContactNumber").val(),
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
               if(result.IsVerified==1)
               {
                        localStorage.setItem("Customer", JSON.stringify(result));
                $(".login-overlay").fadeOut();
                toggleLogInOut();
                toggleProfileAndOrders();
               }else{
                localStorage.setItem("CustomerId",result.Id)
                console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&7")

                $(".login-overlay").fadeOut();
                $("#Contactform").css("display","none");
               $(".web-otp").css("display","block");
                $(".otp-overlay").fadeIn();
               }
          
            // } else {
            //     alert(result.Message);
            // }
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
            alert("Login Failed->Contact No or Password is wrong")
        }
    });
}

function SignUp() {
debugger
    obj = {
        "Name": $("#name").val(),
        "Email": $("#email").val(),
        "Password": $("#password").val(),
        "MobileNumber": $("#mobNum").val(),
        "Address": $("#Address").val(),
        // "CityId": $("#selectCities").val()
    }
console.log (obj);
    $.ajax({
        url: SERVER + "customer",
        type: "POST",
        data: JSON.stringify(obj),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (result) {

            //    localStorage.setItem("Customer", JSON.stringify(result));
            //    location.reload();
            localStorage.setItem("CustomerId",result.Id)

            $(".signup-overlay").fadeOut();
            $("#Contactform").css("display","none");
           $(".web-otp").css("display","block");
            $(".otp-overlay").fadeIn();
        },
        error: function (xhr, status, error) {
            alert("Operation unsuccessfull");    
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


// function selectCities() {

//     $.ajax({
//         url: SERVER + "city",
//         type: "GET",
//         dataType: "JSON",
//         contentType: "application/json;charset=utf-8",
//         success: function (result) {
//             var html='';
            
//              if(result) {
//                 $.each(result, function(index,city){
//                     html += '<option selected hidden>Please Choose your city</option>';
//                     html += '<option value='+city.Id+'>' + city.Name + '</option>';
//                 }); 
//                 $("#selectCities").html(html);
//             }
//         },
//         error: function(xhr, status, error) {
//             console.log(xhr.responseText);
//           }
//     });
// }
function VerifyNumber()
{
var Number=$("#ContactNumber").val()
    $.ajax({
        url: SERVER + "Customer/VerifyNumber/"+Number,
        type: "GET",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        beforeSend:function(){
            // $('#loading').removeClass("d-none");
        },
        success: function (result) {
          console.log(result);
          if(result)
          {
            localStorage.setItem("CustomerId",result.Id);
            // window.open("03. verify.html","_self");
        $(".web-otp").css("display","block"); 
        }$("#Contactform").css("display","none");
        GetCode();
        },
        error: function (xhr, status, error) 
        {
            //var resp=JSON.parse(xhr.responseText);

           // alert(resp.message);
        alert("error")
        },
        complete:function()
        {
            // $('#loading').addClass("d-none");
        }
 
    });
}
function VerifyUser()
{
    var code=$("#Key1").val()+$("#Key2").val()+$("#Key3").val()+$("#Key4").val();
   var Id=localStorage.getItem("CustomerId");
    $.ajax({
        url: SERVER + "customer/VerifyCustomer/"+Id,
        type: "PUT",
        dataType: "json",
        data:{Code:code},
        contentType: "application/json;charset=utf-8",
        beforeSend:function(){
            $('#loading').removeClass("d-none");
        },
        success: function (result) {
          console.log(result);
          if(result)
          {
              if(result.IsVerified==1)
              {
                localStorage.setItem("Customer", JSON.stringify(result));
                localStorage.removeItem("CustomerId");
                // window.open("01. starting-page.html","_self"); 
               $("#Contactform").css("display","block");
               $(".web-otp").css("display","none");

                $(".otp-overlay").fadeOut();
                toggleLogInOut();
                toggleProfileAndOrders();
              }else{
                  alert("Invalid Code");
              }
             
                // $(".login-overlay").fadeOut();
                // toggleLogInOut();
                // toggleProfileAndOrders();
                // window.open("01. starting-page.html","_self");  
          }
             
        },
        error: function (xhr, status, error) 
        {
            //var resp=JSON.parse(xhr.responseText);

           // alert(resp.message);
        alert("error")
        },
        complete:function()
        {
            $('#loading').addClass("d-none");
        }
 
    });
}

function GetCode()
{
    var Id=localStorage.getItem("CustomerId");
    $.ajax({
        url: SERVER + "Setting/sms/"+Id+"/Customer",
        type: "GET",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        beforeSend:function(){
            $('#loading').removeClass("d-none");
        },
        success: function (result) {
          console.log(result);
        },error:function(resp)
        {

        }
    });


}