console.log("connected to main.js as well")


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
//this logic is OK as a user can't get to the edit page without loggin in.
var btn = document.getElementById("delBtn")
if (!btn) {var btn = document.getElementById("logBtn");}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
