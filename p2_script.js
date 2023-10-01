console.log("Hello from P2");


// Onload Animation
window.addEventListener("load", function() {
  var content = document.querySelector(".wrapper");

  content.style.opacity = 1;
  content.style.transform = "translateY(0)";
});

// Back Button
var back_btn = document.getElementById("back_btn");
back_btn.addEventListener("click", function() {
  window.location.href = "index.html";
});


// Chart
let d3 = window.d3;


window.onload = function(){
    setup1("https://cdn.glitch.global/c035c5b7-ccec-41fe-8532-ff655a2685ef/Car_page2.csv?v=1681115600770");
    setup2("https://cdn.glitch.global/c035c5b7-ccec-41fe-8532-ff655a2685ef/Sport_page2.csv?v=1681116139941");
    setup3("https://cdn.glitch.global/c035c5b7-ccec-41fe-8532-ff655a2685ef/SUV_page2.csv?v=1681117129575");
    setup4("https://cdn.glitch.global/c035c5b7-ccec-41fe-8532-ff655a2685ef/Truck_page2.csv?v=1681117994708");
    setup5("https://cdn.glitch.global/c035c5b7-ccec-41fe-8532-ff655a2685ef/Van_page2.csv?v=1681118278495");
    setup6("https://cdn.glitch.global/c035c5b7-ccec-41fe-8532-ff655a2685ef/SPV_page2.csv?v=1681119363953");
};

const MARGIN = {
    "LEFT":50,
    "RIGHT":50,
    "TOP":50,
    "BOTTOM":50,
};

//dimension of our workspace
const   width  = 640,
        height = 400;

var _scatterPlot1; //define a global reference for barchart
var _scatterPlot2; //define a global reference for barchart
var _scatterPlot3; //define a global reference for barchart
var _scatterPlot4; //define a global reference for barchart
var _scatterPlot5; //define a global reference for barchart
var _scatterPlot6; //define a global reference for barchart

/**
 * This function loads the data and calls other necessary functions to create our visualization
 * @param dataPath - the path to your data file from the project's root folder
 */
let setup1 = function (dataPath) {
    var SVG1 = d3.select("#SVG_CONTAINER1");
    d3.csv(dataPath).then(function (d) {
    _scatterPlot1 = new scatterChart(d, SVG1);
    _scatterPlot1.draw();
    });
};

let setup2 = function (dataPath) {
    //defining an easy reference for out SVG Container
    var SVG2 = d3.select("#SVG_CONTAINER2");
    //Loading in our Data with D3
    d3.csv(dataPath).then(function (d) {
        //the data only exists within this scope
        //create a barchart object
        _scatterPlot2 = new scatterChart(d, SVG2);
        _scatterPlot2.draw();
    });

};

let setup3 = function (dataPath) {
    //defining an easy reference for out SVG Container
    var SVG3 = d3.select("#SVG_CONTAINER3");
    //Loading in our Data with D3
    d3.csv(dataPath).then(function (d) {
        //the data only exists within this scope
        //create a barchart object
        _scatterPlot3 = new scatterChart(d, SVG3);
        _scatterPlot3.draw();
    });

};

let setup4 = function (dataPath) {
    //defining an easy reference for out SVG Container
    var SVG4 = d3.select("#SVG_CONTAINER4");
    //Loading in our Data with D3
    d3.csv(dataPath).then(function (d) {
        //the data only exists within this scope
        //create a barchart object
        _scatterPlot4 = new scatterChart(d, SVG4);
        _scatterPlot4.draw();
    });

};

let setup5 = function (dataPath) {
    //defining an easy reference for out SVG Container
    var SVG5 = d3.select("#SVG_CONTAINER5");
    //Loading in our Data with D3
    d3.csv(dataPath).then(function (d) {
        //the data only exists within this scope
        //create a barchart object
        _scatterPlot5 = new scatterChart(d, SVG5);
        _scatterPlot5.draw();
    });

};

let setup6 = function (dataPath) {
    //defining an easy reference for out SVG Container
    var SVG6 = d3.select("#SVG_CONTAINER6");
    //Loading in our Data with D3
    d3.csv(dataPath).then(function (d) {
        //the data only exists within this scope
        //create a barchart object
        _scatterPlot6 = new scatterChart(d, SVG6);
        _scatterPlot6.draw();
    });

};

let checkNull = function(groupName)
{
  if(groupName >1)
    {
      return groupName
    }
  return groupName
}

/**
 * We define our barChart object here
 * @Param data - the data to be use for this bar chart
 * @Param svg - the svg where the bar chart will be drawn
 */
