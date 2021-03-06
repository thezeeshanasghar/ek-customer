var items = [];
$(document).ready(function () {
    var id = parseInt(getParameterByName("id")) || 0;
   var PreId= localStorage.getItem("RestaurantId");
   if(localStorage.getItem("items")!=null)
   {
     if(PreId)
    {
    if(PreId==id)
    {
 
    }else{
     
        if (confirm('Are you sure to Remove Previous Selected Items')) {
            localStorage.setItem("RestaurantId", id);
        localStorage.removeItem("items");
        } else {
            window.open("index.html","_self");
        }
   
    }
}
   }else{
    localStorage.setItem("RestaurantId", id);
   }

   
  
    loadRestaurantDetails(id);
     menuBanner(id);
});

function loadRestaurantDetails(restaurantId) {

    $.ajax({
        url: SERVER + "restaurant/" + restaurantId + "/restaurant-details",
        type: "GET",
        dataType: "JSON",
        contentType: "application/json;charset=utf-8",
        success: function (result) {
            var html = '';
            var cuisineHtml = '';
           
                var restaurant = result;
                localStorage.setItem("DelCharges", restaurant.DelCharges);
                $("#restName").text(restaurant.Name);
                $.each(restaurant.cuisines, function (index, cuisine) {

                    cuisineHtml += '<div class="col-xs-12 col-sm-2 col-md-2 col-lg-2">';
                    cuisineHtml += '<div class="cuisine">';
                    cuisineHtml += '<span>' + cuisine.Name + '</span>';
                    cuisineHtml += '</div></div>';

                });
                $("#cuisineHtml").html(cuisineHtml);
                //Restaurant Menus
                $.each(restaurant.RestaurantMenus, function (index, menu) {
                    html += '<div class="col-xs-12 col-sm-5 col-md-5 col-lg-5">';
                    html += '<div class="large-heading">';
                    html += '<h1>' + menu.Name + '</h1>';
                    html += '</div>';
                    html += '<div class="menu-item-img">';
                    html += '<img src="'+IP+":"+PORT+"/"+menu.ImagePath+'" />';
                    
                    html += '</div></div>';
                    
                    //Restaurant Menu Items
                    html += '<div class="col-xs-12 col-sm-7 col-md-7 col-lg-7 menu-item-info-panel">';
                    $.each(menu.MenuItems, function (index, menuItem) {
console.log(index)
                        html += '<div class="menu-item-info">';

                        html += '<div class="left-panel">';
                        html += '<div class="menu-item-info-img"><img src="'+IP+":"+PORT+"/"+menuItem.ImagePath+'" /></div>';
                        html += '<div class="menu-item-name">';
                        html += '<h4>' + menuItem.Name + '</h4>';
                      //  html += '<p>' + getMenuSize(menuItem.Size) + " " + menuItem.Price + '</p>';
                      html += '<p>(' + menuItem.Size + ") " + menuItem.Price + '</p>';
                        html += '</div></div>';

                        html += '<div class="right-panel">';
                        html += '<a role="button" tabindex="0"  onclick="addToCart('
                        +0+','+ menuItem.Id + ',' + quoteAndEscape(menuItem.Name) +
                            ',' + quoteAndEscape(menuItem.Size) + ',' + menuItem.Price +','+menuItem.MenuId+
                            ');cartGlow();" style="cursor: pointer;">Add to cart</a>';

                        html += '</div></div>';
                    });
                    html += '</div>';
                });
                $("#menuAndItemsHtml").html(html);
            
            // } else {
            //     alert(result.Message);
            // }
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}

function getMenuSize(size) {
    let sizeName = "";
    switch (size) {
        case 0:
            sizeName = "Nothing";
            break;
        case 1:
            sizeName = "Half";
            break;
        case 2:
            sizeName = "Full";
            break;
        // default:
        //     sizeName = "Default Size";
    }
    return sizeName;
}

function addToCart(Type,id, name, size, price,MenuId) {
    // if (isLoggedIn()) {
        items = getObjsFromLocalStorage("items");
        if (!items) items = [];
        let isExist = false;
        if (items.length > 0) {
            $.each(items, function (i, value) {
                if (value.Id == id && value.Type==Type) {
                    isExist = true;
                    return false;
                }
              
            });
        }
        if (!isExist) {
            var item = {
                Type:Type,
                Id: id,
                Name: name,
                Size: size,
                Price: price,
                Quantity: 1,
                Total: 0,
                MenuId:MenuId
            }
            item.Total = item.Price * item.Quantity;
            //item.Size = getMenuSize(item.Size);
            items.push(item);
            localStorage.setItem('items', JSON.stringify(items));
            toggleCart();
        } else {
            alert('This item already added in your cart, please click items on right top corner!');
        }
    // } else {
    //     alert('Please login first');
    // }
}



function menuBanner(id) {

    $.ajax({
        url: SERVER + "restaurant/" + id ,
        type: "GET",
        dataType: "JSON",
        contentType: "application/json;charset=utf-8",
        success: function (result) {
          
          console.log(result);

            var path = result.CoverImagePath;
            var path2 = path.replace(/\\/g, "/");
            console.log(path2);
            var logoPath = IP +":"+ PORT +"/"+ result.LogoImagePath;
            
              $("#menu-banner").css("background-image","url('"+IP+":"+PORT+"/"+path2+"')");
              $(".menu-logo img").attr("src", logoPath);


        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}