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

	var yAxis = d3.svg.axis()
							.scale(yScale)
							.orient("left")
							.tickFormat(d3.format(".2s"));
	d3.csv("../data/population3.csv",function(d){
		d.people = +d.people;
		return d;
	},function(data){
		xScale.domain(d3.range(0,95,5));
		yScale.domain([
			0,
			d3.max(data, function(d){
				return d.people;
			})
		])

		// reconstruct data
		var newData = d3.nest()
								.key(function(d){
									return d.year;
								})
								.key(function(d){
									return d.age;
								})
								.rollup(function(leaf){
									return leaf.map(function(m){
										return m.people;
									})
								})
								.map(data);

		console.log(newData);

		var select = d3.select("body").append("div")
						.attr("id","toggle")
						.append("select")
					// select on change, not option
							.on("change", function(){
								updateYear(this.value)
							})


		select.selectAll("option")
				.data(d3.keys(newData))
				.enter()
				.append("option")
				.attr("value", function(d){
					return d;
				})

				.text(function(d){
					return d;
				});

		// Firstly, add g for each age group
		var ageGroup = svg.selectAll(".age")
			.data(d3.keys(newData["2000"])) // initialize
			.enter()
			.append("g")
			.attr("class","age")
			.attr("transform", function(d){
				return "translate("+xScale(d)+",0)";
			})


		var year = d3.select("select").property("value")

		// Then, add female and male for each age group
		var rect = ageGroup.selectAll("rect")
			.data(function(age){
				return newData[year][age];
			})
			.enter()
			.append("rect")
			.attr({
				"width": xScale.rangeBand(),
				"y": function(d){
					return yScale(d);
				},
				"height": function(d){
					return height - yScale(d);
				}
			});

		function updateYear(year){
			console.log(year)
			ageGroup.data(d3.keys(newData[year]))

			rect.data(function(age){
				return newData[year][age];
			})
			.transition().duration(1000)
			.attr({
				"y": function(d){
					return yScale(d);
				},
				"height": function(d){
					return height - yScale(d);
				}
			})
		}


		//axis
		svg.append("g")
			.attr("class","x axis")
			.attr("transform","translate(0,"+height+")")
			.call(xAxis);

		svg.append("g")
			.attr("class","y axis")
			.call(yAxis);



	})


};
