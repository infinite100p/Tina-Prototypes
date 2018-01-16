/* * * * * * * * * * * *  SETUP  * * * * * * * * * * * */

/** Global Variables **/

var YP_API_Key = '56r88068gh';

var day = new Date().getDay();
var weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// array of property names to display
var propertyNames = ['businessName', 'type', 'email', 'phone', 'hours', 'address'];

var listingCount = 10;

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

// displayAllProperties('13519');
// displayAllProperties('pizza');
// getListingsBySearch(null);
// displayAllListings([533822829, 4380518, 1023009]);

// displayAllListings('pizza');

/* * * * * * * * * * *  USER SEARCH FUNCTIONS  * * * * * * * * * * */
/*  user can search by business type and location 
	show relevant results, auto-generate preview
*/
// return array of listing IDs of search results
function getListingsBySearch(query, loc) {
	var dfd = $.Deferred();
	

	getSearchJSON(query, loc).then(function(data) {
			var listingCount = data.searchResult.metaProperties.listingCount;
			var allListings = data.searchResult.searchListings.searchListing; 
			var listing_ids = [];

			// try {
			//   a = JSON.parse(data);
			// } catch (e) {
			//   alert(e); 
			// }
	  for (var i=0; i < allListings.length; i++) {
  	 	 listing_ids.push(allListings[i].listingId);
  	 	 dfd.resolve(listing_ids);
	  }	
      

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
							
	})
	
	
	return dfd;
}

// getListingsBySearch('pizza').then(function(arr) {
// 	console.log(arr);
// });

// display properties for all listings in array
// @param arr array of listing ids (e.g. [533822829, 4380518, 1023009])
function displayAllListings(query) {
	getListingsBySearch(query).then(function(arr) {
		// arr = [533822829, 4380518, 1023009];
		// array of key : value pairs
		console.log(arr);
		for (var i = 0; i < arr.length; i++) {
			displayAllProperties(arr[i], query);
			// console.log(displayAllProperties(arr[i]));
		}
	});
}

// function getListingsBySearch(query) {
// 	getSearchJSON(query).then(function(data) {

// 	})
// } 

// var testArr = getListingsBySearch('pizza').then(function(arr) {
// 	return arr;
// });

// console.log('testArr :' + testArr);
/* * * * * * * * * * * *  DISPLAY FUNCTIONS  * * * * * * * * * * * */

// display all listing details for a business listing
function displayAllProperties(query, loc) {
	$('#listings').empty(); // reset

	getListingsBySearch(query, loc).then(function(arr) {
		// var listingCount = arr.length;
		
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

			
		// 	$(`.listing${i}`).append(`<div id='${listingid}'></div>`);


		
	})
}

					// for (var i=0; i < propertyNames.length; i++) {
					// 	<div class='${propertyNames[i]}'><ul></ul></div>
					// }
var val = $("input[type='search']").value;
var search = $('#search');
var loc = $('#loc');
console.log(val);
var count;
// return updated search value when user hits enter
function getSearchVal(inputType) {
	
  // var dfd = $.Deferred();
  // return new Promise(function() {
	  inputType.keypress(function(e) {
	    if ((inputType.val() && e.which === 13) || ($('#loc').val() && e.which === 13)) {
	    	// if (getListingsBySearch(search.val(), $('#loc').val()).length === 0) {
	    	// 	alert('Invalid');
	    	// } else {

	    	displayAllProperties(search.val(), $('#loc').val());
	    	// }

	    	// count = ($('.listing').length);
	    	// countListings();
		}
	  });
	// });
  // return dfd;
}

// count number of dynamically generated listings
function countListings() {
	let listings = [];
	$('.listing').each(function() {
		listings.push($(this).val())
	});
	console.log('count: ' + listings.length);
	return listings.length;
}

countListings();

// check that given string is valid zip code 

getSearchVal(search);
getSearchVal(loc);

// $(document).ready(function() {
	
	// getSearchVal().then(function(val) {
	// 	console.log(val);
	// 	displayAllProperties(val);
	// })
	// displayAllProperties(getSearchVal());
	// displayAllProperties(' ');
// })

// displayAllProperties('burger');		

// 		$('#listings').append(`<div class='listing listing${i}'></div>`);
// 			var l = document.getElementsByClassName('listing');
// 			// l.append(`<div id='${listing_id}'</div>`);
// 			$(`.listing2`).append(`<div id='${listing_id}'</div>`);

// 		for (var i=0; i < propertyNames.length; i++) {
// 			$(`.listing[1] #${listing_id}`).append(`<div class='${propertyNames[i]}'><ul></ul></div>`);
// 			displayProperty(listing_id, propertyNames[i]);
			
// 		}	
	
// }


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

// console.log(startAndEndTimes('1600-2359'));
// console.log(startAndEndTimes('1100-1230'));


// console.log(JSON.stringify(getListingInfo('13519')));

/* * * * * * * * * * * * * * * * * * * * * * * PREVIOUS CODE * * * * * * * * * * * * * * * * * * * * * * */

// get specific listing info based on property name
// function listingInfoByProperty(listing_id, propertyName) {
// 	getListingInfo(listing_id).then(function(d) {
// 		return d[propertyName];
// 	})
// }

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



