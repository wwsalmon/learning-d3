var margin = {top: 32, left: 32, bottom: 32, right: 32};
var width = 800 - margin.left - margin.right;
var height = 400 - margin.bottom - margin.top;

var data = [
  {"date": new Date("January 1, 2018")},
  {"date": new Date("June 1, 2018")},
  { "date": new Date("December 31, 2018") }
]

// SVG setup

var svg = d3.select("body").select("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// dataset

d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv", function (data) {
  var x = d3.scaleLinear()
    .domain([0, 1000])
    .range([0, width]);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  var y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 0.01]);
  svg.append("g")
    .call(d3.axisLeft(y));

  data = Array.from(data);

  var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40));
  var density = kde(data.map(function (d) { return d.price; }));

  svg.append("path")
    .attr("class","mypath")
    .datum(density)
    .attr("fill", "#222")
    .attr("opacity", "0.8")
    .attr("stroke", "#000")
    .attr("stroke-width", 1)
    .attr("stroke-linejoin", "round")
    .attr("d", d3.line()
      .curve(d3.curveBasis)
        .x(function(d) {return x(d[0])})
        .y(function(d) {return y(d[1])})
    );

});

function kernelDensityEstimator(kernel, X) {
  return function (V) {
    return X.map(function (x) {
      return [x, d3.mean(V, function (v) { return kernel(x - v); })];
    });
  };
}

function kernelEpanechnikov(k) {
  return function (v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}