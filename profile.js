// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {

    const notificationIcon = document.getElementById("notification");
    const dropdown = document.getElementById("notification-dropdown");
    
   // Toggle dropdown on click
   notificationIcon.addEventListener("click", function (event) {
    event.stopPropagation();
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
    if (!notificationIcon.contains(event.target)) {
        dropdown.style.display = "none";
    }
    });
  
      // Handle Chat Click
      const chatIcon = document.querySelector(".nav-item img[alt='💬']");
      if (chatIcon) {
          chatIcon.addEventListener("click", function () {
              alert("Redirecting to chat...");
              window.location.href = "../chat/chat.html"; // Change to the actual chat page
          });
      }

    // Select elements
    const profilePic = document.getElementById("profile-pic");
    const profilePicInput = document.getElementById("profile-pic-input");
    const editBtn = document.getElementById("edit-btn");
    const saveBtn = document.getElementById("save-btn");
    const profileForm = document.getElementById("profileForm");
    const inputs = document.querySelectorAll("#profileForm input");

    // Load saved profile data from localStorage
    function loadProfile() {
        const savedProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
        if (savedProfile.image) profilePic.src = savedProfile.image;
        inputs.forEach(input => {
            if (savedProfile[input.id]) input.value = savedProfile[input.id];
        });
    }

    // Profile Picture Upload
    profilePicInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePic.src = e.target.result;

                // Save image to local storage
                let userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
                userProfile.image = e.target.result;
                localStorage.setItem("userProfile", JSON.stringify(userProfile));
            };
            reader.readAsDataURL(file);
        }
    });

    // Enable Editing
    editBtn.addEventListener("click", function () {
        inputs.forEach(input => input.removeAttribute("disabled"));
        editBtn.style.display = "none";
        saveBtn.style.display = "block";
    });

    // Save Profile
    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const userProfile = { image: profilePic.src };
        inputs.forEach(input => userProfile[input.id] = input.value);
        localStorage.setItem("userProfile", JSON.stringify(userProfile));
        alert("Profile saved successfully!");
        saveBtn.style.display = "none";
        editBtn.style.display = "block";
        inputs.forEach(input => input.setAttribute("disabled", true));
    });

    // Load profile on page load
    loadProfile();
});
