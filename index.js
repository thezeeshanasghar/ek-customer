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
                    html += '<div class="ccc">';
                    html += '<div class="ccc-border">';
                    html += '<div class="top-right-hider"></div>';
                    html += '<div class="bottom-left-hider"></div>';
                    html += '<a href="restaurant.html?id=' + city.Id + '">';
                    html += '<div class="ccc-img">';
                    html += '<img src="'+IP+":"+PORT+"/"+city.ImagePath+'" />';
                    html += '<div class="ccc-name">' + city.Name + '</div>';
                    html += '</a>'
                    html += '</div></div></div></div></div>'
                }); 
                $("#cityHtml").html(html);
            }
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);
          }
    });
}