$(document).ready(function(){
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
                    html += '<a href="restaurant.html?id=' + city.Id + '">';
                    html += '<img src="'+IP+":"+PORT+"/"+city.ImagePath+'" />';
                    html += '<span>' + city.Name + '</span>'
                    html += '</a>'
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