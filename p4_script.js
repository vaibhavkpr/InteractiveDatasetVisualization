console.log("Hello from P4");
let d3 = window.d3;

// Onload Animation
window.addEventListener("load", function () {
  var content = document.querySelector(".wrapper");

  content.style.opacity = 1;
  content.style.transform = "translateY(0)";
  setup(
    "https://cdn.glitch.global/c035c5b7-ccec-41fe-8532-ff655a2685ef/page_4.csv?v=1681556178123"
  );
});

// Back Button
var back_btn = document.getElementById("back_btn");
back_btn.addEventListener("click", function () {
  window.location.href = "index.html";
});

//--------------------------------------------------------------------------------------------------------------------------

//SLIDER DETAILS
var slider = document.getElementById("myRange");
var output = document.getElementById("rangeValue");
output.innerHTML = parseInt(slider.value) + 1984; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
  output.innerHTML = parseInt(this.value) + 1984;
  //Add the code to recalculate the piechart on slider input!!!
  //  update(data2);
  _pieChart = new pieChart(dataDivide[this.value], svg);
};

//---------------------------------------------------------------------------------------------------------------------------
//DATABASE PARSING
var make1, make2, make3;
// create 2 data_set
//var data1 = {a: 9, b: 20, c:30, d:8, e:12}
//var data2 = {a: 6, b: 16, c:20, d:14, e:19,f:10}
var _pieChart;
// set the dimensions and margins of the graph
const width = 450,
  height = 450,
  margin = 40;

const svg = d3
  .select("#PIE_CONTAINER")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${width / 2}, ${height / 2})`);

var color = d3
  .scaleOrdinal()
  .domain(["a", "b", "c", "d", "e", "f"])
  .range(d3.schemeDark2);

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin;

var dataDivide = [],
  i,
  chunk = 5;
//SETUP FUNCTION FOR DATABASE AND DRAWING PIECHART
let setup = function (dataPath) {
  d3.csv(dataPath).then(function (d) {
    for (i = 0; i < d.length; i += chunk) {
      dataDivide.push(d.slice(i, i + chunk));
    }
    console.log(dataDivide[0]);

    _pieChart = new pieChart(dataDivide[0], svg); // pass in 1984 slice for the data
  });
};

let pieChart = function (data, svg) {
  const pie = d3
    .pie()
    .value((d) => {
      console.log(d[1]["Count"]);
      return d[1]["Count"];
    })
    .sort(function (a, b) {
      return d3.ascending(a.key, b.key);
    }); // This make sure that group order remains the same in the pie chart

  const data_ready = pie(Object.entries(data));

  // map to data
  const u = svg.selectAll("path").data(data_ready);

  u.join("path")
    .attr("d", d3.arc().innerRadius(0).outerRadius(radius))
    .attr("fill", function (d) {
      return color(d.data[0]);
    })
    .attr("stroke", "#1e1e1e")
    .style("stroke-width", "2px")
    .style("opacity", 1);

  svg
    .selectAll("text")
    .data(data_ready)
    .join("text")
    .transition()
    .duration(1000)
    .text(function (d) {
      return d.data[1]["Make"];
    })
    .attr("transform", function (d) {
      return `translate(${d3
        .arc()
        .innerRadius(0)
        .outerRadius(radius)
        .centroid(d)})`;
    })
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .style("z-index", 100)
  /*  .on("mouseover", function (d) {
      d3.select(this)
        .select("text")
        .text(function (d) {
          return "fuck me";
        });
    });*/
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

