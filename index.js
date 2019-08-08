$(document).ready(function(){
    $(".header-user-icon").click(function(){

        $(".login-overlay").fadeIn();

    });
    $( ".login-overlay" ).on( 'click', function( event ) {
        $( this ).fadeOut();
        $(".login-overlay input[type=text] , input[type=password]").val("");
    });

    $( ".login-box" ).on( 'click', function( event ) {
        event.stopPropagation();
    });


    $(".login-box-header .right-panel").click(function(){

        $(".login-overlay").fadeOut();
        $(".login-overlay input[type=text] , input[type=password]").val("");

    });

    loadCities();
});
function loadCities() {

    $.ajax({
        url: SERVER + "city",
        type: "GET",
        dataType: "JSON",
        contentType: "application/json;charset=utf-8",
        success: function (result) {
            var html='';
            
			
             if(result) {
                $.each(result, function(index,city){
                    html += '<div class="col-xs-12 col-sm-12 col-md-3 col-lg-3" data-aos="fade-up" data-aos-duration="2000">';
                    html +='<div class="four-panel">';
                    html += '<div class="city-icon">';
                    html += '<img src="'+IP+":"+PORT+"/"+city.ImagePath+'" />';
                    html += '<span>' + city.Name + '</span>'
                    html += '</div></div></div>'
                }); 
                $("#cityHtml").html(html);
            }
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
          }
    });
}