// Load CSV and populate custom dropdown
async function loadTeams() {
    const response = await fetch('data/nba_teams.csv');
    const data = await response.text();
    const rows = data.trim().split('\n');
    const headers = rows[0].split(',');
  
    const teamList = rows.slice(1).map(row => {
      const cells = row.split(',');
      return Object.fromEntries(headers.map((h, i) => [h.trim(), cells[i].trim()]));
    });
  
    const dropdown = document.getElementById('teamDropdown');
    const selectedDiv = document.getElementById('selectedTeam');
  
    teamList.forEach(team => {
      const div = document.createElement('div');
      div.classList.add('dropdown-item');
      div.innerHTML = `
        <img src="${team.image_url}" alt="${team.team_name}" style="height:20px; vertical-align:middle; margin-right:10px;">
        ${team.team_name}
      `;
      div.addEventListener('click', () => {
        selectedDiv.innerHTML = `<img src="${team.image_url}" alt="${team.team_name}" style="height:20px; vertical-align:middle; margin-right:10px;"> ${team.team_name}`;
        document.getElementById('teamTitle').textContent = team.team_name;
        document.getElementById('teamLogoContainer').innerHTML = `<img src="${team.image_url}" alt="${team.team_name}" style="height:60px;">`;
        dropdown.classList.add('hidden');
        console.log('Selected team ID:', team.team_id);
      });
      dropdown.appendChild(div);
    });
  
    selectedDiv.addEventListener('click', () => {
      dropdown.classList.toggle('hidden');
    });
  
    // Close dropdown if clicked outside
    document.addEventListener('click', function(event) {
      if (!event.target.closest('.custom-dropdown')) {
        dropdown.classList.add('hidden');
      }
    });
  }
  
  window.addEventListener('DOMContentLoaded', loadTeams);
  
  function handleTrade() { console.log('Trade button clicked'); }
  function handleExtend() { console.log('Extend button clicked'); }
  function handleSignFreeAgent() { console.log('Sign Free Agent button clicked'); }
  function handleWaive() { console.log('Waive/Tender Player button clicked'); }
  