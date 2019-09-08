$(document).ready(function () {
    var customer = getObjsFromLocalStorage("Customer");
    loadCustomerOrders(customer.Id);
    // Edti Section

    $("#edit-pro-btn").click(function () {

        $("#edit-pro-row").slideToggle();

        $(".edit-pro-heading img").toggleClass('display');

    });

    // $("#edit-pro-up").click(function(){

    // 	$("#edit-pro-row").slideUp();

    // 	$(".edit-heading img").toggleClass('display');

    // });

    // Order Section

    $("#order-pro-btn").click(function () {

        $("#order-pro-row").slideToggle();

        $(".order-heading img").toggleClass('display');

    });

    // $("#order-pro-up").click(function(){

    // 	$("#order-pro-row").slideUp();

    // 	$(".order-heading img").toggleClass('display');

    // });

    // Wallet Section

    $("#wallet-pro-btn").click(function () {

        $("#wallet-pro-row").slideToggle();

        $(".wallet-heading img").toggleClass('display');

    });

    // $("#wallet-pro-up").click(function(){

    // 	$("#wallet-pro-row").slideUp();

    // 	$(".wallet-heading img").toggleClass('display');

    // });

    // Order Section

    $(document).on("click", ".order-panel-btn", function () {
        $(".vanish-up").css("display", "none");
        $(".vanish-left").css("display", "block");
    });

    $(document).on("click", ".vanish-left", function () {
        $(this).css("display", "none");
        $(".vanish-up").css("display", "block");
    });

});

function loadCustomerOrders(customerId) {

    $.ajax({
        url: SERVER + "Customer/" + customerId + "/orders",
        type: "GET",
        dataType: "JSON",
        contentType: "application/json;charset=utf-8",
        success: function (result) {
            var html = '';
            if (result.IsSuccess) {
                $.each(result.ResponseData, function (key, order) {
                    html += '<section>';
                    html += '<div class="order-panel-col order-panel-detail">';
                    html += '<h4>Order ID #' + order.Id + '</h4>';
                    html += '<p>' + order.Created + '</p>';
                    html += '</div>';
                    html += '<div class="order-panel-col order-panel-amount">';
                    html += '<h4>' + order.GrandTotal + '</h4>';
                    html += '</div>';
                    html += '<div class="order-panel-col order-panel-status">';
                    html += '<h4 class="order-orange">' + order.Status + '</h4>';
                    html += '</div>';
                    html += '<div class="order-panel-col order-panel-btn">';
                    html += '<span><a style="color:white;" href="order-details.html?id=' + order.Id + '">View order Detail</a></span>';
                    html += '</div>';
                    html += '</section>';
                });

            } else {
                alert(result.Message);
            }
            $("#orders").html(html);
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}