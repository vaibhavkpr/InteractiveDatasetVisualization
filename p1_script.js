console.log("Hello from P1");

// Global Vars (Set to their initial defaults)
var classSelect = 1;

var vehicleTypes = ["Minicompact", "Midsize", "Two Seaters", "Sport Utility", "Truck", "Van", "Special"];
var yAxisToggle = ["City MPG (FT1)", "Highway MPG (FT1)"]

// Plot Axis
var xAxisSelect = "Drive";
var yAxisSelect = yAxisToggle[0];

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
  
  // Create Vehicle Class Filter
  createClassFilter();
  setup();
});

// Data Setup function
setup = function (dataPath) {
  //defining an easy reference for out SVG Container
  let svg = d3.select("#BAR_CONTAINER");

  //Loading in our Data with D3
  d3.csv("database.csv", function (data) {
    //create a barchart object
    let barChart = new barPlot(data, svg);
  });
};

// Vehicle Class Filter Creation
let createClassFilter = function () {
  // Vehicle Class Filter Assets
  var hatchBtnImg =
    "https://cdn.glitch.global/c035c5b7-ccec-41fe-8532-ff655a2685ef/HatchbackClassBtn.svg?v=1679340985230";
  var sedanBtnImg =
    "https://cdn.glitch.global/c035c5b7-ccec-41fe-8532-ff655a2685ef/SedanClassBtn.svg?v=1679340989241";
  var sportsBtnImg =
    "https://cdn.glitch.global/c035c5b7-ccec-41fe-8532-ff655a2685ef/SportsClassBtn.svg?v=1681622983371";
  var suvBtnImg =
    "https://cdn.glitch.global/c035c5b7-ccec-41fe-8532-ff655a2685ef/SuvClassBtn.svg?v=1679341016699";
  var truckBtnImg =
    "https://cdn.glitch.global/c035c5b7-ccec-41fe-8532-ff655a2685ef/TruckClassBtn.svg?v=1679341020443";
  var vanBtnImg =
    "https://cdn.glitch.global/c035c5b7-ccec-41fe-8532-ff655a2685ef/VanClassBtn.svg?v=1679341026427";
  var classFilterBtns = [
    hatchBtnImg,
    sedanBtnImg,
    sportsBtnImg,
    suvBtnImg,
    truckBtnImg,
    vanBtnImg,
  ];

  // Get Filter div
  var filterDiv = document.getElementById("class_filter");

  // Add Filter Title
  var filterTitle = document.createElement("span");
  filterTitle.setAttribute("id", "classFilterTitle");
  filterTitle.setAttribute("class", "vehicleClassTitle");
  filterTitle.textContent = "Vehicle Class";
  filterDiv.appendChild(filterTitle);

  // Create container for Vehicle Class buttons
  const buttonsDiv = document.createElement("div");
  buttonsDiv.setAttribute("id", "class_filter_btns");
  buttonsDiv.setAttribute("class", "cardHolder");

  // Create button for each Vehicle Class
  for (var i = 0; i < classFilterBtns.length; i++) {
    const button = document.createElement("button");
    button.classList.add("vehicleClassBtn");
    button.id = "classBtn" + (i + 1);
    const img = document.createElement("img");
    img.src = classFilterBtns[i];
    button.appendChild(img);

    // Set the first button to be selected by default
    if (button.id == "classBtn1") {
      button.classList.add("active");
    }

    // Click function: Assign selected button to active and update CSS
    button.addEventListener("click", function () {
      var lastSelectedClass = classSelect;
      classSelect = button.id[8];
      button.classList.add("active");
      console.log(button.id + " is now active");

      // Remove active from last selected if it has it
      var btn = document.getElementById(
        "classBtn" + lastSelectedClass.toString()
      );
      if (btn != null && classSelect != lastSelectedClass) {
        if (btn.classList.contains("active")) {
          var btn = document.getElementById(
            "classBtn" + lastSelectedClass.toString()
          );
          btn.classList.remove("active");
        }
      }
      setup("database.csv");
    });
    // Add the buttons to the buttons div
    buttonsDiv.appendChild(button);
  }
  // Add the buttons to the filter div
  filterDiv.appendChild(buttonsDiv);
};

// Back Button
var back_btn = document.getElementById("back_btn");
back_btn.addEventListener("click", function () {
  window.location.href = "index.html";
});

