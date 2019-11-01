var subtotal = 0;
var grandTotal = 0;
$(document).ready(function () {
    var orderId = parseInt(getParameterByName("id")) || 0;
    getOrderDetails(orderId);
});

function getOrderDetails(orderId) {

    $.ajax({
        url: SERVER + "Order/" + orderId,
        type: "GET",
        dataType: "JSON",
        contentType: "application/json;charset=utf-8",
        success: function (result) {
            //if (result.IsSuccess) {
                var html = '';
                let subt = 0;
                $.each(result.OrderItems, function (key, item) {
                    html += '<section>';
                    html += '<div style="text-align: left;" class="order-panel-col order-panel-width">';
                    html += '<p>' + item.Name + '</p>';
                    html += '</div>';
                    html += '<div class="order-panel-col order-panel-width">';
                    html += '<p>Rs. ' + item.Price + '</p>';
                    html += '</div>';
                    html += '<div class="order-panel-col order-panel-width">';
                    html += '<p>' + item.Quantity + '</p>';
                    html += '</div>';
                    html += '<div class="order-panel-col order-panel-width">';
                    html += '<p>Rs. ' + item.Total + '</p>';
                    html += '</div>';
                    html += '</section>';
                    subt = calSubotal(item);
                });
                $("#orderItems").html(html);
                $("#subtotal").text(subt);
                grandTotal = calGrandTotal();
                $("#grandTotal").text(subt);


       //     } else {
            //    alert(result.Message);
            
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}

function calSubotal(item){
    subtotal = subtotal + item.Total
    return subtotal;
}

function calGrandTotal(){
    grandTotal = grandTotal + subtotal;
    return grandTotal;
}