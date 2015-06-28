(function(root,factory){
	if(typeof define === "function" && define.amd){
		define(['d3'], factory)
	}else if(typeof module === "object" && module.exports){
		module.exports = factory(require("d3"));
	} else {
		root.d3Margin = factory(root.d3)
	}
}(this, function(d3){
	return function(){
		var svg;
		var defaults = {
			margin:{
				top: 20,
				right: 20,
				bottom: 30,
				left: 30
			},
			width: 960,
			height: 600
		};

		function chart(selection){
			var _this = this;
			selection.each(function(d,i){
				svg = d3.select(this)
					.attr({
						"width": defaults.width,
						"height": defaults.height
					})
					.append("g")
					.attr("transform","translate(" + defaults.margin.left + "," + defaults.margin.top + ")");

				_this.innerChart = svg;
			})

		}

		chart.width = function(value){
			if(!arguments.length) return defaults.width;

			defaults.width = value;
			return chart;
		};

		chart.height = function(value){
			if(!arguments.length) return defaults.height;

			defaults.height = value;
			return chart;
		};

		chart.margin = function(value){
			if(!arguments.length) return defaults.height;

			defaults.margin = value;
			return chart;
		};

		chart.innerWidth = defaults.width - defaults.margin.left - defaults.margin.right;
		chart.innerHeight = defaults.height - defaults.margin.top - defaults.margin.bottom;


		return chart;

	};
}))
