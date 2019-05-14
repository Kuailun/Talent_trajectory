d3.csv("https://gist.githubusercontent.com/cesandoval/b834ac93c07e03ec5205843b97f68017/raw/6e4408bc870e2484ad860aa3e61f2cc0e0610a1e/scfulldata%2520-%2520scfulldata.csv.csv", function(allflow){
        var width = 400,
            height = 600,
            speed = 1e-2,
            start = Date.now();

        var sphere = {type: "Sphere"};

        var projection1 = d3.geo.orthographic()
            .scale(width / 2.1)
            .clipAngle(90)
            .translate([width / 2, height / 2]);

        var projection2 = d3.geo.equirectangular()
            .scale(width / 6)
            .translate([width / 2, height / 2]);

        var graticule = d3.geo.graticule();

        var canvas1 = d3.select("body").append("canvas")
            .attr("width", width)
            .attr("height", height);

        var canvas2 = d3.select("body").append("canvas")
            .attr("width", width)
            .attr("height", height);

        var context1 = canvas1.node().getContext("2d");
        var context2 = canvas2.node().getContext("2d");

        var path1 = d3.geo.path()
            .projection(projection1)
            .context(context1);

        var path2 = d3.geo.path()
            .projection(projection2)
            .context(context2);


        var feature=[]
        var links=[]
        var selectedData = Object.create(null);

//Prevent error when first load
        statemachine3()

        document.getElementById("myRange1").onchange=function () {
            statemachine3()
        }

        function statemachine3(){
            slider = document.getElementById("myRange1")
            selected_year=slider.value;
            output = document.getElementById("demo1");
            output.innerHTML = slider.value;
            // console.log(selected_year)

            slider.oninput = function() {
                output.innerHTML = this.value;
            }

            feature=[]
            links=[]
            selectedData = Object.create(null);

            allflow.forEach(function(a) {

                    if(a["des_country"]!="NA"&&parseFloat(a["year"])==selected_year) {
                        // console.log(a)
                        var source_lat = parseFloat(a.lat),
                            source_lng = parseFloat(a.lng),
                            target_lat = parseFloat(a.des_lat),
                            target_lng = parseFloat(a.des_lng);

                        // Build GeoJSON feature from this link
                        feature.push ({
                            type: 'Feature',
                            geometry: {
                                type: "LineString",
                                coordinates: [[source_lng,source_lat], [target_lng,target_lat]]
                            },
                            properties: {
                                sourceSchool: a.name,
                                targetSchool: a.des_schoolname,
                                sourceCountry: a.country,
                                targetCountry: a.des_country
                            }
                        });
                        links.push({
                            source: [source_lng,source_lat],
                            target: [target_lng,target_lat],
                            feature: feature
                        });
                        selectedData.type = "FeatureCollection",
                            selectedData.features = feature
                    }
                }
            )
        }

// console.log(selectedData)

        function addArc( path, context )
        {
            var circle = d3.geo.circle().angle(5).origin([-0.8432, 51.4102]);
            circles = [];
            circles.push( circle() );
            circle.origin([-122.2744, 37.7561]);
            circles.push( circle() );
            context.fillStyle = "rgba(0,100,0,.5)";
            context.lineWidth = .2;
            context.strokeStyle = "#000";
            context.beginPath();
            path({type: "GeometryCollection", geometries: circles});
            context.fill();
            context.stroke();



            context.lineWidth = 2;
            context.strokeStyle = "rgba(0,100,0,.7)";
            context.beginPath();
            path({type: "LineString", coordinates: [[-0.8432, 51.4102],[-122.2744, 37.7561]] });
            context.stroke();
        }

        d3.json("https://unpkg.com/world-atlas/world/110m.json", function(error, topo) {
            var land = topojson.feature(topo, topo.objects.land),
                grid = graticule();

            d3.timer(function() {
                var λ = speed * (Date.now() - start),
                    φ = -15;

                context1.clearRect(0, 0, width, height);

                context1.beginPath();
                path1(sphere);
                context1.lineWidth = 3;
                context1.strokeStyle = "#000";
                context1.stroke();
                context1.fillStyle = "#fff";
                context1.fill();

                context1.save();
                context1.translate(width / 2, 0);
                context1.scale(-1, 1);
                context1.translate(-width / 2, 0);
                projection1.rotate([λ + 180, -φ]);

                context1.beginPath();
                path1(land);
                context1.fillStyle = "#dadac4";
                context1.fill();

                context1.beginPath();
                path1(grid);
                context1.lineWidth = .5;
                context1.strokeStyle = "rgba(119,119,119,.5)";
                context1.stroke();

                context1.restore();
                projection1.rotate([λ, φ]);

                context1.beginPath();
                path1(grid);
                context1.lineWidth = .5;
                context1.strokeStyle = "rgba(119,119,119,.5)";
                context1.stroke();

                context1.beginPath();
                path1(land);
                context1.fillStyle = "#737368";
                context1.fill();
                context1.lineWidth = .5;
                context1.strokeStyle = "#000";
                context1.stroke();

                context1.beginPath();
                path1(selectedData);
                context1.lineWidth = .5;
                context1.strokeStyle = "rgba(0,100,0,.5)";
                context1.stroke();

                //  addArc( path1, context1 );


                context2.clearRect(0, 0, width, height);

                context2.beginPath();
                path2(sphere);
                context2.lineWidth = 3;
                context2.strokeStyle = "#000";
                context2.stroke();
                context2.fillStyle = "#fff";
                context2.fill();

                context2.beginPath();
                path2(grid);
                context2.lineWidth = .5;
                context2.strokeStyle = "rgba(119,119,119,.5)";
                context2.stroke();

                context2.beginPath();
                path2(land);
                context2.fillStyle = "#737368";
                context2.fill();
                context2.lineWidth = .5;
                context2.strokeStyle = "#000";
                context2.stroke();

                context2.beginPath();
                path2(selectedData);
                context2.lineWidth = .5;
                context2.strokeStyle = "rgba(0,100,0,.5)";
                context2.stroke();

                // addArc( path2, context2 );
            });})

        d3.select(self.frameElement).style("height", height + "px");
    }
)