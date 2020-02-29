var margin = { top: 32, left: 64, bottom: 64, right: 32 };
var width = 1000 - margin.left - margin.right;
var height = 700 - margin.bottom - margin.top;
var textPadding = 8;

var xvar = "Highest Level of Achievement";
var yvar = "Current Engagement";
var zvar = "Current Interest";

var legend = {
    achieve: {
        0: "No knowledge",
        1: "Cursory knowledge",
        2: "Inbetween",
        3: "Dabbling",
        4: "Learning",
        5: "Substantial investment",
        6: "Proficiency",
        7: "Excellence",
        8: "Local recognition/accomplishment",
        9: "Inbetween",
        10: "Real recognition"
    },
    engage: {
        0: "No thought",
        1: "Occassional interaction",
        2: "Inbetween",
        3: "Dabbling",
        4: "Earnestly trying",
        5: "Hobby",
        6: "Major pursuit",
        7: "Inbetween",
        8: "All free time",
        9: "Inbetween",
        10: "Ben Platt"
    },
    interest: {
        0: "No thought",
        1: "Occassional interaction",
        2: "Inbetween",
        3: "Dabbling",
        4: "Earnestly trying",
        5: "Hobby",
        6: "Major pursuit",
        7: "Inbetween",
        8: "All free time",
        9: "Inbetween",
        10: "Ben Platt"
    }
};

var svg = d3.select("body").select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv("/data/feb-thingsido.csv").then(function(data){

    // X AXIS

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

    // Y AXIS

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

    // RADIUS SCALE

    var z = d3.scaleLinear()
        .domain([0,10])
        .range([4,64]);

    // SETUP

    var label_array = [];
    var anchor_array = [];

    // CIRCLES

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("id", (d) => {
            var id = "item-" + d["thing"].replace(/ |\.|\/|\(|\)/g, "_");
            var point = { x: x(d[xvar]), y: y(d[yvar]) };

            // EVENTS FOR LABELS

            var onFocus = function () {
                makeToolTip(d,d3.event.pageX,d3.event.pageY);
                startHover(id);
            };
            var onFocusLost = function () {
                hideToolTip();
                endHover(id);
            };

            label_array.push({ x: point.x, y: point.y, name: d["thing"], width: 0.0, height: 0.0, onFocus: onFocus, onFocusLost: onFocusLost, id: id });
            anchor_array.push({ x: point.x, y: point.y, r: z(d[zvar]) });
            return id;
        })
        .attr("cx", (d) => x(d[xvar]))
        .attr("cy", (d) => y(d[yvar]))
        .attr("r", (d) => z(d[zvar]))
        .attr("stroke-width", 0)
        // MOUSE EVENTS
        .on("mouseover", overCircle)
        .on("mousemove", () => {
            moveToolTip(d3.event.pageX,d3.event.pageY);
        })
        .on("mouseout", leaveCircle);

    // LABELS

    var labels = svg.selectAll("whatever")
        .data(label_array)
        .enter()
        .append("text")
        .attr("class", "item-label")
        .text((d) => d.name)
        .attr("id", (d) => d.id)
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y)
        .attr("stroke-width",0)
        .attr("fill", "black")
        // MOUSE EVENTS
        .on("mouseover", function (d) {
            d.onFocus();
        })
        .on("mousemove", () => moveToolTip(d3.event.pageX,d3.event.pageY))
        .on("mouseout", function (d) {
            d.onFocusLost();
        });

    // LINKS
    
    var links = svg.selectAll(".link")
        .data(label_array)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("id", (d) => d.id)
        .attr("x1", (d) => d.x)
        .attr("y1", (d) => d.y)
        .attr("x2", (d) => d.x)
        .attr("y2", (d) => d.y)
        .attr("stroke-width", 0.6)
        .attr("stroke", "black");

    // REARRANGE LABELS/LINKS
    
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

});

// MOUSE EVENT FUNCTIONS

function overCircle(d){
    startHover(this.id);
    makeToolTip(d,d3.event.pageX,d3.event.pageY);
}

function leaveCircle(d){
    endHover(this.id);
    hideToolTip();
}

function startHover(id){
    d3.selectAll("#" + id).attr("fill", "blue").attr("stroke", "blue");
}

function endHover(id){
    d3.selectAll("#" + id).attr("fill", "black").attr("stroke", "black");
}

// TOOLTIP FUNCTIONS

function getText(cat, num){
    if (cat == 'achieve'){
        catstring = "Highest Level of Achievement: ";
    }
    else if (cat == 'engage'){
        catstring = "Current Engagement: ";
    }
    else if (cat == 'interest'){
        catstring = "Current Interest: ";
    }

    if (num % 1 == 0){
        numstring = num + ", " + legend[cat][num];
    }
    else{
        numLow = Math.floor(num);
        numHigh = Math.ceil(num);
        numstring = num + ", " + legend[cat][numLow] + "/" + legend[cat][numHigh];
    }

    return catstring + numstring;
}

function makeToolTip(thisItem, mouseX, mouseY){
    tooltip.transition()
        .duration(200)
        .style("opacity", "0.8")
        .style("display", "block");
    tooltip.html(() => {
        var achieveNum = thisItem["Highest Level of Achievement"];
        var engageNum = thisItem["Current Engagement"];
        var interestNum = thisItem["Current Interest"];
        return "<p>" + thisItem["thing"] + "</p>" +
            "<p>" + getText("achieve", achieveNum) + "</p>" +
            "<p>" + getText("engage", engageNum) + "</p>" +
            "<p>" + getText("interest", interestNum) + "</p>";
    });
    moveToolTip(mouseX, mouseY);
}

function moveToolTip(mouseX, mouseY) {
    tooltip.style("left", (mouseX + 32) + "px")
        .style("top", (mouseY) + "px");
}

function hideToolTip(){
    tooltip.transition()
        .duration(200)
        .style("opacity", "0")
        .on("end", () => tooltip.style("display", "none"));
}