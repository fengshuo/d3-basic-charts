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
		]); // use fixed y scale so that it's easier to observe population change per year

		//console.log(data);
		// manipulate data with d3.nest
		var newData = d3.nest()
								.key(function(d){
									return d.year; // step 1 - group by year
								})
								.key(function(d){
									return d.age; // in each year, group by age
								})
								.rollup(function(leaf){ // use rollup to manipulate values in leaf
									return leaf.map(function(m){
										return m.people; // only need people in this case, it is common to use d3.sum() here
									})
								})
								.map(data); // if use entries here, it not convenient to use the data

		console.log(newData);

		var select = d3.select("body").append("div")
						.attr("id","toggle")
						.append("select")
					// select on change, not option
							.on("change", function(){
								updateYear(this.value)
							})


		select.selectAll("option")
				.data(d3.keys(newData)) // return keys, that is, the 'year'
				.enter()
				.append("option")
				.attr("value", function(d){
					return d;
				})
				.text(function(d){
					return d;
				});

		// Firstly, create g for each age group (which contains male and female)
		var ageGroup = svg.selectAll(".age")
			.data(d3.keys(newData["2000"])) // read the age group by one of the year
			.enter()
			.append("g")
			.attr("class","age")
			.attr("transform", function(d){
				return "translate("+xScale(d)+",0)";
			})


		var year = d3.select("select").property("value") // get value of the year

		// Then, add female and male for each age group
		var rect = ageGroup.selectAll("rect")
			.data(function(age){ // the age is from ageGroup data()
				return newData[year][age];
			})
			.enter()
			.append("rect") // two rect are appended to group here
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
			// update data, add transition
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
