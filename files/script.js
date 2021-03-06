
var	data;
fetch('/info').then(response=>response.json()).then(obj=>{

		data = obj;
    console.log(data);
  //  console.log(data.type);

    console.log(data[0].City);
    myfunc(data);

  });



var linePath;
var mdiv;

function myfunc(data)
{
          var margin = {top: 10, right: 40, bottom: 30, left: 30},
              width = 1000 - margin.left - margin.right,
              height = 400 - margin.top - margin.bottom;

          // append the svg object to the body of the page
          var sVg = d3.select("#adiv")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            // translate this svg element to leave some margin.
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



              d3.select("#selectButton")
                 .selectAll('myOptions')
                	.data(data)
                 .enter()
               	.append('option')
                 .text(function (d) { return d.City; }) // text showed in the menu
                 .attr("value", function (d,i) { return i; })



          x =  d3.scaleTime()
               .domain([ new Date("2021-11-27 00:00:00"), new Date("2021-11-27 23:00:00") ])
               .range([0,width])
               .nice()

           y = d3.scaleLinear()
             .domain([0, 40])
            .range([height, 0]);



          sVg
            .append('g')
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(24));


          sVg
            .append('g')
            .call(d3.axisLeft(y));



             linePath =  sVg.append("path")
                 .datum(data[0].Data)
                 .attr("fill", "none")
                 .attr("stroke", "#69b3a2")
                 .attr("stroke-width", 1.8)
                 .attr("d", d3.line()
                   .x(function(d,i){return x( new Date(d.Time)) })
                   .y(function(d){ return y(d.PM25) })
                   )

            mdiv = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);


toggleUpdate(0);


        d3.select("#selectButton").on("change", function(d) {
         var selectedOption = d3.select(this).property("value")
            toggleUpdate(selectedOption)
         })

}
        function toggleUpdate(selectedGroup) {

            if(selectedGroup == 0){
              console.log(selectedGroup);
              var newdata = JSON.parse(JSON.stringify(data[0].Data));
            }
            else if(selectedGroup == 1)
            {
              console.log(selectedGroup);
              var newdata = JSON.parse(JSON.stringify(data[1].Data));
            }
            else {

              var newdata = JSON.parse(JSON.stringify(data[0].Data));
              newdata.length = Math.ceil(Math.random() * 24);
              for(let i=0 ; i< newdata.length ; i++)
              {
                newdata[i].PM25 = Math.floor(Math.random() * 40);
              }

          }


           linePath
          .datum(newdata)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
          .x(function(d,i){return x( new Date(d.Time)) })
             .y(function(d){ return y(d.PM25) })
           )


            d3.select('sVg')
             .select('g')
             .selectAll('circle')
             .data(newdata)

           .join(

            (enter)=> {
              return  enter.append('circle')
                .transition()
                .duration(700)
                  .attr("r", 5)
                  .attr("cx", function(d,i){return x( new Date(d.Time)) })
                  .attr("cy", function(d){ return y(d.PM25) })

             },
             (update)=> {
              return update
                 .transition()
                 .duration(1000)
                .attr("r", 5)
                .attr("cx", function(d,i){return x( new Date(d.Time)) })
                .attr("cy", function(d){ return y(d.PM25) })
              },

              (exit)=> {

               return exit.remove();

            })

            .on('mouseover', function (i,d) {

              d3.select(this).transition()
              .duration('100')
              .attr("r", 9);

              mdiv.transition()
              .duration(100)
              .style("opacity", 1)
              .style("left", (i.x + 7 ) + "px")
              .style("top", (i.y -13) + "px");

              mdiv.html(d.PM25);
              console.log(i);

          })
          .on('mouseout', function (d, i) {

              d3.select(this).transition()
              .duration('200')
              .attr("r", 5);

              mdiv.transition()
              .duration('200')
              .style("opacity", 0);

         });


  //          console.log(newdata)
  //          console.log(newdata.length)

  }


