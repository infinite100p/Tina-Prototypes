/* * * * * * * * * * * *  SETUP  * * * * * * * * * * * */

/** Global Variables **/

var YP_API_Key = '56r88068gh';

var day = new Date().getDay();
var weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// array of property names to display
var propertyNames = ['businessName', 'type', 'email', 'phone', 'hours', 'address'];

var listingCount = 12;

var zipCode = 10001; 
var cityState = 'Manhattan%2C+NY';
// var searchLoc = getLocVal().then(function(loc) {return loc}); // undefined

function getLocVal() {
	var dfd = $.Deferred();
	if ($('#loc')) {
		dfd.resolve($('#loc').val());
		return $('#loc').val();
	}
	return dfd;
};

/** API Initialization **/
function getListingsJSON(listing_id) {
	return $.getJSON(`http://api2.yp.com/listings/v1/details?listingid=${listing_id}&key=${YP_API_Key}&format=json`);
}
function getSearchJSON(query, loc) {
	return $.getJSON(`http://api2.yp.com/listings/v1/search?searchloc=${loc}&term=${query}&format=json&sort=distance&radius=5&listingcount=${listingCount}&key=${YP_API_Key}`);
}

/* * * * * * * * * * *  MAIN FUNCTION CALLS  * * * * * * * * * * */

getSearchVal();

/* * * * * * * * * * *  USER SEARCH FUNCTIONS  * * * * * * * * * * */
/*  user can search by business type and location 
	show relevant results, auto-generate preview
*/

// return updated search value when user hits enter
function getSearchVal() {
	let search = $('#search');
	let loc = $('#loc');

	$('#search-btn').click(function() {
		displayAllProperties(search.val(), loc.val());
	})

	$('#search, #loc').keypress(function(e) {
	    if (e.which === 13 && $('input').val()) {
	    		displayAllProperties(search.val(), loc.val());
	    }
	});
}

// return array of listing IDs of search results
function getListingsBySearch(query, loc) {
	var dfd = $.Deferred();
	

	getSearchJSON(query, loc).then(function(data) {
			var listingCount = data.searchResult.metaProperties.listingCount;
			var allListings = data.searchResult.searchListings.searchListing; 
			var listing_ids = [];


	  for (var i=0; i < allListings.length; i++) {
  	 	 listing_ids.push(allListings[i].listingId);
  	 	 dfd.resolve(listing_ids);
	  }	
	})
	
	return dfd;
}	  
							

// display properties for all listings in array
// @param arr array of listing ids (e.g. [533822829, 4380518, 1023009])
function displayAllListings(query) {
	getListingsBySearch(query).then(function(arr) {
		for (var i = 0; i < arr.length; i++) {
			displayAllProperties(arr[i], query);
		}
	});
}


/* * * * * * * * * * * *  DISPLAY FUNCTIONS  * * * * * * * * * * * */

// display all listing details for a business listing
function displayAllProperties(query, loc) {
	$('#listings').empty(); // reset

	getListingsBySearch(query, loc).then(function(arr) {		
		for (var i=0; i < arr.length; i++) {
			var listingid = arr[i];
			$('#listings').append(`<div class='listing'>
				<div id='${listingid}'>

				</div>
				</div>`);

			for (var j=0; j < propertyNames.length; j++) {
				$(`#${listingid}`).append(`<div class='${propertyNames[j]}'><ul></ul></div>`);
				displayProperty(listingid, propertyNames[j]);
			}			
		}			
	})
}


// display single property value for a business listing
function displayProperty(listing_id, propertyName) {
	getListingInfo(listing_id, propertyName).then(function(d) {
		$(`#${listing_id} .${propertyName} ul`).html(`<br><li>${d}</li>`);
	})
}


// get value of property for a business listing (identified by its unique ID)
function getListingInfo(listing_id, propertyName) {
	var dfd = $.Deferred();


	getListingsJSON(listing_id).then(function(data) {
			var d;		
			if (propertyName == 'address') {
				d = getAddress(data);
			} else if (propertyName == 'hours') {
				d = startAndEndTimes(eval(mapPropertyName(data, propertyName)));
			} 
			else {
				d = eval(mapPropertyName(data, propertyName));
			}
			dfd.resolve(d);
		})
	// console.log("now: " + JSON.stringify(dfd)); // incorrect
		return dfd;
}


// map each property name to exact value in API
function mapPropertyName(data, propertyName) {
	var propertyinAPI = 'data.listingsDetailsResult.listingsDetails.listingDetail[0]';
	
	switch(propertyName) {
    case 'type':
        propertyinAPI += '.categories.category[0]';
        break;    
    case 'hours':
        propertyinAPI += '.detailedHours.defaultHours.standardHours.' + weekdays[day];
        break;       

    default:
        propertyinAPI += "." + propertyName;
}
	return propertyinAPI;
}

// return string representing address from JSON data (format: street, city, state zip code)
function getAddress(data) {
	return `${eval(mapPropertyName(data, 'street'))}, ${eval(mapPropertyName(data, 'city'))}, ${eval(mapPropertyName(data, 'state'))} ${eval(mapPropertyName(data, 'zip'))}`; 
}

// convert military time to civilian time
function toStandardTime(t) {
	var num = parseInt(t.slice(0, 2));
	var str = t.slice(2, 4);
	var res = num + ':' + str;;
	if (num > 12) {
		num = num - 12;
		res = num + ':' + str;
	} 
	return res;
}

// return array of two values - start and end times
// @param str example: '1600-2359'
// separate by - 
function startAndEndTimes(str) {
	var unformatted = str.split('-');
	var formatted = [toStandardTime(unformatted[0]), toStandardTime(unformatted[1])];
	return formatted.join().replace(',', ' - ');
}


/* * * * * * * * * * * * * * * * * * * * * * * PREVIOUS CODE * * * * * * * * * * * * * * * * * * * * * * */

// get specific listing info based on property name
// function listingInfoByProperty(listing_id, propertyName) {
// 	getListingInfo(listing_id).then(function(d) {
// 		return d[propertyName];
// 	})
// }


// count number of dynamically generated listings
// function countListings() {
// 	let listings = [];
// 	$('.listing').each(function() {
// 		listings.push($(this).val())
// 	});
// 	console.log('count: ' + listings.length);
// 	return listings.length;
// }

// countListings();

// check if JSON GET response is valid
// fetch('/resource').then(function(response) {
//   if (response.status === 404) {
//   	alert('Invalid Query');
//     // return response.json()
//   } else {
//   	  listing_ids.push(allListings[i].listingId);
//       dfd.resolve(listing_ids);
//   }
// })


// ).then(function(object) {
  // if (object.type === 'error') {
  //   console.log(object.type, object.message)
  // } else {
    // console.log('success')
  // }
// })

/* * * * * * * * * * * * * * * * * * * * * * * ARGHHHH * * * * * * * * * * * * * * * * * * * * * * */
/*
	JSON.parse() : JSON string -> object (NOT ANY NORMAL STRING WITH CODE!)
	eval() : evaluates code in string

	2 for loops - both declared and used same variable i!!!!!
*/

/* * * * * * * * * * * * * * * * * * * * * * * QUESTIONS * * * * * * * * * * * * * * * * * * * * * * */
/*
	Ok to use eval() in favor of DRY principle? 
	   - performance + security
*/



