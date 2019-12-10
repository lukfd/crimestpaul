// Luca and Shijun
// Scripts for Vue and Leaflet
var app;
var lat =44.949642;
var lng =-93.093124;
var mymap;
var latlng;
var addressLat;
var addressLng;

function Init() {
	// VUE
	app = new Vue({
		el: '#app',
		data: {
			mapDiv: false,
			tableDiv: false,
			addressDiv: true,
			userLat: "",
			userLng: "",
			inputSearch: "",
            searchType: "select",
            searchTypeOptions: [
            	{ value: "select", text: "select" },
                { value: "address", text: "address" },
                { value: "latlong", text: "latlong" }
            ],
            stpaulcrimes: []
        },
        methods:{
	        showMap: function(){
	            this.mapDiv = !this.mapDiv;
	        },
	        showTable: function() {
	        	this.tableDiv = !this.tableDiv;
	        },
	        changeAddressDiv: function(value){
	        	if (this.searchType === 'latlong') {
	        		this.addressDiv = false;
	        	} else {
	        		this.addressDiv = true;
	        	}
	        }
    	}
	});

	//MAP
	latlng = L.latLng(lat, lng);
	mymap = L.map('mapid', {
		center: latlng,
		zoom: 12
	});/*.setView(latlng, 15);*/
	mymap.setMinZoom(11);
	mymap.setMaxZoom(18);
    var southWest = L.latLng(44.949642-0.06, -93.093124+0.18);
    var northEast = L.latLng(44.949642+0.06, -93.093124-0.18);
    var mybounds = L.latLngBounds(southWest, northEast);
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    bounds: mybounds,
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(mymap);

	//DATA FOR TABLE
	let request = {
        url:'http://localhost:8000/incidents?start_date=2019-10-01&end_date=2019-10-31',
        dataType: "json",
        success: this.stpaulcrimes
	};

    $.ajax(request);
}

function Search(event) {
	/*
	QUERY : https://nominatim.openstreetmap.org/search?<params>
		street=<housenumber> <streetname>
		city=<city>
		county=<county>
		state=<state>
		country=<country>
		postalcode=<postalcode>
	*/
	var queryNominatim = 'https://nominatim.openstreetmap.org/search?';

	if (app.searchType == 'select' || app.searchType == 'address') {
		var street = app.inputSearch.split(' ');
		var streetName;
		for (var i = 0; i < street.length; i++) {
			if (i == 0) {
				streetName = street[0];
			} else {
				streetName = streetName + '%20' + street[i];
			}
		}

		let request = {
	        url: queryNominatim + 'street='+ streetName +'&city=St%20Paul&state=MN&format=json',
	        dataType: "json",
	        success: setNominatim
	    };

	    $.ajax(request).then(() => {
	    	latlng = L.latLng(addressLat, addressLng);
			mymap.flyTo(latlng, 18);
	    });
	}

	if (app.searchType == 'latlong') {
		if ((app.userLat>=44.949642-0.06 && app.userLat<=44.949642+0.06) 
			&& (app.userLng>=-93.093124-0.18  && app.userLng<=-93.093124+0.18)) {
			latlng = L.latLng(app.userLat, app.userLng);
			mymap.flyTo(latlng, 18);
		}
	}
	
}

function setNominatim(data){
	addressLat = data[0].lat;
	addressLng = data[0].lon;
}

