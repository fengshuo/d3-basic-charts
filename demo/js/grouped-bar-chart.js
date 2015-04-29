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
				"width": width+margin.left+margin.right,
				"height": height+margin.top+margin.bottom
			})
		.append("g")
		.attr("transform","translate(" + margin.left + "," + margin.top + ")");

	var color = d3.scale.category20();

	var xScale = d3.scale.ordinal()
								.rangeRoundBands([0,width], 0.1);

	var yScale = d3.scale.linear()
								.range([height,0]);

	var xAxis = d3.svg.axis()
							.scale(xScale)
							.orient("bottom");
	var yAxis = d3.svg.axis()
							.scale(yScale)
							.orient("left")
							.tickFormat(d3.format(".2s"))


	d3.csv("../data/population.csv",function(d){
		// only use five states in this chart
		var data = d.slice(0,5);

		var states = [];

		data.forEach(function(d){
			states.push(d.State)
		})

		xScale.domain(states);




		var state = svg.selectAll(".state")
				.data(data)
				.enter()
			.append("svg") // you can't append rect in rect! use svg instead
				.attr({
					"width":xScale.rangeBand(),
					"x": function(d){
						return xScale(d.State)
					},
					"height": "100%"
				})


		// rearrange data
		var groups = d3.keys(data[0]).filter(function(key){
			return key !== 'State';
		});

		data.forEach(function(d){
			d.ages = groups.map(function(name){
				return {
					name: name,
					value: +d[name]
				}
			});
		})

		console.log(data)

		yScale.domain([
			0,
			d3.max(data,function(d){
				return d3.max(d.ages, function(a){
					return a.value;
				})
			})
		])

		var xInnerScale = d3.scale.ordinal();


		xInnerScale.domain(d3.keys(data[0]).filter(function(key){
			return key !== "State"
		}));

		xInnerScale.rangeRoundBands([0, xScale.rangeBand()]);

		state.selectAll(".age")
				.data(function(d){
					return d.ages;
				})
				.enter()
			.append("rect")
			.attr("class","age-rect")
					.attr({
						"width": xInnerScale.rangeBand(),
						"x": function(d){
							return xInnerScale(d.name)
						},
						"y": function(d){
							return yScale(d.value)
						},
						"height": function(d){
							return height - yScale(d.value)
						}
					})
					.style("fill",function(d){
						return color(d.name)
					})

		// append axis
		svg.append("g")
				.attr("class","x axis")
				.attr("transform","translate(0,"+height+")")
				.call(xAxis);
		svg.append("g")
				.attr("class","y axis")
				.call(yAxis);
				
	})
};
