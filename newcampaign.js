// Wait for DOM to load before running script
document.addEventListener('DOMContentLoaded', function () {

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
 
     // Handle Profile Click
     const profileIcon = document.querySelector(".nav-item img[alt='👤']");
     if (profileIcon) {
         profileIcon.addEventListener("click", function () {
             alert("Opening profile...");
             window.location.href = "/profile.html"; // Change to the actual profile page
         });
     }
    
    // Get form elements
    const form = document.getElementById('campaignForm');
    const platformSelect = document.getElementById('platform');
    const imageInput = document.getElementById('campaign-image');

    // Create an image preview section
    const imagePreview = document.createElement('img');
    imagePreview.style.display = 'none';
    imagePreview.style.maxWidth = '100%';
    imagePreview.style.marginTop = '10px';
    imageInput.parentElement.appendChild(imagePreview);

    // Event listener for image preview
    imageInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.style.display = 'none';
        }
    });

    // Handle form submission
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent page reload

        // Get form values
        const name = document.getElementById('campaign-name').value;
        const audience = document.getElementById('target-audience').value;
        const requirements = document.getElementById('requirements').value;
        const platforms = Array.from(platformSelect.selectedOptions).map(option => option.value);
        const imageFile = imageInput.files[0];

        // Check if all required fields are filled
        if (!name || !audience || !requirements || platforms.length === 0) {
            alert("Please fill all required fields!");
            return;
        }

        // Store campaign data
        const campaignData = {
            name,
            platforms,
            audience,
            requirements,
            image: imageFile ? imageFile.name : "No image uploaded"
        };

        // Save to local storage for now (replace with API call for backend)
        let campaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
        campaigns.push(campaignData);
        localStorage.setItem('campaigns', JSON.stringify(campaigns));

        console.log("Campaign Saved:", campaignData);
        alert("Campaign submitted successfully!");

        // Reset form
        form.reset();
        imagePreview.style.display = 'none';
    });

});
