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
          <select name="selected_institution">
           <option value="MIT">MIT</option>
           <option value="HARVARD">Harvard</option> 
           <option value="STANFORD">Stanford</option>
           <option value="BERKELEY">UC Berkeley</option>
           <option value="CMU">CMU</option>
           <option value="CHICAGO">U Chicago</option> 
           <option value="OXFORD">Oxford</option>
           <option value="CAMBRIDGE">Cambridge</option>
           <option value="SACLAY">Saclay</option>
           <option value="COPENHAGEN">Copenhagen</option> 
           <option value="MCGILL">McGill U</option>
           <option value="TORONTO">UToronto</option>
           <option value="TOKYO">UTokyo</option>
           <option value="KYOTO">UKyoto</option> 
           <option value="TSINGHUA">Tsinghua</option>
           <option value="PEKING">Peking</option>
           <option value="NUS">NUS</option> 
           <option value="WEIZMANN">WEIZMANN</option>
           <option value="CAPE">Cape Town</option>
          </select>
          var dropDown = d3.select("#table_container").append("select")
          .attr("name", "selected_institution");

          <select name="selected_inoutflow">
           <option value="Inflow">Inflow</option>
           <option value="Outflow">Outflow</option>
           </select>
          var dropDown = d3.select("#table_container").append("select")
          .attr("name", "selected_inoutflow");
           
          </select>
        // Width 
        let width = 900;
        let size = width * 0.8;

        
        // projection
        projection = d3.geoSatellite()
            .distance(distance)
            .clipAngle(Math.acos(1 / distance) * 180 / Math.PI - 1e-6)
            .precision(0.1)
            .fitExtent([[5, 5], [size - 5, size - 5]], {type: "Sphere"})
        backShell = d3.geoCircle()
            .center([180, 0])
            .radius(180 - projection.clipAngle())
        backprojection = d3.geoSatellite()
            .distance(distance)
            .clipAngle(0)
            .preclip(d3.geoClipPolygon(backShell()))
            .translate(projection.translate())
            .scale(projection.scale())
            .precision(0.1);


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

        //tooltip = d3.select("body")
            //.append("div")
           // .style("position", "absolute")
          //  .style("font-family", "'Open Sans', sans-serif")
           // .style("font-size", "12px")
           // .style("z-index", "10")
          //  .style("visibility", "hidden"); 

        
        selected_inflow=z.filter(r => r[selected_institution] == 1, Inflow);
        selected_outflow=z.filter(r => r[selected_institution] == 1, Outflow);
        institutions=Object.keys(Inflow[0]).slice(14);
        arc_inflow={
            let features=[]
            for (let i=0; i<selected_inflow.length; i++){
              features.push({type: "Feature", geometry: {type:"LineString",coordinates:[[parseFloat(selected_inflow[i].lng), parseFloat(selected_inflow[i].lat)], [parseFloat(selected_inflow[i].des_lng), parseFloat(selected_inflow[i].des_lat)]]}},)
            }
            return {
              type: "FeatureCollection",
              features: features
            }
            };
            
        arc_outflow={
            let features=[]
            for (let i=0; i<selected_outflow.length; i++){
              features.push({type: "Feature", geometry: {type:"LineString",coordinates:[[parseFloat(selected_outflow[i].lng), parseFloat(selected_outflow[i].lat)], [parseFloat(selected_outflow[i].des_lng), parseFloat(selected_outflow[i].des_lat)]]}},)
            }
            return {
              type: "FeatureCollection",
              features: features
            }
            };
        selectedData = { 
            switch (selected_inoutflow) {
              case "Inflow": return arc_inflow
              case "Outflow": return arc_outflow
            }
          };
        selectedPlace = { 
            switch (selected_inoutflow) {
              case "Inflow": return [selected_inflow[0].des_lng,selected_inflow[0].des_lat]
              case "Outflow": return [selected_outflow[0].lng,selected_outflow[0].lat]
            }
          };
        selectedColor = { 
            switch (selected_inoutflow) {
              case "Inflow": return "rgba(0,100,0,.4)"
              case "Outflow": return "rgba(100,0,0,.4)"
            }
          };

       // graticule = d3.geoGraticule10();
        
       // land = topojson.feature(world, world.objects.land);
      //  countries = topojson.feature(world, world.objects.countries);
      //  world = d3.json("https://unpkg.com/world-atlas@1/world/110m.json");
        


 
    })
