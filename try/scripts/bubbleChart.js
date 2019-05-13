// set the dimensions and margins of the graph
var margin = {top: 40, right: 150, bottom: 60, left: 60},
    width = 550 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#bubble")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://gist.githubusercontent.com/ycfan14/1acff6fd6f3a6dacf34f39c16f8b5539/raw/41d1e84894a81b6f5a0980e45b9341872a2a4785/bubble_nonUS.csv", function(data) {

// d3.csv("https://gist.githubusercontent.com/ycfan14/9b8e0e7639bcb2769caaf6e1797ef348/raw/ae77949f83e560f39c0082a47605ff73d4c0c6fb/trial_2010_nonUS.csv", function(data) {

    // ---------------------------//
    //       AXIS  AND SCALE      //
    // ---------------------------//

    statemachine()

    document.getElementById("bubbleRange").onchange=function () {
        statemachine()
    }


    function statemachine() {

        svg.selectAll("circle").remove();
        svg.selectAll("g").remove();
        svg.selectAll("legend").remove();
        svg.selectAll("text").remove();
        svg.selectAll("dot").remove();
        svg.selectAll("line").remove();



        slider = document.getElementById("bubbleRange")
        selected_year = slider.value;
        output = document.getElementById("demo2");
        output.innerHTML = slider.value;

        slider.oninput = function () {
            output.innerHTML = this.value;
        }

        // data.forEach(function (a) {
        //
        //     if (parseFloat(a["year"]) == selected_year) {

                // color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));

                //Add X axis
                var x = d3.scaleLinear()
                    .domain([0, d3.max(data.filter(function(d) { return d["year"] == selected_year }), function (d) {
                        return +d.inflow;
                    })])
                    .range([0, width]);

                svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    // .call(d3.axisBottom(x).ticks(3));
                    .call(d3.axisBottom(x).ticks(3));

                // Add X axis label:
                svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("x", width)
                    .attr("y", height + 50)
                    .text("Inflow");

                // Add Y axis
                var y = d3.scaleLinear()
                    .domain([0, d3.max(data.filter(function(d) { return d["year"] == selected_year }), function (d) {
                        return +d.outflow;
                    })])
                    .range([height, 0]);
                svg.append("g")
                    .call(d3.axisLeft(y));

                // Add Y axis label:
                svg.append("text")
                    .attr("text-anchor", "end")
                    .attr("x", 0)
                    .attr("y", -20)
                    .text("Outflow")
                    .attr("text-anchor", "start")

                // Add a scale for bubble size
                var z = d3.scaleSqrt()
                    .domain([0, d3.max(data.filter(function(d) { return d["year"] == selected_year }), function (d) {
                        return +d.stock;
                    })])
                    .range([2, 30]);

                // Add a scale for bubble color
                var myColor = d3.scaleOrdinal()
                    .domain(["Europe", "North America", "Asia", "South America", "Africa", "Oceania"])
                    .range(d3.schemeSet1);

                // ---------------------------//
                //      TOOLTIP               //
                // ---------------------------//

                // -1- Create a tooltip div that is hidden by default:
                var tooltip = d3.select("#bubble")
                    .append("div")
                    .style("opacity", 0)
                    .attr("class", "tooltip")
                    .style("background-color", "black")
                    .style("border-radius", "5px")
                    .style("padding", "10px")
                    .style("color", "white")

                // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
                var showTooltip = function (d) {
                    tooltip
                        .transition(500)
                        .duration(500)
                    tooltip
                        .style("opacity", 1)
                        .html("Country: " + d.country_name)
                        .style("left", (d3.mouse(this)[0] + 30) + "px")
                        .style("top", (d3.mouse(this)[1] + 30) + "px")
                }
                var moveTooltip = function (d) {
                    tooltip
                        .style("left", (d3.mouse(this)[0] + 30) + "px")
                        .style("top", (d3.mouse(this)[1] + 30) + "px")
                }
                var hideTooltip = function (d) {
                    tooltip
                        .transition(500)
                        .duration(500)
                        .style("opacity", 0)
                }

                // ---------------------------//
                //       HIGHLIGHT GROUP      //
                // ---------------------------//

                // What to do when one group is hovered
                var highlight = function (d) {
                    // reduce opacity of all groups
                    d3.selectAll(".bubbles").style("opacity", .05)
                    // expect the one that is hovered
                    d3.selectAll("." + d).style("opacity", 1)
                }

                // And when it is not hovered anymore
                var noHighlight = function (d) {
                    d3.selectAll(".bubbles").style("opacity", 1)
                }

                // ---------------------------//
                //       CIRCLES              //
                // ---------------------------//


                // Add dots

                svg.append('g')
                    .selectAll("dot")
                    .data(data.filter(function(d) { return d["year"] == selected_year }))
                    .enter()
                    .append("circle")
                    .attr("class", function (d) {
                        return "bubbles " + d.continent
                    })
                    .attr("cx", function (d) {
                        return x(d.inflow);
                    })
                    .attr("cy", function (d) {
                        return y(d.outflow);
                    })
                    .attr("r", function (d) {
                        return z(d.stock);
                    })
                    .style("fill", function (d) {
                        return myColor(d.continent);
                    })
                    // -3- Trigger the functions for hover
                    .on("mouseover", showTooltip)
                    .on("mousemove", moveTooltip)
                    .on("mouseleave", hideTooltip)

                // ---------------------------//
                //       LEGEND              //
                // ---------------------------//

                // Add legend: circles
                var valuesToShow = [10, 100]
                //??????
                var xCircle = 390
                var xLabel = 440
                svg
                    .selectAll("legend")
                    .data(valuesToShow)
                    .enter()
                    .append("circle")
                    .attr("cx", xCircle)
                    .attr("cy", function (d) {
                        return height - 100 - z(d)
                    })
                    .attr("r", function (d) {
                        return z(d)
                    })
                    .style("fill", "none")
                    .attr("stroke", "black")

                // Add legend: segments
                svg
                    .selectAll("legend")
                    .data(valuesToShow)
                    .enter()
                    .append("line")
                    .attr('x1', function (d) {
                        return xCircle + z(d)
                    })
                    .attr('x2', xLabel)
                    .attr('y1', function (d) {
                        return height - 100 - z(d)
                    })
                    .attr('y2', function (d) {
                        return height - 100 - z(d)
                    })
                    .attr('stroke', 'black')
                    .style('stroke-dasharray', ('2,2'))

                // Add legend: labels
                svg
                    .selectAll("legend")
                    .data(valuesToShow)
                    .enter()
                    .append("text")
                    .attr('x', xLabel)
                    .attr('y', function (d) {
                        return height - 100 - z(d)
                    })
                    .text(function (d) {
                        return d
                    })
                    .style("font-size", 10)
                    .attr('alignment-baseline', 'middle')

                // Legend title
                svg.append("text")
                    .attr('x', xCircle)
                    .attr("y", height - 100 + 30)
                    .text("Population (M)")
                    .attr("text-anchor", "middle")

                // Add one dot in the legend for each name.
                var size = 20
                var allgroups = ["Asia", "Europe", "North America", "South America", "Africa", "Oceania"]
                svg.selectAll("myrect")
                    .data(allgroups)
                    .enter()
                    .append("circle")
                    //??????
                    .attr("cx", 390)
                    //??????
                    .attr("cy", function (d, i) {
                        return 10 + i * (size + 5)
                    }) // 100 is where the first dot appears. 25 is the distance between dots
                    .attr("r", 7)
                    .style("fill", function (d) {
                        return myColor(d)
                    })
                    .on("mouseover", highlight)
                    .on("mouseleave", noHighlight)

                // Add labels beside legend dots
                svg.selectAll("mylabels")
                    .data(allgroups)
                    .enter()
                    .append("text")
                    .attr("x", 390 + size * .8)
                    .attr("y", function (d, i) {
                        return i * (size + 5) + (size / 2)
                    }) // 100 is where the first dot appears. 25 is the distance between dots
                    .style("fill", function (d) {
                        return myColor(d)
                    })
                    .text(function (d) {
                        return d
                    })
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle")
                    .on("mouseover", highlight)
                    .on("mouseleave", noHighlight)


                // ---------------------------//
                //       SLIDER             //
                // ---------------------------//

                // var slider = svg.append("g")
                //     .attr("class", "slider")
                //     .attr("transform", "translate(" + margin.left + "," + (height - 100) + ")");
                //
                //
                // slider.append("line")
                //     .attr("class", "track")
                //     .attr("x1", x.range()[0])
                //     .attr("x2", x.range()[1])
                //     .select(function () {
                //         return this.parentNode.appendChild(this.cloneNode(true));
                //     })
                //     .attr("class", "track-inset")
                //     .select(function () {
                //         return this.parentNode.appendChild(this.cloneNode(true));
                //     })
                //     .attr("class", "track-overlay")
                //     .call(d3.drag()
                //         .on("start.interrupt", function () {
                //             slider.interrupt();
                //         })
                //         .on("start drag", function () {
                //             updateData(x.invert(d3.event.x), d);
                //         }));

                // slider.insert("g", ".track-overlay")
                //     .attr("class", "ticks")
                //     .attr("transform", "translate(0," + 18 + ")")
                //     .selectAll("text")
                //     .data(x.ticks(10))
                //     .enter().append("text")
                //     .attr("x", x)
                //     .attr("text-anchor", "middle")
                //     .text(function (d) {
                //         return formatDate(d);
                //     });

                // var handle = slider.insert("circle", ".track-overlay")
                //     .attr("class", "handle")
                //     .attr("r", 7);

                // function updateData(h, d) {
                //     console.log(formatDate(h))
                //
                //     handle.attr("cx", x(h));
                //
                //     svg.selectAll('circle[class=scatter]').remove()
                //
                //     for (i = 0; i < d.length; i++) {
                //
                //         var mystring = d[i].time
                //         filterYear = parseTime(mystring.split('T')[0])
                //         //console.log(formatTime(d.time))
                //
                //         //if(formatTime(filterYear)==formatTime(h))
                //         if (parseInt(formatTime(filterYear)) <= parseInt(formatTime(h))) {
                //
                //             svg.append("circle")
                //                 .attr("cx", projection([d[i].longitude, d[i].latitude])[0])
                //                 .attr("cy", projection([d[i].longitude, d[i].latitude])[1])
                //                 .attr("r", (d[i].mag - 5) * 4)
                //                 .style("fill", "red")
                //                 .attr("class", "scatter")
                //
                //         }
                //     }
                //
                // }
            }
        // })

    // }
});






