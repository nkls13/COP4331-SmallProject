
let popUp = document.getElementById("registerPage");

let registerButton = document.getElementById("registerButton");

let closeButton = document.getElementById("closeButton");

registerButton.onclick = function() {
    popUp.style.display = "block";
}

closeButton.onclick = function() {
    popUp.style.display = "none";
}