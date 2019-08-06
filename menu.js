$(document).ready(function () {
    //TODO:get id from url
    loadRestaurantDetails(2);
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
                        html += '<p>' + menuItem.Half + " " + menuItem.Full + '</p>';
                        html += '</div></div>';

                        html += '<div class="right-panel">';
                        html += '<a href="#">Add to order</a>';

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

