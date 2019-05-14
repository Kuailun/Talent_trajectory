
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 70},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://gist.githubusercontent.com/ycfan14/b18d3c24e85679a420bec17458df84af/raw/8300f86de20923773de51aa4e4b31e4760f35240/gistfile1.txt",

    // When reading the csv, I must format variables:
    function(d){
        return { year : d3.timeParse("%Y")(d.year), countryNumber : d.countryNumber }
    },

    // Now I can use this dataset:
    function(data) {

        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.year; }))
            .range([ 0, width ]);
        xAxis = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        svg.append("text")
            .attr("transform",
                "translate(" + (width/2) + " ," +
                (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("Year");


        // Add Y axis
        var y = d3.scaleLinear()
            .domain([20, d3.max(data, function(d) { return +d.countryNumber; })])
            .range([ height, 0 ]);
        yAxis = svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -30)
            .attr("x",0 - (height / 2))
            .style("text-anchor", "middle")
            .text("Country with Top Scholars");

        // This allows to find the closest X index of the mouse:
        var bisect = d3.bisector(function(d) { return d.year; }).left;

        // Create the circle that travels along the curve of chart
        var focus = svg
            .append('g')
            .append('circle')
            .style("fill", "none")
            .attr("stroke", "black")
            .attr('r', 8.5)
            .style("opacity", 0)

        // Create the text that travels along the curve of chart
        var focusText = svg
            .append('g')
            .append('text')
            .style("opacity", 0)
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle")

        // Create a rect on top of the svg area: this rectangle recovers mouse position
        svg
            .append('rect')
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('width', width)
            .attr('height', height)
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseout', mouseout);

        // add the line
        svg.append("g")
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return x(d.year) })
                .y(function(d) { return y(d.countryNumber) })
            );

        // What happens when the mouse move -> show the annotations at the right positions.
        function mouseover() {
            focus.style("opacity", 1)
            focusText.style("opacity",1)
        }

        function mousemove() {
            // recover coordinate we need
            var x0 = x.invert(d3.mouse(this)[0]);
            var i = bisect(data, x0, 1);
            console.log(i)
            selectedData = data[i]
            focus
                .attr("cx", x(selectedData.year))
                .attr("cy", y(selectedData.countryNumber))
            focusText
                .html("number:" + selectedData.countryNumber)
                .attr("x", x(selectedData.year))
                .attr("y", y(selectedData.countryNumber))
        }
        function mouseout() {
            focus.style("opacity", 0)
            focusText.style("opacity", 0)
        }

    })
