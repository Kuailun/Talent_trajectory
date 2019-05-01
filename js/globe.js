 // Our D3 code will go here.
 Promise.all([   
 d3.csv("https://gist.githubusercontent.com/zhengyunhan/6bae5a5d7872ea314ca155281865fcc3/raw/820ee002c06751c4689e6f7a64318446cdd54fae/select_inflow.csv"),
    d3.csv("https://gist.githubusercontent.com/zhengyunhan/ec0cba9408754fc0b38ae90b4dd65a10/raw/3ff848f89d4ebd2ded2c698f1697e18c9a4c3afa/select_outflow.csv"),
]).then(function(Inflow, Outflow){

        // select function
        function select(config = {}) {
            let {
              value: formValue,
              title,
              description,
              submit,
              multiple,
              size,
              options
            } = config;
            if (Array.isArray(config)) options = config;
            options = options.map(
              o => (typeof o === "object" ? o : { value: o, label: o })
            );
            const form = input({
              type: "select",
              title,
              description,
              submit,
              getValue: input => {
                const selected = Array.prototype.filter
                  .call(input.options, i => i.selected)
                  .map(i => i.value);
                return multiple ? selected : selected[0];
              },
              form: html`
                <form>
                  <select name="input" ${
                    multiple ? `multiple size="${size || options.length}"` : ""
                  }>
                    ${options.map(({ value, label }) => Object.assign(html`<option>`, {
                        value,
                        selected: Array.isArray(formValue)
                          ? formValue.includes(value)
                          : formValue === value,
                        textContent: label
                      }))}
                  </select>
                </form>
              `
            });
            form.output.remove();
            return form;
          }
        viewof selected_institution = select({
            title: "Selected institution",
            options: institutions,
            value: 0
          })

        // Width and height of SVG
        let width = 150;
        let height = 175;
        let margin = ({top: 15, right: 10, bottom: 25, left: 30})

        // Initialize SVG object (using our pre-defined width and height)
        var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        //arc_inflow
        let features=[]
        for (let i=0; i<selected_inflow.length; i++){
          features.push({type: "Feature", geometry: {type:"LineString",coordinates:[[parseFloat(selected_inflow[i].lng), parseFloat(selected_inflow[i].lat)], [parseFloat(selected_inflow[i].des_lng), parseFloat(selected_inflow[i].des_lat)]]}},)
            }
        return {
             type: "FeatureCollection",
             features: features
            }

        // map
        

            const context = this ? this.getContext("2d") : DOM.context2d(size, size);
            const render = function() {
              const path = d3.geoPath(projection, context);
              const rotate = projection.rotate();
              const backpath = d3.geoPath(backprojection, context);
              
              const frontColor = d3.hcl('#a9c681');
              const backColor = d3.hcl(frontColor);
              backColor.l += 15;
              backColor.c -= 30;
                  
                context.clearRect(0, 0, width, width);
          
              context.beginPath(), path({type:"Sphere"}),
                context.fillStyle = '#fcfcfc', context.fill();
          
              context.beginPath(), backpath(countries),
                context.fillStyle = backColor, context.fill();
          
              context.beginPath(), backpath(d3.geoGraticule()()),
                context.lineWidth = .1, context.strokeStyle = '#aaa', context.stroke();
          
              context.beginPath(), path(d3.geoGraticule()()),
                context.lineWidth = .1, context.strokeStyle = '#111', context.stroke();
          
              context.beginPath(), path(countries),
                context.globalAlpha = 0.9,
                context.lineWidth = 1, context.strokeStyle = frontColor.darker(1), context.stroke(),
                context.fillStyle = frontColor, context.fill(),
                context.globalAlpha = 1;
          
              context.beginPath(), path({type: "Sphere"}),
                context.lineWidth = .1, context.strokeStyle = '#111', context.stroke();
          
              context.beginPath(), path(selectedData);
                  context.lineWidth = 1, context.strokeStyle = selectedColor, context.stroke()
              
             context.beginPath(), path({type: 'Point', coordinates: selectedPlace});
                context.fillStyle = "red", context.fill()
          
            }
            
            // no need to specify render() here, it's taken care of by the loop below.
            context.canvas.inertia = d3.geoInertiaDrag(d3.select(context.canvas), null, projection);
            const velocity = 0.03
            const timer = d3.timer(function() {
              var rotate = projection.rotate();
              rotate[0] += velocity * 20;
              projection.rotate(rotate);
              backprojection.rotate(rotate);
              render();
            });
            
            invalidation.then(() => (timer.stop(), timer = null, d3.select(context.canvas).on(".drag", null)));
          
            return context.canvas;
          
        

        // Use a scale for the height of the visualization
        {
            // this only for informative purposes.
            while (true) {
              var p = projection.rotate().map(d3.format(".2f"));
              yield md`λ = ${p[0]}, φ = ${p[1]}, γ = ${p[2]}`
            }
          }

        tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("font-family", "'Open Sans', sans-serif")
            .style("font-size", "12px")
            .style("z-index", "10")
            .style("visibility", "hidden"); 

        // Select and generate rectangle elements
        svg.selectAll( "rect" )
            .data( bosData )
            .enter()
            .append("rect")
            .attr( "x", (d,i) => (i*(x_axisLength/arrayLength) + margin.left)) 
                // Set x coordinate of each bar to index of data value (i) times dynamically calculated bar width.
                // Add left margin to account for our left margin.
            .attr( "y", d => (height - yScale(d.calls)) )  
                // Set y coordinate using yScale. 
            .attr( "width", (x_axisLength/arrayLength) - 1 )    
                // Set bar width using length of array, with 1px gap between each bar.
            .attr( "height", d => yScale(d.calls) - yScale(0))                         
                // Set height of rectangle to data value, accounting for bottom margin.
            .attr( "fill", "steelblue")
            .on("mouseover", d => tooltip.style("visibility", "visible").text(d.neighborhood + ": " + d.calls))
            .on("mousemove", d => tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px").text(d.neighborhood + ": " + d.calls))
            .on("mouseout", d => tooltip.style("visibility", "hidden"));

        // Create y-axis, beginning at the top margin and ending at the bottom margin
        svg.append("line")
            .attr("x1", margin.left)
            .attr("y1", margin.top)
            .attr("x2", margin.left)
            .attr("y2", height - margin.bottom)
            .attr("stroke-width", 2)
            .attr("stroke", "black");

        // Create x-axis beginning at the left margin, and ending at the right margin
        svg.append("line")
            .attr("x1", margin.left)
            .attr("y1", height - margin.bottom)
            .attr("x2", width - margin.right)
            .attr("y2", height - margin.bottom)
            .attr("stroke-width", 2)
            .attr("stroke", "black");

        // Add a Label
        // y-axis label
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .text("No. of 311 Calls")
            .attr("transform", "translate(20, 20) rotate(-90)");    
    })
