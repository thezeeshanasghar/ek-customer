$(document).ready(function(){
    // loadCities();
    console.log("Ok");




    $("#star1").click(function(){

        $("#rider-rating label").css("pointer-events","none");


        var riderrating = {
            value: 5
        }

        $.ajax({
            type: "POST",
            url: "http://localhost:5000/riderrating",
            data: riderrating,
            dataType: "JSON",
            // contentType: "application/json;charset=utf-8",
            success: function (data) {

                
                console.log("Successfully Rated!");

            },

            error: function(xhr, status, error) {
                console.log(xhr.responseText);
            }

        });

    });





    $("#star2").click(function(){

        $("#rider-rating label").css("pointer-events","none");


        var riderrating = {
            value: 4
        }

        $.ajax({
            type: "POST",
            url: "http://localhost:5000/riderrating",
            data: riderrating,
            dataType: "JSON",
            // contentType: "application/json;charset=utf-8",
            success: function (data) {

                
                console.log("Successfully Rated!");

            },

            error: function(xhr, status, error) {
                console.log(xhr.responseText);
            }

        });

    });





    $("#star3").click(function(){

        $("#rider-rating label").css("pointer-events","none");


        var riderrating = {
            value: 3
        }

        $.ajax({
            type: "POST",
            url: "http://localhost:5000/riderrating",
            data: riderrating,
            dataType: "JSON",
            // contentType: "application/json;charset=utf-8",
            success: function (data) {

                
                console.log("Successfully Rated!");

            },

            error: function(xhr, status, error) {
                console.log(xhr.responseText);
            }

        });

    });



    $("#star4").click(function(){

        $("#rider-rating label").css("pointer-events","none");


        var riderrating = {
            value: 2
        }

        $.ajax({
            type: "POST",
            url: "http://localhost:5000/riderrating",
            data: riderrating,
            dataType: "JSON",
            // contentType: "application/json;charset=utf-8",
            success: function (data) {

                
                console.log("Successfully Rated!");

            },

            error: function(xhr, status, error) {
                console.log(xhr.responseText);
            }

        });

    });


    $("#star5").click(function(){

        $("#rider-rating label").css("pointer-events","none");
        

        var riderrating = {
            value: 1
        }

        $.ajax({
            type: "POST",
            url: "http://localhost:5000/riderrating",
            data: riderrating,
            dataType: "JSON",
            // contentType: "application/json;charset=utf-8",
            success: function (data) {

                
                console.log("Successfully Rated!");

            },

            error: function(xhr, status, error) {
                console.log(xhr.responseText);
            }

        });

    });






});