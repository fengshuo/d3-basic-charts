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

	var color = d3.scale.category10();

	var xScale = d3.scale.linear()
		.range([0, width]);

	var yScale = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left");

	d3.csv("../data/flowers.csv", function(d){
		return {
			species: d.species,
			sepalLength: +d.sepalLength,
			sepalWidth: +d.sepalWidth
		}
	}, function(err, data){
		// update color domain
		var species = [];
		data.forEach(function(el,i,arr){
			if(i==0){
				species.push(arr[i]["species"]);
			}
			if(i>=1 && (arr[i]["species"] !== arr[i-1]["species"])){
				species.push(arr[i]["species"])
			}
		});

		color.domain(species);

		xScale.domain(d3.extent(data, function(d){
			return d.sepalWidth;
		}));

		yScale.domain(d3.extent(data, function(d){
			return d.sepalLength;
		}));

		// No need to reconstruct data in this case, all you need to
		// do is to distinguish the category by fill color.

		var dots = svg.selectAll(".dot")
					.data(data)
					.enter()
			.append("circle")
				.attr({
					"cx": function(d){
						return xScale(d.sepalWidth);
					},
					"cy": function(d){
						return yScale(d.sepalLength);
					},
					"r": 3.5
				})
				.style("fill",function(d){
					return color(d.species);
				})
				.attr("class","dot");

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0,"+height+")")
			.call(xAxis)
			.append("text")
			.attr("x", (width-55))
			.attr("y", -15)
			.text("sepalWidth");


		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform","rotate(-90)")
			.attr("y",10)
			.text("sepalLength");

		// add legends
		var legends = svg.selectAll(".legend")
				.data(species)
				.enter()
			.append("g")
			.attr("transform", "translate("+ (width-50) + ",10)");

		// append for each legend
		legends.append("rect")
			.attr({
				"width":10,
				"height":10,
				"y": function(d,i){
					return i*20;
				}
			})
			.style("fill", function(d){
				return color(d)
			});

		legends.append("text")
			.attr("x",15)
			.attr("y",function(d,i){
				return i*23
			})
			.text(function(d){
				return d;
			})







	})
};
