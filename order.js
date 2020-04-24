var extraitems = [];
var items = getObjsFromLocalStorage("items");
var extraitems = getObjsFromLocalStorage("extraitems");
var CityId = getObjsFromLocalStorage("CityId");
var RestaurantId = getObjsFromLocalStorage("RestaurantId");
var DelCharges = getObjsFromLocalStorage("DelCharges");
var CouponDiscount = 0 ;
var Discount = 0;

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
                +item.Type+','+ item.Id + ',' + item.Price + ',' + item.Quantity + ')"><img src="img/minus.png"></span>';

            html += '<span class="qty">' + item.Quantity + '</span>';

            html += '<span class="right" onclick="plusQuantity('
            +item.Type+','  + item.Id + ',' + item.Price + ',' + item.Quantity + ')"><img src="img/plus.png"></span>';

            html += '</div>';
            html += ' </li>';
            html += '<li>' + item.Total + '</li>';
            html += '</div>';
            html += '</ul>';

        });
        $("#itemValues").html(html);
        localStorage.setItem("items",JSON.stringify(items));
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
            html += '<li>' + extraitem.Name + ' (' + extraitem.Size + ') </li>';
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
        $("#extraItemValues").append(html);
        calculateOrderTotals();
    }
}




function minusQuantity(type,itemId, price, quantity) {
 
    if (quantity > 0) {
        quantity = quantity - 1;
        let total = calculateTotal(price, quantity);
        changeItemValues(type,itemId, quantity, total);
    }
}



function plusQuantity(type,itemId, price, quantity) {
    debugger
    quantity = quantity + 1;
    let total = calculateTotal(price, quantity);
    changeItemValues(type,itemId, quantity, total)
}



function plusExtraItem(extraitemId, price, quantity) {
    quantity = quantity + 1;
    let total = calculateTotal(price, quantity);
    changeExtraItemValues(extraitemId, quantity, total)
}

function calculateTotal(price, quantity) {
    return price * quantity;
}

