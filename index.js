var heights = [1.7, 1.4, 1.9, 2.5, 3.0];

var svgH = 500, svgW = 1000;
var topBuffer = 50;
var padding = 5;
var barW = svgW / heights.length;
var scaleH = (svgH - topBuffer) / Math.max(...heights)

var svg = d3.select('svg')
  .attr('width',svgW)
  .attr('height',svgH)
  .attr('class','barchart');

var bar = svg.selectAll('rect')
  .data(heights)
  .enter()
  .append('rect')
  .attr('height', function(d){
    return scaleH * d;
  })
  .attr('width', barW - padding)
  .attr('transform', function(d,i){
    var transA = [barW * i, svgH - scaleH * d];
    return "translate(" + transA + ")";
  });

var text = svg.selectAll('text')
  .data(heights)
  .enter()
  .append('text')
  .text(function(d){
    return d;
  })
  .attr("x", function(d,i){
    return barW * i + barW * 0.5;
  })
  .attr("y", function(d){
    return svgH - scaleH * d - 10;
  })
  .attr("fill", "#000000");
