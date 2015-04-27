window.onload = function(){
  // margin convention
  var margin = {
    top:30,
    right: 30,
    bottom: 50,
    left:50
  };

  var width = 960 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;

  var svg = d3.select("body").append("svg")
            attr({
              "width": width + margin.left + margin.right,
              "height": height + margin.top + margin.bottom
            })
          .append("g")
            .attr("transform","translate(" + margin.left + "," + marigin.top + ")");

  // scale and axe
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

  // date formatter
  var dateParser = d3.time.format("%y-%b-%d").parse;

  // color category
  var color = d3.scale.category10();

  // load data
  d3.csv("../data/browsers.csv", function(err,data){
    if(err){
      console.log(err)
    }else {
      // update x domain



      // update colors domain
      // use key and filter to return an array
      color.domain(d3.keys(data[0]).filter(function(key){
        return key !== 'date'
      }));

      // Format date
      // not using the accessor function of csv this time
      data.forEach(function(d){
        d.date = dateParser(d.date);
      });

      // reconstructe data
      // an array of array, one array stands for one category
      var newData = color.domain().map(function(name){
        return {
          name: name,
          bvalues: data.map(function(d){
            return {
              date: d.date,
              index: d[name]
            }
          })
        }
      });

      // stack layout
      // chained with a values since the layers should be
      // a two-demensional array of values
      var stack = d3.layout.stack()
                  .values(function(d){
                    return d.bvalues;
                  });





    }
  })
}
