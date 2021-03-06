$(function() {

    var nav_height = $('.navbar').height();

    function scrollSmooth(event) {
        var location_anchor = $(this).attr('href');
        if (location_anchor === '#') {
            location_anchor = 'html';
        }
        $('html, body').animate({
            scrollTop: Math.max(0, $(location_anchor).offset().top - nav_height)
        }, 1000);
        event.preventDefault();
    }

    $('[data-toggle="scroll-smooth"]').on('click', scrollSmooth);

    //map
    $('#buscar_caminho').on('click', function(e) {
        e.preventdefault();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var point = new google.maps.LatLng(position.coords.latitude,
                                                   position.coords.longitude);
                calcRoute(point);
            });
        }
    });
    var map_canvas = document.getElementById('map_canvas');
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    var event_location = new google.maps.LatLng(map_canvas.getAttribute('data-latitude'), map_canvas.getAttribute('data-longitude'));
    var mapOptions = {
        zoom: 16,
        center: event_location,
        streetViewControl: false,
        panControl: true,
        overviewMapControl: true,
        zoomControl: true,
        scaleControl: true
    }
    var map = new google.maps.Map(map_canvas, mapOptions);
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));
    var marker = new google.maps.Marker({
        position: event_location,
        map: map,
        title: map_canvas.getAttribute('data-location-name')
    });

    function calcRoute(starte) {
        var start = document.getElementById("search-route").value;
        if (starte != undefined) {
            start = starte;
        }
        var request = {
            origin:start,
            destination: event_location,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });
    }

    autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById('search-route')),
        { types: ['geocode'] });
    // When the user selects an address from the dropdown,
    // populate the address fields in the form.
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        calcRoute();
    });

    document.getElementById("search-route").addEventListener("keypress", function(e){
        if (e.keyCode == 13) {
            calcRoute();
            return false;
        }
    });

    $('body').scrollspy({
        offset: 50,
        target: '#main-navbar'
    });

    $(document).on('click','.navbar-collapse.in',function(e) {
        if( $(e.target).is('a') ) {
            $(this).collapse('hide');
        }
    });

    $(document).on('click','a.navbar-brand',function(e) {
        if( $(e.target).is('a') ) {
            $('.navbar-collapse.in').collapse('hide');
        }
    });
});
