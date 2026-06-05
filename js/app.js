/**
 * app.js - 2026 FIFA World Cup Core Engine
 * Official 48-team groups, dynamic calculators, and automatic Taiwan Time conversion.
 */

// 1. Core Dataset: Official 2026 FIFA World Cup Groups & Teams
const worldCup2026Groups = [
  { group: "A", teams: ["Mexico", "South Africa", "South Korea", "Czech Republic"] },
  { group: "B", teams: ["Canada", "Bosnia and Herzegovina", "Qatar", "Switzerland"] },
  { group: "C", teams: ["Brazil", "Morocco", "Haiti", "Scotland"] },
  { group: "D", teams: ["United States", "Paraguay", "Australia", "Türkiye"] },
  { group: "E", teams: ["Germany", "Curaçao", "Ivory Coast", "Ecuador"] },
  { group: "F", teams: ["Netherlands", "Japan", "Sweden", "Tunisia"] },
  { group: "G", teams: ["Belgium", "Egypt", "Iran", "New Zealand"] },
  { group: "H", teams: ["Spain", "Cape Verde", "Saudi Arabia", "Uruguay"] },
  { group: "I", teams: ["France", "Senegal", "Iraq", "Norway"] },
  { group: "J", teams: ["Argentina", "Algeria", "Austria", "Jordan"] },
  { group: "K", teams: ["Portugal", "DR Congo", "Uzbekistan", "Colombia"] },
  { group: "L", teams: ["England", "Croatia", "Ghana", "Panama"] }
];

// Initialize dynamic standings data structure
let standingsData = {};
worldCup2026Groups.forEach(g => {
    standingsData[g.group] = g.teams.map(team => ({
        name: team, p: 0, w: 0, d: 0, l: 0, gd: 0, pts: 0
    }));
});

// Official Mock Openers Array with ISO UTC strings for local Taiwan time conversions
const matches = [
    { id: 1, stage: 'Group Stage', group: 'A', home: 'Mexico', away: 'South Africa', utcTime: '2026-06-11T20:00:00Z', homeScore: '', awayScore: '' },
    { id: 2, stage: 'Group Stage', group: 'B', home: 'Canada', away: 'Bosnia and Herzegovina', utcTime: '2026-06-11T23:00:00Z', homeScore: '', awayScore: '' },
    { id: 3, stage: 'Group Stage', group: 'C', home: 'Brazil', away: 'Morocco', utcTime: '2026-06-12T19:00:00Z', homeScore: '', awayScore: '' },
    { id: 4, stage: 'Group Stage', group: 'D', home: 'United States', away: 'Paraguay', utcTime: '2026-06-13T15:00:00Z', homeScore: '', awayScore: '' },
    { id: 5, stage: 'Group Stage', group: 'I', home: 'France', away: 'Senegal', utcTime: '2026-06-14T18:00:00Z', homeScore: '', awayScore: '' },
    { id: 6, stage: 'Group Stage', group: 'L', home: 'England', away: 'Croatia', utcTime: '2026-06-14T21:00:00Z', homeScore: '', awayScore: '' }
];

// Tab Switching Mechanism
window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
};

// Timezone Localization Helper (Converts UTC to Asia/Taipei string layout)
function formatToTaiwanTime(utcString) {
    const date = new Date(utcString);
    return date.toLocaleString('zh-TW', {
        timeZone: 'Asia/Taipei',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }) + ' (台灣時間)';
}

