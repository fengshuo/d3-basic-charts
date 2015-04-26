window.onload = function(){
	var margin = {
		top:30,
		right:30,
		bottom:30,
		left:50
	}

	var width = 960 - margin.left - margin.right;
	var height = 600 - margin.top - margin.bottom;


	var svg = d3.select("body").append("svg")
			.attr({
				"width": width+margin.left+margin.right,
				"height": height + margin.top + margin.bottom
			})
		.append("g")
			.attr("transform","translate("+margin.left+","+margin.top + ")");

	// scales and axes
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

	// date format
	var dateParser = d3.time.format("%Y/%m/%d").parse;

	// load data
	d3.csv("../data/BaiduNasdaq.csv",function(d){
		return {
			date: dateParser(d.date),
			high: +d.high,
			low: +d.low
		}
	},function(err,data){
		if(err){
			console.log(err)
		}else {
			// update scale domain
			xScale.domain(d3.extent(data, function(d){return d.date}));
			yScale.domain([
				d3.min(data,function(d){
					return d.low;
				}),
				d3.max(data, function(d){
					return d.high;
				})
			]);

			// area generator
			var areaGenerator = d3.svg.area()
				.x(function(d){
					return xScale(d.date);
				})
				.y0(function(d){
					return yScale(d.low);
				})
				.y1(function(d){
					return yScale(d.high);
				});

			var groups = svg.append("path")
				.datum(data)// when using datum, no need to select, just append the element
				.attr("d",areaGenerator)
				.attr("class","area");


			// render axis
			svg.append("g")
				.attr("class","axis x")
				.attr("transform","translate(0,"+height+")")
				.call(xAxis);

			svg.append("g")
				.attr("class","axis y")
				.call(yAxis);
		}
	})

};
