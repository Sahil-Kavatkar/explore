var loader = document.getElementById("loader");

window.addEventListener("load", function() {
    setTimeout(function() {
        loader.style.display = "none";
    }, 2000);  // Adjust the delay time in milliseconds (1000ms = 1 second)
});