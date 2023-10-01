console.log("Hello from P3");

let d3 = window.d3;

//dimension of our workspace
var width = 750,
  height = 500;

const MARGIN = {
  LEFT: 100,
  RIGHT: 50,
  TOP: 50,
  BOTTOM: 50,
};

// Onload Animation
window.addEventListener("load", function () {
  var content = document.querySelector(".wrapper");
  content.style.opacity = 1;
  content.style.transform = "translateY(0)";
});

// Onload function
window.onload = function () {
  setup("database.csv");
};

// Back Button
var back_btn = document.getElementById("back_btn");
back_btn.addEventListener("click", function () {
  window.location.href = "index.html";
});

// Data Setup function
setup = function (dataPath) {
  //defining an easy reference for out SVG Container
  let svg = d3.select("#SVG_CONTAINER");

  //Loading in our Data with D3
  d3.csv("database.csv", function (data) {
    //create a barchart object
    let lineChart = new linePlot(data, svg);
  });
};

// X-Axis Filter
const xFilter = document.getElementById("x_axis_filter");
let xAxisSelect = xFilter.value;

// Y-Axis Filter
const yFilter = document.getElementById("y_axis_filter");
let yAxisSelect = yFilter.value;

// X Axis filter listener
xFilter.addEventListener("change", function () {
  xAxisSelect = xFilter.value;
  setup("database.csv");
});

// Y Axis filter listener
yFilter.addEventListener("change", function () {
  yAxisSelect = yFilter.value;
  setup("database.csv");
});

