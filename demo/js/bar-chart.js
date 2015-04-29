window.onload = function(){
	var margin = {
		top:30,
		right:30,
		bottom:50,
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

	var xScale = d3.scale.ordinal()
								.rangeRoundBands([0,width], .1);

	var yScale = d3.scale.linear()
								.range([height,0]);

	var xAxis = d3.svg.axis()
							.scale(xScale)
							.orient("bottom");

	var formatter = d3.format("%");

	var yAxis = d3.svg.axis()
							.scale(yScale)
							.orient("left")
							.tickFormat(formatter)


	d3.csv("../data/letters.csv", function(err,data){
		// update domain

		var letters = [];
		data.forEach(function(d){
			letters.push(d.letter);
			d.frequency = +d.frequency;
		})

		xScale.domain(letters);
		yScale.domain(d3.extent(data,function(d){
			return d.frequency;
		}))

		var rects = svg.selectAll(".rect")
								.data(data)
								.enter()
							.append("rect")
								.attr({
									"x": function(d){
										return xScale(d.letter)
									},
									"y": function(d){
										return yScale(d.frequency);
									},
									"height": function(d){
										return height - yScale(d.frequency);
									},
									"width": xScale.rangeBand()
								})
								// .style("fill","steelblue")

		svg.append("g")
			.attr("class","x axis")
			.attr("transform","translate(0,"+height+")")
			.call(xAxis);

		svg.append("g")
			.attr("class","y axis")
			.call(yAxis)
			// add on y axis
		.append("text")
			.attr("transform","rotate(-90)")
			.attr("y",15)
			.attr("text-anchor","end")
			.text("Frequency")

	})

};
