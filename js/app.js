/**
 * app.js - Unified FIFA World Cup 2026 Core Dashboard Engine
 * Implements Group Phase calculations, Dynamic Third-Place Rankings,
 * Host Venue Data Modules, and Auto-populating Bracket Tree.
 */

// ==========================================================================
// 1. TOURNAMENT DATA SCHEMAS (12 standalone groups of 4 teams)
// ==========================================================================
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

// Complete 16 Official Host Venues Matrix Database
const worldCupVenues = [
    { name: "Estadio Azteca", city: "Mexico City, Mexico", capacity: "87,523", img: "https://upload.wikimedia.org/wikipedia/commons/4/41/Estadio_Azteca_2015.jpg" },
    { name: "Estadio BBVA", city: "Guadalupe, Monterrey, Mexico", capacity: "53,500", img: "https://upload.wikimedia.org/wikipedia/commons/3/30/Estadio_BBVA_Bancomer_Panor%C3%A1mica.jpg" },
    { name: "Estadio Akron", city: "Zapopan, Guadalajara, Mexico", capacity: "48,071", img: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Estadio_Chivas_interior.jpg" },
    { name: "BMO Field", city: "Toronto, Ontario, Canada", capacity: "45,736", img: "https://upload.wikimedia.org/wikipedia/commons/2/29/BMO_Field_Aug_2023.jpg" },
    { name: "BC Place", city: "Vancouver, British Columbia, Canada", capacity: "54,500", img: "https://upload.wikimedia.org/wikipedia/commons/e/e0/BC_Place_Interior_2015.jpg" },
    { name: "MetLife Stadium", city: "East Rutherford, New Jersey, USA", capacity: "82,500", img: "https://upload.wikimedia.org/wikipedia/commons/6/69/MetLife_Stadium_New_Jersey.jpg" },
    { name: "SoFi Stadium", city: "Inglewood, California, USA", capacity: "70,240", img: "https://upload.wikimedia.org/wikipedia/commons/3/33/Sofi_Stadium%2C_Inglewood_Los_Angeles_California.jpg" },
    { name: "AT&T Stadium", city: "Arlington, Texas, USA", capacity: "80,000", img: "https://upload.wikimedia.org/wikipedia/commons/7/77/AT%26T_Stadium_Interior.jpg" },
    { name: "Mercedes-Benz Stadium", city: "Atlanta, Georgia, USA", capacity: "71,000", img: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Mercedes-Benz_Stadium_interior%2C_October_2017.jpg" },
    { name: "Hard Rock Stadium", city: "Miami Gardens, Florida, USA", capacity: "64,767", img: "https://upload.wikimedia.org/wikipedia/commons/3/32/Hard_Rock_Stadium_Interior_2017.jpg" },
    { name: "Lincoln Financial Field", city: "Philadelphia, Pennsylvania, USA", capacity: "69,796", img: "https://upload.wikimedia.org/wikipedia/commons/4/4c/LFF_Interior.jpg" },
    { name: "Lumen Field", city: "Seattle, Washington, USA", capacity: "69,000", img: "https://upload.wikimedia.org/wikipedia/commons/3/37/CenturyLink_Field_aerial.jpg" },
    { name: "Levi's Stadium", city: "Santa Clara, California, USA", capacity: "68,500", img: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Levi%27s_Stadium_aerial_view.jpg" },
    { name: "Gillette Stadium", city: "Foxborough, Massachusetts, USA", capacity: "65,878", img: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Gillette_Stadium_Patriots_vs_Jets_2019.jpg" },
    { name: "Arrowhead Stadium", city: "Kansas City, Missouri, USA", capacity: "76,416", img: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Arrowhead_Stadium_aerial.jpg" },
    { name: "NRG Stadium", city: "Houston, Texas, USA", capacity: "72,220", img: "https://upload.wikimedia.org/wikipedia/commons/2/22/NRG_Stadium_Houston.jpg" }
];

// Array to store all 104 matches computed at runtime
let worldCupMatches = [];
let groupStandings = {};
let thirdPlacedTeams = [];

// ==========================================================================
// 2. RUNTIME ENGINE INITIALIZATION & MATCH GENERATOR
// ==========================================================================
function generate104Matches() {
    worldCupMatches = [];
    let matchId = 1;

    // Generate Round-Robin Group Matches (6 games per group x 12 groups = 72 Group Games)
    worldCup2026Groups.forEach(g => {
        const t = g.teams;
        const combinations = [
            { h: t[0], a: t[1] }, { h: t[2], a: t[3] },
            { h: t[0], a: t[2] }, { h: t[1], a: t[3] },
            { h: t[3], a: t[0] }, { h: t[1], a: t[2] }
        ];

        combinations.forEach(c => {
            // Pick a randomized sample score for entertainment simulation
            let homeSimScore = Math.floor(Math.random() * 4);
            let awaySimScore = Math.floor(Math.random() * 3);
            let venueObj = worldCupVenues[matchId % worldCupVenues.length];

            worldCupMatches.push({
                id: matchId++,
                stage: "Group Stage",
                group: g.group,
                home: c.h,
                away: c.a,
                homeScore: homeSimScore,
                awayScore: awaySimScore,
                venue: venueObj.name
            });
        });
    });

    // Knockout Matches (32 matches total: 16 in R32, 8 in R16, 4 in QF, 2 in SF, 1 Third Place, 1 Final)
    // 72 + 32 = 104 Total Tournament Matches
    const knockoutPhases = [
        { name: "Round of 32", count: 16 },
        { name: "Round of 16", count: 8 },
        { name: "Quarter-finals", count: 4 },
        { name: "Semi-finals", count: 2 },
        { name: "Third Place Playoff", count: 1 },
        { name: "Final", count: 1 }
    ];

    knockoutPhases.forEach(phase => {
        for (let i = 0; i < phase.count; i++) {
            let venueObj = worldCupVenues[matchId % worldCupVenues.length];
            worldCupMatches.push({
                id: matchId++,
                stage: phase.name,
                group: "KO",
                home: `Winner M${matchId - 17}`, // Dynamically links progression tags
                away: `Winner M${matchId - 16}`,
                homeScore: null,
                awayScore: null,
                venue: venueObj.name
            });
        }
    });
}

function initEngine() {
    generate104Matches(); // Populates all 104 matches
    calculateStandings();
    renderGroups();
    renderThirdPlaceTable();
    renderFixtures();
    renderKnockoutBracket();
    renderVenuesTab();
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// ==========================================================================
// 3. GROUP STANDINGS PROCESSING LOGIC
// ==========================================================================
function calculateStandings() {
    worldCup2026Groups.forEach(g => {
        groupStandings[g.group] = g.teams.map(t => ({
            name: t, pld: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0
        }));
    });

    worldCupMatches.forEach(m => {
        if (m.stage === "Group Stage" && m.homeScore !== null && m.awayScore !== null) {
            const arr = groupStandings[m.group];
            const h = arr.find(t => t.name === m.home);
            const a = arr.find(t => t.name === m.away);
            
            if (h && a) {
                h.pld++; a.pld++;
                h.gf += m.homeScore; h.ga += m.awayScore;
                a.gf += m.awayScore; a.ga += m.homeScore;
                h.gd = h.gf - h.ga; a.gd = a.gf - a.ga;
                
                if (m.homeScore > m.awayScore) { h.w++; h.pts += 3; a.l++; }
                else if (m.awayScore > m.homeScore) { a.w++; a.pts += 3; h.l++; }
                else { h.d++; h.pts += 1; a.d++; a.pts += 1; }
            }
        }
    });

    for (let g in groupStandings) {
        groupStandings[g].sort((x, y) => y.pts - x.pts || y.gd - x.gd || y.gf - x.gf);
    }
}

function renderGroups() {
    const root = document.getElementById("groups-container");
    if (!root) return;
    root.innerHTML = "";

    for (let g in groupStandings) {
        let html = `
            <div class="group-card" style="background: var(--card-bg); padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
                <h4 style="color: var(--primary); margin-bottom: 12px; font-weight:700; border-bottom: 2px solid var(--primary); padding-bottom:4px;">GROUP ${g}</h4>
                <table style="width: 100%; font-size: 0.85rem; text-align: center; border-collapse: collapse;">
                    <thead>
                        <tr style="color: var(--text-muted); font-weight:600;">
                            <th style="text-align: left; padding-bottom:6px;">Team</th>
                            <th>P</th>
                            <th>GD</th>
                            <th>Pts</th>
                        </tr>
                    </thead>
                    <tbody>`;
        groupStandings[g].forEach((t, index) => {
            let rowStyle = index < 2 ? `style="font-weight: bold; color: #10b981;"` : '';
            html += `
                <tr ${rowStyle}>
                    <td style="text-align: left; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.03);">${t.name}</td>
                    <td style="border-bottom: 1px solid rgba(255,255,255,0.03);">${t.pld}</td>
                    <td style="border-bottom: 1px solid rgba(255,255,255,0.03);">${t.gd > 0 ? '+' + t.gd : t.gd}</td>
                    <td style="border-bottom: 1px solid rgba(255,255,255,0.03);"><strong>${t.pts}</strong></td>
                </tr>`;
        });
        html += `</tbody></table></div>`;
        root.innerHTML += html;
    }
}

// ==========================================================================
// 4. THIRD-PLACED TEAMS LIVE TRACKER ADVANCEMENT CALCULATOR
// ==========================================================================
function renderThirdPlaceTable() {
    const tbody = document.getElementById("third-place-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    thirdPlacedTeams = [];
    for (let g in groupStandings) {
        if (groupStandings[g][2]) {
            thirdPlacedTeams.push({ group: g, ...groupStandings[g][2] });
        }
    }

    thirdPlacedTeams.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);

    thirdPlacedTeams.forEach((t, i) => {
        const isAdvancing = i < 8;
        const rowClass = isAdvancing ? "cutoff-advance" : "cutoff-out";
        tbody.innerHTML += `
            <tr class="${rowClass}">
                <td>${i + 1}</td>
                <td><strong>Group ${t.group}</strong></td>
                <td class="text-left">${t.name}</td>
                <td>${t.pld}</td>
                <td>${t.w}</td>
                <td>${t.d}</td>
                <td>${t.l}</td>
                <td>${t.gf}</td>
                <td>${t.ga}</td>
                <td>${t.gd > 0 ? '+' + t.gd : t.gd}</td>
                <td><strong>${t.pts}</strong></td>
            </tr>`;
    });
}

// ==========================================================================
// 5. FIXTURES ENGINE VIEWPORT
// ==========================================================================
function renderFixtures() {
    const root = document.getElementById("match-list");
    const filter = document.getElementById("stage-filter") ? document.getElementById("stage-filter").value : "all";
    if (!root) return;
    root.innerHTML = "";
    
    const filteredMatches = worldCupMatches.filter(m => filter === "all" || m.stage === filter);

    if (filteredMatches.length === 0) {
        root.innerHTML = `<div style="text-align:center; padding: 20px; color:#9ca3af;">No scheduled matches found for this phase.</div>`;
        return;
    }

    filteredMatches.forEach(m => {
        let scoreDisplay = (m.homeScore !== null) ? `${m.homeScore} : ${m.awayScore}` : "vs";
        let badgeInfo = m.stage === "Group Stage" ? `Pool ${m.group}` : `${m.stage}`;
        
        root.innerHTML += `
            <div style="background: var(--card-bg); padding: 14px 20px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 8px;">
                <div>
                    <span style="background: var(--primary); color: #000; padding: 2px 8px; font-size: 0.75rem; font-weight: 700; border-radius:3px;">M${m.id}</span>
                    <small style="color: var(--text-muted); margin-left: 8px; font-weight:600;">${badgeInfo}</small>
                    <div style="font-size: 0.75rem; color: var(--accent); margin-top: 4px; font-weight:500;">📍 ${m.venue}</div>
                </div>
                <div style="font-size: 1rem; letter-spacing: 0.3px; font-weight: 500;">
                    ${m.home} <strong style="color: var(--primary); margin: 0 8px;">${scoreDisplay}</strong> ${m.away}
                </div>
            </div>`;
    });
}

// ==========================================================================
// 6. LINEAR TREE BRACKET - AUTOMATED REAL TEAM POPULATION FIX
// ==========================================================================
function getTeamOrPlaceholder(groupLetter, rankIndex) {
    // Gracefully reads calculated results from live table standings
    if (groupStandings[groupLetter] && groupStandings[groupLetter][rankIndex]) {
        return groupStandings[groupLetter][rankIndex].name;
    }
    return `${rankIndex + 1}º Place Group ${groupLetter}`;
}

function getThirdPlaceQualifiedTeam(rankPosition) {
    if (thirdPlacedTeams && thirdPlacedTeams[rankPosition]) {
        return thirdPlacedTeams[rankPosition].name;
    }
    return `Best 3rd Place #${rankPosition + 1}`;
}

function renderKnockoutBracket() {
    const root = document.getElementById("bracket-render-root");
    if (!root) return;
    root.innerHTML = "";

    // Maps structural bracket rows directly to computed table spots
    const bracketStructure = [
        {
            roundName: "Round of 32",
            matches: [
                { matchId: "M73", t1: getTeamOrPlaceholder("A", 0), t2: getTeamOrPlaceholder("C", 1), venue: "SoFi Stadium" },
                { matchId: "M74", t1: getTeamOrPlaceholder("B", 0), t2: getThirdPlaceQualifiedTeam(0), venue: "MetLife Stadium" },
                { matchId: "M75", t1: getTeamOrPlaceholder("E", 0), t2: getTeamOrPlaceholder("F", 1), venue: "Mercedes-Benz Stadium" },
                { matchId: "M76", t1: getTeamOrPlaceholder("D", 0), t2: getThirdPlaceQualifiedTeam(1), venue: "BC Place" }
            ]
        },
        {
            roundName: "Round of 16",
            matches: [
                { matchId: "M89", t1: "Winner Match 73", t2: "Winner Match 74", venue: "Estadio Azteca" },
                { matchId: "M90", t1: "Winner Match 75", t2: "Winner Match 76", venue: "AT&T Stadium" }
            ]
        },
        {
            roundName: "Quarter-finals",
            matches: [
                { matchId: "M97", t1: "Winner Match 89", t2: "Winner Match 90", venue: "Gillette Stadium" }
            ]
        },
        {
            roundName: "Semi-finals",
            matches: [
                { matchId: "M101", t1: "Winner Match 97", t2: "Qualified Challenger", venue: "Hard Rock Stadium" }
            ]
        },
        {
            roundName: "Final",
            matches: [
                { matchId: "M104", t1: "🏆 World Cup Finalist 1", t2: "🏆 World Cup Finalist 2", venue: "MetLife Stadium" }
            ]
        }
    ];

    bracketStructure.forEach(round => {
        let colHtml = `<div class="bracket-column"><div class="bracket-header-node">${round.roundName}</div>`;
        
        round.matches.forEach(m => {
            colHtml += `
                <div class="bracket-match-node">
                    <div class="bracket-match-id">
                        <span>MATCH ${m.matchId}</span>
                        <span class="bracket-match-venue">📍 ${m.venue}</span>
                    </div>
                    <div class="bracket-team-row">
                        <span style="color: ${m.t1.includes('Place') ? 'var(--text-muted)' : '#fff'}">${m.t1}</span>
                        <strong>-</strong>
                    </div>
                    <div class="bracket-team-row">
                        <span style="color: ${m.t2.includes('Place') ? 'var(--text-muted)' : '#fff'}">${m.t2}</span>
                        <strong>-</strong>
                    </div>
                </div>`;
        });
        
        colHtml += `</div>`;
        root.innerHTML += colHtml;
    });
}

// ==========================================================================
// 7. VENUES TAB DATABASE POPULATION
// ==========================================================================
function renderVenuesTab() {
    const container = document.getElementById("venues-container");
    if (!container) return;
    container.innerHTML = "";

    worldCupVenues.forEach(v => {
        container.innerHTML += `
            <div class="venue-card">
                <img src="${v.img}" alt="${v.name}" class="venue-img">
                <div class="venue-info">
                    <h3>${v.name}</h3>
                    <div class="venue-meta"><span>📍 Location:</span> <strong>${v.city}</strong></div>
                    <div class="venue-meta"><span>👥 Capacity:</span> <strong>${v.capacity} spectators</strong></div>
                </div>
            </div>`;
    });
}

// Attach listeners to safely initialize UI rendering on window content load
window.onload = initEngine;
