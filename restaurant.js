var URL="";
var id =0;
var cuisineId=0;
var Top="";
var Parameters=[];
$(document).ready(function(){
  GenerateUrl(Parameters);
     id = parseInt(getParameterByName("id")) || 0;
     
     cuisineId=parseInt(getParameterByName("cuisineId"))||0;
    localStorage.setItem("CityId", id);
     URL=SERVER + "restaurant/city/"+id;
     cuisineId!=0?URL+="?cuisineId="+cuisineId:"";
     Top!=""?URL+="&top=true":"";
    getResturantsFromDB(id,URL);
    loadRest();
    getCousines();
    restBanner(id);
  
});
var Status = ['Open', 'Close'];

function getResturantsFromDB(id,url) {
 
    $.get(url, function(
      restaurants,
      status
    ) {;
      console.log(restaurants)
      // $(".top-dishes").html("");
      // $(".top-resturants").html("");
      // $(".all-restaurants").html("");
   
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
            imgpath += res.CoverImagePath;
          } else {
            imgpath += res.LogoImagePath;
          }

          // console.log('image path is ===',imgpath);
          var sponsers="";
          
      
          if(res.IsSponsor==true)
          {
             sponsers =
            '<div class="col-xs-12 col-sm-3 col-md-3 col-lg-3"><div class="top-sponsor-item"><img src =' +
            imgpath +
            ' style="width:100%; height: 100%;"></div></div>';
          }
      
          var str =
            '<div class="col-xs-12 col-sm-3 col-md-3 col-lg-3"><div class="top-sponsor-item"><img src =' +
            imgpath +
            ' style="width:100%; height: 100%;"></div> </div>';

          // var str2 =
          //   '<div class="all-rest-info">' +
          //   '<div class="rest-info-img"><img src =' +
          //   imgpath +
          //   ' style="width:100%; height: 100%;"></div><div class="rest-info-content"><div class="left-panel" style="width: 280px; overflow: hidden;">' +
          //   "<h4>" +
          //   res.Name +
          //   '</h4> <div class="rating"><img src="img/stars.png" /> <span class="rating-num" style="margin-left: 10px; color: #62ba64;" >4.5 Excellent ' +
          //   '</span > <span class="rating-reviews" style="margin-left: 10px; color: #c6c4c7;" >(50+)</span >' +
          //   '<div class="rest-info-distance" style="margin-top: 10px; color: #000;" > Approximately 45 Min </div> ' +
          //   '<div class="rest-info-attr" style="margin-top: 10px; color: #c6c4c7;" > ' +
          //   MenuList +
          //   " .... </div></div> </div> " +
          //   '<div class="right-panel" style="text-transform: uppercase;">' +
          //   '&nbsp;<span class="status status-open">'+Status[res.Status]+'</span> </div><a href="menu.html?id='+res.Id+'" class="view-btn">view</a>'+
          //   "</div>";

          $(".top-dishes").append(sponsers);
          $(".top-resturants").append(str);
          // $(".all-restaurants").append(str2);
        });
      }
    });
  }

  function getCousines() {
    $.get(SERVER + "Cuisine", function(val, status) {
      var restmenuList = ' <ul><li class="active">All Cuisines</li>';
      for (var i = 0; i < val.length; i++) {
        var obj = val[i];
        restmenuList += '<li onclick=\'Cousineclk('+obj.Id+')\'>' + obj.Name + ' </li>'
      }
      restmenuList +='</ul>';
      $(".item-list").append(restmenuList);
    });
  }
  
 function Cousineclk(Cousine)
  {
 
    setParams("cuisineId",Cousine);
    GenerateUrl(Parameters);
  }


function setParams(key,val)
{
  var url= window.location.href;
   Parameters= url.split("?")[1].split("&");
  var stat=false;
  console.log(Parameters)
  for(var x=0;x<Parameters.length;x++){
    console.log(Parameters[x].split("=")[0].toString()==key);
    if(Parameters[x].split("=")[0].toString()==key)
    {
      Parameters[x]=key+"="+val;

      stat=true;
    }
  }
  if(stat==false)
  {
    Parameters.push(key+"="+val);
  }
}
function GenerateUrl(Parameters)
{
 
  if(Parameters.length!=0)
  {
     var url=  window.location.href.split("?")[0]+"?";

    for(var i=0;i<Parameters.length;i++){
      if(i==0)
      {
        url+=Parameters[i];
      } else{
        url+="&"+Parameters[i];
      }
      
      }
    window.open(url,"_self");
  }
}

function restBanner(id) {

    $.ajax({
        url: SERVER + "City/" + id ,
        type: "GET",
        dataType: "JSON",
        contentType: "application/json;charset=utf-8",
        success: function (result) {
          
          console.log(result);

            var path = result.ImagePath;
            var path2 = path.replace(/\\/g, "/");
            console.log(path2);
            
        $("#restaurant-banner").css("background-image","url('"+IP+":"+PORT+"/"+path2+"')");
        $(".city-restaurant h1").text(result.Name);
          $("#CityName").text("Top restaurants of "+result.Name);
                
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText);
        }
    });
}

function getPromotions(id) {

      $.ajax({
          url: SERVER + "promotion/city/" + id ,
          type: "GET",
          dataType: "JSON",
          contentType: "application/json;charset=utf-8",
          success: function (result) {
            console.log(result);
            $.each(result, function (index, promo) {
              // 0-image 1-news 2-video
              if (promo.PromoType == 0)
              {
                console.log("image");
              }
              if (promo.PromoType == 1)
              {
                console.log("news");
                $("#newstitle").html(promo.Name);
                $("#newscontent").html(promo.Content);
              }
            });
  
             
  
          },
          error: function (xhr, status, error) {
              console.log(xhr.responseText);
          }
      });
  }