let scatterChart = function (data, svg) {
  
  
  //List of groups
      const allGroup = ["Forward", "Four", "All", "Rear" ];
      const dataReady = allGroup.map (function(grpName){
      return {
        name: grpName,
        values: data.map(function(d) {
          return {fuelScore: d["Fuel Economy"], value: checkNull(d[grpName]), recommended: d["Recommended " + grpName]};
        })
        };
      });
  
      // A color scale: one color for each group
      const myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

 console.log(dataReady)
 

  //AVERAGE ALL THE ANNUAL FUEL COSTS FOR EACH FUEL ECONOMY SCORE VALUE
 
    //creating the scales for our bar chart
    let xScale = d3.scaleLinear() //a band scale automatically determines sizes of objects based on amount of data and draw space
        .domain([1,10]) //amount of data
        .range([MARGIN.LEFT, width - MARGIN.RIGHT]) //draw space

    //the frequency of occurrence
    let yScale = d3.scaleLinear()   //a linear scale is simply a continuous linear growth axis
        .domain([0, 4000])      //the "input" that you want to map, essentially the extent of your numeric data
        .range([height-MARGIN.BOTTOM, MARGIN.TOP]);   //the "output" you map it to, basically the pixels on your screen

  

    //draws our barchart
    this.draw = function(){

        // A nice little rectangle to show our boundaries!
        svg.append("rect")
            .attr("width", (width - MARGIN.RIGHT) - MARGIN.LEFT)
            .attr("height", (height - MARGIN.BOTTOM) - MARGIN.TOP)
            .attr("x", MARGIN.LEFT)
            .attr("y", MARGIN.TOP)
            .attr("fill", "#1E1E1E");
      
        //creating a group for our barchart
        let chart = svg.append('g')
            .attr("class", "scatterPlot");
      
      
      //ADD LINES
       let line = d3.line()
      .x(d => xScale(+d.fuelScore))
      .y(d => yScale(+d.value))
       
    svg.selectAll("myLines")
      .data(dataReady)
      .join("path")
        .attr("class", function(d){ return d.name })
        .attr("d", function(d){ return line(d.values) })
        .attr("stroke", d => myColor(d.name))
        .style("stroke-width", 2)
        .style("fill", "none")
        
    // create a tooltip
    const Tooltip = d3.select("#EXPECTED")
      .style("opacity", 1)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("padding", "5px")
      .style ("color", "white")
      .style("background-color", "#525252")
      .style("border-radius", "8px")
      .style ("text-align", "center")
      // Three function that change the tooltip when user hover / move / leave a cell
      const mouseover = function(event,d) {
        Tooltip

          .style("opacity", 1)
      }
      const mousemove = function(event,d) {
        Tooltip
          .text("Cost "+d.value +"  Recommended Car: "+ d.recommended)
          .style("left", `${event.layerX+10}px`)
          .style("top", `${event.layerY}px`)
      }
      const mouseleave = function(event,d) {
        Tooltip
          .style("opacity", 1)
      }
  
      
  //ADD DOTS
  let circles = chart
      // First we need to enter in a group
      .selectAll("myDots")
      .data(dataReady)
      .join('g')
        .style("fill", d => myColor(d.name))
        .attr("class", function(d){ return d.name })
      // Second we need to enter in the 'values' part of this group
      .selectAll("myPoints")
      .data(d => d.values)
      .join("circle")
        .attr("cx", d => xScale(d.fuelScore))
        .attr("cy", d => yScale(d.value))
        .attr("r", 5)
        .attr("stroke", "white")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
      
       
    // ADD LEGEND INTERACTIVE
   let myLegend = chart
      .selectAll("myLegend")
      .data(dataReady)
      .join('g')
        .append("text")
          .attr('x', (d,i) => 30 + i*60)
          .attr('y', 30)
          .text(d => d.name)
          .style("fill", d => myColor(d.name))
          .style("font-size", "14px")
        .on("click", function(event,d){
          // is the element currently visible ?
          let currentOpacity = d3.selectAll("." + d.name).style("opacity")
          // Change the opacity: from 0 to 1 or from 1 to 0
          d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1)
         // d3.selectAll("." + d.name).transition().style("visibility", currentOpacity == 1 ? 0:1)
        })
   
   svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width-300 )
    .attr("y", height - 6)
    .text("Fuel Score (1-10)")
    .style("fill","white")
    .style("font-size", "12px")
      svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 0)
    .attr("x",-150)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Annual Cost ($)")
    .style("fill","white")
    .style("font-size", "12px")
        //create the render specifications for y axis
        var yAxis = d3.axisLeft()
            .scale(yScale);

        //draw the y axis on our chart
        chart.append("g")
            .attr("transform", "translate("+ MARGIN.LEFT + ","+ 0 +")")
            .call(yAxis);

        //create the render specifications for x axis
        var xAxis = d3.axisBottom()
            .scale(xScale);

        //draw the x axis on our chart
        chart.append("g")
            .attr("transform", "translate("+ 0 + ","+ (height-MARGIN.BOTTOM) +")")
            .attr("class", "xAxis")
            .call(xAxis);
    }; 
  
};

// Dataset information button
var more_btn = document.getElementById("more_btn");
  more_btn.addEventListener("click", function() {
    const section2 = document.querySelector('#s2');
    section2.scrollIntoView({ behavior: 'smooth' });
    //section2.classList.add("animate");
});

// Dataset information button
var more_btn = document.getElementById("less_btn");
  more_btn.addEventListener("click", function() {
    const section2 = document.querySelector('#s1');
    section2.scrollIntoView({ behavior: 'smooth' });
});

