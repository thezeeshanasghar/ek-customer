var cust_latitude=localStorage.getItem("lat");
var cust_longitude=localStorage.getItem("lng");
var OrderId=localStorage.getItem("OrderId");
loadOrderById(OrderId);
var Customer=0;
var Rider=0;
var RestaurantId=localStorage.getItem("RestaurantId");
var Executed=0;
$(document).ready(function(){
    // loadCities();
    console.log("Ok");









    loadOrderStatus(OrderId);
    window.setInterval("loadOrderStatus(OrderId)", 10000);



});



function  GetResturent(RestaurantId)
{
    $.ajax({
       Type:"GET",
       dataType:"json",
       url:SERVER+ "RestaurantLocation/Restaurant/"+RestaurantId,
       success:function(response)
       {
          rest_latitude=response.Latitude;
          rest_longitude=response.Longitude;
          mapLocation();
          console.log(response);
       },
       error:function(response)
       {
           console.log(response);
       }
    })
}



function loadOrderStatus (id)
{
    $.ajax({
        url: SERVER + "order/" +id+"/status",
        type: "GET",
        dataType: "JSON",
        contentType: "application/json;charset=utf-8",
        success: function (result) {
            console.log("Status",result);
            if (result ==1 || result == 5 || result == 6 || result == 7)
            {

            setTimeout('$(".order-con-2 .green-bar").css("height" , "100%");', 3000);

            setTimeout('$(".order-con-2 .green-round").css("height" , "18px");', 4300);

            setTimeout('$(".order-con-2 .green-bar2").css("height" , "100%");', 5800);
            if(result==6 )
            {
                $("#rider-info").css("display","block");
                GetRider(Rider);

                if(Executed==0)
                {
                    Executed+=1;
                    setTimeout(function()
                    {
                      GetResturent(RestaurantId);
                    },0)
                }


            }
            }
            else if (result ==2)
            {



                setTimeout('$(".order-con-2 .green-bar").css("height" , "100%");', 3000);

                setTimeout('$(".order-con-2 .green-round").css("height" , "18px");', 4300);

                setTimeout('$(".order-con-2 .green-bar2").css("height" , "100%");', 5800);



                setTimeout('$(".order-con-3 .green-bar").css("height" , "100%");', 7800);

                setTimeout('$(".order-con-3 .green-round").css("height" , "18px");', 9600);

                $("#orderTrackBtn").attr("onclick" ,"window.location.href='25. track-location.html'");
                $("#orderTrackBtn").css("background-color", "#039611");
                if(Executed==0)
                {
                  $("#rider-info").css("display","block");
                GetRider(Rider);
                    Executed+=1;
                    setTimeout(function()
                    {
                      GetResturent(RestaurantId);
                    },0)

                }

            }
            else if (result ==3)
            {

                setTimeout('$(".order-con-2 .green-bar").css("height" , "100%");', 3000);

                setTimeout('$(".order-con-2 .green-round").css("height" , "18px");', 4300);

                setTimeout('$(".order-con-2 .green-bar2").css("height" , "100%");', 5800);



                setTimeout('$(".order-con-3 .green-bar").css("height" , "100%");', 6800);

                setTimeout('$(".order-con-3 .green-round").css("height" , "18px");', 9600);

                $("#orderTrackBtn").attr("onclick" ,"window.location.href='25. track-location.html'");
                $("#orderTrackBtn").css("background-color", "#039611");
                loadOrderById(OrderId);
                    $("#rider-rating").css("display","block");
            }
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
          }
    });
}
function mapLocation() {
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var map;

    function initialize() {
      directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });


      var mapOptions = {
        zoom: 7,
        center: new google.maps.LatLng(30.3753, 69.3451)
      };
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      directionsDisplay.setMap(map);
       calcRoute();
    }

    function calcRoute() {
      var start = new google.maps.LatLng(rest_latitude, rest_longitude);
      var end = new google.maps.LatLng(cust_latitude, cust_longitude);
      var Rest = new google.maps.Marker({icon: "img/rest.ico", map: map, position: start});
      var Customer = new google.maps.Marker({icon: "img/user.ico", map: map, position: end});
      var request = {
        origin: new google.maps.LatLng(rest_latitude, rest_longitude),
        destination: new google.maps.LatLng(cust_latitude,cust_longitude),
        travelMode: google.maps.TravelMode.DRIVING
      };
      marker = new google.maps.Marker({icon: "img/Bike.ico"});
      setInterval(function(){
        $.ajax({
          type:"GET",
          dataType:"json",
          url:SERVER+"Coordinates/"+OrderId,
          success:function(response)
          {
              //debugger;
            var ridlat = parseFloat(response.RiderCoordinates.split(",")[0]);
            var ridlng = parseFloat(response.RiderCoordinates.split(",")[1]);

            marker.setPosition( new google.maps.LatLng(ridlat,ridlng));
            marker.setMap(map);

            var distance = getDistanceFromLatLonInKm(cust_latitude, cust_longitude, ridlat, ridlng);
            console.log(distance);
            $("#time").html(distance*3);

          },
          error:function(response)
          {

          }
        })



      },10000)

      // var request_1 = {
      //   origin: start,
      //   destination: end,
      //   travelMode: google.maps.TravelMode.DRIVING
      // };
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
          directionsDisplay.setMap(map);
        } else {
          alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
        }
      });
      // directionsService_2.route(request_1, function(response, status) {
      //   if (status == google.maps.DirectionsStatus.OK) {
      //     directionsDisplay_2.setDirections(response);
      //     directionsDisplay_2.setMap(map);
      //   } else {
      //     alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
      //   }
      // });
    }
    initialize();
  }

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }
  function deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  
       function loadOrderById(id)
            {
                $.ajax({
                    url: SERVER + "order/" +id,
                    type: "GET",
                    dataType: "JSON",
                    contentType: "application/json;charset=utf-8",
                    success: function (result) {
                     if(result!=null)
                     {
                         console.log(result);
                         $(".total-amount").html("Rs. "+result.GrandTotal);
                         CustomerId=result.CustomerId;
                         Rider=result.RiderId;
                     }

                    },
                    error: function(xhr, status, error) {
                        console.log(xhr.responseText);
                      }
                });
            }


  function Feedback(Val){

    $("#rider-rating label").css("pointer-events","none");


    var riderrating = {
        value: Val,
        CustomerId:CustomerId,
        RiderId:Rider
    }

    $.ajax({
        type: "POST",
        url: SERVER + "RiderRating",
        data: JSON.stringify( riderrating),
        dataType: "JSON",
        contentType: "application/json;charset=utf-8",

        // contentType: "application/json;charset=utf-8",
        success: function (data) {
            window.open("index.html","_self");

            console.log("Successfully Rated!");

        },

        error: function(xhr, status, error) {
            console.log(xhr.responseText);
        }

    });

}

function GetRider(Id){




    $.ajax({
        type: "Get",
        url: SERVER + "Rider/"+Id,
        dataType: "JSON",
        contentType: "application/json;charset=utf-8",

        // contentType: "application/json;charset=utf-8",
        success: function (data) {
          console.log(data)
          $(".rider-name").html(data.Name);
        },

        error: function(xhr, status, error) {
            console.log(xhr.responseText);
        }

    });

}
