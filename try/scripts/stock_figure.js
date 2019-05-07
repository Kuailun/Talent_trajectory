var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var formatPercent = d3.format("d");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<strong>Number:</strong> <span style='color:red'>" + d.Number + "</span>";
    })

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.csv("https://gist.githubusercontent.com/ycfan14/c90bc325d675be4720e6819ed819e45b/raw/c42524e3e5abc95a6ded2462b20f9b50370defc5/stock_all.csv", type, function(data){

    statemachine()
    document.getElementById("selected_startStop").onchange=function () {
        statemachine()
    }

    function statemachine() {
        e = document.getElementById("selected_startStop");
        selected_startStop = e.options[e.selectedIndex].value;
        var data_start = zebras.filter(r => r[selected_startStop] == 1, data);

        x.domain(data.map(function (d) {
            return d.University;
        }));
        y.domain([0, d3.max(data, function (d) {
            return d.Number;
        })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Number");

        svg.selectAll(".bar")
            .data(data_start)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return x(d.University);
            })
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                return y(d.Number);
            })
            .attr("height", function (d) {
                return height - y(d.Number);
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)

    }

});

function type(d) {
    d.Number = +d.Number;
    return d;
}