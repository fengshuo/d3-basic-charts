window.onload = function(){
	var width = 150;
	var height = 150;
	var radius = 70;

	var svg = d3.select("body");

	var legendArea = svg
		.append("svg")
		.attr({
			"width": radius*2,
			"height": radius*2
		});

	var color = d3.scale.category10();

	d3.csv("../data/population.csv", function(err, data){
		// update color domain
		color.domain(d3.keys(data[0]).filter(function(key){
			return key !== 'State';
		}));


		// return value is an array of arc descriptors

		var donutLayout = d3.layout.pie()
			.value(function(d){
				return d.population;
			});

		var arcGenerator = d3.svg.arc()
			.innerRadius(40)
			.outerRadius(70);

		// reconstruct data, add a new key for age group values
		data.forEach(function(d){
			d.values = color.domain().map(function(c){
				return {
					name: c,
					population: +d[c]
				}
			})
		})

		var group = svg.selectAll(".donut")
				.data(data)
				.enter()
			.append("svg")
				.attr({
					"width": radius*2,
					"height": radius*2
				})
			// or else the center will be the top left corner
			.append("g")
				.attr("transform","translate("+radius+","+radius+")")


		group.selectAll(".arc")
			.data(function(d){
				return donutLayout(d.values);
			})
			.enter()
			.append("path")
			.attr("d",arcGenerator)
			.attr("class","arc")
			.style("fill",function(d){
				return color(d.data.name);
			});

		group.append("text")
			.attr("text-anchor","middle")
			.text(function(d){
				return d.State;
			})




		// update legend
		var legendGroup = legendArea.selectAll(".legend")
							.data(color.domain())
							.enter()
						.append("g")
							.attr("class","legend")
			.attr("transform", function(d,i){
				return "translate(0," + i*15 + ")";
			});

		legendGroup.append("rect")
			.attr({
				"width":10,
				"height":10
			})
			.style("fill",function(d){
				return color(d);
			});

		legendGroup.append("text")
			.attr({
				"x":70,
				"y":10
			})
			.style("text-anchor","middle")
			.text(function(d){
				return d;
			})


	})


};