// Line plot
let linePlot = function (data, svg) {
  // Clear SVG
  d3.select("svg").selectAll("*").remove();

  let filteredData = data.filter((d) => {
    if (
      d[yAxisSelect] != null &&
      d[xAxisSelect] != null &&
      d[yAxisSelect] != "" &&
      d[xAxisSelect] != ""
    ) {
      if (
        ["Engine Cylinders", "Engine Displacement", "Drive"].includes(
          xAxisSelect
        )
      ) {
        return !isNaN(parseFloat(d[xAxisSelect]));
      } else {
        return true;
      }
    }
    return false;
  });

  let xScale;
  let yScale;
  height = 400;
  width = 750;
  let chart = svg.append("g").attr("class", "line");

  // Save or Spend Y-Axis
  if (yAxisSelect == "Save or Spend (5 Year)") {
    yScale = d3
      .scaleLinear()
      .domain([
        d3.min(filteredData, (d) => parseFloat(d[yAxisSelect]) + 6000) - 0.1,
        d3.max(filteredData, (d) => parseFloat(d[yAxisSelect])) + 0.1,
      ])
      .range([height - MARGIN.BOTTOM, MARGIN.TOP]);
  }

  // Annual Fuel Cost (FT1) Y-Axis
  else if (yAxisSelect == "Annual Fuel Cost (FT1)") {
    height= 400;
    yScale = d3
      .scaleLinear()
      .domain([
        -10,
        d3.max(filteredData, (d) => parseFloat(d[yAxisSelect])) -1000 + 0.1,
      ])
      .range([height - MARGIN.BOTTOM, MARGIN.TOP]);
  }
  
  // Annual Fuel Cost (FT2) Y-Axis
  else if (yAxisSelect == "Annual Fuel Cost (FT2)") {
    height= 400;
    yScale = d3
      .scaleLinear()
      .domain([
        -100,
        d3.max(filteredData, (d) => parseFloat(d[yAxisSelect])) + 0.1,
      ])
      .range([height - MARGIN.BOTTOM, MARGIN.TOP]);
  }
  
  // Fuel Economy Y-Axis
  else if (yAxisSelect == "Combined MPG (FT1)") {
    yScale = d3.scaleLinear()
      .domain([0, 120])
      .range([height - MARGIN.BOTTOM, MARGIN.TOP]);
  }  

  let yAxis = d3.axisLeft().scale(yScale);

  chart
    .append("g")
    .attr("transform", `translate(${MARGIN.LEFT},0)`)
    .attr("class", "yAxis")
    .call(yAxis)
    .selectAll("text")
    .style("fill", "#ffffff");
  

  // Engine Cylinders X Axis
  if (xAxisSelect == "Engine Cylinders") {
    xScale = d3
      .scaleBand()
      .domain(
        filteredData
          .filter((d) => d[xAxisSelect])
          .map((d) => parseFloat(d[xAxisSelect]))
          .sort((a, b) => a - b)
      )
      .range([MARGIN.LEFT, width - MARGIN.RIGHT])
      .padding(1);

    //Add axis to plot
    let xAxis = d3.axisBottom().ticks(20).scale(xScale);
    chart
      .append("g")
      .attr("transform", "translate(0," + yScale(0) + ")")
      .attr("class", "xAxis")
      .call(xAxis)
      .selectAll("text")
      .style("fill", "#ffffff");
  }

  // Engine Displacement X Axis
  else if (xAxisSelect == "Engine Displacement") {
    xScale = d3
      .scaleLinear()
      .domain([
        d3.min(filteredData, (d) => parseFloat(d[xAxisSelect])) - 0.05,
        d3.max(filteredData, (d) => parseFloat(d[xAxisSelect])) + 0.1,
      ])
      .range([MARGIN.LEFT, width - MARGIN.RIGHT]);

    //Add axis to plot
    let xAxis = d3.axisBottom().ticks(20).scale(xScale);
    chart
      .append("g")
      .attr("transform", "translate(0," + yScale(0) + ")")
      .attr("class", "xAxis")
      .call(xAxis)
      .selectAll("text")
      .style("fill", "#ffffff");
  }

  // Fuel Type X Axis
  else if (xAxisSelect == "Fuel Type") {
    xScale = d3
      .scaleBand()
      .domain(filteredData.map((d) => d[xAxisSelect]))
      .range([MARGIN.LEFT, width - MARGIN.RIGHT])
      .padding(1);

    //Add axis to plot
    let xAxis = d3.axisBottom().ticks(20).scale(xScale);
    chart
      .append("g")
      .attr("transform", "translate(0," + yScale(0) + ")")
      .attr("class", "xAxis")
      .call(xAxis)
      .selectAll("text")
      .style("fill", "#ffffff")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-90) translate(-20, -14)");
  }

  // Transmission X Axis
  else if (xAxisSelect == "Transmission") {
    //Filter dataset more
    filteredData = data.filter((d) => {
      return (
        (d[xAxisSelect].includes("Automatic") &&
          d[xAxisSelect].includes("Speed")) ||
        d[xAxisSelect].includes("Manual")
      );
    });

    xScale = d3
      .scaleBand()
      .domain(filteredData.map((d) => d[xAxisSelect]))
      .range([MARGIN.LEFT, width - MARGIN.RIGHT])
      .padding(1);

    //Add axis to plot
    let xAxis = d3.axisBottom().ticks(20).scale(xScale);
    chart
      .append("g")
      .attr("transform", "translate(0," + yScale(0) + ")")
      .attr("class", "xAxis")
      .call(xAxis)
      .selectAll("text")
      .style("fill", "#ffffff")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-90) translate(-20, -13)");
  }

  // Drive X Axis
  else if (xAxisSelect == "Drive") {
    xScale = d3
      .scaleBand()
      .domain(filteredData.map((d) => d[xAxisSelect]))
      .range([MARGIN.LEFT, width - MARGIN.RIGHT])
      .padding(1);

    //Add axis to plot
    let xAxis = d3.axisBottom().ticks(20).scale(xScale);
    chart
      .append("g")
      .attr("transform", "translate(0," + yScale(0) + ")")
      .attr("class", "xAxis")
      .call(xAxis)
      .selectAll("text")
      .style("fill", "#ffffff");
  }

  chart.selectAll("path").style("stroke", "#ffffff");
  chart.selectAll(".tick line").style("stroke", "#ffffff");

  // Calculate the Average Y per X
  const avgData = d3
    .nest()
    .key((d) => d[xAxisSelect])
    .rollup((v) => d3.mean(v, (d) => +d[yAxisSelect]))
    .entries(filteredData)
    .sort((a, b) => a.key - b.key);

  // X Axis is Numeric
  if (
    xAxisSelect == "Engine Cylinders" ||
    xAxisSelect == "Engine Displacement"
  ) {
    // Plot Scatter Points on Plot
    chart
      .selectAll(".dot")
      .data(avgData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(parseFloat(d.key)))
      .attr("cy", (d) => yScale(parseFloat(d.value)))
      .attr("r", 0)
      .style("fill", "steelblue");

    // Animate circles to grow from radius 0 to 2
    chart.selectAll("circle").transition().duration(500).attr("r", 4);
    
    chart
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 3)
      .attr("d", function () {
        return d3
          .line()
          .x((d) => xScale(parseFloat(d.key)))
          .y((d) => yScale(d.value))(avgData);
      })
      .transition()
      .duration(800)
      .attrTween("stroke-dasharray", function () {
        var len = this.getTotalLength();
        return function (t) {
          return d3.interpolateString("0," + len, len + ",0")(t);
        };
      });
        
    // Append x-axis label
    chart
      .append("text")
      .attr("transform", "translate(" + (width+40) + " ," + (yScale(0)+5) + ")")
      .style("text-anchor", "middle")
      .style("fill", "#ffffff")
      .attr("opacity", 0)
      .text(xAxisSelect);

    chart
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 15)
      .attr("x", -(height/2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", "#ffffff")
      .attr("opacity", 0)
      .text(yAxisSelect);
    
    // Animate labels
    chart.selectAll("text").transition().duration(500).attr("opacity", 1);

  }
  
  // X Axis is Non-Numeric
  else {
    // Plot Scatter Points on Plot
    chart
      .selectAll(".dot")
      .data(avgData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.key))
      .attr("cy", (d) => yScale(parseFloat(d.value)))
      .attr("r", 0)
      .style("fill", "steelblue");
    
    // Animate circles to grow from radius 0 to 2
    chart.selectAll("circle").transition().duration(1000).attr("r", 4);

    // Plot Line connecting points
    chart
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 3)
      .attr("d", function () {
        return d3
          .line()
          .x((d) => xScale(d.key))
          .y((d) => yScale(d.value))(avgData);
      })
      .transition()
      .duration(800)
      .attrTween("stroke-dasharray", function () {
        var len = this.getTotalLength();
        return function (t) {
          return d3.interpolateString("0," + len, len + ",0")(t);
        };
      });
    
    // Append x-axis label
    chart
      .append("text")
      .attr("transform", "translate(" + (width+40) + " ," + (yScale(0)+5) + ")")
      .style("text-anchor", "middle")
      .style("fill", "#ffffff")
      .attr("opacity", 0)
      .text(xAxisSelect);

    chart
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 15)
      .attr("x", -(height/2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("fill", "#ffffff")
      .attr("opacity", 0)
      .text(yAxisSelect);
    
    // Animate labels
    chart.selectAll("text").transition().duration(1000).attr("opacity", 1);
  }
};

