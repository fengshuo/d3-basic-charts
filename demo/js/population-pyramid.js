window.onload = function(){
	var margin = {
		top:30,
		right:30,
		bottom:50,
		left:50
	};

	var width = 960 - margin.left - margin.right;
	var height = 600 - margin.top - margin.bottom;



	d3.csv("../data/population3.csv", function(d){
		d.people = +d.people;
		d.year = +d.year;
		d.age = +d.age;
		return d;
	}, function(err,data){
		if(err) throw err;


	})
};
