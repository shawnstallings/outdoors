$(function() {

onPageLoadPopulate();

	$('#search').on('click', function(event) {
		event.preventDefault();
		$('.site').empty();

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
				populateResults(data);
			});
	});
});

/* Functions */

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
			alert("There are no results for your search.");
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

			var sitelat = data.places[i].lat;
			var sitelon = data.places[i].lon;
			var sitename = data.places[i].name;

				L.marker([sitelat, sitelon]).addTo(map)
    					.bindPopup(sitename)

			if (data.places[i].activities.length > 0) {

				var $table = $('<table/>');

				for (var x = 0; x < data.places[i].activities.length; x++) {
						
					var result = data.places[i].activities[x];
					console.log(result);
					
						var photo = result.thumbnail;							
						var name = result.name;
						var url = result.url;
						var desc = result.description; 
													
						if (photo !== null) {
							var image = '<img src="' + photo + "\" class=\"photo\" alt=\"location image\" />";
						}
						else {
							var image = '<img src="images/noimage.png" class="photo" alt="location image">';
						}	  

						$table.append( '<tr class="row"><tr class="row"><td>' + image + '</td></tr><tr class="row"><td class="cell"><div class="desc"><b><a href="' + url + '">' + name + '</b></a><span> (click name for more details)</span> ' + city + ', ' + state + '<br><br>' + desc + '</div></td></tr>' );
						$('.site').append($table);
						$('img').error(function(){
        					$(this).attr('src', 'images/noimage.png');
						})
				}
			}
		}
	}
}