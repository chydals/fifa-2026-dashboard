/**
 * app.js - 2026 FIFA World Cup Group Stage Data System
 * Features the official 48-team expansion across Groups A through L.
 */

// 1. Core Dataset: Official 2026 FIFA World Cup Groups & Teams
const worldCup2026Groups = [
  {
    group: "A",
    teams: ["Mexico", "South Africa", "South Korea", "Czech Republic"]
  },
  {
    group: "B",
    teams: ["Canada", "Bosnia and Herzegovina", "Qatar", "Switzerland"]
  },
  {
    group: "C",
    teams: ["Brazil", "Morocco", "Haiti", "Scotland"]
  },
  {
    group: "D",
    teams: ["United States", "Paraguay", "Australia", "Türkiye"]
  },
  {
    group: "E",
    teams: ["Germany", "Curaçao", "Ivory Coast", "Ecuador"]
  },
  {
    group: "F",
    teams: ["Netherlands", "Japan", "Sweden", "Tunisia"]
  },
  {
    group: "G",
    teams: ["Belgium", "Egypt", "Iran", "New Zealand"]
  },
  {
    group: "H",
    teams: ["Spain", "Cape Verde", "Saudi Arabia", "Uruguay"]
  },
  {
    group: "I",
    teams: ["France", "Senegal", "Iraq", "Norway"]
  },
  {
    group: "J",
    teams: ["Argentina", "Algeria", "Austria", "Jordan"]
  },
  {
    group: "K",
    teams: ["Portugal", "DR Congo", "Uzbekistan", "Colombia"]
  },
  {
    group: "L",
    teams: ["England", "Croatia", "Ghana", "Panama"]
  }
];

// 2. Utility & Helper Functions
const GroupStageManager = {
  /**
   * Returns all groups and their respective teams
   */
  getAllGroups: () => {
    return worldCup2026Groups;
  },

  /**
   * Find a specific group by its letter identifier (A-L)
   * @param {string} letter - e.g., 'A', 'I', 'L'
   */
  getGroup: (letter) => {
    if (!letter) return null;
    const searchLetter = letter.toUpperCase().trim();
    return worldCup2026Groups.find(g => g.group === searchLetter) || null;
  },

  /**
   * Locates which group a specific country belongs to
   * @param {string} countryName 
   */
  findTeamGroup: (countryName) => {
    if (!countryName) return null;
    const cleanName = countryName.toLowerCase().trim();
    
    const found = worldCup2026Groups.find(g => 
      g.teams.some(team => team.toLowerCase() === cleanName)
    );
    
    return found ? { team: countryName, group: found.group, groupTeams: found.teams } : null;
  },

  /**
   * Helper function to return a clean alphabetical array of all 48 qualified nations
   */
  getAllQualifiedTeams: () => {
    const allTeams = [];
    worldCup2026Groups.forEach(g => {
      allTeams.push(...g.teams);
    });
    return allTeams.sort();
  }
};

// 3. System Initialization / Demonstration Runtime
function initApp() {
  console.log("=== 2026 FIFA World Cup Group Stage Module Initialized ===");
  console.log(`Total Groups Loaded: ${worldCup2026Groups.length} (Groups A to L)`);
  console.log(`Total Teams Confirmed: ${GroupStageManager.getAllQualifiedTeams().length} Teams\n`);

  // Example Test 1: Fetch all teams in Group I (Verifying Italy removal / Norway inclusion)
  const groupI = GroupStageManager.getGroup("I");
  console.log("--- Group I Verification ---");
  if (groupI) {
    console.log(`Teams in Group I: ${groupI.teams.join(", ")}`);
  }

  // Example Test 2: Locate a specific team's group placement
  console.log("\n--- Team Search Test ---");
  const searchCountry = "Mexico";
  const searchResult = GroupStageManager.findTeamGroup(searchCountry);
  if (searchResult) {
    console.log(`Success: ${searchResult.team} is playing in Group ${searchResult.group}.`);
    console.log(`Group competitors: ${searchResult.groupTeams.filter(t => t !== searchCountry).join(", ")}`);
  } else {
    console.log(`Alert: Could not find "${searchCountry}" in the tournament groups.`);
  }
}

// Execute on script load
initApp();

// Export module logic safely for environments running Node.js components
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { worldCup2026Groups, GroupStageManager };
}
