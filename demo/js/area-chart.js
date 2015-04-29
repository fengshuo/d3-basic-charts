// window.onload = function(){
  // margin convention
  var margin = {
    top:50,
    right:30,
    bottom:35,
    left:50
  };

  var width = 960 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;

  // basic variables
  var svg = d3.select("body")
            .append("svg")
              .attr({
                "width":width + margin.left + margin.right,
                "height": height + margin.top + margin.bottom
              })
            .append("g")
              // use group to move the chart area
              .attr("transform","translate(" + margin.top + "," + margin.left + ")")

  // scales (range)
  // time scale and linear scale
  var xScale = d3.time.scale()
                .range([0, width]);

  var yScale = d3.scale.linear()
                .range([height, 0]);

  // axes
  var xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom")
              .tickFormat(d3.time.format("%Y-%m"));
              // use time format for ticks

  var yAxis = d3.svg.axis()
              .scale(yScale)
              .orient("left");


  // date formatter
  var dateParser = d3.time.format("%Y/%m/%d").parse;

  // load data
  d3.csv("../data/BaiduNasdaq.csv",function(d){
    // accessor function is very useful to handle raw data
    return {
      date:dateParser(d.date),
      close:+d.close // numbers
    }
  },function(err,data){

    // scale domain
    xScale.domain(d3.extent(data, function(d){
      return d.date;
    }));

    yScale.domain([0, d3.max(data,function(d){
      return d.close;
    })]);

    // area generator
    var areaGenerator = d3.svg.area()
                        .x(function(d){
                          return xScale(d.date);
                          // remember to add Scale!
                        })
                        .y0(height)
                        .y1(function(d){
                          return yScale(d.close);
                          // remember to add Scale!
                        });

    var lineGenerator = d3.svg.line()
                        .x(function(d){
                                return xScale(d.date);
                        })
                        .y(function(d){
                                return yScale(d.close);
                        });



    // there is only on path for this chart
    svg.append("path")
      .datum(data) //use data for static, one time data bound
      .attr("d",areaGenerator)
      .attr("class","area");

    // below code won't work, because:

    // there is only on path on the chart at the end
    // if you use 'data' method, it will compare
    // the selection and data
    // and it will generate multiple path

    // svg.select("path")
    //     .data(data)
    //     .enter()
    //     .append("path")
    //     .attr("d",areaGenerator)
    //     .attr("class","area")

      // add a line on the edge of the area
      var line = svg.append("path")
          .datum(data)
          .attr("d",lineGenerator)
          .attr("class", "line");

      // add scatterplot for indicators

      var indicatorGroup = svg.selectAll("g")
          .data(data)
          .enter()
          .append("g")
          .attr("class","indicator-group");


      var circles =  indicatorGroup.append("circle")
          .attr({
              "cx": function(d){
                  return xScale(d.date)
              },
              "cy": function(d){
                  return yScale(d.close)
              },
              "r": "4.5px",
              "class":"indicator-dot"
          });


      indicatorGroup.on("mouseenter",function(d){
              var data = [d]; // the data should be an array
          // position for tooltip
          var xPos = parseFloat(xScale(d.date) + margin.left );
          var yPos = parseFloat(yScale(d.close));

              d3.select(this).selectAll(".horizontal-line") // as long as you are selectAll sth doesn't exist
                    .data(data)
                    .enter()
                    .append("line")
                    .attr({
                        "x1":0,
                        "y1": function(d){
                            return yScale(d.close);
                        },
                        "x2": function(d){
                            return xScale(d.date)
                        },
                        "y2":  function(d){
                            return yScale(d.close);
                        }
                    })
                  .attr("class","indicator-line");


              d3.select(this).selectAll(".vertical-Line")
                  .data(data)
                  .enter()
                  .append("line")
                  .attr({
                      "x1": function(d){
                          return xScale(d.date)
                      },
                      "y1": function(d){
                          return yScale(0);
                      },
                      "x2": function(d){
                          return xScale(d.date)
                      },
                      "y2":  function(d){
                          return yScale(d.close);
                      }
                  })
                  .attr("class","indicator-line");


              // show tooltip
              d3.select("#tooltip")
                  .classed("hide",false)
                  .style({
                      "left": (xPos - 30) + "px", // it's not flexible, should use the xScaled width/2
                      "top":  (yPos + 50) + "px"
                  })
                  .html(function(){
                      // use time format to handle the Date
                      return '<p>Date: ' + d3.time.format("%Y-%m-%d")(d.date) + '</p><p>Close: ' + d.close;
                  })

          })
          .on("mouseout", function(d){
              svg.selectAll(".indicator-line").remove();
              d3.select("#tooltip").classed("hide",true)
          });


    // append axis
    // x axis
    svg.append("g")
        .attr("transform","translate(0," + height + ")")
        .attr("class","x axis")
        .call(xAxis);

    // y axis
    svg.append("g")
        .attr("class","y axis")
        .call(yAxis);
  })





};
