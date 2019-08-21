var items = [];
$(document).ready(function () {
    var id = parseInt(getParameterByName("id")) || 0;
    loadRestaurantDetails(id);
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
            if (result.IsSuccess) {
                var restaurant = result.ResponseData;
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
                    html += '<div class="menu-item-img">'
                    html += '<span>Picture related to mutton</span>';
                    html += '</div></div>';
                    //Restaurant Menu Items
                    html += '<div class="col-xs-12 col-sm-7 col-md-7 col-lg-7">';
                    $.each(menu.MenuItems, function (index, menuItem) {

                        html += '<div class="menu-item-info">';

                        html += '<div class="left-panel">';
                        html += '<div class="menu-item-info-img"></div>';
                        html += '<div class="menu-item-name">';
                        html += '<h4>' + menuItem.Name + '</h4>';
                        html += '<p>' + getMenuSize(menuItem.Size) + " " + menuItem.Price + '</p>';
                        html += '</div></div>';

                        html += '<div class="right-panel">';
                        html += '<a role="button" tabindex="0"  onclick="addToCart('
                            + menuItem.Id + ',' + quoteAndEscape(menuItem.Name) +
                            ',' + menuItem.Size + ',' + menuItem.Price +
                            ')" style="cursor: pointer;">Add to cart</a>';

                        html += '</div></div>';
                    });
                    html += '</div>';
                });
                $("#menuAndItemsHtml").html(html);
            } else {
                alert(result.Message);
            }
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

function addToCart(id, name, size, price) {
    if (isLoggedIn()) {
        items = getObjsFromLocalStorage("items");
        if (!items) items = [];
        let isExist = false;
        if (items.length > 0) {
            $.each(items, function (i, value) {
                if (value.Id == id) {
                    isExist = true;
                    return false;
                }
            });
        }
        if (!isExist) {
            var item = {
                Id: id,
                Name: name,
                Size: size,
                Price: price,
                Quantity: 1,
                Total: 0
            }
            item.Total = item.Price * item.Quantity;
            item.Size = getMenuSize(item.Size);
            items.push(item);
            localStorage.setItem('items', JSON.stringify(items));
            toggleCart();
        } else {
            alert('This item already added in your cart, please click items on right top corner!');
        }
    } else {
        alert('Please login first');
    }
}