$("#dropdownSort").on("change",function(){
  var value=$("#dropdownSort").val();

  if(value!="0")
  {
    setParams("top","true");
    GenerateUrl(Parameters);
  }
})

GetPromotionByCity();
function GetPromotionByCity()
{
 
  var Id=localStorage.getItem("CityId");
$.ajax({
type:"GET",
dataType:"json",
url:SERVER+"Promotion/city/"+Id,
success:function(response)
{
  console.log(response);
  var News_rows="";
  var Video_rows="";
  var Picture_owl="";
  for(var i=0;i<response.length;i++)
  {
    if(response[i].PromoType==1)
    {
  

      
     News_rows+=" <div class=\"item\" ><h3>"+response[i].Name+"</h3><h4 >"+response[i].Content+"</h4><br></div>"
     
    }else if(response[i].PromoType==2)
    {
      Video_rows+=" <div class=\"item\">"
      Video_rows+="<iframe width=\"853\" height=\"335\" src="+response[i].Content+" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>";
     Video_rows+="</div>"

    }else if(response[i].PromoType==0)
    {

      Picture_owl+="<div class=\"item\"><img src="+response[i].Content+" alt="+response[i].Name+"></div>"
    }
  }
  
console.log(Video_rows)
$("#Video_owl").html("");
$("#News_owl").html("");
$("#Picture_owl").html("");
  $("#Video_owl").html(Video_rows); 
 $("#News_owl").html(News_rows);
$("#Picture_owl").html(Picture_owl);

var owl = $('.owl-carousel');
owl.owlCarousel({
    items:1,
    loop:true,
    margin:10,
    autoplay:true,
    autoplayTimeout:10000,
    autoplayHoverPause:true
});

},error:function(response)
{
  console.log(response)
}

})

}

function loadRest() {
  navigator.geolocation.getCurrentPosition(function(position) {
 
  var FilterURL="";
  $.ajax({
    //  url: SERVER + "restaurant/city/"+cityid+"?"+ FilterURL,
    url: SERVER + "restaurant/"+position.coords.latitude+"/"+position.coords.longitude + "?"+ FilterURL,
      type: "GET",
      dataType: "JSON",
      contentType: "application/json;charset=utf-8",
      success: function (result) {
        localStorage.setItem("lat",position.coords.latitude);
        localStorage.setItem("lng",position.coords.longitude);
      // addCoordinates("",position.coords.latitude+","+position.coords.longitude,result.Id);

          result=result.filter(x=>x.Status==1);
        console.log(result);
          var spohtml='';
          var html='';
           if(result) {
            var   MenuList="";
            var row="";
            $(".all-restaurants").html("");
              $.each(result, function(index,rest){
           
                var resMenu = SERVER + "restaurant/" + rest.Id + "/menu";
                var MenuList = [];
        $.get(resMenu, function(menus, stat) {
        
          for (var j = 0; j < menus.length; j++) {
            MenuList.push(menus[j].Name);
          }
        });
      
      // For All Restaurants
                  // html += '<div class="rest-slider">';
                  // html += '<a href="19. view-order.html?id='+rest.Id+'">';
                  // html += '<div class="all-rest-item rest-item">';
                  // html += '<div class="rest-photo">';
                  // html += '<div class="img"><img src="'+IP+":"+PORT+"/"+rest.CoverImagePath+'" /></div>';
                  // html += '<span class="distance">Approximately<br><b>'+rest.approximateTime+' Min</b></span>';
                  // html += '</div>';
                  // html += '<div class="rest-info">';
                  // html += '<h4>'+rest.Name+'</h4>';
                  // html += '<p><span><img src="img/star.jpg" />'+rest.Rating+' Good</span>('+rest.reviewCount+'+) - BBQ - Chinese - Pak...</p>';
                  // html += '</div></div></a></div>';
                   row =
                  '<div class="all-rest-info">' +
                  '<div class="rest-info-img"><img src =' +
                   "'"+IP+":"+PORT+"/"+rest.CoverImagePath+"'" +
                  ' style="width:100%; height: 100%;"></div><div class="rest-info-content"><div class="left-panel" style="width: 280px; overflow: hidden;">' +
                  "<h4>" +
                  rest.Name +
                  '</h4> <div class="rating"><img src="img/stars.png" /> <span class="rating-num" style="margin-left: 10px; color: #62ba64;" >'+(rest.rating==null?0:rest.rating)+'' +
                  '</span > <span class="rating-reviews" style="margin-left: 10px; color: #c6c4c7;" >('+(rest.reviewCount==null?0:rest.reviewCount)+')</span >' +
                  '<div class="rest-info-distance" style="margin-top: 10px; color: #000;" > '+(rest.approximateTime==null?'Not found':'Approximately in '+rest.approximateTime +' min')+' </div> ' +
                  '<div class="rest-info-attr" style="margin-top: 10px; color: #c6c4c7;" > ' +
                  MenuList +
                  " .... </div></div> </div> " +
                  '<div class="right-panel" style="text-transform: uppercase;">' +
                  '&nbsp;<span class="status status-open">'+(rest.Status==1?'Open':'Close')+'</span> </div><a href="menu.html?id='+rest.Id+'" class="view-btn">view</a>'+
                  "</div>";
                  $(".all-restaurants").append(row);

                  console.log(row);
           //Status[res.Status]
                }); 
              // $("#spon-rest").html(spohtml);
              // var swiper = new Swiper('.s2', {
              //     slidesPerView: 'auto',
              //     spaceBetween: 14,
              //     freeMode: true,
              //   });
              console.log(row);
              
          }
      },
      error: function(xhr, status, error) {
          console.log(xhr.responseText);
        }
  });
});
}
