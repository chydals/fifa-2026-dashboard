/**
 * app.js - FIFA World Cup 2026 Core Dashboard Engine
 * Optimized match rendering loops, group stages, and filter systems.
 */

// 1. Official 48-Team Groups & ISO Codes for Flag Generation
const worldCup2026Groups = [
  { group: "A", teams: [{name: "Mexico", code: "mx"}, {name: "South Africa", code: "za"}, {name: "South Korea", code: "kr"}, {name: "Czech Republic", code: "cz"}] },
  { group: "B", teams: [{name: "Canada", code: "ca"}, {name: "Bosnia and Herzegovina", code: "ba"}, {name: "Qatar", code: "qa"}, {name: "Switzerland", code: "ch"}] },
  { group: "C", teams: [{name: "Brazil", code: "br"}, {name: "Morocco", code: "ma"}, {name: "Haiti", code: "ht"}, {name: "Scotland", code: "gb-sct"}] },
  { group: "D", teams: [{name: "United States", code: "us"}, {name: "Paraguay", code: "py"}, {name: "Australia", code: "au"}, {name: "Türkiye", code: "tr"}] },
  { group: "E", teams: [{name: "Germany", code: "de"}, {name: "Curaçao", code: "cw"}, {name: "Ivory Coast", code: "ci"}, {name: "Ecuador", code: "ec"}] },
  { group: "F", teams: [{name: "Netherlands", code: "nl"}, {name: "Japan", code: "jp"}, {name: "Sweden", code: "se"}, {name: "Tunisia", code: "tn"}] },
  { group: "G", teams: [{name: "Belgium", code: "be"}, {name: "Egypt", code: "eg"}, {name: "Iran", code: "ir"}, {name: "New Zealand", code: "nz"}] },
  { group: "H", teams: [{name: "Spain", code: "es"}, {name: "Cape Verde", code: "cv"}, {name: "Saudi Arabia", code: "sa"}, {name: "Uruguay", code: "uy"}] },
  { group: "I", teams: [{name: "France", code: "fr"}, {name: "Senegal", code: "sn"}, {name: "Iraq", code: "iq"}, {name: "Norway", code: "no"}] },
  { group: "J", teams: [{name: "Argentina", code: "ar"}, {name: "Algeria", code: "dz"}, {name: "Austria", code: "at"}, {name: "Jordan", code: "jo"}] },
  { group: "K", teams: [{name: "Portugal", code: "pt"}, {name: "DR Congo", code: "cd"}, {name: "Uzbekistan", code: "uz"}, {name: "Colombia", code: "co"}] },
  { group: "L", teams: [{name: "England", code: "gb-eng"}, {name: "Croatia", code: "hr"}, {name: "Ghana", code: "gh"}, {name: "Panama", code: "pa"}] }
];

// Rebuild local live score calculations
let standingsData = {};
worldCup2026Groups.forEach(g => {
    standingsData[g.group] = g.teams.map(t => ({
        name: t.name, code: t.code, p: 0, w: 0, d: 0, l: 0, gd: 0, pts: 0
    }));
});

// Generate all 72 group stage match configurations dynamically
const matches = [];
let matchIdCounter = 1;

worldCup2026Groups.forEach(g => {
    const t = g.teams;
    const roundRobinPairings = [
        {h: t[0], a: t[1], dayOffset: 0}, {h: t[2], a: t[3], dayOffset: 0},
        {h: t[0], a: t[2], dayOffset: 4}, {h: t[1], a: t[3], dayOffset: 4},
        {h: t[3], a: t[0], dayOffset: 8}, {h: t[1], a: t[2], dayOffset: 8}
    ];
    roundRobinPairings.forEach((pair, index) => {
        let hourOffset = 15 + (index * 3);
        let dateString = `2026-06-${11 + pair.dayOffset}T${hourOffset % 24}:00:00Z`;
        matches.push({
            id: matchIdCounter++,
            stage: 'Group Stage',
            group: g.group,
            home: pair.h.name,
            homeCode: pair.h.code,
            away: pair.a.name,
            awayCode: pair.a.code,
            utcTime: dateString,
            homeScore: '',
            awayScore: ''
        });
    });
});

window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }
};

