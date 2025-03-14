function searchCampaigns() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const campaigns = document.querySelectorAll('.campaign-box');
    campaigns.forEach(campaign => {
      const platform = campaign.getAttribute('data-platform').toLowerCase();
      const theme = campaign.getAttribute('data-theme').toLowerCase();
      if (platform.includes(input) || theme.includes(input)) {
        campaign.style.display = 'block';
      } else {
        campaign.style.display = 'none';
      }
    });
}

function showCampaignDetails(button) {
    const campaign = button.parentElement;
    
    const title = encodeURIComponent(campaign.querySelector('h3').innerText);
    const type = encodeURIComponent(campaign.getAttribute('data-type')) || "Not specified";
    const duration = encodeURIComponent(campaign.getAttribute('data-duration')) || "Not specified";
    const content = encodeURIComponent(campaign.getAttribute('data-content')) || "Not specified";
    const salary = encodeURIComponent(campaign.getAttribute('data-salary')) || "Not specified";
    
    window.location.href = `campaign-details.html?title=${title}&type=${type}&duration=${duration}&content=${content}&salary=${salary}`;
}
