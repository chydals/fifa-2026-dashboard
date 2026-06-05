/**
 * app.js - Unified FIFA World Cup 2026 Core Dashboard Engine
 * Pristine Tournament State (All Teams on 0) with Taiwan Standard Time (TST) Schedules.
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
    { name: "Estadio Azteca", city: "Mexico City, Mexico", capacity: "87,523", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Vista_a%C3%A9rea_del_Estadio_Azteca_-_2026_-_02.jpg/250px-Vista_a%C3%A9rea_del_Estadio_Azteca_-_2026_-_02.jpg" },
    { name: "Estadio BBVA", city: "Guadalupe, Monterrey, Mexico", capacity: "53,500", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Mexico_Guadalupe_Monterrey_Estadio_BBVA_Bancomer_fifa_world_cup_2026_6.JPG/250px-Mexico_Guadalupe_Monterrey_Estadio_BBVA_Bancomer_fifa_world_cup_2026_6.JPG" },
    { name: "Estadio Akron", city: "Zapopan, Guadalajara, Mexico", capacity: "48,071", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Estadio_Akron_02-07-2022_cabecera_sur_lado_derecho.jpg/330px-Estadio_Akron_02-07-2022_cabecera_sur_lado_derecho.jpg" },
    { name: "BMO Field", city: "Toronto, Ontario, Canada", capacity: "45,736", img: "https://static.cfl.ca/wp-content/uploads/sites/8/2017/06/DJI_0053.jpg" },
    { name: "BC Place", city: "Vancouver, British Columbia, Canada", capacity: "54,500", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/BC_Place_%28Vancouver%29.jpg/250px-BC_Place_%28Vancouver%29.jpg" },
    { name: "MetLife Stadium", city: "East Rutherford, New Jersey, USA", capacity: "82,500", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Metlife_stadium_%28Aerial_view%29.jpg/250px-Metlife_stadium_%28Aerial_view%29.jpg" },
    { name: "SoFi Stadium", city: "Inglewood, California, USA", capacity: "70,240", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/SoFi_Stadium_interior_2021.jpg/250px-SoFi_Stadium_interior_2021.jpg" },
    { name: "AT&T Stadium", city: "Arlington, Texas, USA", capacity: "80,000", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Arlington_June_2020_4_%28AT%26T_Stadium%29.jpg/250px-Arlington_June_2020_4_%28AT%26T_Stadium%29.jpg" },
    { name: "Mercedes-Benz Stadium", city: "Atlanta, Georgia, USA", capacity: "71,000", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Mercedes_Benz_Stadium_time_lapse_capture_2017-08-13.jpg/250px-Mercedes_Benz_Stadium_time_lapse_capture_2017-08-13.jpg" },
    { name: "Hard Rock Stadium", city: "Miami Gardens, Florida, USA", capacity: "64,767", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/200127-H-PX819-0092.jpg/330px-200127-H-PX819-0092.jpg" },
    { name: "Lincoln Financial Field", city: "Philadelphia, Pennsylvania, USA", capacity: "69,796", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Lincoln_Financial_Field_%28Aerial_view%29.jpg/250px-Lincoln_Financial_Field_%28Aerial_view%29.jpg" },
    { name: "Lumen Field", city: "Seattle, Washington, USA", capacity: "69,000", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/CenturyLink_Field_Sounders_layout.jpg/330px-CenturyLink_Field_Sounders_layout.jpg" },
    { name: "Levi's Stadium", city: "Santa Clara, California, USA", capacity: "68,500", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Levi%27s_Stadium_in_February_2016_prior_to_Super_Bowl_50_%2824398261729%29.jpg/250px-Levi%27s_Stadium_in_February_2016_prior_to_Super_Bowl_50_%2824398261729%29.jpg" },
    { name: "Gillette Stadium", city: "Foxborough, Massachusetts, USA", capacity: "65,878", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Gillette_Stadium_%28Top_View%29.jpg/250px-Gillette_Stadium_%28Top_View%29.jpg" },
    { name: "Arrowhead Stadium", city: "Kansas City, Missouri, USA", capacity: "76,416", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Aerial_view_of_Arrowhead_Stadium_08-31-2013.jpg/250px-Aerial_view_of_Arrowhead_Stadium_08-31-2013.jpg" },
    { name: "NRG Stadium", city: "Houston, Texas, USA", capacity: "72,220", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/NRG_stadium_prepared_for_Super_Bowl_Li_%2832513086661%29.jpg/250px-NRG_stadium_prepared_for_Super_Bowl_Li_%2832513086661%29.jpg" }
];

// Structural runtime arrays
let worldCupMatches = [];
let groupStandings = {};
let thirdPlacedTeams = [];

// ==========================================================================
// 2. TIMELINE GENERATION ENGINE (Taiwan Standard Time - UTC+8 Calibration)
// ==========================================================================
function generatePristine104Matches() {
    worldCupMatches = [];
    let matchId = 1;
    let baseGroupDate = new Date("2026-06-12T03:00:00+08:00"); 

    worldCup2026Groups.forEach((g, gIdx) => {
        const t = g.teams;
        const pairings = [
            { h: t[0], a: t[1] }, { h: t[2], a: t[3] },
            { h: t[0], a: t[2] }, { h: t[1], a: t[3] },
            { h: t[3], a: t[0] }, { h: t[1], a: t[2] }
        ];

        pairings.forEach((p, pIdx) => {
            let venueObj = worldCupVenues[matchId % worldCupVenues.length];
            let matchDate = new Date(baseGroupDate.getTime());
            matchDate.setDate(baseGroupDate.getDate() + Math.floor(matchId / 6) + (pIdx * 2));
            matchDate.setHours(pIdx % 3 === 0 ? 3 : pIdx % 3 === 1 ? 6 : 9);

            worldCupMatches.push({
                id: matchId++,
                stage: "Group Stage",
                group: g.group,
                home: p.h,
                away: p.a,
                homeScore: null, 
                awayScore: null,
                venue: venueObj.name,
                country: venueObj.country,
                timeTST: matchDate.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) + " (TST)"
            });
        });
    });

    const knockoutPhases = [
        { name: "Round of 32", count: 16, startDate: "2026-06-29T03:00:00+08:00" },
        { name: "Round of 16", count: 8,  startDate: "2026-07-05T03:00:00+08:00" },
        { name: "Quarter-finals", count: 4, startDate: "2026-07-10T06:00:00+08:00" },
        { name: "Semi-finals", count: 2,  startDate: "2026-07-15T09:00:00+08:00" },
        { name: "Third Place Playoff", count: 1, startDate: "2026-07-19T03:00:00+08:00" },
        { name: "Final", count: 1,        startDate: "2026-07-20T03:00:00+08:00" }
    ];

    knockoutPhases.forEach(phase => {
        let koDate = new Date(phase.startDate);
        for (let i = 0; i < phase.count; i++) {
            let venueObj = worldCupVenues[matchId % worldCupVenues.length];
            let currentKODate = new Date(koDate.getTime());
            currentKODate.setDate(koDate.getDate() + Math.floor(i / 2));
            currentKODate.setHours(i % 2 === 0 ? 3 : 9);

            worldCupMatches.push({
                id: matchId++,
                stage: phase.name,
                group: "Knockout Stage",
                home: `Winner M${matchId - 17}`, 
                away: `Winner M${matchId - 16}`,
                homeScore: null,
                awayScore: null,
                venue: venueObj.name,
                country: venueObj.country,
                timeTST: currentKODate.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) + " (TST)"
            });
        }
    });
}

function initEngine() {
    generatePristine104Matches(); 
    calculateStandings();
    renderGroups();
    renderThirdPlaceTable();
    setupFilterListeners();
    renderFixtures();
    renderKnockoutBracket();
    renderVenuesTab();
}

function setupFilterListeners() {
    const filterSelect = document.getElementById("stage-filter");
    if (filterSelect) {
        filterSelect.addEventListener("change", renderFixtures);
    }
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
            html += `
                <tr>
                    <td style="text-align: left; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.03);">${t.name}</td>
                    <td style="border-bottom: 1px solid rgba(255,255,255,0.03);">${t.pld}</td>
                    <td style="border-bottom: 1px solid rgba(255,255,255,0.03);">${t.gd}</td>
                    <td style="border-bottom: 1px solid rgba(255,255,255,0.03);"><strong>${t.pts}</strong></td>
                </tr>`;
        });
        html += `</tbody></table></div>`;
        root.innerHTML += html;
    }
}

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

    thirdPlacedTeams.forEach((t, i) => {
        tbody.innerHTML += `
            <tr class="cutoff-advance">
                <td>${i + 1}</td>
                <td><strong>Group ${t.group}</strong></td>
                <td class="text-left">${t.name}</td>
                <td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
                <td><strong>0</strong></td>
            </tr>`;
    });
}

// ==========================================================================
// 5. ADVANCED FIXTURES SORT FILTER MOTOR (Group, Stadium, Country)
// ==========================================================================
function renderFixtures() {
    const root = document.getElementById("match-list");
    const filterValue = document.getElementById("stage-filter") ? document.getElementById("stage-filter").value : "all";
    if (!root) return;
    root.innerHTML = "";

    let filteredMatches = [...worldCupMatches];

    // Evaluate Filter Types
    if (filterValue !== "all") {
        if (["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].includes(filterValue)) {
            filteredMatches = worldCupMatches.filter(m => m.group === filterValue);
        } else if (["USA", "Mexico", "Canada"].includes(filterValue)) {
            filteredMatches = worldCupMatches.filter(m => m.country === filterValue);
        } else if (filterValue === "Knockout Stage") {
            filteredMatches = worldCupMatches.filter(m => m.stage !== "Group Stage");
        } else {
            // Otherwise, it matches a unique Stadium venue name
            filteredMatches = worldCupMatches.filter(m => m.venue === filterValue);
        }
    }

    if (filteredMatches.length === 0) {
        root.innerHTML = `<div style="text-align:center; padding: 20px; color:#9ca3af;">No scheduled matches found for your active filter.</div>`;
        return;
    }

    // Render matches out into the DOM template list
    filteredMatches.forEach(m => {
        let scoreDisplay = (m.homeScore !== null) ? `${m.homeScore} : ${m.awayScore}` : "vs";
        let badgeInfo = m.stage === "Group Stage" ? `Group ${m.group}` : `${m.stage}`;
        let flagEmoji = m.country === "USA" ? "🇺🇸" : m.country === "Mexico" ? "🇲🇽" : "🇨🇦";

        root.innerHTML += `
            <div style="background: var(--card-bg); padding: 14px 20px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 8px;">
                <div style="flex: 1;">
                    <span style="background: var(--primary); color: #000; padding: 2px 8px; font-size: 0.75rem; font-weight: 700; border-radius:3px;">M${m.id}</span>
                    <small style="color: var(--text-muted); margin-left: 8px; font-weight:600;">${badgeInfo}</small>
                    <div style="font-size: 0.75rem; color: var(--accent); margin-top: 4px; font-weight:500;">📍 ${m.venue} (${flagEmoji} ${m.country})</div>
                </div>
                <div style="flex: 1; text-align: center; font-size: 1rem; letter-spacing: 0.3px; font-weight: 500;">
                    ${m.home} <strong style="color: var(--primary); margin: 0 12px;">${scoreDisplay}</strong> ${m.away}
                </div>
                <div style="flex: 1; text-align: right; font-size: 0.8rem; color: var(--primary); font-weight: 600;">
                    📅 ${m.timeTST}
                </div>
            </div>`;
    });
}

// ==========================================================================
// 6. LINEAR TREE BRACKET
// ==========================================================================
function getTeamOrPlaceholder(groupLetter, rankIndex) {
    return `${rankIndex + 1}º Place Group ${groupLetter}`;
}

function getThirdPlaceQualifiedTeam(rankPosition) {
    return `Best 3rd Place #${rankPosition + 1}`;
}

function renderKnockoutBracket() {
    const root = document.getElementById("bracket-render-root");
    if (!root) return;
    root.innerHTML = "";

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
                    <div class="bracket-team-row"><span style="color: var(--text-muted)">${m.t1}</span><strong>-</strong></div>
                    <div class="bracket-team-row"><span style="color: var(--text-muted)">${m.t2}</span><strong>-</strong></div>
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
                    <div class="venue-meta"><span>📍 Location:</span> <strong>${v.city}, ${v.country}</strong></div>
                    <div class="venue-meta"><span>👥 Capacity:</span> <strong>${v.capacity} spectators</strong></div>
                </div>
            </div>`;
    });
}

window.onload = initEngine;
