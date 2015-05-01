window.onload = function(){
	var margin = {
		top: 35,
		right:30,
		bottom:30,
		left:50
	};

	var width = 960 - margin.left - margin.right;
	var height = 600 - margin.top - margin.bottom;

	var svg = d3.select("body")
		.append("svg")
		.attr({
			"width": width,
			"height": height
		})
		.append("g")
		.attr("transform","translate(" + width/2 + "," + height/2 + ")");
		// adjust the svg here

	var color = d3.scale.category20();


	d3.csv("../data/donut.csv",function(data){

		var arcGenerator = d3.svg.arc()
			.innerRadius(100)
			.outerRadius(200);
			// if these accessor function is not specified
			// there should be innerRadius and outerRadius in data

		var pieLayout = d3.layout.pie()
			.value(function(d){
				return d.population;
			});

		data.forEach(function(d){
			d.population = +d.population;
		});

		var group = svg.selectAll(".arc")
				.data(pieLayout(data))
				.enter()
			.append("g")
			.attr("class","arc");

		// first use layout to 'shape' data (into different groups in some cases)
		// then use generator to actually draw these data (mainly by 'path')

		group.append("path")
			.attr("d", arcGenerator)
			.style("fill", function(d){
				return color(d.data.age);
				// after arcGenerator, there is the original data and svg data
			});

		// labels
		// The centroid is defined as the midpoint in polar coordinates of the inner and outer radius, and the start and end angle.
		// This provides a convenient location for arc labels
		var legends = group.append("text")
			.attr("transform",function(d){
				return "translate(" + arcGenerator.centroid(d) + ")"
			})
			.attr("text-anchor", "middle")
			.text(function(d){
				return d.data.age;
			})





	})

};
