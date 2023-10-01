// Print a message in the browser's dev tools console each time the page loads
// Use your menus or right-click / control-click and choose "Inspect" > "Console"
console.log("Hello 🌎");

// Onload Animation
window.addEventListener("load", function() {
  var content = document.querySelector(".wrapper");
  content.style.opacity = 1;
  content.style.transform = "translateY(0)";
});

// Page 1 Button
var p1_btn = document.getElementById("p1_btn");
p1_btn.addEventListener("click", function() {
  window.location.href = "Page1.html";
});

// Page 2 Button
var p2_btn = document.getElementById("p2_btn");
p2_btn.addEventListener("click", function() {
  window.location.href = "Page2.html";
});

// Page 3 Button
var p3_btn = document.getElementById("p3_btn");
p3_btn.addEventListener("click", function() {
  window.location.href = "Page3.html";
});

// Page 4 Button
var p4_btn = document.getElementById("p4_btn");
p4_btn.addEventListener("click", function() {
  window.location.href = "Page4.html";
});

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

























// ----- GLITCH STARTER PROJECT HELPER CODE -----

// Open file when the link in the preview is clicked
let goto = (file, line) => {
  window.parent.postMessage(
    { type: "glitch/go-to-line", payload: { filePath: file, line: line } }, "*"
  );
};
// Get the file opening button from its class name
const filer = document.querySelectorAll(".fileopener");
filer.forEach((f) => {
  f.onclick = () => { goto(f.dataset.file, f.dataset.line); };
});
