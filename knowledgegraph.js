var margin = { top: 32, left: 64, bottom: 64, right: 32 };
var width = 1000 - margin.left - margin.right;
var height = 700 - margin.bottom - margin.top;
var textPadding = 8;

var xvar = "Highest Level of Achievement";
var yvar = "Current Engagement";
var zvar = "Current Interest";

var svg = d3.select("body").select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("/data/feb-thingsido.csv").then(function(data){
    var x = d3.scaleLinear()
        .domain([0,10])
        .range([0, width]);
    
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + "," + (height + margin.top + margin.bottom / 2) + ")")
        .style("text-anchor", "middle")
        .text("Highest Level of Achievement");

    var y = d3.scaleLinear()
        .domain([10,0])
        .range([0, height]);

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height / 2))
        .attr("y", 0 - margin.left / 2)
        .style("text-anchor", "middle")
        .text("Current Engagement");

    var z = d3.scaleLinear()
        .domain([0,10])
        .range([4,64]);

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var label_array = [];
    var anchor_array = [];

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("id", (d) => {
            var id = "item-" + d["thing"].replace(/ /g, "_");
            var point = { x: x(d[xvar]), y: y(d[yvar]) };
            var onFocus = function () {
                d3.select("#" + id)
                    .attr("stroke", "blue")
                    .attr("stroke-width", "2");
            };
            var onFocusLost = function () {
                d3.select("#" + id)
                    .attr("stroke", "none")
                    .attr("stroke-width", "0");
            };
            label_array.push({ x: point.x, y: point.y, name: d["thing"], width: 0.0, height: 0.0, onFocus: onFocus, onFocusLost: onFocusLost });
            anchor_array.push({ x: point.x, y: point.y, r: z(d[zvar]) });
            return id;
        })
        .attr("cx", (d) => x(d[xvar]))
        .attr("cy", (d) => y(d[yvar]))
        .attr("r", (d) => z(d[zvar]))
        .on("mouseover", (d) => {
            tooltip.transition()
                .duration(200)
                .style("opacity", "0.8")
                .style("display", "block");
            tooltip.html(
                "<p>" + d["thing"] + "</p>" +
                "<p>Highest Level of Achievement: " + d["Highest Level of Achievement"] + "</p>" +
                "<p>Current Engagement: " + d["Current Engagement"] + "</p>" +
                "<p>Current Interest: " + d["Current Interest"] + "</p>"
            )
                .style("left", (d3.event.pageX + 32) + "px")
                .style("top", (d3.event.pageY) + "px");
        })
        .on("mouseout", () => {
            tooltip.transition()
                .duration(200)
                .style("opacity", "0")
                .on("end", () => tooltip.style("display", "none"))
        });

    // code from https://jsfiddle.net/s3logic/7cw1ddn2/

    var labels = svg.selectAll("whatever")
        .data(label_array)
        .enter()
        .append("text")
        .attr("class", "item-label")
        .text((d) => d.name)
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y)
        .attr("fill", "black")
        .on("mouseover", function (d) {
            d3.select(this).attr("fill", "blue");
            d.onFocus();
        })
        .on("mouseout", function (d) {
            d3.select(this).attr("fill", "black");
            d.onFocusLost();
        });
    
    var links = svg.selectAll(".link")
        .data(label_array)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", (d) => d.x)
        .attr("y1", (d) => d.y)
        .attr("x2", (d) => d.x)
        .attr("y2", (d) => d.y)
        .attr("stroke-width", 0.6)
        .attr("stroke", "gray");
    
    var index = 0;
    labels.each(function () {
        label_array[index].width = this.getBBox().width;
        label_array[index].height = this.getBBox().height;
        index += 1;
    });

    d3.labeler()
        .label(label_array)
        .anchor(anchor_array)
        .width(width)
        .height(height)
        .start(200);

    labels
        .transition()
        .duration(800)
        .attr("x", function (d) { return (d.x); })
        .attr("y", function (d) { return (d.y); });

    links
        .transition()
        .duration(800)
        .attr("x2", function (d) { return (d.x); })
        .attr("y2", function (d) { return (d.y); });

    // svg.selectAll("whatever")
    //     .data(data)
    //     .enter()
    //     .append("text")
    //         .attr("x", (d) => x(d[xvar]) + z(d[zvar]) + textPadding)
    //         .attr("y", (d) => y(d[yvar]))
    //         .attr("alignment-baseline", "middle")
    //         .text((d) => d["thing"])
    //         .classed('item-label', true);
});