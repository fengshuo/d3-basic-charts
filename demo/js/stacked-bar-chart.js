window.onload = function(){
	// margin convention
	var margin = {
		top:30,
		right:30,
		bottom:50,
		left:50
	};

	var width = 1000 - margin.left - margin.right;
	var height = 600 - margin.top - margin.bottom;

	var svg = d3.select("body")
					.append("svg")
						.attr({
							"width": width+margin.left+margin.right,
							"height": height+margin.top+margin.bottom
						})
					.append("g")
						.attr("transform","translate("+margin.left+","+margin.top+")");

	// scale range and axe
	// ordinal xscale
	var xScale = d3.scale.ordinal()
							.rangeRoundBands([0,width],.1);

	var yScale = d3.scale.linear()
							.range([height,0]);

	var xAxis = d3.svg.axis()
							.scale(xScale)
							.orient("bottom");

	var yAxis = d3.svg.axis()
							.scale(yScale)
							.orient("left")
							.tickFormat(d3.format(".2s"));
							// format numbers

	// color
	var color = d3.scale.category20();


	d3.csv("../data/population.csv", function(data){

		// update color domain
		color.domain(d3.keys(data[0]).filter(function(key){
			return key !== "State" // the age groups in colors
		}));

		// reconstruct data
		// doesn't need d3.layout.stack in this case

		data.forEach(function(d){
			var y0 = 0;
			// add new keys
			d.ages = color.domain().map(function(name){
				// generate new value for each age group
				return {
					name: name,
					y0: y0,
					y1: y0 += +d[name] // pay attention to how this line of code update y0 and y1
				}
			});

			// use total for sorting and yScale
			d.total = d.ages[d.ages.length-1].y1;
		});

		// sort
		data.sort(function(a,b){
			return b.total - a.total;
		})

		// after data reconstruction
		// update scale domains, particularly y scale
		xScale.domain(data.map(function(d){
			return d.State;
		}));

		yScale.domain([
			0,
			d3.max(data, function(d){
				return d.total;
			})
		]);

		console.log(data)

		// add elements
		var group = svg.selectAll(".state")
								.data(data)
								.enter()
							.append("g")
								.attr("class","state")
								.attr("transform", function(d){
									return "translate(" + xScale(d.State) + ",0)";
								});

		// for each state, there are multiple age groups in different colors
		group.selectAll("age")
			.data(function(d){
				return d.ages;
			})
			.enter()
		.append("rect")
				.attr({
					"width": xScale.rangeBand(),
					"y": function(d){
						return yScale(d.y1);
					},
					"height":function(d){
						// NOTE: y0, y1 in d is not the coordinates on the chart
						// they are caculated based on the original data
						// since we scaled y range to [height,0]
						// yScale(d.y0) is bigger than yScale(d.y1)
						return yScale(d.y0) - yScale(d.y1);
					}
				})
				.style("fill", function(d){
					return color(d.name);
				})


		// add axis
		svg.append("g")
			.attr("class","axis x")
			.attr("transform","translate(0,"+height+")")
			.call(xAxis);

		svg.append("g")
			.attr("class","axis y")
			.call(yAxis);


	})



};