function formatToTaiwanTime(utcString) {
    const date = new Date(utcString);
    return date.toLocaleString('zh-TW', {
        timeZone: 'Asia/Taipei',
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
    }) + ' (台灣時間)';
}

function renderGroups() {
    const container = document.getElementById('groups-container');
    if (!container) return;
    container.innerHTML = '';
    
    for (const [groupLetter, teams] of Object.entries(standingsData)) {
        teams.sort((a, b) => b.pts - a.pts || b.gd - a.gd);

        let tableHtml = `
            <div class="group-card">
                <h3>Group ${groupLetter}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        teams.forEach(team => {
            tableHtml += `
                <tr>
                    <td class="flag-cell">
                        <img class="flag-icon" src="https://flagcdn.com/w40/${team.code}.png" alt="">
                        <span>${team.name}</span>
                    </td>
                    <td>${team.p}</td><td>${team.w}</td><td>${team.d}</td><td>${team.l}</td><td>${team.gd}</td>
                    <td><strong>${team.pts}</strong></td>
                </tr>
            `;
        });
        tableHtml += `</tbody></table></div>`;
        container.innerHTML += tableHtml;
    }
}

window.renderFixtures = function() {
    const listContainer = document.getElementById('match-list');
    if (!listContainer) return;
    const filterValue = document.getElementById('stage-filter').value;
    listContainer.innerHTML = '';

    const filteredMatches = matches.filter(m => filterValue === 'all' || m.group === filterValue);

    filteredMatches.forEach(match => {
        const card = document.createElement('div');
        card.className = 'match-card';
        card.innerHTML = `
            <div class="match-info">
                <div class="match-time">${formatToTaiwanTime(match.utcTime)}</div>
                <div class="match-stage">Match ${match.id} &bull; Group ${match.group}</div>
            </div>
            <div class="match-teams">
                <div class="team-row">
                    <span class="flag-cell"><img class="flag-icon" src="https://flagcdn.com/w40/${match.homeCode}.png" alt=""> ${match.home}</span>
                    <input type="number" class="score-input" value="${match.homeScore}" data-match-id="${match.id}" data-team="home" onchange="updateScore(this)">
                </div>
                <div class="team-row">
                    <span class="flag-cell"><img class="flag-icon" src="https://flagcdn.com/w40/${match.awayCode}.png" alt=""> ${match.away}</span>
                    <input type="number" class="score-input" value="${match.awayScore}" data-match-id="${match.id}" data-team="away" onchange="updateScore(this)">
                </div>
            </div>
        `;
        listContainer.appendChild(card);
    });
};

window.updateScore = function(inputEl) {
    const matchId = parseInt(inputEl.dataset.matchId);
    const type = inputEl.dataset.team;
    const val = inputEl.value !== '' ? parseInt(inputEl.value) : '';
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    if (type === 'home') match.homeScore = val;
    else match.awayScore = val;

    recalculateGroupStandings();
};

function recalculateGroupStandings() {
    for (const groupLetter of Object.keys(standingsData)) {
        standingsData[groupLetter] = worldCup2026Groups
            .find(g => g.group === groupLetter).teams
            .map(t => ({ name: t.name, code: t.code, p: 0, w: 0, d: 0, l: 0, gd: 0, pts: 0 }));
    }

    matches.forEach(m => {
        if (m.homeScore !== '' && m.awayScore !== '') {
            const groupTeams = standingsData[m.group];
            const homeTeam = groupTeams.find(t => t.name === m.home);
            const awayTeam = groupTeams.find(t => t.name === m.away);

            if (homeTeam && awayTeam) {
                const hSc = parseInt(m.homeScore);
                const aSc = parseInt(m.awayScore);
                homeTeam.p++; awayTeam.p++;
                homeTeam.gd += (hSc - aSc); awayTeam.gd += (aSc - hSc);

                if (hSc > aSc) { homeTeam.w++; homeTeam.pts += 3; awayTeam.l++; }
                else if (aSc > hSc) { awayTeam.w++; awayTeam.pts += 3; homeTeam.l++; }
                else { homeTeam.d++; homeTeam.pts += 1; awayTeam.d++; awayTeam.pts += 1; }
            }
        }
    });
    renderGroups();
}

document.addEventListener('DOMContentLoaded', () => {
    renderGroups();
    renderFixtures();
});
