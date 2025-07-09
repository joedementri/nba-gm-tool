// Load CSV and populate custom dropdown
let currentSortKey = "Player";
let currentSortDirection = "asc";
let currentTeamPlayers = [];

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
      loadRoster(team.team_id);
    });
    dropdown.appendChild(div);
  });

  selectedDiv.addEventListener('click', () => {
    dropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', function(event) {
    if (!event.target.closest('.custom-dropdown')) {
      dropdown.classList.add('hidden');
    }
  });

  // Set up sorting events
  document.querySelectorAll('th.sortable').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      if (currentSortKey === key) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : currentSortDirection === 'desc' ? 'reset' : 'asc';
      } else {
        currentSortKey = key;
        currentSortDirection = 'asc';
      }
      updateSortIndicators();
      renderRoster();
    });
  });
}

function updateSortIndicators() {
  document.querySelectorAll('th.sortable').forEach(th => {
    th.classList.remove('sorted-desc', 'sorted-reset');
    if (th.dataset.key === currentSortKey) {
      if (currentSortDirection === 'desc') th.classList.add('sorted-desc');
      else if (currentSortDirection === 'reset') th.classList.add('sorted-reset');
    } else {
      th.classList.add('sorted-reset');
    }
  });
}

function calculateAge(birthDateStr) {
  const birthDate = new Date(birthDateStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

async function loadRoster(teamId) {
  const response = await fetch('data/players.csv');
  const data = await response.text();
  const rows = data.trim().split('\n');
  const headers = rows[0].split(',');

  currentTeamPlayers = rows.slice(1).map(row => {
    const cells = row.split(',');
    const player = Object.fromEntries(headers.map((h, i) => [h.trim(), cells[i] ? cells[i].trim() : '']));
    player.Age = calculateAge(player["Birth Date"]);
    return player;
  }).filter(player => player.team_id === teamId);

  updateSortIndicators();
  renderRoster();
}

function renderRoster() {
  const tableBody = document.querySelector('#rosterTable tbody');
  tableBody.innerHTML = '';

  let players = [...currentTeamPlayers];
  if (currentSortDirection !== 'reset') {
    players.sort((a, b) => {
      const valA = isNaN(a[currentSortKey]) ? a[currentSortKey] : parseFloat(a[currentSortKey]);
      const valB = isNaN(b[currentSortKey]) ? b[currentSortKey] : parseFloat(b[currentSortKey]);
      if (currentSortDirection === 'asc') return valA > valB ? 1 : -1;
      else return valA < valB ? 1 : -1;
    });
  }

  players.forEach(player => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><a href="https://www.basketball-reference.com/players/${player["Player-additional"].charAt(0)}/${player["Player-additional"]}.html" target="_blank">${player.Player}</a></td>
      <td></td>
      <td></td>
      <td>${player.Age}</td>
      <td>${player.Pos}</td>
      <td>${player.Ht}</td>
      <td>${player.Wt}</td>
      <td>${player.Exp}</td>
      <td>${player.G}</td>
      <td>${player.GS}</td>
      <td>${player.MP}</td>
      <td>${player.PTS}</td>
      <td>${player.AST}</td>
      <td>${player.TRB}</td>
    `;
    tableBody.appendChild(tr);
  });
}

window.addEventListener('DOMContentLoaded', loadTeams);

function handleTrade() { console.log('Trade button clicked'); }
function handleExtend() { console.log('Extend button clicked'); }
function handleSignFreeAgent() { console.log('Sign Free Agent button clicked'); }
function handleWaive() { console.log('Waive/Tender Player button clicked'); }
