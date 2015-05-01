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
		.attr("transform","translate("+margin.left+","+margin.top+")");

	var xScale = d3.scale.linear()
		.range([0, width]);

	var yScale = d3.scale.ordinal()
		.rangeRoundBands([0, height],.2);

	var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("top");

	d3.csv("../data/negative-value.csv",function(err,data){
		// don't forget to convert string to number
		data.forEach(function(d){
			d.value = +d.value;
		});

		// update scale domain
		yScale.domain(data.map(function(d){
			return d.name;
		}));

		xScale.domain(d3.extent(data,function(d){
			return d.value;
		}));

		svg.selectAll(".rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("y", function(d){
					return yScale(d.name);
				// use the category
			})
			//.attr("x",function(d){
			//	if(d.value > 0){
			//		return xScale(0)
			//	}else {
			//		return xScale(d.value);
			//	}
			//})
			.attr("x", function(d){
				// major difference 1
				return xScale(Math.min(0, d.value));
			})
			.attr("height", function(d){
				return yScale.rangeBand();
			})
			.attr("width", function(d){
				// major difference 2
				// don't forget the Math.abs
				return Math.abs(xScale(d.value)-xScale(0))
			})
			//.style("fill",function(d){
			//	if(d.value > 0){
			//		return "blue"
			//	}else {
			//		return "red"
			//	}
			//});
			.style("fill", function(d){
				return d.value>0 ? "steelblue" : "orange";
			});

		// axis
		svg.append("g")
			.attr("class", "x axis")
			.call(xAxis);

		// a little bit different than usual y axis
		svg.append("g")
			.attr("class", "y axis")
			.append("line")
			.attr({
				"x1": xScale(0),
				"x2": xScale(0),
				"y1": 0,
				"y2": height
			})

		// if ticks are needed, transform should be handy


	})


};
