// basic SVG setup
var margin3 = { top: 20, right: 100, bottom: 40, left: 100 };
var height3 = 400 - margin3.top - margin3.bottom;
var width3 = 600 - margin3.left - margin3.right;

var svg1 = d3.select("#country").append("svg")
    .attr("width",width3 + margin3.left + margin3.right)
    .attr("height",height3 + margin3.top + margin3.bottom)
    .append("g")
    .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

// setup scales - the domain is specified inside of the function called when we load the data
var xScale = d3.time.scale().range([0, width3]);
var yScale = d3.scale.linear().range([height3, 0]);
var color = d3.scale.category10();

// setup the axes
var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
var yAxis = d3.svg.axis().scale(yScale).orient("left");

// create function to parse dates into date objects
var parseDate = d3.time.format("%Y").parse;
var formatDate = d3.time.format("%Y");
var bisectDate = d3.bisector(function(d) { return d.year; }).left;

// set the line attributes
var line = d3.svg.line()
    // .interpolate("basis")
    .x(function(d) { return xScale(d.year); })
    .y(function(d) { return yScale(d.close); });

var focus = svg1.append("g").style("display","none");

// import data and create chart
d3.csv("https://gist.githubusercontent.com/ycfan14/bc58e86c56ce01808cd26a2c59d74bf8/raw/4bd9e6f9e694ffebea46f1bf96c481c5c644de43/countryNumber_continent.csv", function(d) {
    return {
        year: parseDate(d.year),
        Africa: +d.Africa,
        Asia: +d.Asia,
        Europe: +d.Europe,
        NorthAmerica: +d.NorthAmerica,
        Oceania: +d.Oceania,
        SouthAmerica: +d.SouthAmerica
    };
},
    function(error,data) {

        // sort data ascending - needed to get correct bisector results
        data.sort(function (a, b) {
            return a.year - b.year;
        });

        // color domain
        color.domain(d3.keys(data[0]).filter(function (key) {
            return key !== "year";
        }));


        // create stocks array with object for each company containing all data
        var stocks = color.domain().map(function (name) {
            return {
                name: name,
                values: data.map(function (d) {
                    return {year: d.year, close: d[name]};
                })
            };
        });


        // add domain ranges to the x and y scales
        xScale.domain([
            d3.min(stocks, function(c) { return d3.min(c.values, function(v) { return v.year; }); }),
            d3.max(stocks, function(c) { return d3.max(c.values, function(v) { return v.year; }); })
        ]);
        yScale.domain([
            0,
            // d3.min(stocks, function(c) { return d3.min(c.values, function(v) { return v.close; }); }),
            d3.max(stocks, function(c) { return d3.max(c.values, function(v) { return v.close; }); })
        ]);

        // add the x axis
        svg1.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height3 + ")")
            .call(xAxis);

        // add the y axis
        svg1.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform","rotate(-90)")
            .attr("y",-60)
            .attr("dy",".71em")
            .style("text-anchor","end")
            .text("Number of Country with Top Scholars");

        // add circle at intersection
        focus.append("circle")
            .attr("class","y")
            .attr("fill","none")
            .attr("stroke","black")
            .style("opacity",0.5)
            .attr("r",8);

        // add horizontal line at intersection
        focus.append("line")
            .attr("class","x")
            .attr("stroke","black")
            .attr("stroke-dasharray","3,3")
            .style("opacity",0.5)
            .attr("x1", 0)
            .attr("x2", width3);

        // add vertical line at intersection
        focus.append("line")
            .attr("class","y")
            .attr("stroke","black")
            .attr("stroke-dasharray","3,3")
            .style("opacity",0.5)
            .attr("y1", 0)
            .attr("y2", height3);

        //append rectangle for capturing if mouse moves within area
        svg1.append("rect")
            .attr("width",width3)
            .attr("height",height3)
            .style("fill","none")
            .style("pointer-events","all")
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove)

        // add the line groups
        var stock = svg1.selectAll(".stockXYZ")
            .data(stocks)
            .enter().append("g")
            .attr("class","stockXYZ");

        // add the number of country paths
        stock.append("path")
            .attr("class","line")
            .attr("id",function(d,i){ return "id" + i; })
            .attr("d", function(d) {
                return line(d.values);
            })
            .style("stroke", function(d) { return color(d.name); })
            .style("fill","none");



        // add the continent labels at the right edge of chart
        var maxLen = data.length;
        stock.append("text")
            .datum(function(d) {
                return {name: d.name, value: d.values[maxLen - 1]};
            })
            .attr("transform", function(d) {
                return "translate(" + xScale(d.value.year) + "," + yScale(d.value.close) + ")";
            })
            .attr("id",function(d,i){ return "text_id" + i; })
            .attr("x", 3)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; })
            .on("mouseover",function(d,i) {
                for (j=0; j < 6; j++) {
                    if (i !== j) {
                        d3.select("#id"+j).style("opacity",0.1);
                        d3.select("#text_id"+j).style("opacity",0.2);
                    }
                };
            })
            .on("mouseout", function(d,i) {
                for (j=0; j < 6; j++) {
                    d3.select("#id"+j).style("opacity",1);
                    d3.select("#text_id"+j).style("opacity",1);
                };
            });

        // mousemove function
        function mousemove() {

            var x0 = xScale.invert(d3.mouse(this)[0]);
            var i = bisectDate(data, x0, 1); // gives index of element which has date higher than x0
            var d0 = data[i - 1], d1 = data[i];
            var d = x0 - d0.year > d1.year - x0 ? d1 : d0;
            var close = d3.max([+d.Africa,+d.Asia,+d.Europe,+d.NorthAmerica,+d.Oceania,+d.SouthAmerica]);

            focus.select("circle.y")
                .attr("transform", "translate(" + xScale(d.year) + "," + yScale(close) + ")");

            focus.select("line.y")
                .attr("y2",height3 - yScale(close))
                .attr("transform", "translate(" + xScale(d.year) + ","
                    + yScale(close) + ")");

            focus.select("line.x")
                .attr("x2",xScale(d.year))
                .attr("transform", "translate(0,"
                    + (yScale(close)) + ")");

        };

     });




