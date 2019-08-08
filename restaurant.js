$(document).ready(function(){
    getResturantsFromDB();
    getCousines();
});

function getResturantsFromDB() {
    $.get(SERVER + "restaurant", function(
      restaurants,
      status
    ) {
      for (var i = 0; i < restaurants.length; i++) {
        var res = restaurants[i];
        // console.log(res.Name);
        var resMenu = SERVER + "restaurant/" + res.Id + "/menu";

        jQuery.ajaxSetup({ async: false }); // this line is used for Synchronous JavaScript call

        $.get(resMenu, function(menus, stat) {
          var MenuList = [];
          for (var j = 0; j < menus.length; j++) {
            MenuList.push(menus[j].Name);
          }
          // console.log('res.CoverImagePath',res.CoverImagePath);
          var imgpath = IP + ":" + PORT + "/";

          if (res.CoverImagePath == null) {
            imgpath += res.LogoImagePath;
          } else {
            imgpath += res.CoverImagePath;
          }

          // console.log('image path is ===',imgpath);
          var sponsers =
            '<div class="col-xs-12 col-sm-3 col-md-3 col-lg-3"><div class="top-sponsor-item"><img src =' +
            imgpath +
            ' style="width:100%; height: 100%;"></div></div>';
          var str =
            '<div class="col-xs-12 col-sm-3 col-md-3 col-lg-3"><div class="top-sponsor-item"><img src =' +
            imgpath +
            ' style="width:100%; height: 100%;"></div> </div>';

          var str2 =
            '<div class="col-xs-12 col-sm-9 col-md-9 col-lg-9"><div class="all-rest-info">' +
            '<div class="rest-info-img"><img src =' +
            imgpath +
            ' style="width:100%; height: 100%;"></div><div class="rest-info-content"><div class="left-panel" style="width: 280px; overflow: hidden;">' +
            "<h4>" +
            res.Name +
            '</h4> <div class="rating"><img src="img/stars.png" /> <span class="rating-num" style="margin-left: 10px; color: #62ba64;" >4.5 Excellent ' +
            '</span > <span class="rating-reviews" style="margin-left: 10px; color: #c6c4c7;" >(50+)</span >' +
            '<div class="rest-info-distance" style="margin-top: 10px; color: #000;" > Approximately 45 Min </div> ' +
            '<div class="rest-info-attr" style="margin-top: 10px; color: #c6c4c7;" > ' +
            MenuList +
            " .... </div> " +
            '</div> </div> <div class="right-panel" style="text-transform: uppercase;"><div class="status status-open">Open</div>' +
            '<a href="#">View</a> </div> </div> </div>';

          $(".top-dishes").append(sponsers);
          $(".top-resturants").append(str);
          $(".all-restaurants").append(str2);
        });
      }
    });
  }

  function getCousines() {
    $.get(SERVER + "Cuisine", function(val, status) {
      var restmenuList = ' <ul><li class="active">All Cuisines</li>';
      for (var i = 0; i < val.length; i++) {
        var obj = val[i];
        restmenuList += '<li>' + obj.Name + ' </li>'
      }
      restmenuList +='</ul>';
      $(".item-list").append(restmenuList);
    });
  }
  