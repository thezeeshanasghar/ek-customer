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
                console.log(result)
                var html = '';
                let subt = 0,gst=0.,deliveryCharges=0;
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
                    gst=(subt/100)*16;
                
                    console.log(item.DeliveryCharges)
               
                });
                $("#orderItems").html(html);
                $("#subtotal").text(subt);
                $("#GST").text(gst);
                deliveryCharges=result.DeliveryCharges;
                $("#DeliveryCharges").text(result.DeliveryCharges);
                grandTotal = calGrandTotal(subt,gst,deliveryCharges);
                $("#grandTotal").text(grandTotal);


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

function calGrandTotal(subt,gst,DeliveryCharges){
    debugger
  let  grandTotal = subt +gst+DeliveryCharges;
    return Math.round(grandTotal) ;
}