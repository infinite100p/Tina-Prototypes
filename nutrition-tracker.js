/*
get nutrition facts for food item (e.g. 1 banana)
show image of food item

determine how much user should eat, if at all
add food item to daily food journal/tracker
count nutrition values & show how much of each primary (and secondary) nutrients they need to reach daily recommendation (or how much they've exceeded it by)
are they at healthy level, safe level, or in danger (health meter)

suggest food items as user enters search term
have user check if food belongs to standard / branded data source, and filter results based on that

*/
var search = $( "input[name='search']");
var food_Item = search.val();
var QUERY_LIMIT = 5;
var NUTRIENT_QUERY_MAX = 100;
var NAMES_OF_STANDARD_NUTRIENTS = ["Sodium, NA", "Sugars, total", "Protein", "Carbohydrate, by difference", "Cholesterol", "Fatty acids, total trans", "Fatty acids, total saturated", "Fiber, total dietary", "Calcium, Ca", "Potassium, K"];


var Google_API_Key = 'AIzaSyChFmxcotyJD1iIKw0WL-uy2AXO7o5xF9Q'; 
var Google_Search_Engine_Id = '012029723201963103841:tmf9zdgfp_k';

// get image from Google Custom Search API
// function getImage() {
// 	var dfd = $.Deferred();
// 	var imgURL;
// 	$.getJSON(`https://www.googleapis.com/customsearch/v1?key=${Google_API_Key}&content_copy&cx=${Google_Search_Engine_Id}&searchType=image&num=3`).then(
// 		function(data) {
// 			imgURL = JSON.stringify(data.items[1].link);
// 			dfd.resolve(imgURL);

// 			// console.log(data.items[1].link);
// 		})
	
// 	return dfd;
// }

// getImage();

// track input value as user types in search
function userInput() {
	(search).on("input", function() { 
		food_Item = search.val();
		$('ul').remove();
		$('#wrap').css('display', 'block');

		if (search.val()) {
			// console.log(search.val());
			// console.log(data.list.item.length);
			// getNutrition(function(data) {

				getJSON().then(function(data) {
				if (QUERY_LIMIT <= data.list.item.length) {
					for(var i=0; i < QUERY_LIMIT; i++) {
						$('li').append(` <ul> ${data.list.item[i].name} </ul>`);
						// search.autocomplete({source: JSON.stringify(data.list.item)});
					}
					// food_ItemNutrition();
			}

				selectedFoodId(data);
		})

	}})}

userInput();

// display food nutrition info
function selectedFoodId(data) {
	getJSON().then(function(data) {
		$('ul').on("click", function() {
		var index = $('ul').index(this);


		nutritionInfo(data.list.item[index].ndbno).then(function(foodName) {
			var googleSearch_API_URL = `https://www.googleapis.com/customsearch/v1?key=${Google_API_Key}&content_copy&cx=${Google_Search_Engine_Id}`;
			googleSearch_API_URL.concat(`&q=${foodName}`); // is concat an asynchonous function?

				// console.log(foodName);
				console.log(googleSearch_API_URL); // does not return url with query concatenated...


			$.getJSON(removeCommas(googleSearch_API_URL.concat(`&q=${foodName}`))).then(function(googleImgData) {
				var imgURL = googleImgData.items[1].link;
				$('h4').append(`<img src=${imgURL} />`);
				console.log(removeCommas(googleSearch_API_URL.concat(`&q=${foodName}`)));
				console.log(imgURL);
			})

				

			})
			// console.log(foodName);
		});
		console.log(index);
	})
}

// remove all commas in given string
function removeCommas(str) {
	str.replace(",", "");
}

// handle event when user clicks on a suggested food item in list
// show nutrition info for that food item
function foodItemNutrition() {
	$('ul').on("click", function() {
		$('#wrap').css('display', 'none');
		getJSON().then(function(foodData) {
			console.log(foodData)
		})
	})
}


