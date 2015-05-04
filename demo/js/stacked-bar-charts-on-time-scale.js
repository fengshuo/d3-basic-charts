window.onload = function(){
	var margin = {
		top:10,
		right:10,
		bottom:30,
		left:30
	};

	var width = 300 - margin.left - margin.right;
	var height = 300 - margin.top - margin.bottom;

	var svg = d3.select("body")
						.append("svg")
							.attr({
								"width":width+margin.left+margin.right,
								"height":height+margin.top+margin.bottom
							})
						.append("g")
							.attr("transform","translate("+margin.left+","+margin.top+")");

	drawChart(19);

	var selector = d3.select("#date").on("change", change);

	function change(){
		var date = this.value;
		drawChart(date);
	};

	// scale and axe
	var xScale = d3.scale.ordinal()
								.rangeRoundBands([0,width], .1);
	var yScale = d3.scale.linear()
								.range([height,0]);
	var xAxis = d3.svg.axis()
							.scale(xScale)
							.orient("bottom");
	var yAxis = d3.svg.axis()
							.scale(yScale)
							.orient("left");

	var color = d3.scale.category10();

	var activity = ["invite","accept","decline"];

	function drawChart(date){

		d3.json("../data/stackedBaronTimeScale/"+date+".json",function(err,data){



		})
	}


};