// Filter Data
// let filteredData = data.filter(
//   (d) =>
//     d[yAxisSelect] != null &&
//     d[xAxisSelect] != null &&
//     d[yAxisSelect] != "" &&
//     d[xAxisSelect] != "" &&
//     !isNaN(d[xAxisSelect])
// );

// // create path element
// chart
//   .append("path")
//   .attr("fill", "none")
//   .attr("stroke", "steelblue")
//   .attr("stroke-width", 2)
//   .attr("d", function () {
//     return d3
//       .line()
//       .x((d) => xScale(parseFloat(d["Engine Cylinders"])))
//       .y((d) => yScale(parseFloat(d["Save or Spend (5 Year)"])))(filteredData);
//   });

//TODO: Create the circles in the scatter plot
// let circles = chart
//   .selectAll("circle")
//   .data(filteredData)
//   .enter()
//   .append("circle")
//   .attr("class", (d) => d["Engine Cylinders"])
//   .attr("cx", (d, i) => xScale(i))
//   .attr("cy", (d) => yScale(d["Save or Spend (5 Year)"]))
//   .attr("r", 5)
//   .attr("fill", "steelblue");

// Plot Line connecting points
// chart
//   .append("path")
//   .attr("fill", "none")
//   .attr("stroke", "steelblue")
//   .attr("stroke-width", 2)
//   .attr("d", function () {
//     return d3
//       .line()
//       .x((d) => xScale(parseFloat(d.key)))
//       .y((d) => yScale(d.value))(avgData);
//   });

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