// display basic nutrition info for given food ID
function nutritionInfo(id) {
	var url = `https://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=rWKfuG6YjQU9h0WMNksynapfFqcr3BJWK5giCqRQ&ndbno=${id}`;
	var dfd = $.Deferred();

	getNutrientsData().then(function(data) {
		var standardNutri = getStandardNutrients(data, NAMES_OF_STANDARD_NUTRIENTS); // array of names & IDs for standard nutrients
		var standardNutrientIds = nutrientsIds(standardNutri) // array of IDs for standard nutrients only
		var str = "";
		for(var i=0; i < standardNutrientIds.length; i++) {
			url = url.concat(`&nutrients=${standardNutrientIds[i]}`);
			// url = url.concat(`&nutrients= ${standardNutrientIds[i]}`); // add the nutrient IDs to the url
			// url = url.concat(`&nutrients=${standardNutrientIds[i]}`); // add the nutrient IDs to the url			
		}

			// console.log(url);
	$.getJSON(url).then(function(n) {

			// if (n.report.foods.length > 0) {
			var nutriInfo = n.report.foods[0].nutrients; // nutrition facts for food Item (array)
			var foodName = n.report.foods[0].name; // nutrition facts for food Item (array)
			console.log(n.report.foods[0].nutrients);
			console.log(n);
		// }

			var nutriName;
			var nutriValue;
			var nutriMeasure;
			
			// var test = nutriInfo[i].nutrient;
			// console.log(nutriInfo);
			console.log(url);

			$('#wrap').css('display', 'none');
			$('h4').html("");

								
				$('h4').append(`<div id='foodName'> ${foodName} </div>`);
				

			for (var i=0; i < nutriInfo.length; i++) {
				nutriName = nutriInfo[i].nutrient;
				nutriMeasure = nutriInfo[i].gm;
				$('h4').append(`<p> ${nutriName}: ${nutriMeasure} g </p>`);
				// $('h4').html(`<p> Nutrient: ${JSON.stringify(nutriInfo[i].nutrient)} ${JSON.stringify(nutriInfo[i].value)} ${JSON.stringify(nutriInfo[i].gm)} </p>`);
				// console.log(nutriInfo[i].nutrient);
				// console.log(test);
			}

		// getImage().then(function(imgUrl) {
		// 	imgUrl.concat(`&q=${nutriName}`);
		// 	$('h4').append(`<img src=${imgUrl} />`);

			// var nutriName = nutriInfo[2].nutrient;
			// console.log(foodName);

			dfd.resolve(foodName);
		// })

			});
//  
})
		return dfd;
}
		// &nutrients=205
// }
// nutritionInfo('01009');

// function getNutri(id) {
// 	nutritionInfo(id).then(function(url, ids) {
// 		console.log(url);
// 		console.log(ids);
// 	})
// }

// nutritionInfo('01009');
// getNutri('01009');

// Is search bar empty?
// function mtSearchBar() {
// 	return $( "input[value='Hot Fuzz']" )
// }

// JSON data of food item names
function getJSON() {
		// food_Item = search.val();
		var data = $.getJSON(`https://api.nal.usda.gov/ndb/search/?format=json&q= ${food_Item} &max=25&ds=Standard%20Reference&offset=0&api_key=rWKfuG6YjQU9h0WMNksynapfFqcr3BJWK5giCqRQ`);
	 // data;
	 return data;
}

// return Deferred Object - defers array of all standard Nutrients (names & IDs)
function getNutrientsData() {
	var nutrients = []; // list of nutrients with their names and IDs
	var dfd = $.Deferred();
	var data = $.getJSON(`https://api.nal.usda.gov/ndb/list?format=json&lt=nr&sort=id&max=${NUTRIENT_QUERY_MAX}&api_key=rWKfuG6YjQU9h0WMNksynapfFqcr3BJWK5giCqRQ`); // nutrition list
		// var name = data.list.item
	data.then(function(d) {
		for(var i=0; i < NUTRIENT_QUERY_MAX; i++) {
			var nutri = d.list.item[i]
			nutrients.push({name: nutri.name, id: nutri.id}); // list of all nutrients from JSON data
			// console.log(nutrients);
			// dfd.resolve(getStandardNutrients(nutrients, NAMES_OF_STANDARD_NUTRIENTS));
			
	}
	// console.log(nutrients);
	dfd.resolve(nutrients);
})
	return dfd;

}

