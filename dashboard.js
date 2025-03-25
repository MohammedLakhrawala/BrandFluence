// Wait for the DOM to load before running the script
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

    // Handle Profile Click
    const profileIcon = document.querySelector(".nav-item img[alt='👤']");
    if (profileIcon) {
        profileIcon.addEventListener("click", function () {
            alert("Opening profile...");
            window.location.href = "profile.html"; // Change to the actual profile page
        });
    }

    // Search Functionality for Influencers
    const searchBar = document.querySelector(".search-bar");
    if (searchBar) {
        searchBar.addEventListener("input", function () {
            const query = searchBar.value.toLowerCase();
            const influencers = document.querySelectorAll(".influencer-card");

            influencers.forEach(influencer => {
                const nameElement = influencer.querySelector(".influencer-name");
                if (nameElement) {
                    const name = nameElement.textContent.toLowerCase();
                    influencer.style.display = name.includes(query) ? "block" : "none";
                }
            });
        });
    }

    // Handle Campaign "Check" Button Clicks
    document.querySelectorAll(".apply-btn").forEach(button => {
        button.addEventListener("click", function () {
            alert(`You clicked: ${this.closest(".campaign-card")?.querySelector(".campaign-title")?.textContent || "Unknown Campaign"}`);
        });
    });

    // Handle Influencer "Reach" Button Clicks
    document.querySelectorAll(".influencer-card .apply-btn").forEach(button => {
        button.addEventListener("click", function () {
            alert(`Reaching out to: ${this.closest(".influencer-card")?.querySelector(".influencer-name")?.textContent || "Unknown Influencer"}`);
        });
    });

});
