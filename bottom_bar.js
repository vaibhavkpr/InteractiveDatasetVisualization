console.log("BottomBar Initialized");

// Global Vars (Set to their initial defaults)
var selectedVehicleClass = 1;
var selectedVehicleMake = 1;
var dataset;
var carMakes = [];


// Onload Animation
window.addEventListener("load", function () {  
  var content = document.querySelector(".wrapper");
  content.style.opacity = 1;
  content.style.transform = "translateY(0)";
  setupBar();
});


let setupBar = function () {
  // Create Vehicle Class Filter
  createClassFilter();
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
  var spvBtnImg =
    "https://cdn.glitch.global/c035c5b7-ccec-41fe-8532-ff655a2685ef/SpvClassBtn.svg?v=1679341011116";
  var classFilterBtns = [
    hatchBtnImg,
    sportsBtnImg,
    suvBtnImg,
    truckBtnImg,
    vanBtnImg,
    spvBtnImg,
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
      
      //hide previous container
      d3.select("#SVG_CONTAINER" + selectedVehicleClass)
      .style("visibility", "hidden")
      .style("z-index", -1);
      
      var lastSelectedClass = selectedVehicleClass;
      selectedVehicleClass = button.id[8];
      button.classList.add("active");
      console.log(button.id + " is now active");

      // Remove active from last selected if it has it
      var btn = document.getElementById(
        "classBtn" + lastSelectedClass.toString()
      );
      if (btn != null && selectedVehicleClass != lastSelectedClass) {
        if (btn.classList.contains("active")) {
          var btn = document.getElementById(
            "classBtn" + lastSelectedClass.toString()
          );
          btn.classList.remove("active");
        }
      }
      
      // show new container
      d3.select("#SVG_CONTAINER" + selectedVehicleClass)
      .style("visibility", "visible")
      .style("z-index", 100);
    
    
    });
    // Add the buttons to the buttons div
    buttonsDiv.appendChild(button);
  }
  // Add the buttons to the filter div
  filterDiv.appendChild(buttonsDiv);
};



