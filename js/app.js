$(function() {

var mapOriginalState = $('#map').clone();

onPageLoadPopulate();

	$('#search').on('click', function(event) {
		event.preventDefault();
		
		$('.site').empty(); //clear previous results
		$('.no-results').css('display', 'none'); //make sure error message is hidden
		$('#map').replaceWith(mapOriginalState.clone()); //set map div to empty and fix class

		//pull requested search
		var activity = $('#activity option:selected').val();
		var city = $('#city').val();
	
		$.ajax({
			type: 'GET',
			url: "https://outdoor-data-api.herokuapp.com/api.json?api_key=1fc0ab0d006bccd6e0fdf1856cea5b2c&q[city_cont]=" + city + '&q[activities_activity_type_name_cont]=' + activity + "&radius=100",
			dataType: 'jsonp',
			jsonp: 'callback',
			jsonpCallback: 'query',
				
		})
			.done(function(data) {
				populateResults(data); //populate results
			});
	});
});

/* Functions */

//load page with example search
function onPageLoadPopulate() {
	$.ajax({
		type: 'GET',
		url: "https://outdoor-data-api.herokuapp.com/api.json?api_key=1fc0ab0d006bccd6e0fdf1856cea5b2c&q[city_cont]=Denver&q[activities_activity_type_name_cont]=mountain biking&radius=100",
		dataType: 'jsonp',
		jsonp: 'callback',
		jsonpCallback: 'query',
				
	})

		.done(function(data) {
			populateResults(data);
		});
}

function populateResults(data) {

	if (data.places.length === 0) {
			$('.no-results').css('display', 'block');
			$('body').animate({ scrollTop: 0}, "slow");
		}
	else {
		//Grab map for initial site
		var initlat = data.places[0].lat;
		var initlon = data.places[0].lon;
		var map = L.map('map').setView([initlat, initlon], 8);

			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    					attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
						}).addTo(map);

		for (var i = 0; i < data.places.length; i++) {
			console.log(data);

			var city = data.places[i].city;
			var state = data.places[i].state;				
			// define marker location for map
			var sitelat = data.places[i].lat;
			var sitelon = data.places[i].lon;
			var sitename = data.places[i].name;

				L.marker([sitelat, sitelon]).addTo(map)
    					.bindPopup(sitename)
    		// drill down to get inside places and find activities
			if (data.places[i].activities.length > 0) {

				for (var x = 0; x < data.places[i].activities.length; x++) {
						
					var result = data.places[i].activities[x];
					console.log(result);
					
						var photo = result.thumbnail;							
						var name = result.name;
						var url = result.url;
						var desc = result.description; 
													
						if (photo !== null) {
							var image = '<a href="' + url + '"><img src="' + photo + '" class="photo" alt="location image" /></a>';
						}
						else {
							var image = '<img src="images/noimage.png" class="photo" alt="location image">';
						}	  
						// load results into the html div
						$('#site').append('<div class="site-block"><div>' + image + '</div><div class="desc"><b><a href="' + url + '">' + name + '</b></a><br>(click name for more details)<br>' + city + ', ' + state + '<br><br>' + desc + '</div></div>');
						// find any broken images
						$('img').error(function(){
        					$(this).attr('src', 'images/noimage.png');
						})
				}
			}
		}
	}
}