getNutrientsData();

// filter the given array to only include standard nutrients listed in arr2
function getStandardNutrients(arr, arr2) {
	var res = [];
	for(var i=0; i < arr.length; i++) {
		for(var j=0; j < arr2.length; j++) {
			if (arr[i].name.toLowerCase() === arr2[j].toLowerCase()) {
				res.push(arr[i]);
			}
		}
	}
	return res;
};

// extract IDs from array of Nutrient objects and return them in a new array
function nutrientsIds(arr) {
	var ids = [];
	for(var i=0; i < arr.length; i++) {
		ids.push(arr[i].id);
	}
	return ids;
}

console.log(nutrientsIds([{name: 'Iron', id: '10'}, {name: 'protein', id: '20'}]));

// console.log(getStandardNutrients( [{name: 'Iron', id: '10'}, {name: 'protein', id: '20'}], NAMES_OF_STANDARD_NUTRIENTS));

// console.log(getNutrientsData());

function test() {
	getNutrientsData().then(function(data, nutrients) {
		console.log(nutrients);
		console.log(typeof nutrients[0]);
	})
}

// return the ID of given nutrient
function getNutrientId(nutrient) {
	var id;
	getNutrientsData().then(function(data) {
		for(var i=0; i < NUTRIENT_QUERY_MAX; i++) {
			if (data.list.item[i].name === nutrient) {
				id = data.list.item[i].id;
				break;
			}
		}
	})
	console.log(id);
	return id;
	 
} 

// function test(nutrient) {
	
// 	getNutrientsData().then(function(data) {
// 		for(var i=0; i < NUTRIENT_QUERY_MAX; i++) {
// 			if (data.list.item[0].name === nutrient) {
// 				dfd.resolve(data.list.item[0].id);
// 				// console.log(id);
// 				break;
// 			}

// 		}
// 	})
// 	console.log(dfd);
// 	return id;
	 
// } 

// getNutrientId("Protein"); // 203
// test("Protein"); // 203


// a Nutrient Object
var nutrient = {};

// return nutrition facts for food item with most pertinent facts hightlighted (e.g. 1 banana)
function getNutrition(food_Item, condition) {
	getJSON().then(function(data) {
		$('h4').html(JSON.stringify(data.list.item[0].name));
		// $('#test').html(JSON.stringify(data));
	})
}

// console.log(getNutrition('banana'));
// console.log(getNutrition());
// getNutrition('banana');

/************************************* TESTING - BUGS IDENTIFIED *****************************************/
/*
Enter 'cereals ready-to-eat gra' in search, repeats same group of results three times (15 queries displayed) when QUERY_LIMIT is set to 5
Should only display one set of 5 results


Search for 'tomato', cannot select 'tomato powder' - cannot retrieve nutrition info
jQuery.Deferred exception: Cannot read property 'nutrients' of undefined TypeError: Cannot read property 'nutrients' of undefined

*/

/************************************* QUESTIONS ******************************************/

/* How to use autocomplete on JSON data using jQuery UI 
   ERROR: JSON.Deferred undefined when calling data. Why is food_Item undefined?
*/    

// var myUrl = `https://api.nal.usda.gov/ndb/search/?format=json&q= ${food_Item} &max=25&ds=Standard%20Reference&offset=0&api_key=rWKfuG6YjQU9h0WMNksynapfFqcr3BJWK5giCqRQ`;
	          
// search.autocomplete({
//     source: function(request, response) {
//         $.getJSON(myUrl, { q: request.term }, function(data) {
//             response($.map(data, function(item) {
//                 return list.item
//             }));
//         });
//     }
// })}})}


// 	          getJSON().then(function (data){       
// 		         search.autocomplete({
// 		             // minLength: 2,
// 		             source: data.list.item
// 		          })
//             })}
//             })
// }  

/* Can I use Array.filter() in standardNutrients method? How? */

		// arr.filter(function(el) {
		// 	return el.name === arr2[i]
		// })

   

