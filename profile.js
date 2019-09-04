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
             if (result.IsSuccess) {
                var customer = result.ResponseData;
                $(".Name").text(customer.Name);
                $(".Email").text(customer.Email);
                $("#Password").val(customer.Password);
                var html = '';
                if(customer.ImagePath){
                    html +='<img src="'+ customer.ImagePath + '" />';
                } else {
                    html +='<img src="img/edit-profile-pic.jpg"></img>';
                }
                $("#ProfileImage").html(html);
                
            } else {
                alert(result.Message);
            }
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}
function update() {
    if (isLoggedIn()) {
        var customer = getObjsFromLocalStorage("Customer"); 
            var customer = {
                CustomerId: customer.Id
            }
            $.ajax({
                url: SERVER + "Customer",
                type: "PUT",
                data: JSON.stringify(customer),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (result) {
                    if (result.IsSuccess) {
                        alert("Your profile is updated successfully");
                    } else {
                        alert(result.Message);
                    }
                }
            });
    } else {
        alert('Please login first');
    }

}