function changeItemValues(type,itemId, quantity, total) {
    $.each(items, function (i, value) {
        if (value.Id == itemId &&  value.Type==type) {
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

    // if (CouponDiscount !=0 && CouponDiscount != null)
    // {
    // Discount = ((CouponDiscount/100)*itemsubtotal);
    // subtotal = itemsubtotal-Discount ;
    // }

    // else {
    
    let itemsubtotal = 0;
    let exitemsubtotal = 0;
    let subtotal = 0;
    let grandTotal = 0;
    let GST = 0;
    let fee = DelCharges;
    $.each(items, function (i, value) {
        itemsubtotal = itemsubtotal + value.Total;
    });

    $.each(extraitems, function (i, value) {
        exitemsubtotal = exitemsubtotal + value.Total;
    });

    subtotal = itemsubtotal + exitemsubtotal ;
    GST = (15/100)*subtotal;

    grandTotal = subtotal + fee + GST; // TODO: using gst and fee to cal grandtotal
    $("#subtotal").val(subtotal);
   // $("#GST").val(GST);

   // var rounded = grandTotal.toPrecision(1);
   var rounded = Math.round(grandTotal);
    $("#DelCharges").val(DelCharges);
    $("#grandTotal").val(Math.round(grandTotal));
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
        
        if (extraitems != null)
        for (var i = 0; i <= extraitems.length - 1; i++) {
            delete extraitems[i].Id; 
            if (extraitems[i].Quantity === 0) {
                delete extraitems[i]; 
                extraitems.length--;

            }
        }
        if (items && items.length > 0) {
            var allItems = [];
            if (extraitems != null){
            allItems = items.concat(extraitems);
            }
            else {allItems = items}
            console.log (allItems);
            var order = {
                Subtotal: $("#subtotal").val(),
                GrandTotal: $("#grandTotal").val(),
                Fee: $("#DelCharges").val(),
                GST: $("#GST").val(),
                OrderItems : allItems,
                CustomerId: customer.Id,
                CityId : CityId,
                RestaurantId: RestaurantId 
            }
            $.ajax({
                url: SERVER + "order/customer-order",
                type: "POST",
                data: JSON.stringify(order),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (result) {
                    console.log(result);

                        alert("Your order is placed successfully");
                 
                       
                        // navigator.geolocation.getCurrentPosition(function(position) {
                        //     localStorage.setItem("lat",position.coords.latitude);
                        //     localStorage.setItem("long",position.coords.longitude);
                            addCoordinates("",localStorage.getItem("lat")+","+localStorage.getItem("lng"),result.Id);
                            localStorage.removeItem("items");
                            localStorage.removeItem("extraitems");
                            // localStorage.removeItem("RestaurantId");
                            localStorage.setItem("OrderId",result.Id);
                            toggleCart();
                             window.location.reload(true);
                        location.href = 'order-placed.html';
                        //});

                       
                        
                       
                      
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
//   function AddToCart(ID) {
//     var id = ID;//$('option:selected').val();
    
//     $.ajax({
//         url: SERVER + "MenuExtraItem/"+id,
//         type: "GET",
//         dataType: "JSON",
//         contentType: "application/json;charset=utf-8",
//         success: function (result) {
//             console.log(result);
//          if (isLoggedIn()) {
//            // extraitems = getObjsFromLocalStorage("extraitems");
//             if (!extraitems) extraitems = [];
//             let isExist = false;
//             if (extraitems.length > 0) {
//                 $.each(extraitems, function (i, value) {
//                     if (value.Id == id) {
//                         isExist = true;
//                         return false;
//                     }
//                 });
//             }
//             if (!isExist) {
//                 var extraitem = {
//                     Size: result.Size,
//                     Id: result.Id,
//                     Name: result.Name,
//                     Price: result.Price,
//                     Quantity: 1,
//                     Total: 0
//                 }
//                 extraitem.Total = extraitem.Price * extraitem.Quantity;
//                 extraitems.push(extraitem);
//                 localStorage.setItem('extraitems', JSON.stringify(extraitems));
//                 toggleCart();
//                 loadExtraOrderItems();
                
//             } else {
//                 alert('This item already added in your cart, please click items on right top corner!');
//             }
//          } else {
//              alert('Please login first');
//          }

            
//         },
//         error: function(xhr, status, error) {
//             console.log(xhr.responseText);
//           }
//     });

    
// }





function loadCouponCode()
{
    var code = $("#coupon-input").val();
    $.ajax({
        url: SERVER +"CouponCode/" + code,
        type: "GET",
        dataType: "JSON",
        contentType: "application/json;charset=utf-8",
        success: function (result) { 
            console.log(result);
            var date = result.ValidTill;
            var jdate = new Date(date);
            var sysdate = new Date();
            if (sysdate < jdate)
            {
            // alert("Congratulations You Got " +result.PctDiscount+"% Discount");  
            CouponDiscount = result.PctDiscount;
            console.log(CouponDiscount);
            calculateOrderTotals();
            $("#coupon-input").css({
               'border-color' : '#60ba62',
               'color' : '#60ba62'
            });

            }
            if(sysdate > jdate)
            {
            alert("Sorry This Code is Expired");
            }


            
          
            //$("#extras").html(html);
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
            
             $("#coupon-input").css({
               'border-color' : 'red',
               'color' : 'red'
            });


        }
    });
}

function GetExtraItem()
{
    var Item =JSON.parse(localStorage.getItem("items"));
    console.log(Item);
   var MenuId=[];
   $("#ExtraMenuList tbody").html("");
    for(var  x=0;x< Item.length;x++ )
    {
        
        var response = MenuId.indexOf(Item[x].MenuId)
        if(MenuId.indexOf(Item[x].MenuId)==-1)
        {
            console.log(Item[x].MenuId)
          $.ajax({
            type:"GET",
            dataType:"json",
            url:SERVER + "menu/" + Item[x].MenuId + "/menuextraitem" ,
            async: true,
            success:function(response)
            {
                
                console.log(response);
                var rows="";
                for(var i=0;i<response.length;i++)
                {
                    rows+="<tr>"
                    rows +="<td><input type=\"checkbox\"  onclick=\"addToCart("+1+","+response[i].Id+",'"+response[i].Name+"',"+response[i].Size+","+response[i].Price+")\" /></td>"
                    rows +="<td>"+response[i].Name+"</td>"
                    rows +="<td>"+response[i].Price+"</td>"
                    rows +="</tr>"
                }
                $("#ExtraMenuList tbody").append(rows);
               
            },
            error:function(response)
            {
                console.log(response);
            }
        })
        }
   
        MenuId.push(Item[x].MenuId)
    }
    
    $("#ExtraItemModal").modal("show");

}



//Changes


function addToCart(type,id, name, size, price) { 
    if (!items) items = [];
    let isExist = false;
    if (items.length > 0) {
        $.each(items, function (i, value) {
            // if (value.Id == id) {
            //     isExist = true;
            //     return false;
            // }
            if (value.Id == id && value.Type == type) 
            {
                isExist = true;
                return false;
            }
        });
    }
    if (!isExist) {
        var item = {
            Type:type,
            Id: id,
            Name: name,
            Size: size,
            Price: price,
            Quantity: 1,
            Total: 0
        }
        item.Total = item.Price * item.Quantity;
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
        console.log(items);
        loadOrderItems();
      
    } else {
        alert('This item already added in your cart');
    }
}


function addCoordinates(driver_Coordinates,customer_Coordinates,order_Id)
{
    var obj={
        Id:0,
        RiderCoordinates:driver_Coordinates,
        CustomerCoordinates:customer_Coordinates,
        OrderId:order_Id
    }
$.ajax({
    type:"POST",
    url:SERVER+"Coordinates",
    data:JSON.stringify(obj),
    dataType:"json",
    contentType: "application/json;charset=utf-8",
    success:function(response)
    {
        
      //   window.location.reload(true);
        //  location.href = '23. order-placed.html';
    },error:function(response)
    {
        console.log("error",response);
    }
})
}