window.onload = function(){
	// margin conventions
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

	// Scales and Axes
	var xScale = d3.time.scale()
				.range([0,width]);

	var yScale = d3.scale.linear()
				.range([height,0]);

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left");

	// time formatter
	var dateParser = d3.time.format("%Y/%m/%d").parse;


	// ordinal colors
	var color = d3.scale.category10();

	// Load data
	d3.csv("../data/BaiduNasdaq.csv", function(d){
		return {
			date: dateParser(d.date),
			close: +d.close,
			open: +d.open,
			high: +d.high,
			low: +d.low
		}
	}, function(data){
		// update domain for ordinal colors
		color.domain(["close","open","high","low"]);

		// reconstruct data based on color domain
		var stocks = color.domain().map(function(name){
			return {
				type: name,
				values: data.map(function(d){
					return {
						date: d.date,
						index: d[name]
					}
				})
			}
		});


		// update scale domain
		xScale.domain(d3.extent(data, function(data){return data.date;}))
		yScale.domain([
			d3.min(stocks, function(s){
				return d3.min(s.values, function(v){
					return v.index;
				})
			}),
			d3.max(stocks, function(s){
				return d3.max(s.values, function(v){
					return v.index;
				})
			})
		])

		// append lines
		// line generator
		var lineGenerator = d3.svg.line()
							.interpolate("basis")
			.x(function(d){
				return xScale(d.date); //don't forget the scales here!
			})
			.y(function(d){
				return yScale(d.index);
			});

		var groups = svg.selectAll(".stock")
				.data(stocks)
			.enter()
				.append("g")
				.attr("class","stock");

		// render lines
		groups.append("path")
			.attr("class","line")
			.attr("d", function(s){
				return lineGenerator(s.values);
			})
			.style("stroke",function(d){
				return color(d.type); //map color
			});

		// render axis
		svg.append("g")
			.attr("class","axis x")
			.attr("transform","translate(0,"+height+")")
			.call(xAxis);

		svg.append("g")
			.attr("class","axis y")
			.call(yAxis);


	})


};