// City Button
var toggle1 = document.getElementById("city");
toggle1.addEventListener("click", function () {
  toggle1.style.background = "#69b3a2";
  toggle2.style.background = "black";
  yAxisSelect = yAxisToggle[0];
  setup("database.csv");
});

// Highway Button
var toggle2 = document.getElementById("highway");
toggle2.addEventListener("click", function () {
  toggle2.style.background = "#69b3a2";
  toggle1.style.background = "black";
  yAxisSelect = yAxisToggle[1];
  setup("database.csv");
});


// Make the Barplot
let barPlot = function (data, svg) {
  
  // Clear SVG
  d3.select("svg").selectAll("*").remove();
  
  // // Filter Data
  // let filteredData = data.filter((d) => {
  //   // Remove Null or Empty Values
  //   d[yAxisSelect] != null &&
  //   d[xAxisSelect] != null &&
  //   d[yAxisSelect] != "" &&
  //   d[xAxisSelect] != ""
  // });

  let xScale;
  let yScale;
  height = 380;
  width = 700;
  
  let chart = svg.append("g").attr("class", "bar");
  
  yScale = d3.scaleLinear()
    .domain([0, 40])
    .range([height - MARGIN.BOTTOM, MARGIN.TOP]);

  let yAxis = d3.axisLeft().scale(yScale);

  chart
    .append("g")
    .attr("transform", `translate(${MARGIN.LEFT},0)`)
    .attr("class", "yAxis")
    .call(yAxis)
    .selectAll("text")
    .style("fill", "#ffffff");
  
  // Filter the data for selected vehicle class
  let filteredData = data.filter((d) => {
    return (
      d[yAxisSelect] != null &&
      d[xAxisSelect] != null &&
      d[yAxisSelect] != "" &&
      d[xAxisSelect] != "" &&
      (d["Class"].includes(vehicleTypes[classSelect]))
    );
  });
  
  // Average Data
  const avgData = d3
    .nest()
    .key((d) => d[xAxisSelect])
    .rollup((v) => d3.mean(v, (d) => +d[yAxisSelect]))
    .entries(filteredData)
    .sort((a, b) => a.key - b.key);

  // X Axis
  xScale = d3
    .scaleBand()
    .domain(filteredData.map((d) => d[xAxisSelect]))
    .range([MARGIN.LEFT, width - MARGIN.RIGHT])
    .padding(1);

  //Add axis to plot
  let xAxis = d3.axisBottom().scale(xScale);
  chart
    .append("g")
    .attr("transform", "translate(0," + yScale(0) + ")")
    .attr("class", "xAxis")
    .call(xAxis)
    .selectAll("text")
    .style("fill", "#ffffff")
    .style("text-anchor", "end")
    .attr("transform", "rotate(-45) translate(-15, -4)");
  
  // Format colors of axis
  chart.selectAll("path").style("stroke", "#ffffff");
  chart.selectAll(".tick line").style("stroke", "#ffffff");
  
  
  
  // Here --------------------------------------------------------------------DRAWING THROUGH TEMPLATE CODE
  // var u = svg.selectAll("rect")
  //   .data(avgData);
  // u
  //   .enter()
  //   .append("rect")
  //   .merge(u)
  //   .attr("x", function(d) { return xScale(d.key); })
  //   .attr("y", function(d) { return yScale(parseFloat(d.value)); })
  //   .attr("width", 10)
  //   .transition()
  //   .duration(1000)
  //   .attr("height", function(d) { return (height - yScale(parseFloat(d.value) - 5.8)); })
  //   .attr("fill", "#69b3a2");
  console.log(avgData);
  
  var u = svg.selectAll("rect")
    .data(avgData);
  u
    .enter()
    .append("rect")
    .merge(u)
    .attr("x", function(d) { return (xScale(d.key) - 20); })
    .attr("y", function(d) { return yScale(0); }) 
    .attr("width", 40)
    .transition()
    .duration(1000)
    .attr("y", function(d) { return yScale(parseFloat(d.value)); })
    .attr("height", function(d) { return (height - yScale(parseFloat(d.value))- 50); })
    .attr("fill", "#69b3a2");

    // Append x-axis label
    chart
      .append("text")
      .attr("transform", "translate(" + (width+20) + " ," + (yScale(0)+5) + ")")
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

