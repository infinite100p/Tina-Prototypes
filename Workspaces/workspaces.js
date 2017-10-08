// filter by type and distance from current location
// manhattan & brooklyn 
// expand / collapse all
// machine learning - find best study spots to recommend?


var checkIcon = `<i class="fa fa-check-circle-o" aria-hidden="true"></i>`;
var bus = `<a id="icon"><i class="fa fa-bus" aria-hidden="true"></i></a>`;


// Caffe Bene

var caffebene_tribeca = {
	name: "Caffe Bene",
	region: "TriBeCa",
	address: "378 Canal St New York, NY 10013",
	cost: "$$",	
	outlets: checkIcon,
	restroom: checkIcon,
	seats: "plenty",
	type: "bubble tea shop",
	place_id: 'ChIJVdiM4opZwokRXYfr0Z6JUkU'
}

var caffebene_greenwich = {
	name: "Caffe Bene",
	region: "Greenwich Village, East Village",
	address: "378 Canal St New York, NY 10013",
	cost: "$$",	
	outlets: checkIcon,
	restroom: checkIcon,
	seats: "plenty",	
	type: "bubble tea shop"
}

var caffebene_alphabetCity = {
	name: "Caffe Bene",
	region: "East Village, Alphabet City",
	address: "208 Ave A New York, NY 10009",
	cost: "$$",	
	outlets: checkIcon,
	restroom: checkIcon,
	seats: "few",	
	type: "bubble tea shop",
	place_id: 'ChIJWWrFenZZwokRYw7-CbtDEUE'
}

var caffebene_bensonhurst = {
	name: "Caffe Bene",
	region: "Bensonhurst",
	address: "6307 18th Ave Brooklyn, NY 11204",
	cost: "$$",	
	outlets: checkIcon,
	restroom: checkIcon,
	seats: "plenty",	
	type: "bubble tea shop",
	place_id: 'ChIJd2fMKiJFwokRKb5aINbTkwI'
}

// Argo Tea

var argotea_broadway = {
	name: "Argo Tea",
	region: "Broadway",
	address: "949 Broadway New York, NY 10010",
	cost: "$$",	
	outlets: checkIcon,
	restroom: checkIcon,
	seats: "plenty",	
	type: "tea shop",
	place_id: 'ChIJ-QQV-aNZwokRfC_bYyZuq6E'
}

var argotea_chelsea = {
	name: "Argo Tea",
	region: "Chelsea",
	address: '275 7th Ave New York, NY 10001',
	cost: "$$",	
	outlets: checkIcon,
	restroom: checkIcon,
	seats: "plenty",	
	type: "tea shop",
	place_id: 'ChIJj2q4SKVZwokR4ifdE5XHjyQ'
}


// Other

var wholefoods_tribeca = {
	name: "Whole Foods Market",
	region: "TriBeCa",
	address: '270 Greenwich St New York, NY 10007',
	cost: "$$",	
	outlets: checkIcon,
	restroom: checkIcon,
	seats: "plenty",	
	type: "cafe",
	place_id: 'ChIJl4BZ5opZwokRUR0n7MrTIEA'
}

var capitalOne = {
	name: "Capital One Bank / Peet's Coffee",
	region: "Union Square",
	address: '853 Broadway New York, NY 10003',
	cost: "$$",	
	outlets: checkIcon,
	restroom: checkIcon,
	seats: "plenty",	
	type: "bank / coffee shop",	
	place_id: 'ChIJG3lW5ZhZwokRbbE3bvRnzb0'
}

var aceHotel = {
	name: "Ace Hotel / Stumptown Coffee Roasters",
	region: "Flatiron",
	address: '20 W 29th St New York, NY 10001',
	cost: "$$",	
	outlets: checkIcon,
	restroom: checkIcon,
	seats: "plenty",	
	type: "hotel lobby",
	place_id: 'ChIJT2h1HKZZwokR_Nwoxn8RfU0'
}

var formosaCafe = {
	name: "Formosa Cafe",
	region: "Sunset Park, Brooklyn",
	address: '5323 7th Ave, Brooklyn, NY 11220',
	cost: "$$",	
	outlets: checkIcon,
	restroom: checkIcon,
	seats: "plenty",	
	type: "bubble tea shop",
	place_id: 'ChIJFTjtNbVawokR22SwaardFQ4'
}

/* PUBLIC SPACES */
var rubenstein = {
	name: "David Rubenstein Atrium",
	region: "Upper West Side",
	address: '61 W 62nd St New York, NY 10023',
	cost: `<span class="free">FREE</span>`,	
	outlets: checkIcon,
	restroom: checkIcon,
	seats: "plenty",	
	type: "public space",
	place_id: 'ChIJDyq28vVYwokRuzPLGeJGAC0'	
}

/* LIBRARIES */
var SIBL = {
	name: "SIBL",
	region: "Midtown East",
	address: '188 Madison Ave New York, NY 10016',
	cost: `<span class="free">FREE</span>`,	
	outlets: checkIcon,
	restroom: checkIcon,
	seats: "plenty",	
	type: "Library",
	place_id: 'ChIJxWpBfgdZwokR9r3G6p2PJn4'
}

