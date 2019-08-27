var items = getObjsFromLocalStorage("items");
$(document).ready(function () {
    loadOrderItems();
});
function loadOrderItems() {

    if (items && items.length > 0) {
        var html = '';
        $.each(items, function (index, item) {

            html += '<ul class="second-ul">';
            html += '<div class="left-panel">';
            html += '<li>';
            html += '<img src="img/cross-dark.jpg">';
            html += '</li>';
            html += '<li>' + item.Name + ' (' + item.Size + ')</li>';
            html += '</div>';

            html += '<div class="right-panel">';
            html += '<li>Rs. ' + item.Price + '</li>';
            html += '<li>';
            html += '<div class="quantity-box">';

            html += '<span class="left" onclick="minusQuantity('
                + item.Id + ',' + item.Price + ',' + item.Quantity + ')"><img src="img/minus.png"></span>';

            html += '<span class="qty">' + item.Quantity + '</span>';

            html += '<span class="right" onclick="plusQuantity('
                + item.Id + ',' + item.Price + ',' + item.Quantity + ')"><img src="img/plus.png"></span>';

            html += '</div>';
            html += ' </li>';
            html += '<li>' + item.Total + '</li>';
            html += '</div>';
            html += '</ul>';

        });
        $("#itemValues").html(html);
        calculateOrderTotals();
    }
}

function minusQuantity(itemId, price, quantity) {
    if (quantity > 0) {
        quantity = quantity - 1;
        let total = calculateTotal(price, quantity);
        changeItemValues(itemId, quantity, total);
    }
}

function plusQuantity(itemId, price, quantity) {
    quantity = quantity + 1;
    let total = calculateTotal(price, quantity);
    changeItemValues(itemId, quantity, total)
}

function calculateTotal(price, quantity) {
    return price * quantity;
}

function changeItemValues(itemId, quantity, total) {
    $.each(items, function (i, value) {
        if (value.Id == itemId) {
            items[i].Quantity = quantity;
            items[i].Total = total;
        }
    });
    loadOrderItems();
}

function calculateOrderTotals() {
    let subtotal = 0;
    let grandTotal = 0;
    let GST = 0;
    let fee = 0;
    $.each(items, function (i, value) {
        subtotal = subtotal + value.Total;
    });
    grandTotal = subtotal + fee + GST; // TODO: using gst and fee to cal grandtotal
    $("#subtotal").val(subtotal);
    $("#grandTotal").val(grandTotal);
}

function checkout() {
    if (isLoggedIn()) {
        var customer = getObjsFromLocalStorage("Customer");
        for (var i = 0; i <= items.length - 1; i++) {
            delete items[i].Id;
            if (items[i].Quantity === 0) {
                delete items[i];
                items.length--;

            }
        }
        if (items && items.length > 0) {
            var order = {
                Subtotal: $("#subtotal").val(),
                GrandTotal: $("#grandTotal").val(),
                Fee: 0,
                GST: 0,
                OrderItems: items,
                CustomerId: customer.Id
            }
            $.ajax({
                url: SERVER + "order/customer-order",
                type: "POST",
                data: JSON.stringify(order),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (result) {
                    if (result.IsSuccess) {
                        alert("Your order is placed successfully");
                        localStorage.removeItem("items");
                        toggleCart();
                        window.location.reload(true);
                        location.href = 'index.html';
                    } else {
                        alert(result.Message);
                    }
                }
            });
        } else {
            alert("Cart is empty");
        }
    } else {
        alert('Please login first');
    }

}