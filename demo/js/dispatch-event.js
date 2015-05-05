// http://bl.ocks.org/mbostock/5872848
window.onload = function(){
	var dispatch = d3.dispatch("load", "statechange");

	var groups = [
  	"Under 5 Years",
	  "5 to 13 Years",
	  "14 to 17 Years",
	  "18 to 24 Years",
	  "25 to 44 Years",
	  "45 to 64 Years",
	  "65 Years and Over"
	];

	d3.csv("../data/population.csv", function(data){
		data.total = d3.sum(groups, function(g){
			return (+data[g]);
			// return data[g] = +data[g];
		})
		return data;
	}, function(err,data){
		console.log(data)
	})

};