var NYPL = {
	name: "NYPL",
	region: "Midtown West",
	address: '476 Fifth Ave New York, NY 10018',
	cost: `<span class="free">FREE</span>`,	
	outlets: checkIcon,
	restroom: checkIcon,
	seats: "plenty",	
	type: "Library",
	place_id: 'ChIJqaiomQBZwokRTHOaUG7fUTs'	
}

// Caffe Bene, Argo Tea, Whole Foods, Peet's Coffee, BK Express, Furmosa Cafe
// NYPL, Rubenstein Atrium, Union Sq Park, Subway Station, ACE Hotel


// array of coffee shops
var coffee_shops = [{id: "0"}, caffebene_tribeca, caffebene_alphabetCity, argotea_broadway, argotea_chelsea, capitalOne, aceHotel];
var cafes = [{id: "1"}, wholefoods_tribeca, formosaCafe];
var public_spaces = [{id: "2"}, rubenstein];
var libraries = [{id: "3"}, SIBL, NYPL];
var google_API_Key = 'AIzaSyAKxlXzVwLNa0RiGuq4TNPxZGgwnppx89A'; // Remember to delete for security!


// numerical equivalent for today
var day = new Date().getDay();


/** API Initialization **/
function getGooglePlaceJSON(place_id) {
	return $.getJSON(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&key=${google_API_Key}`);
}



function getBusinessHours(place_id) {
	// var str;
	var dfd = $.Deferred();

	getGooglePlaceJSON(place_id).then(function(data) {
		var str = JSON.stringify(data.result.opening_hours.weekday_text[day-1]);
		dfd.resolve(str);
	})
	console.log(dfd);
	return dfd;
}

function ok() {
	var hrs;
	getBusinessHours('ChIJl4BZ5opZwokRUR0n7MrTIEA').then(function(hours) {
		hrs = hours;
			// return hours;
			// $(`#info${this.id}`).html(hours);
		})
	console.log(hrs);
}


getBusinessHours('ChIJl4BZ5opZwokRUR0n7MrTIEA');
// getBusinessHours('ChIJl4BZ5opZwokRUR0n7MrTIEA').then(function(str) {
// 	console.log(str);
// });

/** Main Functions **/

function displayWorkspaces(arr, id) {
	// var hrs = '<div id="hours">';
	var str = `<div id='info${arr[0].id}'`;
	for (var i = 1; i < arr.length; i++) {
		var hrs = `$(".hours${i-1}")`
		str += `<p>
		${arr[i].name} { ${arr[i].cost} }<br> 
		${arr[i].address} &nbsp; ${bus} <br>
		Outlets: ${arr[i].outlets},
		Restroom: ${arr[i].restroom} <br>
		Seats: ${arr[i].seats} <br>
		
		<div id="${removeHash(id)}-hours-${i}"> 
			
			${displayHours(arr, id, i)}
		</div>

		<br>

		<p> &nbsp;</p>
		</p>`;
		// console.log(arr[i].name);
	}
	str += `</div>`
	// console.log(str);
	$(id).html(str);
}

function displayHours(arr, id, i) {
		// var idStr = "#" + removeHash(id) + "-hours-" + i;
		var idStr = `${id}-hours-${i}`;

		`${getGooglePlaceJSON(arr[i].place_id).then(function(data) {			
			$(idStr).html(data.result.opening_hours.weekday_text[day-1]); 
			console.log(idStr);
		})}`
}



// remove hashtag from ID
function removeHash(id) {
	return id.slice(1, id.length);
}

// test(coffee_shops);

$('.collapse').on('click', function() {
	// for (var i = 0; i < $('.collapse').length; i++) {
	if($(`#info${this.id}`).text() ) {
		$(`#info${this.id}`).html('');
		// console.log(this.id);
		// console.log('ok');
	} else {
		display(this.id);
		
	}
})

// display workspaces based on section click 
function display(id) {
	switch (id) {
		case "0":
			displayWorkspaces(coffee_shops, "#info0");
			break;
		case "1":
			displayWorkspaces(cafes, "#info1");
			break;		
		case "2":
			displayWorkspaces(public_spaces, "#info2");
			break;		
		case "3":
			displayWorkspaces(libraries, "#info3");
			break;		
		case "4":
			displayWorkspaces(nearby, "#info4");
			break;
	}
}


function alternate(type) {
	$('.collapse').on('click', function() {
		if ($('#coffee-shops').text()) {
			$('#coffee-shops').html('');
			$('.collapse').html('+');		
		} else {
			test(coffee_shops);
			$('.collapse').html(`<i class="fa fa-minus" aria-hidden="true"></i>`);
		}
	});
}


// console.log($('.section').text());

// var i = 0;
// for (i in manhattan_coffee_shops) {
// 	console.log(i, manhattan_coffee_shops[i]);
// }

// array of cafes
// array of public spaces 
