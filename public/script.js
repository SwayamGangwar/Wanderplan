const editBtn = document.getElementById("editBtn");
const cancelBtn = document.getElementById("cancelBtn");
const profileView = document.getElementById("profileView");
const profileForm = document.getElementById("profileForm");

//To toggle between view mode and edit mode in profile
editBtn.addEventListener("click", () => {
    profileForm.style.display = "block";
    profileView.style.display = "none";
    editBtn.style.display = "none";
    cancelBtn.style.display = "inline-block";
});

cancelBtn.addEventListener("click", () => {
    profileView.style.display = "block";
    profileForm.style.display = "none";
    cancelBtn.style.display = "none";
    editBtn.style.display = "inline-block";
});


//Checking Email format 
function validateEmail() {
    const email = document.getElementById("email").value;
    const emailMsg = document.getElementById("emailError");
    const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

    if(!regex.test(email)) {
        emailMsg.textContent = "Please enter a valid email address";
        return false;
    }
    return true;
}


//Password hide feature
function togglePassword() {
    const pass = document.getElementById("password");
    const toggleBtn = document.getElementById("toggleBtn");

   if(pass.type === "password"){
    pass.type = "text";
   } else {
    pass.type = "password";
   }
}

//validate add trip form
function validateForm() {
    let isValid = true;

    // Date validation
    const startDate = new Date(document.getElementById("startDate").value);
    const endDate = new Date(document.getElementById("endDate").value);
    const dateErrorMsg = document.getElementById("dateError");

    if (endDate < startDate) {
        dateErrorMsg.textContent = "*End date must be after Start date*";
        isValid = false;
    } else {
        dateErrorMsg.textContent = "";
    }

    // Budget validation
    const budget = Number(document.getElementById("budget").value);
    const budgetErrorMsg = document.getElementById("budgetError");

    if (isNaN(budget) || budget <= 0) {
        budgetErrorMsg.textContent = "*Budget must be greater than 0*";
        isValid = false;
    } else {
        budgetErrorMsg.textContent = "";
    }

    return isValid; // if both the condition get satisfied, then only it will run
}


