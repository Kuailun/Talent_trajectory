

d3.csv("https://gist.githubusercontent.com/zhengyunhan/6bae5a5d7872ea314ca155281865fcc3/raw/820ee002c06751c4689e6f7a64318446cdd54fae/select_inflow.csv", function(inflow){
    d3.csv("https://gist.githubusercontent.com/zhengyunhan/6bae5a5d7872ea314ca155281865fcc3/raw/820ee002c06751c4689e6f7a64318446cdd54fae/select_outflow.csv", function(outflow){

var width = 960,
    height = 500;

var velocity = .01;

var projection = d3.geoOrthographic()
.rotate([-10,-30]);

var canvas = d3.select("body").append("canvas")
    .attr("width", width)
    .attr("height", height);

var context = canvas.node().getContext("2d");

    // retina display
var devicePixelRatio = window.devicePixelRatio || 1;
  canvas.style('width', canvas.attr('width')+'px');
  canvas.style('height', canvas.attr('height')+'px');
  canvas.attr('width', canvas.attr('width') * devicePixelRatio);
  canvas.attr('height', canvas.attr('height') * devicePixelRatio);
  context.scale(devicePixelRatio,devicePixelRatio);

var path = d3.geoPath()
    .projection(projection)
    .context(context);


var backprojection = d3.geoProjection(function(a,b) {
  return d3.geoOrthographicRaw(-a,b);
})
  .clipAngle(90)
  .translate(projection.translate())
  .scale(projection.scale());

var backpath = d3.geoPath()
    .projection(backprojection)
    .context(context);


d3.json("https://unpkg.com/world-atlas/world/110m.json", function(error, world) {
  if (error) throw error;

  var land = topojson.feature(world, world.objects.land);

  d3.timer(function(elapsed) {
    var rotate = projection.rotate();
    rotate[0] += velocity * 20;
    projection.rotate(rotate);
    render();
  });

function render() {
  var rotate = projection.rotate();
    backprojection.rotate([rotate[0] + 180, -rotate[1], -rotate[2]]);

    context.clearRect(0, 0, width, height);

    context.beginPath();
    path({type:"Sphere"});
    context.fillStyle = '#fcfcfc';
    context.fill();

    context.beginPath();
    backpath(land);
    context.fillStyle = '#d0ddfa';
    context.fill();
    context.beginPath();
    backpath(d3.geoGraticule()());
    context.lineWidth = .1;
    context.strokeStyle = '#97b3f6';
    context.stroke();


    context.beginPath();
    path(d3.geoGraticule()());
    context.lineWidth = .1;
    context.strokeStyle = '#1046c6';
    context.stroke();

    context.beginPath();
    path(land);
    context.lineWidth = 1;
    context.strokeStyle = '#1046c6';
    context.stroke();
    context.fillStyle = '#5c88ee';
    var alpha = context.globalAlpha;
    context.globalAlpha = 1;
    context.fill();
    context.globalAlpha = alpha;

    context.beginPath();
    path({type: "Sphere"});
    context.lineWidth = .1;
    context.strokeStyle = '#1046c6';
    context.stroke();

    context.beginPath(), path(selectedData);
    context.lineWidth = 1, context.strokeStyle = selectedColor, context.stroke()

    context.beginPath(), path({type: 'Point', coordinates: selectedPlace});
    context.fillStyle = "red", context.fill()

}
//
//  d3.geoInertiaDrag(canvas, render);
//  canvas.style('cursor', 'move')
//
//
//
    selected_inflow=z.filter(r => r[selected_institution] == 1, Inflow);
    selected_outflow=z.filter(r => r[selected_institution] == 1, Outflow);
    institutions=Object.keys(Inflow[0]).slice(14);
//
    function inflow()  {
            let features=[];
            for (let i=0; i<selected_inflow.length; i++){
              features.push({type: "Feature", geometry: {type:"LineString",coordinates:[[parseFloat(selected_inflow[i].lng), parseFloat(selected_inflow[i].lat)], [parseFloat(selected_inflow[i].des_lng), parseFloat(selected_inflow[i].des_lat)]]}},)
            }
            return {
              type: "FeatureCollection",
              features: features
            }
            };

      var arc_inflow=inflow();
////
        function outflow(){
            var features=[]
            for (let i=0; i<selected_outflow.length; i++){
              features.push({type: "Feature", geometry: {type:"LineString",coordinates:[[parseFloat(selected_outflow[i].lng), parseFloat(selected_outflow[i].lat)], [parseFloat(selected_outflow[i].des_lng), parseFloat(selected_outflow[i].des_lat)]]}},)
            }
            return {
              type: "FeatureCollection",
              features: features
            }
            };

         var arc_outflow=outflow()
////
        function selected_Data()  {
            switch (selected_inoutflow) {
              case "Inflow": return arc_inflow
              case "Outflow": return arc_outflow
            }
          };

         var selectedData=selected_Data()

        function selected_Place() {
            switch (selected_inoutflow) {
              case "Inflow": return [selected_inflow[0].des_lng,selected_inflow[0].des_lat]
              case "Outflow": return [selected_outflow[0].lng,selected_outflow[0].lat]
            }
          };
         var selectedPlace=selected_Place()


        function selected_Color() {
            switch (selected_inoutflow) {
              case "Inflow": return "rgba(0,100,0,.4)"
              case "Outflow": return "rgba(100,0,0,.4)"
            }
          };

        var selectedColor=selected_Color()

//
});

    })
})