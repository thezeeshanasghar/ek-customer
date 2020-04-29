$(document).ready(function () {
    var customer = getObjsFromLocalStorage("Customer");
    loadCustomerProfile(customer.Id);
});

function loadCustomerProfile(customerId) {

    $.ajax({
        url: SERVER + "Customer/" + customerId,
        type: "GET",
        dataType: "JSON",
        contentType: "application/json;charset=utf-8",
        success: function (result) {
          //  if (result.IsSuccess) {
                var customer = result;
                
                $(".Name").text(customer.Name);
                $(".Email").text(customer.Email);
                $("#oldPassword").val(customer.Password);

                $("#Name").val(customer.Name);
                $("#MobileNumber").val(customer.MobileNumber);
                $("#Email").val(customer.Email);
                var html = '';
                if (customer.ImagePath) {
                    // html += '<img src="' + RESOURCEURL + customer.ImagePath + '" />';
                    html += '<img src="' +RESOURCEURL+ customer.ImagePath + '" />';
                    
                } else {
                    html += '<img id="output" src="img/edit-profile-pic.jpg"></img>';
                }
                $("#oldProfileImage").html(html);

            // } else {
            //     alert(result.Message);
            // }
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

$("form#data").submit(function (e) {
    if (isLoggedIn()) {
        if (validatePassword()) {
            e.preventDefault();
            var formData = new FormData(this);
            var customer = getObjsFromLocalStorage("Customer");
            var customerId = customer.Id;
            var obj = {
                Name: $("#Name").val(),
                MobileNumber: $("#MobileNumber").val(),
                Email: $("#Email").val(),
                Password: $("#Password").val()
            }
            
            formData.append("Customer", JSON.stringify(obj));

            $.ajax({
                url: SERVER + "Customer/edit-profile/" + customerId,
                type: "PUT",
                data: formData,
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (result) {
                    // if (result.IsSuccess) {
                        localStorage.setItem("Customer", JSON.stringify(result));
                        alert("Your profile is updated successfully");
                    // } else {
                    //     alert(result.Message);
                    // }
                },
                error: function (xhr, status, error) {
                    console.log(error);
                },
                cache: false,
                contentType: false,
                processData: false
            });
        } else {
            alert("Password is mismatched")
        }
    } else {
        alert('Please login first');
    }
});

function validatePassword() {
    if ($("#newPassword").val() && $("#Password").val()) {
        if ($("#newPassword").val() === $("#Password").val()) {
            return true;
        } else {
            return false;
        }
    } else {
        $("#Password").val($("#oldPassword").val());
        return true;
    }
}

 function  loadFile(event) {
      var html="";
	// var image = document.getElementById('output');
    // image.src = URL.createObjectURL(event.target.files[0]);
    if (event.target.files[0]) {
        // html += '<img src="' + RESOURCEURL + customer.ImagePath + '" />';
        html += '<img src="'+  URL.createObjectURL(event.target.files[0]) + '" />';
        
    } else {
        html += '<img id="output" src="img/edit-profile-pic.jpg"></img>';
    }
    $("#oldProfileImage").html(html);
}
const myForm = document.getElementById('myForm');
const inpFile = document.getElementById('file-input');
myForm.addEventListener("submit" , e=> {
    e.preventDefault();
    const endpoint = SERVER + "upload";
    const formData = new FormData();
    formData.append("inpFile" , inpFile.files[0]);
    fetch(endpoint , {
        method: "POST",
        body : formData  
    }).then(response => response.json())
    .then(data => {
        customer.ImagePath = data.dbPath;
      console.log(customer) // Prints result from `response.json()` in getRequest
    }).catch(console.error);
   
});