let popup = document.getElementById("loginPage");

let button = document.getElementById("loginButton");

let span = document.getElementById("closeButton");

//when user clicks on login
button.onclick = function() {
    popup.style.display = "block";
}

//if the user clicks on X
span.onclick = function() {
    popup.style.display = "none";
}