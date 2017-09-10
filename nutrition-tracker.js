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
var foodItem = search.val();
var QUERY_LIMIT = 5;

// track input value as user types in search
function userInput() {
	(search).on("input", function() {
		foodItem = search.val();
		$('ul').remove();

		if (search.val()) {
			console.log(search.val());
			// console.log(data.list.item.length);
			// getNutrition(function(data) {
				getJSON().then(function(data) {
				if (QUERY_LIMIT <= data.list.item.length) {
					for(var i=0; i < QUERY_LIMIT; i++) {
						$('li').append(` <ul> ${data.list.item[i].name} </ul>`);
					}
			}})
		}})}

userInput();

// convert from KeyCode to string representing that key
function keyCodeToStr(kc) {

}

// Is search bar empty?
// function mtSearchBar() {
// 	return $( "input[value='Hot Fuzz']" )
// }

function getJSON() {
		var data = $.getJSON(`https://api.nal.usda.gov/ndb/search/?format=json&q= ${foodItem} &max=25&ds=Standard%20Reference&offset=0&api_key=rWKfuG6YjQU9h0WMNksynapfFqcr3BJWK5giCqRQ`);
	 data;
	 return data;
}


// return nutrition facts for food item with most pertinent facts hightlighted (e.g. 1 banana)
function getNutrition(foodItem, condition) {
	getJSON().then(function(data) {
		$('h4').html(JSON.stringify(data.list.item[0].name));
		// $('#test').html(JSON.stringify(data));
	})
}

// console.log(getNutrition('banana'));
// console.log(getNutrition());
// getNutrition('banana');
