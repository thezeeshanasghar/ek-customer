var extraitems = [];
var items = getObjsFromLocalStorage("items");
var extraitems = getObjsFromLocalStorage("extraitems");
$(document).ready(function () {
    loadOrderItems(); loadextraitems(); loadExtraOrderItems();
});
function loadOrderItems() {

    if (items && items.length >= 0) {
        var html = '';
        $.each(items, function (index, item) {

            html += '<ul class="second-ul">';
            html += '<div class="left-panel">';
            html += '<li>';
            html += '<img src="img/cross-dark.jpg" onclick = deleteItem('+index+');cartGlow();>';
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

// load extra Items dropdown
function loadextraitems () {
    var id = localStorage.getItem("RestaurantId")
    $.ajax({
        url: SERVER + "restaurant/"+id+"/extraitem",
        type: "GET",
        dataType: "JSON",
        contentType: "application/json;charset=utf-8",
        success: function (result) {
            console.log(result);
            var html = '';
            $.each(result, function (index ) {
               html += '<option selected hidden>Choose item</option>' ; 
               html += '<option value = '+result[index].Id+' >' + result[index].Name + '</option>' ; 
               
            });
            
            $("#extraItems").html(html);
        

        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
          }
    });
}

// load extra items in table
function loadExtraOrderItems() {

    if (extraitems && extraitems.length >= 0) {
        var html = '';
        $.each(extraitems, function (index, extraitem) {

            html += '<ul class="second-ul">';
            html += '<div class="left-panel">';
            html += '<li>';
            html += '<img src="img/cross-dark.jpg" onclick="deleteExtraItem('+index+')">';
            html += '</li>';
            html += '<li>' + extraitem.Name + '</li>';
            html += '</div>';

            html += '<div class="right-panel">';
            html += '<li>Rs. ' + extraitem.Price + '</li>';
            html += '<li>';
            html += '<div class="quantity-box">';

            html += '<span class="left" onclick="minusExtraItem('
                + extraitem.Id + ',' + extraitem.Price + ',' + extraitem.Quantity + ')"><img src="img/minus.png"></span>';

            html += '<span class="qty">' + extraitem.Quantity + '</span>';

            html += '<span class="right" onclick="plusExtraItem('
                + extraitem.Id + ',' + extraitem.Price + ',' + extraitem.Quantity + ')"><img src="img/plus.png"></span>';

            html += '</div>';
            html += ' </li>';
            html += '<li>' + extraitem.Total + '</li>';
            html += '</div>';
            html += '</ul>';

        });
        $("#extraItemValues").html(html);
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

function minusExtraItem(extraitemId, price, quantity) {
    if (quantity > 0) {
        quantity = quantity - 1;
        let total = calculateTotal(price, quantity);
        changeExtraItemValues(extraitemId, quantity, total);
    }
}


function plusQuantity(itemId, price, quantity) {
    quantity = quantity + 1;
    let total = calculateTotal(price, quantity);
    changeItemValues(itemId, quantity, total)
}

function plusExtraItem(extraitemId, price, quantity) {
    quantity = quantity + 1;
    let total = calculateTotal(price, quantity);
    changeExtraItemValues(extraitemId, quantity, total)
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

function changeExtraItemValues(extraitemId, quantity, total) {
    $.each(extraitems, function (i, value) {
        if (value.Id == extraitemId) {
            extraitems[i].Quantity = quantity;
            extraitems[i].Total = total;
        }
    });
    loadExtraOrderItems();
}

function deleteItem (i)
{
    console.log (items[i]);
   items.splice(i , 1);
   localStorage.setItem('items', JSON.stringify(items));
  loadOrderItems(); toggleCart();

}

function deleteExtraItem (i)
{
    console.log (extraitems[i]);
   extraitems.splice(i , 1);
   localStorage.setItem('extraitems', JSON.stringify(extraitems));
  loadExtraOrderItems();

}

function calculateOrderTotals() {
    
    let itemsubtotal = 0;
    let exitemsubtotal = 0;
    let subtotal = 0;
    let grandTotal = 0;
    let GST = 0;
    let fee = 0;
    $.each(items, function (i, value) {
        itemsubtotal = itemsubtotal + value.Total;
    });

    $.each(extraitems, function (i, value) {
        exitemsubtotal = exitemsubtotal + value.Total;
    });

    subtotal = itemsubtotal + exitemsubtotal ;


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

        for (var i = 0; i <= extraitems.length - 1; i++) {
            delete extraitems[i].Id; 
            if (extraitems[i].Quantity === 0) {
                delete extraitems[i]; 
                extraitems.length--;

            }
        }
        if (items && items.length > 0) {
            var allItems = [];
            allItems = items.concat(extraitems);
            console.log (allItems);
            var order = {
                Subtotal: $("#subtotal").val(),
                GrandTotal: $("#grandTotal").val(),
                Fee: 0,
                GST: 0,
                OrderItems : allItems,
                CustomerId: customer.Id
            }
            $.ajax({
                url: SERVER + "order/customer-order",
                type: "POST",
                data: JSON.stringify(order),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (result) {
                //    if (result.IsSuccess) {
                        alert("Your order is placed successfully");
                        localStorage.removeItem("items");
                        localStorage.removeItem("extraitems");
                        toggleCart();
                        window.location.reload(true);
                        location.href = 'order-placed.html';
                //    } else {
                //        alert(result.Message);
                //    }
                }
            });
        } else {
            alert("Cart is empty");
        }
    } else {
        alert('Please login first');
    }

}

// Add to Cart
  function AddToCart() {
    var id = $('option:selected').val();
    
    $.ajax({
        url: SERVER + "restaurantextraitem/"+id,
        type: "GET",
        dataType: "JSON",
        contentType: "application/json;charset=utf-8",
        success: function (result) {
            console.log(result);
         if (isLoggedIn()) {
           // extraitems = getObjsFromLocalStorage("extraitems");
            if (!extraitems) extraitems = [];
            let isExist = false;
            if (extraitems.length > 0) {
                $.each(extraitems, function (i, value) {
                    if (value.Id == id) {
                        isExist = true;
                        return false;
                    }
                });
            }
            if (!isExist) {
                var extraitem = {
                    Size: 'Full',
                    Id: result.Id,
                    Name: result.Name,
                    Price: result.Price,
                    Quantity: 1,
                    Total: 0
                }
                extraitem.Total = extraitem.Price * extraitem.Quantity;
                extraitems.push(extraitem);
                localStorage.setItem('extraitems', JSON.stringify(extraitems));
                toggleCart();
                loadExtraOrderItems();
                
            } else {
                alert('This item already added in your cart, please click items on right top corner!');
            }
         } else {
             alert('Please login first');
         }

            
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
          }
    });

    
}
