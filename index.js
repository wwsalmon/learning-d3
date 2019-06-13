var width = 1500;
var height = 700;
var leftMar = 32;

var data = [
  {"date": new Date("January 1, 2018"), "player": "Kronovi", "type": "leave"},
  {"date": new Date("June 1, 2018")},
  {"date": new Date("December 31, 2018")}
]

var x_scale = d3.scaleTime()
  .domain(
    d3.extent(data,function(d){
      return d;
    }))
  .range([0, width - 100]);

var x_axis = d3.axisBottom()
  .scale(x_scale)
  .ticks(20)

var svg = d3.select("svg")
  .attr("width",width)
  .attr("height", height)
  

svg.append("g")
  .call(x_axis)
  .attr("transform","translate(" + leftMar + ",80)")

svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("r", 10)
  .attr("fill", "red")
  .attr("cx", function (d) {
    return x_scale(d) + leftMar
  })
  .attr("cy", 10);
  