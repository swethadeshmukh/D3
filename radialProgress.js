function radialProgress(parent) {
    var data=null,
        duration= 1000,/*duration taken to display the content*/
        selection,
        margin = {top:0, right:0, bottom:30, left:0},
        width = 300,
        height = 300,
        diameter = 1500,
        label="",
        fontSize=10;


   // var mouseClick;

    var value= 0,
        minValue = 0,
        maxValue = 100;

    var  currentArc= 0, currentArc2= 0, currentValue=0;

    var arc = d3.svg.arc()
        .startAngle(0 * (Math.PI/180)); //just radians

   
    selection=d3.select(parent);


    function component() {

        selection.each(function (data) {

            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);

            var enter = svg.enter().append("svg").attr("class","radial-svg").append("g");

           // measure();

            svg.attr("width", width)
                .attr("height", height);


            var background = enter.append("g").attr("class","component")
                .attr("cursor","pointer");


            arc.endAngle(360 * (Math.PI/180))

            background.append("path")
                .attr("transform", "translate(" + width/2 + "," + width/2 + ")")
                .attr("d", arc);
           
          /* var g = svg.select("g")
                .attr("transform", "translate(" + _margin.left + "," + _margin.top + ")");*/


            arc.endAngle(currentArc);

            enter.append("g").attr("class", "arcs");

            //Blue path on the radius
            var path = svg.select(".arcs").selectAll(".arc").data(data);
            path.enter().append("path")
                .attr("class","arc")
                .attr("transform", "translate(" + width/2 + "," + width/2 + ")")
                .attr("d", arc);

            //Another path in case we exceed 100%
            /*var path2 = svg.select(".arcs").selectAll(".arc2").data(data);
            path2.enter().append("path")
                .attr("class","arc2")
                .attr("transform", "translate(" + _width/2 + "," + _width/2 + ")")
                .attr("d", _arc2);*/


            enter.append("g").attr("class", "labels");
            var label = svg.select(".labels").selectAll(".label").data(data);
            label.enter().append("text")
                .attr("class","label")
                .attr("y",width/2+fontSize/3)
                .attr("x",width/2)
                .attr("cursor","pointer")
                .attr("width",width)
                // .attr("x",(3*_fontSize/2))
                .text(function (d) { return Math.round((value-minValue)/(maxValue-minValue)*100) + "%" })
                .style("font-size",fontSize+"px");
                //.on("click",onMouseClick);

            path.exit().transition().duration(500).attr("x",1000).remove();


            layout(svg);

            function layout(svg) {

                var ratio=(value-minValue)/(maxValue-minValue);
                var endAngle=Math.min(360*ratio,360);
                endAngle=endAngle * Math.PI/180;

                path.datum(endAngle);
                path.transition().duration(duration)
                    .attrTween("d", arcTween);

                if (ratio > 1) {
                    path2.datum(Math.min(360*(ratio-1),360) * Math.PI/180);
                    path2.transition().delay(duration).duration(duration)
                        .attrTween("d", arcTween2);
                }

                label.datum(Math.round(ratio*100));
                label.transition().duration(duration)
                    .tween("text",labelTween);

            }

        });

       /* function onMouseClick(d) {
            if (typeof _mouseClick == "function") {
                _mouseClick.call();
            }
        }*/
    }

    function labelTween(a) {
        var i = d3.interpolate(currentValue, a);
        currentValue = i(0);

        return function(t) {
            currentValue = i(t);
            this.textContent = Math.round(i(t)) + "%";
        }
    }

    function arcTween(a) {
        var i = d3.interpolate(currentArc, a);

        return function(t) {
            currentArc=i(t);
            return arc.endAngle(i(t))();
        };
    }

   /* function arcTween2(a) {
        var i = d3.interpolate(_currentArc2, a);

        return function(t) {
            return _arc2.endAngle(i(t))();
        };
    }*/


    function measure() {
        width=diameter - margin.right - margin.left - margin.top - margin.bottom;
        height=width;
        fontSize=width*.2;
        arc.outerRadius(width/2);
        arc.innerRadius(width/2 * .85);
        //_arc2.outerRadius(_width/2 * .85);
        //_arc2.innerRadius(_width/2 * .85 - (_width/2 * .15));
    }


    component.render = function() {
        measure();
        component();
        return component;
    }

    component.value = function (_) {
        if (!arguments.length) return value;
        value = [_];
        selection.datum([value]);
        return component;
    }


    component.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return component;
    };

    component.diameter = function(_) {
        if (!arguments.length) return diameter
        diameter =  _;
        return component;
    };

    component.minValue = function(_) {
        if (!arguments.length) return minValue;
        minValue = _;
        return component;
    };

    component.maxValue = function(_) {
        if (!arguments.length) return maxValue;
        _maxValue = _;
        return component;
    };

    component.label = function(_) {
        if (!arguments.length) return label;
        label = _;
        return component;
    };

    component.duration = function(_) {
        if (!arguments.length) return duration;
        duration = _;
        return component;
    };

   /* component.onClick = function (_) {
        if (!arguments.length) return _mouseClick;
        _mouseClick=_;
        return component;
    }*/

    return component;

}