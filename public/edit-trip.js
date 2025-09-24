const editTripBtn = document.getElementById("editTripBtn");
const cancelTripBtn = document.getElementById("cancelTripBtn");
const viewTrip = document.getElementById("viewTrip");
const editTripForm = document.getElementById("editTripForm");

editTripBtn.addEventListener("click", () => {
    editTripBtn.style.display = "none";
    cancelTripBtn.style.display = "block";
    editTripForm.style.display = "block";
    viewTrip.style.display = "none";
});

cancelTripBtn.addEventListener("click", () => {
    editTripBtn.style.display = "block";
    cancelTripBtn.style.display = "none";
    editTripForm.style.display = "none";
    viewTrip.style.display = "block";
});