var margin = {top: 32, left: 32, bottom: 32, right: 32};
var width = 1800 - margin.left - margin.right;
var height = 400 - margin.bottom - margin.top;

var data = [
  {"date": new Date("January 1, 2018")},
  {"date": new Date("June 1, 2018")},
  {"date": new Date("December 31, 2018")}
]

// dataset

var easydata = [
  { x: 10, y: 20 }, { x: 40, y: 90 }, { x: 80, y: 50 }
];

// SVG setup

var svg = d3.select("body").select("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// x axis

var x = d3.scaleLinear()
  .domain([0, d3.max(easydata, d => d.x)])
  .range([0,width]);

svg.append('g')
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// y axis

var y = d3.scaleLinear()
  .domain([0, d3.max(easydata, d => d.y)])
  .range([height, 0]);

svg.append('g')
  .call(d3.axisLeft(y));

// data binding

svg.selectAll("whatever")
  .data(easydata)
  .enter()
  .append("circle")
    .attr("cx", function(d){return x(d.x)})
    .attr("cy", function(d){return y(d.y)})
    .attr("r",7);