// UI Rendering Engine: Renders Group Cards & Standings Tables
function renderGroups() {
    const container = document.getElementById('groups-container');
    if (!container) return;
    container.innerHTML = '';
    
    for (const [groupLetter, teams] of Object.entries(standingsData)) {
        // Sort automatically by total points, then goal difference
        teams.sort((a, b) => b.pts - a.pts || b.gd - a.gd);

        let tableHtml = `
            <div class="group-card">
                <h3>Group ${groupLetter}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Team</th>
                            <th>P</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>GD</th>
                            <th>Pts</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        teams.forEach(team => {
            tableHtml += `
                <tr>
                    <td>${team.name}</td>
                    <td>${team.p}</td>
                    <td>${team.w}</td>
                    <td>${team.d}</td>
                    <td>${team.l}</td>
                    <td>${team.gd}</td>
                    <td><strong>${team.pts}</strong></td>
                </tr>
            `;
        });

        tableHtml += `</tbody></table></div>`;
        container.innerHTML += tableHtml;
    }
}

// UI Rendering Engine: Renders Match Lists inside Fixtures Tab
window.renderFixtures = function() {
    const listContainer = document.getElementById('match-list');
    if (!listContainer) return;
    
    const filterSelect = document.getElementById('stage-filter');
    const filterValue = filterSelect ? filterSelect.value : 'all';
    listContainer.innerHTML = '';

    const filteredMatches = matches.filter(m => filterValue === 'all' || m.stage === filterValue);

    if (filteredMatches.length === 0) {
        listContainer.innerHTML = `<p style="text-align:center;color:var(--text-muted);padding:20px;">No matches scheduled for this stage placeholder yet.</p>`;
        return;
    }

    filteredMatches.forEach(match => {
        const card = document.createElement('div');
        card.className = 'match-card';
        card.innerHTML = `
            <div class="match-info">
                <div class="match-time">${formatToTaiwanTime(match.utcTime)}</div>
                <div class="match-stage">${match.stage} ${match.group ? '&bull; Group ' + match.group : ''}</div>
            </div>
            <div class="match-teams">
                <div class="team-row">
                    <span>${match.home}</span>
                    <input type="number" class="score-input" value="${match.homeScore}" data-match-id="${match.id}" data-team="home" onchange="updateScore(this)">
                </div>
                <div class="team-row">
                    <span>${match.away}</span>
                    <input type="number" class="score-input" value="${match.awayScore}" data-match-id="${match.id}" data-team="away" onchange="updateScore(this)">
                </div>
            </div>
        `;
        listContainer.appendChild(card);
    });
};

// Captures input score modifications and calculates live standings changes
window.updateScore = function(inputEl) {
    const matchId = parseInt(inputEl.dataset.matchId);
    const type = inputEl.dataset.team;
    const val = inputEl.value !== '' ? parseInt(inputEl.value) : '';
    
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    if (type === 'home') match.homeScore = val;
    else match.awayScore = val;

    if (match.stage === 'Group Stage') {
        recalculateGroupStandings();
    }
};

// Calculation Matrix Core Logic
function recalculateGroupStandings() {
    // Reset structural calculations clean before rebuilding properties
    for (const groupLetter of Object.keys(standingsData)) {
        standingsData[groupLetter] = worldCup2026Groups
            .find(g => g.group === groupLetter).teams
            .map(team => ({ name: team, p: 0, w: 0, d: 0, l: 0, gd: 0, pts: 0 }));
    }

    // Traverse scores entered 
    matches.forEach(m => {
        if (m.stage === 'Group Stage' && m.homeScore !== '' && m.awayScore !== '') {
            const groupTeams = standingsData[m.group];
            const homeTeam = groupTeams.find(t => t.name === m.home);
            const awayTeam = groupTeams.find(t => t.name === m.away);

            if (homeTeam && awayTeam) {
                const hSc = parseInt(m.homeScore);
                const aSc = parseInt(m.awayScore);

                homeTeam.p++;
                awayTeam.p++;
                homeTeam.gd += (hSc - aSc);
                awayTeam.gd += (aSc - hSc);

                if (hSc > aSc) {
                    homeTeam.w++; homeTeam.pts += 3;
                    awayTeam.l++;
                } else if (aSc > hSc) {
                    awayTeam.w++; awayTeam.pts += 3;
                    homeTeam.l++;
                } else {
                    homeTeam.d++; homeTeam.pts += 1;
                    awayTeam.d++; awayTeam.pts += 1;
                }
            }
        }
    });

    renderGroups();
}

// Start visual building as soon as window contexts are ready
document.addEventListener('DOMContentLoaded', () => {
    renderGroups();
    renderFixtures();
});
