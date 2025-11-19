import React, { useState, useEffect } from 'react';
import { Play, Pause, Users, TrendingUp, Building, Trophy, DollarSign, UserPlus, FileText, BarChart3 } from 'lucide-react';
import './FootballTycoon.css';

const FootballTycoon = () => {
  const SAVE_KEY = 'footballTycoonSave';

  // Save game to localStorage
  function saveGame(state) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  }

  // Load game from localStorage
  function loadGame() {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load game:', error);
    }
    return null;
  }

  // Delete save
  function deleteSave() {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (error) {
      console.error('Failed to delete save:', error);
    }
  }
// League structure with realistic financial data
const LEAGUES = {
  5: { 
    name: 'National League', 
    teams: 24, 
    avgSalary: 65000,
    avgRevenue: 1800000,
    tvRevenue: 100000,
    prizeFirst: 50000,
    prizePlayoff: 25000,
    facilityBaseCost: 300000
  },
  4: { 
    name: 'League Two', 
    teams: 24, 
    avgSalary: 110000,
    avgRevenue: 3800000,
    tvRevenue: 800000,
    prizeFirst: 150000,
    prizePlayoff: 75000,
    facilityBaseCost: 800000
  },
  3: { 
    name: 'League One', 
    teams: 24, 
    avgSalary: 180000,
    avgRevenue: 8500000,
    tvRevenue: 1500000,
    prizeFirst: 400000,
    prizePlayoff: 200000,
    facilityBaseCost: 2000000
  },
  2: { 
    name: 'Championship', 
    teams: 24, 
    avgSalary: 520000,
    avgRevenue: 32000000,
    tvRevenue: 7000000,
    prizeFirst: 5000000,
    prizePlayoff: 2500000,
    facilityBaseCost: 8000000
  },
  1: { 
    name: 'Premier League', 
    teams: 20, 
    avgSalary: 3200000,
    avgRevenue: 160000000,
    tvRevenue: 100000000,
    prizeFirst: 50000000,
    prizePlayoff: 0,
    facilityBaseCost: 30000000
  }
};

const FACILITIES = [
  { name: 'Training Ground', level: 0, maxLevel: 5, baseCost: 1000000, performanceBonus: 1, attendanceBonus: 0, maintenanceCost: 30000 },
  { name: 'Stadium', level: 0, maxLevel: 5, baseCost: 2000000, performanceBonus: 0, attendanceBonus: 5, maintenanceCost: 50000, capacity: 5000 },
  { name: 'Youth Academy', level: 0, maxLevel: 5, baseCost: 800000, performanceBonus: 1, attendanceBonus: 0, maintenanceCost: 20000 },
  { name: 'Medical Center', level: 0, maxLevel: 5, baseCost: 800000, performanceBonus: 1, attendanceBonus: 0, maintenanceCost: 15000 }
];

const STADIUM_CAPACITIES = {
  0: 3000,
  1: 8000,
  2: 12000,
  3: 18000,
  4: 25000,
  5: 50000
};

const POSITIONS = ['GK', 'DEF', 'MID', 'FWD'];

const TEAM_NAMES = {
  5: [ // National League - add more teams
    'Eastleigh FC', 'Halifax Town', 'Barrow AFC', 'Gateshead FC', 'Aldershot Town',
    'Southend United', 'Yeovil Town', 'Oldham Athletic', 'Bromley FC', 'Solihull Moors',
    'Hartlepool United', 'Dagenham & Redbridge', 'Ebbsfleet United', 'Sutton United',
    'Woking FC', 'Altrincham FC', 'Maidenhead United', 'Boreham Wood', 'Dorking Wanderers',
    'Wealdstone FC', 'York City', 'Rochdale AFC', 'FC Halifax Town', 'Chesterfield FC',
    // Add more reserve teams
    'Tamworth FC', 'Kidderminster', 'Forest Green', 'Torquay United', 'Wrexham AFC',
    'Notts County', 'Stockport County', 'Macclesfield Town', 'Chester FC'
  ],
  4: [ // League Two - add more
    'Stockport County', 'Wrexham AFC', 'Notts County', 'Mansfield Town', 'Crawley Town',
    'Doncaster Rovers', 'Crewe Alexandra', 'Bradford City', 'Grimsby Town', 'Salford City',
    'Harrogate Town', 'Colchester United', 'Swindon Town', 'Walsall FC', 'Newport County',
    'Tranmere Rovers', 'Barrow AFC', 'AFC Wimbledon', 'Morecambe FC', 'Gillingham FC',
    'Carlisle United', 'Accrington Stanley', 'Chesterfield FC', 'Bromley FC',
    // Add more
    'Oldham Athletic', 'Scunthorpe United', 'Southend United', 'Stevenage FC'
  ],
  3: [ // League One - add more
    'Bolton Wanderers', 'Derby County', 'Portsmouth FC', 'Oxford United', 'Barnsley FC',
    'Peterborough United', 'Blackpool FC', 'Lincoln City', 'Stevenage FC', 'Northampton Town',
    'Reading FC', 'Exeter City', 'Charlton Athletic', 'Wycombe Wanderers', 'Leyton Orient',
    'Burton Albion', 'Bristol Rovers', 'Shrewsbury Town', 'Cambridge United', 'Fleetwood Town',
    'Port Vale', 'Cheltenham Town', 'Carlisle United', 'MK Dons',
    // Add more
    'Ipswich Town', 'Sunderland AFC', 'Sheffield Wednesday', 'Plymouth Argyle'
  ],
  2: [ // Championship - add more
    'Leeds United', 'Leicester City', 'Ipswich Town', 'Southampton FC', 'West Bromwich Albion',
    'Norwich City', 'Coventry City', 'Hull City', 'Middlesbrough FC', 'Preston North End',
    'Bristol City', 'Swansea City', 'Sheffield Wednesday', 'Stoke City', 'Millwall FC',
    'Blackburn Rovers', 'Watford FC', 'Queens Park Rangers', 'Cardiff City', 'Plymouth Argyle',
    'Birmingham City', 'Rotherham United', 'Huddersfield Town', 'Sunderland AFC',
    // Add more
    'Derby County', 'Portsmouth FC', 'Sheffield United', 'Burnley FC'
  ],
  1: [ // Premier League
    'Manchester City', 'Arsenal FC', 'Liverpool FC', 'Aston Villa', 'Tottenham Hotspur',
    'Chelsea FC', 'Newcastle United', 'Manchester United', 'West Ham United', 'Brighton & Hove Albion',
    'Bournemouth AFC', 'Crystal Palace', 'Fulham FC', 'Wolverhampton Wanderers', 'Everton FC',
    'Brentford FC', 'Nottingham Forest', 'Luton Town', 'Burnley FC', 'Sheffield United',
    // These are extras for when teams get relegated/promoted
    'Leeds United', 'Leicester City', 'Southampton FC', 'Ipswich Town'
  ]
};

const [freeAgentMessage, setFreeAgentMessage] = useState(null);
const [transferMessage, setTransferMessage] = useState(null);

const [view, setView] = useState('start'); // start, main, freeagents, standings, contracts, gameover, transfer
const [selectedPlayer, setSelectedPlayer] = useState(null);
const [contractOffer, setContractOffer] = useState({ years: 1, salary: 0 });
const [teamNameInput, setTeamNameInput] = useState('');
const [gameOverReason, setGameOverReason] = useState(null);

// Initialize game state
const [gameState, setGameState] = useState(() => {
  // Try to load saved game on initial mount
  const savedGame = loadGame();
  return savedGame;
});

function initializeGame(teamName) {
  const initialState = {
    season: 1,
    league: 5,
    matchday: 0,
    money: 2000000,
    reputation: 50,
    facilities: JSON.parse(JSON.stringify(FACILITIES)),
    squad: [],
    seasonGoal: 'Top 7 (Playoffs)',
    paused: true,
    lastSeasonFinish: null,
    teamName: teamName || 'Your Club FC',
    matches: [],
    standings: [],
    freeAgents: [],
    seasonPhase: 'regular', // regular, offseason
    contractNegotiations: [],
    averageAttendance: 0,
    totalAttendance: 0,
    accumulatedTicketRevenue: 0,
    homeGames: 0,
    transferOffers: [], // Track transfer offers for players
    isTransferWindow: false, // Whether transfer window is open
  };
  
  // Generate initial squad
  const positions = { GK: 3, DEF: 8, MID: 8, FWD: 6 };
  
  Object.entries(positions).forEach(([pos, count]) => {
    for (let i = 0; i < count; i++) {
      initialState.squad.push(generatePlayer(pos, 5, initialState.reputation));
    }
  });

  // Generate initial standings
  initialState.standings = generateStandings(5, initialState.teamName);
  
  // Generate free agents
  initialState.freeAgents = generateFreeAgents(5, initialState.reputation, 30);
  
  setGameState(initialState);
  setView('main');
}

function generatePlayer(position, league, reputation, isYoung = false) {
  // Define realistic rating ranges per league
  let minRating, maxRating;
  
  switch(league) {
    case 5: // National League
      minRating = 45;
      maxRating = 68;
      break;
    case 4: // League Two
      minRating = 55;
      maxRating = 72;
      break;
    case 3: // League One
      minRating = 60;
      maxRating = 76;
      break;
    case 2: // Championship
      minRating = 65;
      maxRating = 82;
      break;
    case 1: // Premier League
      minRating = 70;
      maxRating = 92;
      break;
    default:
      minRating = 45;
      maxRating = 68;
  }
  
  const ratingRange = maxRating - minRating;
  const baseRating = minRating + Math.floor(Math.random() * ratingRange);
  const repBonus = Math.floor(reputation / 25);
  const rating = Math.min(maxRating, baseRating + repBonus);
  
  const names = {
    first: ['Jack', 'Tom', 'James', 'Connor', 'Lewis', 'Ryan', 'Luke', 'Josh', 'Sam', 'Dan', 'Chris', 'Alex', 'Ben', 'Matt', 'Joe', 'Charlie', 'Harry', 'Liam', 'Adam', 'Kyle'],
    last: ['Smith', 'Jones', 'Taylor', 'Brown', 'Wilson', 'Evans', 'Davies', 'Roberts', 'Walker', 'Thompson', 'Clarke', 'Hughes', 'Edwards', 'Harris', 'Moore', 'Allen', 'Young', 'Hall', 'Green', 'Baker']
  };
  
  const age = isYoung ? (17 + Math.floor(Math.random() * 5)) : (18 + Math.floor(Math.random() * 15));
  
  // Calculate salary based on rating brackets
  const salary = calculateMarketValue({ rating, age, position, seasonStats: { appearances: 0 } }, league);
  
  // Generate detailed stats
  const pace = Math.max(30, Math.min(99, rating + Math.floor(Math.random() * 20 - 10)));
  const shooting = position === 'FWD' ? Math.max(30, Math.min(99, rating + Math.floor(Math.random() * 15))) :
                   position === 'MID' ? Math.max(30, Math.min(99, rating + Math.floor(Math.random() * 10 - 5))) :
                   Math.max(30, Math.min(99, rating - 10 + Math.floor(Math.random() * 10)));
  const passing = position === 'MID' ? Math.max(30, Math.min(99, rating + Math.floor(Math.random() * 15))) :
                  Math.max(30, Math.min(99, rating + Math.floor(Math.random() * 10 - 5)));
  const defending = position === 'DEF' ? Math.max(30, Math.min(99, rating + Math.floor(Math.random() * 15))) :
                    position === 'GK' ? Math.max(30, Math.min(99, rating + Math.floor(Math.random() * 10))) :
                    Math.max(30, Math.min(99, rating - 10 + Math.floor(Math.random() * 10)));
  const physical = Math.max(30, Math.min(99, rating + Math.floor(Math.random() * 20 - 10)));
  
  return {
    id: Date.now() + Math.random(),
    name: `${names.first[Math.floor(Math.random() * names.first.length)]} ${names.last[Math.floor(Math.random() * names.last.length)]}`,
    position,
    rating,
    age,
    salary,
    contractYears: 1 + Math.floor(Math.random() * 3),
    stats: {
      pace,
      shooting,
      passing,
      defending,
      physical
    },
    seasonStats: {
      appearances: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0
    },
    morale: 50 + Math.floor(Math.random() * 30)
  };
}

function generateFreeAgents(league, reputation, count) {
  const agents = [];
  const positions = { GK: 2, DEF: 10, MID: 10, FWD: 8 };
  
  Object.entries(positions).forEach(([pos, posCount]) => {
    for (let i = 0; i < posCount; i++) {
      agents.push(generatePlayer(pos, league, reputation));
    }
  });
  
  return agents.sort((a, b) => b.rating - a.rating);
}

function generateStandings(league, playerTeam) {
  const leagueData = LEAGUES[league];
  const teams = [playerTeam, ...TEAM_NAMES[league].slice(0, leagueData.teams - 1)];
  
  return teams.map((team, index) => {
    // League-specific rating ranges
    let minRating, maxRating;
    
    switch(league) {
      case 5: // National League
        minRating = 50;
        maxRating = 66; // Now top teams can reach 66 (vs player pool of 45-68)
        break;
      case 4: // League Two
        minRating = 58;
        maxRating = 71; // Top teams 71 (vs player pool of 55-72)
        break;
      case 3: // League One
        minRating = 64;
        maxRating = 76; // Top teams 76 (vs player pool of 60-76)
        break;
      case 2: // Championship
        minRating = 70;
        maxRating = 82; // Top teams 82 (vs player pool of 65-82)
        break;
      case 1: // Premier League
        minRating = 80;
        maxRating = 95; // Big 6 are 88-95 (vs player pool of 70-92)
        break;
      default:
        minRating = 50;
        maxRating = 66;
    }
    
    // Create more realistic distribution
    // Top teams are much better, bottom teams closer to relegation zone
    const positionInLeague = index; // 0 = first in list, not necessarily best
    const totalTeams = leagueData.teams;
    
    // Use a curve so top teams are better and there's more spread
    // This creates a realistic distribution where top 6 are significantly better
    let teamRating;
    
    if (team === playerTeam) {
      // Player team starts in middle of the pack
      teamRating = Math.round((minRating + maxRating) / 2);
    } else {
      // Create realistic spread with better teams at top
      const positionFactor = positionInLeague / (totalTeams - 1); // 0 to 1
      
      // Use exponential curve for Premier League to create "Big 6" effect
      if (league === 1 && positionInLeague < 6) {
        // Top 6 teams are 88-95 rated
        teamRating = Math.round(95 - (positionInLeague * 1.0));
      } else if (league === 1) {
        // Rest of PL: 80-89
        const restMinRating = 80;
        const restMaxRating = 89;
        const adjustedPosition = (positionInLeague - 6) / (totalTeams - 7);
        teamRating = Math.round(restMaxRating - (adjustedPosition * (restMaxRating - restMinRating)));
      } else {
        // Other leagues: more linear but with variance
        const range = maxRating - minRating;
        const baseForPosition = maxRating - (positionFactor * range);
        const variance = range * 0.15; // ±15% variance
        teamRating = Math.round(baseForPosition + (Math.random() - 0.5) * variance);
      }
      
      // Clamp to min/max
      teamRating = Math.max(minRating, Math.min(maxRating, teamRating));
    }
    
    return {
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      position: index + 1,
      isPlayer: team === playerTeam,
      rating: team === playerTeam ? 0 : teamRating
    };
  });
}

function calculateTeamRating(squad) {
  if (squad.length === 0) return 0;
  
  // Separate players by position
  const gks = squad.filter(p => p.position === 'GK').sort((a, b) => b.rating - a.rating);
  const defs = squad.filter(p => p.position === 'DEF').sort((a, b) => b.rating - a.rating);
  const mids = squad.filter(p => p.position === 'MID').sort((a, b) => b.rating - a.rating);
  const fwds = squad.filter(p => p.position === 'FWD').sort((a, b) => b.rating - a.rating);
  
  // Valid formations: [DEF, MID, FWD]
  const formations = [
    [4, 4, 2],
    [4, 3, 3],
    [4, 5, 1],
    [5, 4, 1],
    [5, 3, 2],
    [3, 5, 2],
    [3, 4, 3]
  ];
  
  let bestFormation = null;
  let bestRating = 0;
  
  // Try each formation and find the best one
  formations.forEach(([numDef, numMid, numFwd]) => {
    // Check if we have enough players for this formation
    if (gks.length < 1 || defs.length < numDef || 
        mids.length < numMid || fwds.length < numFwd) {
      return; // Skip this formation
    }
    
    // Get best players for this formation
    const starter_gk = gks[0];
    const starter_defs = defs.slice(0, numDef);
    const starter_mids = mids.slice(0, numMid);
    const starter_fwds = fwds.slice(0, numFwd);
    
    // Calculate average rating for this formation
    const allStarters = [starter_gk, ...starter_defs, ...starter_mids, ...starter_fwds];
    const formationRating = allStarters.reduce((sum, p) => sum + p.rating, 0) / 11;
    
    if (formationRating > bestRating) {
      bestRating = formationRating;
      bestFormation = {
        starters: allStarters,
        formation: [numDef, numMid, numFwd],
        gk: starter_gk,
        def: starter_defs,
        mid: starter_mids,
        fwd: starter_fwds
      };
    }
  });
  
  // Fallback if no valid formation found (shouldn't happen with proper squad)
  if (!bestFormation) {
    const sortedSquad = [...squad].sort((a, b) => b.rating - a.rating);
    const top11 = sortedSquad.slice(0, 11);
    bestFormation = { starters: top11 };
  }
  
  const starters = bestFormation.starters;
  const startersAvg = starters.reduce((sum, p) => sum + p.rating, 0) / starters.length;
  
  // Get bench players (next best 7 not in starting 11)
  const starterIds = new Set(starters.map(p => p.id));
  const nonStarters = squad.filter(p => !starterIds.has(p.id))
    .sort((a, b) => b.rating - a.rating);
  
  const bench = nonStarters.slice(0, 7);
  const benchAvg = bench.length > 0 
    ? bench.reduce((sum, p) => sum + p.rating, 0) / bench.length 
    : startersAvg;
  
  // Reserves (rest of squad)
  const reserves = nonStarters.slice(7);
  const reservesAvg = reserves.length > 0
    ? reserves.reduce((sum, p) => sum + p.rating, 0) / reserves.length
    : benchAvg;
  
  // Weighted average: 80% starters, 15% bench, 5% reserves
  const weightedRating = (startersAvg * 0.80) + (benchAvg * 0.15) + (reservesAvg * 0.05);
  
  // Small bonuses from facilities (max +3)
  const facilityBonus = gameState.facilities.reduce((sum, f) => 
    sum + (f.level * f.performanceBonus * 0.3), 0);
  
  // Small morale bonus (max ±2)
  const avgMorale = squad.reduce((sum, p) => sum + p.morale, 0) / squad.length;
  const moraleBonus = (avgMorale - 50) / 25;
  
  const finalRating = weightedRating + facilityBonus + moraleBonus;
  
  return Math.round(Math.max(40, Math.min(99, finalRating)));
}

function simulateMatch(homeTeam, awayTeam, isPlayerHome) {
  const homeRating = isPlayerHome ? calculateTeamRating(gameState.squad) : 
                     gameState.standings.find(t => t.team === homeTeam)?.rating || 55;
  const awayRating = !isPlayerHome && awayTeam === gameState.teamName ? calculateTeamRating(gameState.squad) :
                     gameState.standings.find(t => t.team === awayTeam)?.rating || 55;
  
  // Home advantage
  const adjustedHomeRating = homeRating + 3;
  
  // Calculate expected goals based on team ratings
  const ratingDiff = adjustedHomeRating - awayRating;
  const homeExpectedGoals = Math.max(0.3, 1.3 + (ratingDiff / 25) + (Math.random() * 1.2 - 0.4));
  const awayExpectedGoals = Math.max(0.3, 1.0 - (ratingDiff / 30) + (Math.random() * 1.2 - 0.4));
  
  // Generate actual goals with Poisson-like distribution
  const homeGoals = Math.floor(homeExpectedGoals + (Math.random() > 0.7 ? 1 : 0));
  const awayGoals = Math.floor(awayExpectedGoals + (Math.random() > 0.7 ? 1 : 0));
  
  // Update player stats if player team involved
  if (homeTeam === gameState.teamName || awayTeam === gameState.teamName) {
    const isPlayerTeam = homeTeam === gameState.teamName;
    const playerGoals = isPlayerTeam ? homeGoals : awayGoals;
    
    updatePlayerMatchStats(playerGoals);
  }
  
  return {
    homeTeam,
    awayTeam,
    homeGoals,
    awayGoals,
    result: homeGoals > awayGoals ? 'home' : homeGoals < awayGoals ? 'away' : 'draw'
  };
}

function updatePlayerMatchStats(goalsScored) {
  setGameState(prev => {
    // Get starters using the same formation logic as team rating
    const gks = prev.squad.filter(p => p.position === 'GK').sort((a, b) => b.rating - a.rating);
    const defs = prev.squad.filter(p => p.position === 'DEF').sort((a, b) => b.rating - a.rating);
    const mids = prev.squad.filter(p => p.position === 'MID').sort((a, b) => b.rating - a.rating);
    const fwds = prev.squad.filter(p => p.position === 'FWD').sort((a, b) => b.rating - a.rating);
    
    // Valid formations: [DEF, MID, FWD]
    const formations = [
      [4, 4, 2],
      [4, 3, 3],
      [4, 5, 1],
      [5, 4, 1],
      [5, 3, 2],
      [3, 5, 2],
      [3, 4, 3]
    ];
    
    let bestFormation = null;
    let bestRating = 0;
    
    // Try each formation and find the best one
    formations.forEach(([numDef, numMid, numFwd]) => {
      // Check if we have enough players for this formation
      if (gks.length < 1 || defs.length < numDef || 
          mids.length < numMid || fwds.length < numFwd) {
        return; // Skip this formation
      }
      
      // Get best players for this formation
      const starter_gk = gks[0];
      const starter_defs = defs.slice(0, numDef);
      const starter_mids = mids.slice(0, numMid);
      const starter_fwds = fwds.slice(0, numFwd);
      
      // Calculate average rating for this formation
      const allStarters = [starter_gk, ...starter_defs, ...starter_mids, ...starter_fwds];
      const formationRating = allStarters.reduce((sum, p) => sum + p.rating, 0) / 11;
      
      if (formationRating > bestRating) {
        bestRating = formationRating;
        bestFormation = {
          starters: allStarters,
          formation: [numDef, numMid, numFwd]
        };
      }
    });
    
    // Fallback if no valid formation found
    if (!bestFormation) {
      const sortedSquad = [...prev.squad].sort((a, b) => b.rating - a.rating);
      bestFormation = { starters: sortedSquad.slice(0, 11) };
    }
    
    const starters = bestFormation.starters;
    const starterIds = new Set(starters.map(p => p.id));
    // Track goals assigned to ensure we match the match score
    let goalsAssigned = 0;
    const goalScorers = [];
    
    // First pass: determine who scored
    if (goalsScored > 0) {
      const eligibleScorers = prev.squad
        .filter(p => starterIds.has(p.id) && p.position !== 'GK')
        .map(player => {
          let goalChance = 0;
          
          // Base chances by position
          if (player.position === 'FWD') {
            goalChance = 0.5;
          } else if (player.position === 'MID') {
            goalChance = 0.25;
          } else if (player.position === 'DEF') {
            goalChance = 0.04;
          }
          
          // Scale by rating and shooting
          const ratingMultiplier = (player.rating / 65);
          const shootingMultiplier = (player.stats.shooting / 65);
          goalChance *= ratingMultiplier * shootingMultiplier;
          
          return { player, goalChance };
        })
        .sort((a, b) => b.goalChance - a.goalChance);
      
      // Assign goals to players based on probability
      for (let i = 0; i < goalsScored; i++) {
        const totalChance = eligibleScorers.reduce((sum, s) => sum + s.goalChance, 0);
        let roll = Math.random() * totalChance;
        
        for (const scorer of eligibleScorers) {
          roll -= scorer.goalChance;
          if (roll <= 0) {
            goalScorers.push(scorer.player.id);
            break;
          }
        }
      }
    }
    
    let updatedSquad = prev.squad.map(player => {
      const isStarter = starterIds.has(player.id);
      
      // Starters play 95% of games, bench players 30%
      const playChance = isStarter ? 0.95 : 0.3;
      const isPlaying = Math.random() < playChance;
      
      if (!isPlaying) return player;
      
      const newStats = { ...player.seasonStats, appearances: player.seasonStats.appearances + 1 };
      
      // Assign goals based on our pre-calculated goal scorers
      const goalsThisMatch = goalScorers.filter(id => id === player.id).length;
      newStats.goals += goalsThisMatch;
      
      // Cards - more likely for defenders and physical players
      const cardChance = player.position === 'DEF' ? 0.12 : 0.08;
      if (Math.random() < cardChance) newStats.yellowCards++;
      if (Math.random() < 0.008) newStats.redCards++;
      
      return { ...player, seasonStats: newStats };
    });

    // NOW assign assists - one assist per goal (with some unassisted)
    const eligibleAssisters = updatedSquad.filter(p => {
      const isStarter = starterIds.has(p.id);
      const playChance = isStarter ? 0.95 : 0.3;
      // Only players who played can assist
      return p.position !== 'GK' && p.seasonStats.appearances > 0;
    });

    for (let i = 0; i < goalsScored; i++) {
      // 10% chance the goal is unassisted (e.g., solo effort, defensive error)
      if (Math.random() < 0.10) continue;
      
      // Calculate assist probability for each player
      const assistProbabilities = eligibleAssisters.map(player => {
        const isStarter = starterIds.has(player.id);
        let assistChance = 0;
        
        // Midfielders are the primary assist providers
        if (player.position === 'MID') {
          assistChance = isStarter ? 0.50 : 0.12;
        } else if (player.position === 'FWD') {
          // Forwards assist each other frequently
          assistChance = isStarter ? 0.35 : 0.10;
        } else if (player.position === 'DEF') {
          // Defenders occasionally assist (crosses, set pieces)
          assistChance = isStarter ? 0.15 : 0.03;
        }
        
        // Weight heavily by passing ability and overall rating
        const passingMultiplier = (player.stats.passing / 65);
        const ratingMultiplier = (player.rating / 65);
        assistChance *= passingMultiplier * ratingMultiplier;
        
        return { player, assistChance };
      });
      
      // Pick one assister based on probability
      const totalChance = assistProbabilities.reduce((sum, p) => sum + p.assistChance, 0);
      if (totalChance === 0) continue;
      
      let roll = Math.random() * totalChance;
      
      for (const { player, assistChance } of assistProbabilities) {
        roll -= assistChance;
        if (roll <= 0) {
          // Find this player in updatedSquad and add assist
          updatedSquad = updatedSquad.map(p => {
            if (p.id === player.id) {
              return {
                ...p,
                seasonStats: {
                  ...p.seasonStats,
                  assists: p.seasonStats.assists + 1
                }
              };
            }
            return p;
          });
          break;
        }
      }
    }

    return { ...prev, squad: updatedSquad };
  });
}

function updateStandings(match) {
  setGameState(prev => {
    const updatedStandings = prev.standings.map(team => {
      if (team.team !== match.homeTeam && team.team !== match.awayTeam) return team;
      
      const isHome = team.team === match.homeTeam;
      const goalsFor = isHome ? match.homeGoals : match.awayGoals;
      const goalsAgainst = isHome ? match.awayGoals : match.homeGoals;
      
      let points = team.points;
      let won = team.won;
      let drawn = team.drawn;
      let lost = team.lost;
      
      if (match.result === 'draw') {
        points += 1;
        drawn += 1;
      } else if ((isHome && match.result === 'home') || (!isHome && match.result === 'away')) {
        points += 3;
        won += 1;
      } else {
        lost += 1;
      }
      
      return {
        ...team,
        played: team.played + 1,
        won,
        drawn,
        lost,
        goalsFor: team.goalsFor + goalsFor,
        goalsAgainst: team.goalsAgainst + goalsAgainst,
        goalDifference: (team.goalsFor + goalsFor) - (team.goalsAgainst + goalsAgainst),
        points
      };
    });
    
    // Sort standings
    const sorted = updatedStandings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    }).map((team, index) => ({ ...team, position: index + 1 }));
    
    return { ...prev, standings: sorted };
  });
}

function simulateMatchday() {
  const leagueData = LEAGUES[gameState.league];
  const newMatches = [];
  
  // Simulate all matches for this matchday
  const shuffledTeams = [...gameState.standings].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < shuffledTeams.length; i += 2) {
    if (i + 1 < shuffledTeams.length) {
      const isPlayerHome = shuffledTeams[i].team === gameState.teamName;
      const match = simulateMatch(
        shuffledTeams[i].team, 
        shuffledTeams[i + 1].team,
        isPlayerHome
      );
      newMatches.push(match);
      updateStandings(match);
      
      // Calculate attendance for player's home games
      if (isPlayerHome) {
        const stadium = gameState.facilities.find(f => f.name === 'Stadium');
        const capacity = STADIUM_CAPACITIES[stadium.level];
        const playerStanding = gameState.standings.find(t => t.team === gameState.teamName);
        
        // Base attendance factors
        const leagueAppeal = (6 - gameState.league) * 0.05; // Higher leagues = more fans
        const positionBonus = (25 - playerStanding.position) / 25; // Better position = more fans
        const reputationBonus = gameState.reputation / 200; // Up to 0.5
        const facilityBonus = (stadium.level * stadium.attendanceBonus) / 100; // Stadium attendance bonus
        
        // Calculate attendance percentage (40% to 98% of capacity)
        let attendanceRate = 0.4 + leagueAppeal + positionBonus * 0.3 + reputationBonus + facilityBonus;
        attendanceRate += (Math.random() - 0.5) * 0.15; // ±7.5% randomness
        attendanceRate = Math.max(0.35, Math.min(0.98, attendanceRate));
        
        const attendance = Math.floor(capacity * attendanceRate);
        const ticketPrice = 15 + (6 - gameState.league) * 8; // £15-55 per ticket
        const ticketRevenue = attendance * ticketPrice;
        
        setGameState(prev => ({
          ...prev,
          accumulatedTicketRevenue: prev.accumulatedTicketRevenue + ticketRevenue, // Store instead of add
          totalAttendance: prev.totalAttendance + attendance,
          homeGames: prev.homeGames + 1,
          averageAttendance: Math.round((prev.totalAttendance + attendance) / (prev.homeGames + 1))
        }));
      }
    }
  }
  
  setGameState(prev => {
    const newMatchday = prev.matchday + 1;
    const leagueData = LEAGUES[prev.league];
    const transferWindowStart = Math.floor((leagueData.teams - 1) * 0.5); // Opens at halfway point
    const transferWindowEnd = transferWindowStart + 4; // Stays open for 4 matchdays
    
    return {
      ...prev,
      matches: [...newMatches, ...prev.matches].slice(0, 50),
      matchday: newMatchday,
      isTransferWindow: newMatchday >= transferWindowStart && newMatchday <= transferWindowEnd
    };
  });

}

function endSeason() {
  const playerStanding = gameState.standings.find(t => t.team === gameState.teamName);
  const leagueData = LEAGUES[gameState.league];
  let promoted = false;
  let relegated = false;
  let prize = 0;
  let message = '';
  let playoffDetails = null;

  // Promotion/relegation logic
  if (playerStanding.position === 1) {
    promoted = true;
    prize = leagueData.prizeFirst;
    message = `🏆 CHAMPIONS! Automatic promotion to ${LEAGUES[gameState.league - 1]?.name || 'Premier League'}!`;
  } else if (playerStanding.position >= 2 && playerStanding.position <= 7) {
    // Playoff simulation with detailed results
    const playoffTeams = gameState.standings
      .filter(t => t.position >= 2 && t.position <= 7)
      .sort((a, b) => a.position - b.position);
    
    // Semi-finals: 2v5, 3v6, 4v7
    const semis = [
      { team1: playoffTeams[0], team2: playoffTeams[3] }, // 2 vs 5
      { team1: playoffTeams[1], team2: playoffTeams[4] }, // 3 vs 6
      { team1: playoffTeams[2], team2: playoffTeams[5] }  // 4 vs 7
    ];
    
    const semiResults = semis.map(semi => {
      const team1Rating = semi.team1.isPlayer ? calculateTeamRating(gameState.squad) : semi.team1.rating;
      const team2Rating = semi.team2.isPlayer ? calculateTeamRating(gameState.squad) : semi.team2.rating;
      
      // Two-legged tie
      const leg1 = simulatePlayoffLeg(team1Rating, team2Rating);
      const leg2 = simulatePlayoffLeg(team2Rating, team1Rating);
      
      const team1Total = leg1.home + leg2.away;
      const team2Total = leg1.away + leg2.home;
      
      let winner;
      if (team1Total > team2Total) {
        winner = semi.team1;
      } else if (team2Total > team1Total) {
        winner = semi.team2;
      } else {
        // If tied, higher seed wins
        winner = semi.team1;
      }
      
      return {
        team1: semi.team1.team,
        team2: semi.team2.team,
        leg1Score: `${leg1.home}-${leg1.away}`,
        leg2Score: `${leg2.home}-${leg2.away}`,
        aggregate: `${team1Total}-${team2Total}`,
        winner: winner.team,
        winnerObj: winner
      };
    });
    
    // Check if player made it through
    const playerInFinal = semiResults.some(r => r.winner === gameState.teamName);
    
    if (!playerInFinal) {
      prize = leagueData.prizePlayoff * 0.3;
      message = `😔 Lost in playoff semi-finals. Finished ${playerStanding.position}${getOrdinal(playerStanding.position)}. Stay in ${leagueData.name}.`;
      playoffDetails = { stage: 'Semi-Final', results: semiResults };
    } else {
      // Player in final - simulate final
      const otherFinalists = semiResults.filter(r => r.winner !== gameState.teamName).map(r => r.winnerObj);
      const opponent = otherFinalists[Math.floor(Math.random() * otherFinalists.length)];
      
      const playerRating = calculateTeamRating(gameState.squad);
      const opponentRating = opponent.rating;
      
      const finalLeg1 = simulatePlayoffLeg(playerRating, opponentRating);
      const finalLeg2 = simulatePlayoffLeg(opponentRating, playerRating);
      
      const playerTotal = finalLeg1.home + finalLeg2.away;
      const opponentTotal = finalLeg1.away + finalLeg2.home;
      
      const wonFinal = playerTotal > opponentTotal || (playerTotal === opponentTotal && Math.random() > 0.5);
      
      const finalResult = {
        team1: gameState.teamName,
        team2: opponent.team,
        leg1Score: `${finalLeg1.home}-${finalLeg1.away}`,
        leg2Score: `${finalLeg2.home}-${finalLeg2.away}`,
        aggregate: `${playerTotal}-${opponentTotal}`,
        winner: wonFinal ? gameState.teamName : opponent.team
      };
      
      if (wonFinal) {
        promoted = true;
        prize = leagueData.prizePlayoff;
        message = `⚽ PLAYOFF WINNERS! Promoted to ${LEAGUES[gameState.league - 1]?.name || 'Premier League'}!`;
        playoffDetails = { stage: 'Final - WON', results: [...semiResults, finalResult] };
      } else {
        prize = leagueData.prizePlayoff * 0.6;
        message = `😔 Lost in playoff final. Finished ${playerStanding.position}${getOrdinal(playerStanding.position)}. Stay in ${leagueData.name}.`;
        playoffDetails = { stage: 'Final - LOST', results: [...semiResults, finalResult] };
      }
    }
  } else if (playerStanding.position >= leagueData.teams - 3 && gameState.league < 5) {
    relegated = true;
    message = `📉 Relegated to ${LEAGUES[gameState.league + 1].name}. Finished ${playerStanding.position}${getOrdinal(playerStanding.position)}.`;
  } else {
    message = `😐 Finished ${playerStanding.position}${getOrdinal(playerStanding.position)} in ${leagueData.name}.`;
  }

  // Calculate season finances with variance
  const tvRevenue = leagueData.tvRevenue * (0.9 + Math.random() * 0.2);
  const ticketRevenue = gameState.accumulatedTicketRevenue; // Add this line
  
  // Add promotion bonus
  let promotionBonus = 0;
  if (promoted) {
    if (gameState.league === 5) promotionBonus = 2000000; // National League to League Two
    else if (gameState.league === 4) promotionBonus = 4000000; // League Two to League One
    else if (gameState.league === 3) promotionBonus = 8000000; // League One to Championship
    else if (gameState.league === 2) promotionBonus = 30000000; // Championship to Premier League
  }
  
  const totalRevenue = tvRevenue + prize + promotionBonus + ticketRevenue;
  
  const wagesCost = gameState.squad.reduce((sum, p) => sum + p.salary, 0);
  const facilitiesCost = gameState.facilities.reduce((sum, f) => 
    sum + (f.maintenanceCost * f.level), 0);
  const operatingCost = leagueData.facilityBaseCost * (0.25 + Math.random() * 0.1);
  const totalCosts = wagesCost + facilitiesCost + operatingCost;
  
  const netIncome = totalRevenue - totalCosts;
  const newBalance = gameState.money + netIncome;

  // Check for bankruptcy - if more than £2M in debt, game over
  if (newBalance < -2000000) {
    setGameOverReason({
      reason: 'bankruptcy',
      finalBalance: newBalance,
      debt: Math.abs(newBalance),
      season: gameState.season,
      league: leagueData.name,
      position: playerStanding.position
    });
    setView('gameover');
    return;
  }

  // Prepare contract negotiations
  const contractNegotiations = gameState.squad
    .filter(p => p.contractYears <= 1 && p.age < 34)
    .map(p => ({ ...p, offer: null, status: 'pending' }));

  // Remove retiring players
  const retirees = gameState.squad.filter(p => p.age >= 34 && Math.random() > 0.3);

  setGameState(prev => ({
    ...prev,
    league: promoted ? Math.max(1, prev.league - 1) : (relegated ? Math.min(5, prev.league + 1) : prev.league),
    season: prev.season + 1,
    matchday: 0,
    money: newBalance,
    reputation: Math.min(100, Math.max(0, prev.reputation + (promoted ? 15 : relegated ? -10 : (playerStanding.position <= 7 ? 5 : -2)))),
    lastSeasonFinish: { 
      ...playerStanding, 
      message, 
      revenue: totalRevenue, 
      costs: totalCosts, 
      net: netIncome,
      promotionBonus,
      ticketRevenue,
      playoffDetails,
      operatingCost,
      wagesCost,
      facilitiesCost
    },
    seasonPhase: 'offseason',
    contractNegotiations,
    paused: true
  }));

  if (retirees.length > 0) {
    alert(`${retirees.map(p => p.name).join(', ')} have retired from professional football.`);
  }
}

function simulatePlayoffLeg(homeRating, awayRating) {
  const adjustedHomeRating = homeRating + 3;
  const ratingDiff = adjustedHomeRating - awayRating;
  const homeExpectedGoals = Math.max(0.3, 1.3 + (ratingDiff / 25) + (Math.random() * 1.2 - 0.4));
  const awayExpectedGoals = Math.max(0.3, 1.0 - (ratingDiff / 30) + (Math.random() * 1.2 - 0.4));
  
  const homeGoals = Math.floor(homeExpectedGoals + (Math.random() > 0.7 ? 1 : 0));
  const awayGoals = Math.floor(awayExpectedGoals + (Math.random() > 0.7 ? 1 : 0));
  
  return { home: homeGoals, away: awayGoals };
}

function processLeaguePromotionRelegation(league, playerPromoted, playerRelegated) {
  // Get current standings for this league
  const currentStandings = gameState.standings;
  
  // Determine who gets promoted and relegated
  let promotedTeams = [];
  let relegatedTeams = [];
  
  if (league === 5) {
    // National League: Top 1 auto, positions 2-7 playoffs
    // For simplicity, assume top 2 get promoted (champion + playoff winner)
    promotedTeams = currentStandings.slice(0, 2).map(t => t.team);
  } else if (league === 1) {
    // Premier League: Bottom 3 relegated
    relegatedTeams = currentStandings.slice(-3).map(t => t.team);
  } else {
    // Leagues 2-4: Top 3 (or top 2 + playoff winner) promoted, bottom 4 relegated
    promotedTeams = currentStandings.slice(0, 3).map(t => t.team);
    relegatedTeams = currentStandings.slice(-4).map(t => t.team);
  }
  
  // Remove player team from these lists
  promotedTeams = promotedTeams.filter(t => t !== gameState.teamName);
  relegatedTeams = relegatedTeams.filter(t => t !== gameState.teamName);
  
  return { promotedTeams, relegatedTeams };
}

function getReplacementTeams(league, count, excludeTeams) {
  // Get teams from the appropriate league that aren't already used
  const availableTeams = TEAM_NAMES[league].filter(team => 
    !excludeTeams.includes(team) && team !== gameState.teamName
  );
  
  // Shuffle and return requested count
  const shuffled = availableTeams.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function startNewSeason() {
  // Remove players who rejected contracts or had contracts expire
  const retainedPlayers = gameState.squad.filter(p => {
    const negotiation = gameState.contractNegotiations.find(n => n.id === p.id);
    if (!negotiation) return p.contractYears > 1;
    return negotiation.status === 'accepted';
  });

  // Age players, reduce contracts, and update ratings
  const updatedSquad = retainedPlayers.map(player => {
    const negotiation = gameState.contractNegotiations.find(n => n.id === player.id);
    const newAge = player.age + 1;
    
    // Rating progression/regression
    let ratingChange = 0;
    if (newAge <= 23) {
      // Young players improve more often
      ratingChange = Math.random() < 0.7 ? (Math.random() < 0.5 ? 2 : 1) : (Math.random() < 0.3 ? -1 : 0);
    } else if (newAge <= 28) {
      // Prime age players stay mostly stable
      ratingChange = Math.random() < 0.4 ? 1 : (Math.random() < 0.3 ? -1 : 0);
    } else if (newAge <= 32) {
      // Declining years
      ratingChange = Math.random() < 0.4 ? -1 : (Math.random() < 0.2 ? 1 : 0);
    } else {
      // Old players decline more
      ratingChange = Math.random() < 0.7 ? (Math.random() < 0.6 ? -2 : -1) : 0;
    }
    
    const newRating = Math.max(40, Math.min(99, player.rating + ratingChange));
    
    // Update stats proportionally to rating change
    const statChange = ratingChange;
    const newStats = {
      pace: Math.max(30, Math.min(99, player.stats.pace + statChange)),
      shooting: Math.max(30, Math.min(99, player.stats.shooting + statChange)),
      passing: Math.max(30, Math.min(99, player.stats.passing + statChange)),
      defending: Math.max(30, Math.min(99, player.stats.defending + statChange)),
      physical: Math.max(30, Math.min(99, player.stats.physical + (newAge > 30 ? statChange - 1 : statChange)))
    };
    
    return {
      ...player,
      age: newAge,
      rating: newRating,
      stats: newStats,
      contractYears: negotiation?.status === 'accepted' ? negotiation.offer.years : player.contractYears - 1,
      salary: negotiation?.status === 'accepted' ? negotiation.offer.salary : player.salary,
      seasonStats: {
        appearances: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0
      },
      transferOffers: [], // Reset transfer offers
      isTransferWindow: false // Close transfer window
    };
  });

   // Generate new standings with realistic promotion/relegation
  const newLeague = gameState.league;
  const leagueData = LEAGUES[newLeague];
  
  // Get teams that should stay in the current league
  let teamsForNewSeason = [];
  
  if (gameState.lastSeasonFinish) {
    // Process promotion/relegation from last season
    const { promotedTeams, relegatedTeams } = processLeaguePromotionRelegation(
      gameState.lastSeasonFinish.league || gameState.league,
      gameState.lastSeasonFinish.message.includes('promotion'),
      gameState.lastSeasonFinish.message.includes('Relegated')
    );
    
    // Get teams that weren't promoted or relegated (middle of table)
    const oldStandings = gameState.standings || [];
    const stayingTeams = oldStandings
      .filter(t => !t.isPlayer)
      .map(t => t.team)
      .filter(team => !promotedTeams.includes(team) && !relegatedTeams.includes(team));
    
    teamsForNewSeason = [...stayingTeams];
    
    // Add teams relegated from league above (if not in PL)
    if (newLeague < 5) {
      const relegatedFromAbove = getReplacementTeams(newLeague + 1, 3, teamsForNewSeason);
      teamsForNewSeason = [...teamsForNewSeason, ...relegatedFromAbove];
    }
    
    // Add teams promoted from league below (if not in National League)
    if (newLeague > 1) {
      const promotedFromBelow = getReplacementTeams(newLeague - 1, 3, teamsForNewSeason);
      teamsForNewSeason = [...teamsForNewSeason, ...promotedFromBelow];
    }
    
    // Fill remaining slots with fresh teams if needed
    const slotsNeeded = leagueData.teams - 1 - teamsForNewSeason.length;
    if (slotsNeeded > 0) {
      const fillerTeams = getReplacementTeams(newLeague, slotsNeeded, teamsForNewSeason);
      teamsForNewSeason = [...teamsForNewSeason, ...fillerTeams];
    }
    
    // Trim to correct size
    teamsForNewSeason = teamsForNewSeason.slice(0, leagueData.teams - 1);
  } else {
    // First season - just generate normally
    teamsForNewSeason = TEAM_NAMES[newLeague].slice(0, leagueData.teams - 1);
  }
  
  // Add player team
  const allTeams = [gameState.teamName, ...teamsForNewSeason];
  
  // Generate standings with these teams
  const newStandings = allTeams.map((team, index) => {
    let minRating, maxRating;
    
    switch(newLeague) {
      case 5: minRating = 50; maxRating = 66; break;
      case 4: minRating = 58; maxRating = 71; break;
      case 3: minRating = 64; maxRating = 76; break;
      case 2: minRating = 70; maxRating = 82; break;
      case 1: minRating = 80; maxRating = 95; break;
      default: minRating = 50; maxRating = 66;
    }
    
    let teamRating;
    const positionInLeague = index;
    const totalTeams = leagueData.teams;
    
    if (team === gameState.teamName) {
      teamRating = Math.round((minRating + maxRating) / 2);
    } else {
      const positionFactor = positionInLeague / (totalTeams - 1);
      
      if (newLeague === 1 && positionInLeague < 6) {
        teamRating = Math.round(95 - (positionInLeague * 1.0));
      } else if (newLeague === 1) {
        const restMinRating = 80;
        const restMaxRating = 89;
        const adjustedPosition = (positionInLeague - 6) / (totalTeams - 7);
        teamRating = Math.round(restMaxRating - (adjustedPosition * (restMaxRating - restMinRating)));
      } else {
        const range = maxRating - minRating;
        const baseForPosition = maxRating - (positionFactor * range);
        const variance = range * 0.15;
        teamRating = Math.round(baseForPosition + (Math.random() - 0.5) * variance);
      }
      
      teamRating = Math.max(minRating, Math.min(maxRating, teamRating));
    }
    
    return {
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      position: index + 1,
      isPlayer: team === gameState.teamName,
      rating: team === gameState.teamName ? 0 : teamRating
    };
  });

  const newFreeAgents = generateFreeAgents(newLeague, gameState.reputation, 30);

  setGameState(prev => ({
    ...prev,
    squad: updatedSquad,
    standings: newStandings,
    freeAgents: newFreeAgents,
    matches: [],
    seasonPhase: 'regular',
    contractNegotiations: [],
    paused: true,
    lastSeasonFinish: null,
    averageAttendance: 0,
    totalAttendance: 0,
    homeGames: 0,
    accumulatedTicketRevenue: 0,
    transferOffers: [],
    isTransferWindow: false
  }));
  
  setView('main');
  setFreeAgentMessage(null);
  setSelectedPlayer(null);
}

function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return (s[(v - 20) % 10] || s[v] || s[0]);
}

function calculateMarketValue(player, league) {
  const rating = player.rating;
  let baseSalary;
  
  // Non-linear salary brackets based on rating
  if (rating < 60) {
    baseSalary = 25000 + ((rating - 40) / 20) * 20000;
  } else if (rating < 70) {
    baseSalary = 45000 + ((rating - 60) / 10) * 75000;
  } else if (rating < 77) {
    baseSalary = 120000 + ((rating - 70) / 7) * 280000;
  } else if (rating < 83) {
    baseSalary = 400000 + ((rating - 77) / 6) * 1100000;
  } else if (rating < 88) {
    baseSalary = 1500000 + ((rating - 83) / 5) * 3500000;
  } else {
    baseSalary = 5000000 + ((rating - 88) / 11) * 20000000;
  }
  
  // Age factor
  if (player.age <= 23) {
    baseSalary *= 1.35;
  } else if (player.age <= 26) {
    baseSalary *= 1.20;
  } else if (player.age >= 30) {
    baseSalary *= 0.80;
  } else if (player.age >= 33) {
    baseSalary *= 0.60;
  }
  
  // Performance bonus based on season stats
  if (player.seasonStats && player.seasonStats.appearances > 0) {
    const goalsPerGame = player.seasonStats.goals / player.seasonStats.appearances;
    const assistsPerGame = player.seasonStats.assists / player.seasonStats.appearances;
    
    if (player.position === 'FWD') {
      if (goalsPerGame > 0.5) baseSalary *= 1.25;
      else if (goalsPerGame > 0.3) baseSalary *= 1.15;
    } else if (player.position === 'MID') {
      const contributions = goalsPerGame + assistsPerGame;
      if (contributions > 0.4) baseSalary *= 1.20;
      else if (contributions > 0.25) baseSalary *= 1.12;
    }
    
    if (player.seasonStats.appearances > 30) {
      baseSalary *= 1.15;
    }
  }
  
  const randomFactor = 0.80 + Math.random() * 0.4;
  baseSalary *= randomFactor;
  
  return Math.floor(baseSalary);
}

function negotiateContract(player, offer) {
  const yearlyOffer = offer.salary;
  
  // Determine player's counteroffer/demand
  let counterofferValue;
  
  if (player.previousCounteroffer) {
    // They already stated a demand - can only go down or stay same, NEVER up
    const marketValue = calculateMarketValue(player, gameState.league);
    
    // They might lower their demand slightly (2-5% reduction) to show flexibility
    const flexibilityReduction = 0.95 + Math.random() * 0.03; // 95-98% of previous
    const newCounteroffer = Math.floor(player.previousCounteroffer * flexibilityReduction);
    
    // But never go below their true market value
    counterofferValue = Math.max(marketValue, newCounteroffer);
    
    // CRITICAL: Never let it go above their previous counteroffer
    counterofferValue = Math.min(counterofferValue, player.previousCounteroffer);
    
  } else {
    // First time - calculate their market value and set as initial demand
    const marketValue = calculateMarketValue(player, gameState.league);
    counterofferValue = Math.max(yearlyOffer, marketValue);
  }
  
  // Now calculate acceptance based on offer vs their counteroffer
  const offerRatio = yearlyOffer / counterofferValue;
  
  const optimalRatio = 1.0;
  const deviation = 0.15;
  
  const distance = Math.abs(offerRatio - optimalRatio);
  
  let acceptChance = Math.exp(-Math.pow(distance / deviation, 2)) * 0.85;
  
  // Harsher penalties for low offers
  if (offerRatio < 0.6) {
    acceptChance = 0.01; // Insultingly low
  } else if (offerRatio < 0.75) {
    acceptChance = 0.05; // Way too low
  } else if (offerRatio < 0.85) {
    acceptChance = 0.15; // Still too low
  } else if (offerRatio >= 0.95) {
    acceptChance = 0.75; // Close enough - they'll likely accept
  } else if (offerRatio >= 1.0) {
    acceptChance = 0.95; // Met their demand - very likely accept
  }
  
  // Bonuses
  if (offer.years >= 4) {
    acceptChance += 0.12;
  } else if (offer.years >= 3) {
    acceptChance += 0.08;
  } else if (offer.years >= 2) {
    acceptChance += 0.04;
  }
  
  const repBonus = (gameState.reputation / 100) * 0.15;
  acceptChance += repBonus;
  
  if (player.morale) {
    const moraleBonus = (player.morale - 50) / 250;
    acceptChance += moraleBonus;
  }
  
  if (gameState.league > 1) {
    const leagueFactor = (6 - gameState.league) * 0.02;
    acceptChance += leagueFactor;
  }
  
  acceptChance = Math.max(0.01, Math.min(0.98, acceptChance));
  
  const accepted = Math.random() < acceptChance;
  
  return { accepted, marketValue: counterofferValue };
}

function offerContract(player, years, salary) {
  const totalCost = salary * years;
  
  if (salary > gameState.money) {
    alert('Not enough money for this contract!');
    return;
  }

  const { accepted, marketValue } = negotiateContract(player, { years, salary });
  
  if (view === 'freeagents') {
    if (accepted) {
      const signingBonus = salary * 0.5;
      const newPlayer = { 
        ...player, 
        contractYears: years, 
        salary, 
        id: Date.now() + Math.random(),
        seasonStats: {
          appearances: 0,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0
        }
      };
      
      setGameState(prev => ({
        ...prev,
        squad: [...prev.squad, newPlayer],
        freeAgents: prev.freeAgents.map(p => 
          p.id === player.id ? { ...p, status: 'accepted', offer: { years, salary }, marketValue } : p
        ),
        money: prev.money - signingBonus
      }));
      
      setFreeAgentMessage({ player: player.name, accepted: true, agreedSalary: salary });
      setSelectedPlayer(null);
    } else {
      setGameState(prev => ({
        ...prev,
        freeAgents: prev.freeAgents.map(p => 
          p.id === player.id ? { 
            ...p, 
            status: 'rejected', 
            offer: { years, salary }, 
            marketValue,
            previousCounteroffer: marketValue // Store this for next negotiation
          } : p
        )
      }));
      setFreeAgentMessage({ player: player.name, accepted: false, marketValue, offer: salary });
      setSelectedPlayer(null);
    }
  } else if (view === 'contracts') {
    // Contract renewal
    setGameState(prev => ({
      ...prev,
      contractNegotiations: prev.contractNegotiations.map(n => 
        n.id === player.id 
          ? { 
              ...n, 
              offer: { years, salary }, 
              status: accepted ? 'accepted' : 'rejected', 
              marketValue,
              previousCounteroffer: marketValue // Store for next negotiation
            }
          : n
      )
    }));
    
    if (accepted) {
      setFreeAgentMessage({ player: player.name, accepted: true, agreedSalary: salary });
    } else {
      setFreeAgentMessage({ player: player.name, accepted: false, isRenewal: true, marketValue, offer: salary });
    }
  }
}

function releasePlayer(playerId) {
  const player = gameState.squad.find(p => p.id === playerId);
  if (window.confirm(`Release ${player.name}? No compensation will be received.`)) {
    setGameState(prev => ({
      ...prev,
      squad: prev.squad.filter(p => p.id !== playerId)
    }));
  }
}

function listPlayerForTransfer(player, askingPrice) {
  // Calculate market value
  const marketValue = calculateMarketValue(player, gameState.league);
  
  // Determine player quality relative to current league
  const leagueData = LEAGUES[gameState.league];
  let playerQualityForLeague = 'average';
  
  switch(gameState.league) {
    case 5: // National League (50-66 team ratings)
      if (player.rating >= 67) playerQualityForLeague = 'star';
      else if (player.rating >= 62) playerQualityForLeague = 'good';
      else if (player.rating >= 55) playerQualityForLeague = 'average';
      else playerQualityForLeague = 'poor';
      break;
    case 4: // League Two (58-71)
      if (player.rating >= 71) playerQualityForLeague = 'star';
      else if (player.rating >= 66) playerQualityForLeague = 'good';
      else if (player.rating >= 60) playerQualityForLeague = 'average';
      else playerQualityForLeague = 'poor';
      break;
    case 3: // League One (64-76)
      if (player.rating >= 75) playerQualityForLeague = 'star';
      else if (player.rating >= 70) playerQualityForLeague = 'good';
      else if (player.rating >= 63) playerQualityForLeague = 'average';
      else playerQualityForLeague = 'poor';
      break;
    case 2: // Championship (70-82)
      if (player.rating >= 81) playerQualityForLeague = 'star';
      else if (player.rating >= 76) playerQualityForLeague = 'good';
      else if (player.rating >= 68) playerQualityForLeague = 'average';
      else playerQualityForLeague = 'poor';
      break;
    case 1: // Premier League (80-95)
      if (player.rating >= 91) playerQualityForLeague = 'star';
      else if (player.rating >= 84) playerQualityForLeague = 'good';
      else if (player.rating >= 78) playerQualityForLeague = 'average';
      else playerQualityForLeague = 'poor';
      break;
  }
  
  // Base interest based on player quality in current league context
  let baseInterest;
  switch(playerQualityForLeague) {
    case 'star':
      baseInterest = 0.95; // Star players always in demand
      break;
    case 'good':
      baseInterest = 0.80; // Good players usually get offers
      break;
    case 'average':
      baseInterest = 0.60; // Average players moderate interest
      break;
    case 'poor':
      baseInterest = 0.25; // Poor players hard to sell
      break;
    default:
      baseInterest = 0.60;
  }
  
  // Adjust for pricing
  const priceRatio = askingPrice / marketValue;
  let priceMultiplier = 1.0;
  
  if (priceRatio > 1.5) {
    priceMultiplier = 0.3; // Massively overpriced
  } else if (priceRatio > 1.3) {
    priceMultiplier = 0.5; // Significantly overpriced
  } else if (priceRatio > 1.15) {
    priceMultiplier = 0.7; // Slightly overpriced
  } else if (priceRatio < 0.7) {
    priceMultiplier = 1.4; // Bargain - increases interest
  } else if (priceRatio < 0.85) {
    priceMultiplier = 1.2; // Good deal
  }
  
  // Age factor - younger players more desirable
  let ageFactor = 1.0;
  if (player.age <= 23) {
    ageFactor = 1.3; // Young prospects in high demand
  } else if (player.age <= 26) {
    ageFactor = 1.15; // Prime age
  } else if (player.age >= 32) {
    ageFactor = 0.6; // Older players harder to sell
  } else if (player.age >= 30) {
    ageFactor = 0.8; // Aging players
  }
  
  // Position factor - some positions always needed
  let positionFactor = 1.0;
  if (player.position === 'GK') {
    positionFactor = 0.7; // GKs harder to sell (teams only need 1-2)
  }
  
  // Calculate final offer chance
  let offerChance = baseInterest * priceMultiplier * ageFactor * positionFactor;
  offerChance = Math.max(0.05, Math.min(0.98, offerChance));
  
  const hasOffer = Math.random() < offerChance;
  
  if (hasOffer) {
    // Generate counter offer based on player quality and pricing
    let offerMultiplier;
    
    if (priceRatio > 1.2) {
      // If overpriced, offers come in much lower
      offerMultiplier = 0.65 + Math.random() * 0.15; // 65-80% of asking
    } else if (priceRatio < 0.8) {
      // If underpriced, might get full price or more
      offerMultiplier = 0.95 + Math.random() * 0.10; // 95-105% of asking
    } else {
      // Fair price, get reasonable offers
      offerMultiplier = 0.85 + Math.random() * 0.12; // 85-97% of asking
    }
    
    const counterOffer = Math.floor(askingPrice * offerMultiplier);
    
    setGameState(prev => ({
      ...prev,
      transferOffers: [...prev.transferOffers, {
        player,
        askingPrice,
        counterOffer,
        status: 'pending',
        quality: playerQualityForLeague
      }]
    }));
    
    return { 
      success: true, 
      message: `Offer received: £${(counterOffer / 1000).toFixed(0)}k (${playerQualityForLeague} player for this league)`, 
      counterOffer 
    };
  } else {
    let reason = 'No offers received.';
    
    if (playerQualityForLeague === 'poor') {
      reason = 'No offers - player quality too low for this level.';
    } else if (priceRatio > 1.3) {
      reason = 'No offers - asking price too high.';
    } else if (player.age >= 32) {
      reason = 'No offers - player may be too old.';
    } else {
      reason = 'No offers. Try lowering the price or waiting.';
    }
    
    return { success: false, message: reason };
  }
}

function acceptTransferOffer(playerId, offerAmount) {
  setGameState(prev => ({
    ...prev,
    squad: prev.squad.filter(p => p.id !== playerId),
    money: prev.money + offerAmount,
    transferOffers: prev.transferOffers.filter(offer => offer.player.id !== playerId)
  }));
}

function rejectTransferOffer(playerId) {
  setGameState(prev => ({
    ...prev,
    transferOffers: prev.transferOffers.map(offer => 
      offer.player.id === playerId ? { ...offer, status: 'rejected' } : offer
    )
  }));
}

function upgradeFacility(facilityName) {
  const facilityIndex = gameState.facilities.findIndex(f => f.name === facilityName);
  const facility = gameState.facilities[facilityIndex];
  
  if (facility.level >= facility.maxLevel) {
    alert('Facility is at maximum level!');
    return;
  }
  
  const cost = facility.baseCost * Math.pow(2, facility.level + 1) * (gameState.league / 5);
  
  if (gameState.money < cost) {
    alert('Not enough money to upgrade!');
    return;
  }
  
  const updatedFacilities = [...gameState.facilities];
  updatedFacilities[facilityIndex] = { ...facility, level: facility.level + 1 };
  
  setGameState(prev => ({
    ...prev,
    facilities: updatedFacilities,
    money: prev.money - cost
  }));
}

function validateRoster(squad) {
  const total = squad.length;
  const gks = squad.filter(p => p.position === 'GK').length;
  const defs = squad.filter(p => p.position === 'DEF').length;
  const mids = squad.filter(p => p.position === 'MID').length;
  const fwds = squad.filter(p => p.position === 'FWD').length;
  
  const errors = [];
  
  // Must have exactly 25 players
  if (total !== 25) {
    errors.push(`Must have exactly 25 players (currently ${total})`);
  }
  
  // Minimum requirements per position
  if (gks < 2) {
    errors.push(`Need at least 2 goalkeepers (currently ${gks})`);
  }
  if (defs < 7) {
    errors.push(`Need at least 7 defenders (currently ${defs})`);
  }
  if (mids < 7) {
    errors.push(`Need at least 7 midfielders (currently ${mids})`);
  }
  if (fwds < 4) {
    errors.push(`Need at least 4 forwards (currently ${fwds})`);
  }
  
  // Maximum limits per position
  if (gks > 3) {
    errors.push(`Maximum 3 goalkeepers (currently ${gks})`);
  }
  if (defs > 10) {
    errors.push(`Maximum 10 defenders (currently ${defs})`);
  }
  if (mids > 10) {
    errors.push(`Maximum 10 midfielders (currently ${mids})`);
  }
  if (fwds > 8) {
    errors.push(`Maximum 8 forwards (currently ${fwds})`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    counts: { total, gks, defs, mids, fwds }
  };
}

useEffect(() => {
  if (!gameState || !gameState.paused && gameState.seasonPhase === 'regular') {
    if (!gameState) return;
    
    const leagueData = LEAGUES[gameState.league];
    const totalMatches = (leagueData.teams - 1) * 2;
    
    if (gameState.matchday >= totalMatches) {
      return;
    }

    const interval = setInterval(() => {
      simulateMatchday();
    }, 2000);
    
    return () => clearInterval(interval);
  }
}, [gameState?.paused, gameState?.matchday, gameState?.seasonPhase]);

// Existing useEffect for simulation...

// Autosave effect
useEffect(() => {
  if (gameState && view !== 'start' && view !== 'gameover') {
    saveGame(gameState);
  }
}, [gameState]);

const leagueData = gameState ? LEAGUES[gameState.league] : null;
const totalMatches = leagueData ? (leagueData.teams - 1) * 2 : 0;
const weeklyWages = gameState ? gameState.squad.reduce((sum, p) => sum + p.salary, 0) / 52 : 0;
const teamRating = gameState ? calculateTeamRating(gameState.squad) : 0;
const playerStanding = gameState ? gameState.standings.find(t => t.team === gameState.teamName) : null;

// Start Screen
if (view === 'start') {
  const hasSavedGame = loadGame() !== null;
  
  return (
    <div className="game-container">
      <div className="content-wrapper">
        <div className="start-screen">
          <h1 className="start-title">Road to the Premier League</h1>
          <p className="start-subtitle">Build your club from the National League to the top of English football</p>
          
          {hasSavedGame && (
            <div className="saved-game-notice">
              <h3>Saved Game Detected!</h3>
              <div className="button-group">
                <button
                  onClick={() => {
                    const saved = loadGame();
                    setGameState(saved);
                    setView('main');
                  }}
                  className="btn btn-success btn-large btn-bold"
                >
                  Continue Saved Game
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete saved game and start fresh?')) {
                      deleteSave();
                      setGameState(null);
                    }
                  }}
                  className="btn btn-danger"
                >
                  Delete Save
                </button>
              </div>
            </div>
          )}
          
          <div className="start-form">
            <h2 className="start-form-title">{hasSavedGame ? 'Start New Game' : 'Create Your Club'}</h2>
            <div className="form-group">
              <label>Club Name</label>
              <input
                type="text"
                value={teamNameInput}
                onChange={(e) => setTeamNameInput(e.target.value)}
                placeholder="Enter your club name..."
                className="form-input start-input"
                maxLength={30}
              />
            </div>
            
            <button
              onClick={() => {
                if (hasSavedGame && !window.confirm('This will overwrite your saved game. Continue?')) {
                  return;
                }
                const name = teamNameInput.trim() || 'Your Club FC';
                deleteSave(); // Clear old save
                initializeGame(name);
              }}
              className="btn btn-success btn-large btn-bold start-button"
            >
              {hasSavedGame ? 'Start New Game' : 'Start Journey'}
            </button>
          </div>
          
          <div className="start-info">
            <h3 className="start-info-title">Game Features:</h3>
            <ul className="start-info-list">
              <li>Start in the National League with £2M budget</li>
              <li>Manage squad, sign free agents, and negotiate contracts</li>
              <li>Upgrade facilities to boost performance</li>
              <li>Navigate through 5 divisions to reach the Premier League</li>
              <li>Survive financially - bankruptcy at -£2M ends the game</li>
              <li>Auto-saves your progress</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Game Over Screen
if (view === 'gameover') {
  return (
    <div className="game-container">
      <div className="content-wrapper">
        <div className="gameover-screen">
          <h1 className="gameover-title">💔 GAME OVER</h1>
          
          <div className="gameover-details">
            {gameOverReason.reason === 'bankruptcy' && (
              <>
                <h2 className="gameover-reason">Financial Collapse</h2>
                <p className="gameover-text">
                  Your club has gone into administration with debts of <span className="text-danger">£{(gameOverReason.debt / 1000000).toFixed(2)}M</span>
                </p>
              </>
            )}
            
            <div className="gameover-stats">
              <div className="gameover-stat">
                <div className="gameover-stat-label">Final Season</div>
                <div className="gameover-stat-value">{gameOverReason.season}</div>
              </div>
              <div className="gameover-stat">
                <div className="gameover-stat-label">League</div>
                <div className="gameover-stat-value">{gameOverReason.league}</div>
              </div>
              <div className="gameover-stat">
                <div className="gameover-stat-label">Final Position</div>
                <div className="gameover-stat-value">{gameOverReason.position}{getOrdinal(gameOverReason.position)}</div>
              </div>
              <div className="gameover-stat">
                <div className="gameover-stat-label">Final Balance</div>
                <div className="gameover-stat-value text-danger">£{(gameOverReason.finalBalance / 1000000).toFixed(2)}M</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => {
              setView('start');
              setGameState(null);
              setTeamNameInput('');
              setGameOverReason(null);
            }}
            className="btn btn-primary btn-large btn-bold"
          >
            Start New Game
          </button>
        </div>
      </div>
    </div>
  );
}

// Guard against null gameState
if (!gameState) {
  return (
    <div className="game-container">
      <div className="content-wrapper">
        <div className="loading-screen">Loading...</div>
      </div>
    </div>
  );
}

// Render different views
if (view === 'freeagents') {
  return (
    <div className="game-container">
      <div className="content-wrapper">
        <div className="header-card">
          <div className="header-content">
            <h2>Free Agent Market</h2>
            <button onClick={() => { setView('main'); setFreeAgentMessage(null); setSelectedPlayer(null); }} className="btn btn-secondary">
              Back to Main
            </button>
            
          </div>
          <div className="header-stats">
            Balance: £{(gameState.money / 1000000).toFixed(2)}M | Squad Size: {gameState.squad.length}/25
          </div>
        </div>

        {freeAgentMessage && (
          <div className={`message-card ${freeAgentMessage.accepted ? 'message-success' : 'message-error'}`}>
            <div className="message-title">
              {freeAgentMessage.accepted 
                ? `✓ ${freeAgentMessage.player} has signed with your club!` 
                : `✗ ${freeAgentMessage.player} has rejected your offer.`}
            </div>
            {freeAgentMessage.agreedSalary && (
              <div className="message-details">
                {freeAgentMessage.accepted ? (
                  <span className="text-success">
                    Agreed Terms: £{(freeAgentMessage.agreedSalary / 1000).toFixed(0)}k/year
                  </span>
                ) : (
                  <span className="text-warning">
                    Your Offer: £{(freeAgentMessage.offer / 1000).toFixed(0)}k/year | 
                    Counteroffer: £{(freeAgentMessage.marketValue / 1000).toFixed(0)}k/year
                    {freeAgentMessage.offer < freeAgentMessage.marketValue && 
                      ` (you offered ${Math.round((freeAgentMessage.offer / freeAgentMessage.marketValue) * 100)}%)`}
                  </span>
                )}
              </div>
            )}
            <button 
              onClick={() => setFreeAgentMessage(null)}
              className="btn btn-small"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="player-list">
          {gameState.freeAgents.filter(p => p.status !== 'accepted').map(player => (
            <div key={player.id} className={`player-card ${player.status === 'rejected' ? 'player-rejected' : ''}`}>
              <div className="player-header">
                <div className="player-info">
                  <div className="player-name-row">
                    <span className="player-name">{player.name}</span>
                    <span className="badge badge-position">{player.position}</span>
                    <span className={`player-rating rating-${player.rating >= 70 ? 'high' : player.rating >= 60 ? 'medium' : 'low'}`}>
                      {player.rating} OVR
                    </span>
                    <span className="player-age">Age: {player.age}</span>
                    {player.status === 'rejected' && (
                      <span className="badge badge-danger">Previously Rejected</span>
                    )}
                  </div>
                  <div className="player-stats">
                    <div>PAC: {player.stats.pace}</div>
                    <div>SHO: {player.stats.shooting}</div>
                    <div>PAS: {player.stats.passing}</div>
                    <div>DEF: {player.stats.defending}</div>
                    <div>PHY: {player.stats.physical}</div>
                  </div>
                </div>
                <div className="player-actions">
                  <div className="player-salary">£{(player.salary / 1000).toFixed(0)}k/year</div>
                  <button
                    onClick={() => setSelectedPlayer(player)}
                    className="btn btn-success btn-bold"
                  >
                    Make Offer
                  </button>
                </div>
              </div>

              {selectedPlayer?.id === player.id && (
                <div className="contract-offer-section">
                  <h3 className="section-title">Contract Offer</h3>
                  {player.status === 'rejected' && player.offer && player.marketValue && (
                    <div className="rejection-notice">
                      <div className="rejection-title">Previous Rejected Offer:</div>
                      <div>Your Offer: £{(player.offer.salary / 1000).toFixed(0)}k/year for {player.offer.years} years</div>
                      <div className="text-warning">
                        Player Counteroffer: £{(player.marketValue / 1000).toFixed(0)}k/year
                        (you offered {Math.round((player.offer.salary / player.marketValue) * 100)}%)
                      </div>
                      <div className="rejection-hint">Negotiate closer to their counteroffer</div>
                    </div>
                  )}
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Contract Length (years)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={contractOffer.years}
                        onChange={(e) => setContractOffer(prev => ({ ...prev, years: parseInt(e.target.value) }))}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Annual Salary (£)</label>
                      <input
                        type="number"
                        min="10000"
                        step="5000"
                        value={contractOffer.salary || player.salary}
                        onChange={(e) => setContractOffer(prev => ({ ...prev, salary: parseInt(e.target.value) }))}
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="contract-summary">
                    Total Contract Value: £{((contractOffer.salary || player.salary) * contractOffer.years / 1000).toFixed(0)}k
                    <br />
                    Signing Bonus: £{((contractOffer.salary || player.salary) * 0.5 / 1000).toFixed(0)}k
                  </div>
                  <div className="button-group">
                    <button
                      onClick={() => offerContract(player, contractOffer.years, contractOffer.salary || player.salary)}
                      className="btn btn-primary btn-bold"
                    >
                      Submit Offer
                    </button>
                    <button
                      onClick={() => setSelectedPlayer(null)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

if (view === 'standings') {
  return (
    <div className="game-container">
      <div className="content-wrapper">
        <div className="header-card">
          <div className="header-content">
            <h2>{leagueData.name} Standings</h2>
            <button onClick={() => { 
              setView('main'); 
              setFreeAgentMessage(null); 
              setSelectedPlayer(null);
            }} className="btn btn-secondary">
              Back to Main
            </button>
          </div>
        </div>

        <div className="standings-table-container">
          <table className="standings-table">
            <thead>
              <tr>
                <th>Pos</th>
                <th>Team</th>
                <th>OVR</th>
                <th>P</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GF</th>
                <th>GA</th>
                <th>GD</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              {gameState.standings.map((team, index) => {
                const displayRating = team.isPlayer ? calculateTeamRating(gameState.squad) : team.rating;
                let rowClass = '';
                if (team.isPlayer) rowClass = 'player-row';
                else if (index === 0) rowClass = 'promotion-auto';
                else if (index >= 1 && index <= 6) rowClass = 'promotion-playoff';
                else if (index >= leagueData.teams - 4) rowClass = 'relegation';
                
                return (
                  <tr key={team.team} className={rowClass}>
                    <td className="text-center text-bold">{team.position}</td>
                    <td>{team.team}</td>
                    <td className="text-center">
                      <span className={`rating-${displayRating >= 70 ? 'high' : displayRating >= 60 ? 'medium' : 'low'}`}>
                        {displayRating}
                      </span>
                    </td>
                    <td className="text-center">{team.played}</td>
                    <td className="text-center">{team.won}</td>
                    <td className="text-center">{team.drawn}</td>
                    <td className="text-center">{team.lost}</td>
                    <td className="text-center">{team.goalsFor}</td>
                    <td className="text-center">{team.goalsAgainst}</td>
                    <td className="text-center">{team.goalDifference > 0 ? '+' : ''}{team.goalDifference}</td>
                    <td className="text-center text-bold">{team.points}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="legend-card">
          <h3 className="section-title">Legend</h3>
          <div className="legend-grid">
            <div className="legend-item">
              <div className="legend-box promotion-auto"></div>
              <span>Automatic Promotion</span>
            </div>
            <div className="legend-item">
              <div className="legend-box promotion-playoff"></div>
              <span>Playoff Places</span>
            </div>
            <div className="legend-item">
              <div className="legend-box relegation"></div>
              <span>Relegation Zone</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

if (view === 'contracts') {
  return (
    <div className="game-container">
      <div className="content-wrapper">
        <div className="header-card">
          <div>
            <h2>Contract Negotiations - Offseason</h2>
            <p className="header-subtitle">Negotiate with players whose contracts are expiring</p>
          </div>
        </div>

        {freeAgentMessage && freeAgentMessage.isRenewal && (
          <div className={`message-card ${freeAgentMessage.accepted ? 'message-success' : 'message-error'}`}>
            <div className="message-title">
              {freeAgentMessage.accepted 
                ? `✓ ${freeAgentMessage.player} has accepted the contract renewal!`
                : `✗ ${freeAgentMessage.player} has rejected your offer. Make a counter-offer below!`}
            </div>
            {freeAgentMessage.marketValue && !freeAgentMessage.accepted && (
              <div className="message-details text-warning">
                Your Offer: £{(freeAgentMessage.offer / 1000).toFixed(0)}k/year | 
                Player Counteroffer: £{(freeAgentMessage.marketValue / 1000).toFixed(0)}k/year
                {freeAgentMessage.offer < freeAgentMessage.marketValue && 
                  ` (you offered ${Math.round((freeAgentMessage.offer / freeAgentMessage.marketValue) * 100)}%)`}
              </div>
            )}
            <button 
              onClick={() => setFreeAgentMessage(null)}
              className="btn btn-small"
            >
              Dismiss
            </button>
          </div>
        )}

        {gameState.contractNegotiations.length === 0 ? (
          <div className="empty-state-card">
            <p className="empty-state-title">No contract negotiations needed!</p>
            <p className="empty-state-subtitle">All players are under contract.</p>
          </div>
        ) : (
          <div className="player-list">
            {gameState.contractNegotiations.map(player => (
              <div key={player.id} className={`player-card ${
                player.status === 'rejected' ? 'player-rejected' : 
                player.status === 'accepted' ? 'player-accepted' : ''
              }`}>
                <div className="player-header">
                  <div className="player-info">
                    <div className="player-name-row">
                      <span className="player-name">{player.name}</span>
                      <span className="badge badge-position">{player.position}</span>
                      <span className={`player-rating rating-${player.rating >= 70 ? 'high' : player.rating >= 60 ? 'medium' : 'low'}`}>
                        {player.rating} OVR
                      </span>
                      <span className="player-age">Age: {player.age}</span>
                    </div>
                    <div className="player-stats">
                      <div>PAC: {player.stats.pace}</div>
                      <div>SHO: {player.stats.shooting}</div>
                      <div>PAS: {player.stats.passing}</div>
                      <div>DEF: {player.stats.defending}</div>
                      <div>PHY: {player.stats.physical}</div>
                    </div>
                    <div className="player-contract-info">
                      Current Salary: £{(player.salary / 1000).toFixed(0)}k/year | Contract Expires: End of Season
                    </div>
                    <div className="player-season-stats">
                      Season Stats: {player.seasonStats.appearances} apps, {player.seasonStats.goals} goals, {player.seasonStats.assists} assists
                    </div>
                  </div>
                  <div>
                    {player.status === 'accepted' && (
                      <span className="badge badge-success">✓ Accepted</span>
                    )}
                    {player.status === 'rejected' && (
                      <span className="badge badge-danger">✗ Rejected - Counter?</span>
                    )}
                    {player.status === 'pending' && (
                      <span className="badge badge-warning">Pending</span>
                    )}
                  </div>
                </div>

                {(player.status === 'pending' || player.status === 'rejected') && (
                  <div className="contract-offer-section">
                    <h3 className="section-title">{player.status === 'rejected' ? 'Counter Offer' : 'New Contract Offer'}</h3>
                    {player.status === 'rejected' && player.offer && player.marketValue && (
                      <div className="rejection-notice">
                        <div className="rejection-title">Previous Rejected Offer:</div>
                        <div>Your Offer: £{(player.offer.salary / 1000).toFixed(0)}k/year for {player.offer.years} years</div>
                        <div className="text-warning">
                          Player Counteroffer: £{(player.marketValue / 1000).toFixed(0)}k/year
                          (you offered {Math.round((player.offer.salary / player.marketValue) * 100)}%)
                        </div>
                        <div className="rejection-hint">Negotiate closer to their counteroffer</div>
                      </div>
                    )}
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Contract Length (years)</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          defaultValue={player.offer?.years || 2}
                          id={`years-${player.id}`}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Annual Salary (£)</label>
                        <input
                          type="number"
                          min="10000"
                          step="5000"
                          defaultValue={player.marketValue || Math.floor(player.salary * 1.1)}
                          id={`salary-${player.id}`}
                          className="form-input"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const yearsInput = document.getElementById(`years-${player.id}`);
                        const salaryInput = document.getElementById(`salary-${player.id}`);
                        const years = parseInt(yearsInput.value) || 2;
                        const salary = parseInt(salaryInput.value) || player.salary;
                        offerContract(player, years, salary);
                      }}
                      className="btn btn-primary btn-bold"
                    >
                      {player.status === 'rejected' ? 'Submit Counter Offer' : 'Submit Offer'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="season-continue-card">
          <div className="season-continue-content">
            <div>
              <h3 className="section-title">Ready to continue?</h3>
              <p className="season-continue-subtitle">
                {gameState.contractNegotiations.filter(p => p.status === 'pending').length} negotiations remaining
                {gameState.contractNegotiations.filter(p => p.status === 'rejected').length > 0 && 
                  ` | ${gameState.contractNegotiations.filter(p => p.status === 'rejected').length} rejected (will leave)`}
              </p>
            </div>
            <button
              onClick={startNewSeason}
              className="btn btn-success btn-large btn-bold"
            >
              Start Season {gameState.season}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

if (view === 'transfers') {
  
  return (
    <div className="game-container">
      <div className="content-wrapper">
        <div className="header-card">
          <div className="header-content">
            <h2>Transfer Market - Mid-Season Window</h2>
            <button onClick={() => { 
              setView('main');
              setSelectedPlayer(null);
              setTransferMessage(null);
            }} className="btn btn-secondary">
              Back to Main
            </button>
          </div>
          <div className="header-stats">
            Balance: £{(gameState.money / 1000000).toFixed(2)}M | Squad Size: {gameState.squad.length}/25
            {(() => {
              const leagueData = LEAGUES[gameState.league];
              const transferWindowStart = Math.floor((leagueData.teams - 1) * 0.5);
              const transferWindowEnd = transferWindowStart + 4;
              const matchdaysRemaining = transferWindowEnd - gameState.matchday;
              return ` | Window closes in ${matchdaysRemaining} matchday${matchdaysRemaining !== 1 ? 's' : ''}`;
            })()}
          </div>
        </div>

        {transferMessage && (
          <div className={`message-card ${transferMessage.success ? 'message-success' : 'message-error'}`}>
            <div className="message-title">{transferMessage.message}</div>
            {transferMessage.counterOffer && (
              <div className="message-details">
                Your asking price: £{(transferMessage.askingPrice / 1000).toFixed(0)}k | 
                Counter offer: £{(transferMessage.counterOffer / 1000).toFixed(0)}k
              </div>
            )}
            <button onClick={() => setTransferMessage(null)} className="btn btn-small">
              Dismiss
            </button>
          </div>
        )}

        {/* Active Transfer Offers */}
        {gameState.transferOffers.length > 0 && (
          <div className="transfers-section">
            <h3 className="section-title">Active Transfer Offers</h3>
            <div className="player-list">
              {gameState.transferOffers.filter(offer => offer.status === 'pending').map(offer => (
                <div key={offer.player.id} className="player-card player-accepted">
                  <div className="player-header">
                    <div className="player-info">
                      <div className="player-name-row">
                        <span className="player-name">{offer.player.name}</span>
                        <span className="badge badge-position">{offer.player.position}</span>
                        <span className={`player-rating rating-${offer.player.rating >= 70 ? 'high' : offer.player.rating >= 60 ? 'medium' : 'low'}`}>
                          {offer.player.rating} OVR
                        </span>
                      </div>
                      <div className="player-contract-info">
                        Your asking price: £{(offer.askingPrice / 1000).toFixed(0)}k | 
                        <span className="text-success"> Offer received: £{(offer.counterOffer / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                    <div className="button-group">
                      <button
                        onClick={() => {
                          acceptTransferOffer(offer.player.id, offer.counterOffer);
                          setTransferMessage({
                            success: true,
                            message: `${offer.player.name} sold for £${(offer.counterOffer / 1000).toFixed(0)}k!`
                          });
                        }}
                        className="btn btn-success btn-bold"
                      >
                        Accept £{(offer.counterOffer / 1000).toFixed(0)}k
                      </button>
                      <button
                        onClick={() => rejectTransferOffer(offer.player.id)}
                        className="btn btn-danger"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Your Squad - Available for Transfer */}
        <div className="transfers-section">
          <h3 className="section-title">Your Squad - List Players for Transfer</h3>
          <div className="player-list">
            {gameState.squad
              .filter(p => !gameState.transferOffers.some(offer => offer.player.id === p.id && offer.status === 'pending'))
              .sort((a, b) => b.rating - a.rating)
              .map(player => {
                const marketValue = calculateMarketValue(player, gameState.league);
                const rejectedOffer = gameState.transferOffers.find(o => o.player.id === player.id && o.status === 'rejected');
                
                return (
                  <div key={player.id} className={`player-card ${rejectedOffer ? 'player-rejected' : ''}`}>
                    <div className="player-header">
                      <div className="player-info">
                        <div className="player-name-row">
                          <span className="player-name">{player.name}</span>
                          <span className="badge badge-position">{player.position}</span>
                          <span className={`player-rating rating-${player.rating >= 70 ? 'high' : player.rating >= 60 ? 'medium' : 'low'}`}>
                            {player.rating} OVR
                          </span>
                          <span className="player-age">Age: {player.age}</span>
                          {rejectedOffer && (
                            <span className="badge badge-danger">No Offers</span>
                          )}
                        </div>
                        <div className="player-stats">
                          <div>PAC: {player.stats.pace}</div>
                          <div>SHO: {player.stats.shooting}</div>
                          <div>PAS: {player.stats.passing}</div>
                          <div>DEF: {player.stats.defending}</div>
                          <div>PHY: {player.stats.physical}</div>
                        </div>
                        <div className="player-contract-info">
                          Current Salary: £{(player.salary / 1000).toFixed(0)}k/year | 
                          Market Value: ~£{(marketValue / 1000).toFixed(0)}k
                        </div>
                        <div className="player-season-stats">
                          Season: {player.seasonStats.appearances} apps, {player.seasonStats.goals}G, {player.seasonStats.assists}A
                        </div>
                      </div>
                      <div className="player-actions">
                        <button
                          onClick={() => setSelectedPlayer(player)}
                          className="btn btn-primary btn-bold"
                        >
                          List for Transfer
                        </button>
                      </div>
                    </div>

                    {selectedPlayer?.id === player.id && (
                      <div className="contract-offer-section">
                        <h3 className="section-title">Set Asking Price</h3>
                        <div className="form-group">
                          <label>Transfer Fee (£)</label>
                          <input
                            type="number"
                            min="10000"
                            step="10000"
                            defaultValue={marketValue}
                            id={`transfer-${player.id}`}
                            className="form-input"
                          />
                          <div className="form-hint">
                            Market value: £{(marketValue / 1000).toFixed(0)}k | 
                            Price too high and you won't get offers
                          </div>
                        </div>
                        <div className="button-group">
                          <button
                            onClick={() => {
                              const priceInput = document.getElementById(`transfer-${player.id}`);
                              const askingPrice = parseInt(priceInput.value) || marketValue;
                              const result = listPlayerForTransfer(player, askingPrice);
                              setTransferMessage({
                                ...result,
                                askingPrice
                              });
                              setSelectedPlayer(null);
                            }}
                            className="btn btn-success btn-bold"
                          >
                            List Player
                          </button>
                          <button
                            onClick={() => setSelectedPlayer(null)}
                            className="btn btn-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main view
return (
  <div className="game-container">
    <div className="content-wrapper">
      {/* Header */}
      <div className="header-card">
        <div className="header-content">
          <div>
            <h1 className="main-title">{gameState.teamName}</h1>
            <div className="header-badges">
              <span className="badge badge-primary">Season {gameState.season}</span>
              <span className="badge badge-purple">{leagueData.name}</span>
              {playerStanding && (
                <>
                  <span className="badge badge-warning">
                    Position: {playerStanding.position}{getOrdinal(playerStanding.position)}
                  </span>
                  <span className="badge badge-success">
                    {playerStanding.points} pts
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="header-money">
            <div className="money-amount">£{(gameState.money / 1000000).toFixed(2)}M</div>
            <div className="money-label">Balance</div>
            <button
              onClick={() => {
                if (window.confirm('Resign from your position? This will end your save and return to menu.')) {
                  deleteSave();
                  setGameState(null);
                  setView('start');
                  setTeamNameInput('');
                }
              }}
              className="btn btn-danger btn-small"
              style={{ marginTop: '8px' }}
            >
              Resign
            </button>
          </div>
        </div>
        
        {/* Season Progress */}
        {gameState.seasonPhase === 'regular' && (
          <div className="season-progress">
            <div className="progress-label">
              <span>Matchday {gameState.matchday} / {totalMatches}</span>
              <span>{Math.round((gameState.matchday / totalMatches) * 100)}% Complete</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(gameState.matchday / totalMatches) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="controls">
        {gameState.seasonPhase === 'regular' && (
          <>
            <button
              onClick={() => {
                const validation = validateRoster(gameState.squad);
                if (!validation.isValid) {
                  alert(`Cannot start season:\n\n${validation.errors.join('\n')}`);
                  return;
                }
                setGameState(prev => ({ ...prev, paused: !prev.paused }));
              }}
              disabled={gameState.matchday >= totalMatches}
              className={`btn ${gameState.paused ? 'btn-success' : 'btn-danger'} btn-bold ${gameState.matchday >= totalMatches ? 'btn-disabled' : ''}`}
            >
              {gameState.paused ? <Play size={20} /> : <Pause size={20} />}
              {gameState.paused ? 'Play Season' : 'Pause'}
            </button>
            
            {gameState.matchday >= totalMatches && (
              <button
                onClick={endSeason}
                className="btn btn-warning btn-bold"
              >
                <Trophy size={20} />
                End Season
              </button>
            )}
          </>
        )}

        {/* NEW: Transfer Window Button */}
        {gameState.isTransferWindow && gameState.seasonPhase === 'regular' && (
          <button
            onClick={() => setView('transfers')}
            className="btn btn-warning btn-bold btn-pulse"
          >
            <DollarSign size={20} />
            Transfer Market (OPEN)
          </button>
        )}

        {gameState.seasonPhase === 'offseason' && (
          <button
            onClick={() => setView('contracts')}
            className="btn btn-warning btn-bold btn-pulse"
          >
            <FileText size={20} />
            Contract Negotiations ({gameState.contractNegotiations.length})
          </button>
        )}
        
        <button
          onClick={() => {
            setSelectedPlayer(null);
            setFreeAgentMessage(null);
            setView('freeagents');
          }}
          className="btn btn-primary btn-bold"
        >
          <UserPlus size={20} />
          Free Agents
        </button>
        
        <button
          onClick={() => {
            setSelectedPlayer(null);
            setView('standings');
          }}
          className="btn btn-purple btn-bold"
        >
          <BarChart3 size={20} />
          Standings
        </button>
      </div>
      </div>

      {/* Last Season Results */}
      {gameState.lastSeasonFinish && (
        <div className="season-result-card">
          <h2 className="section-title">Season {gameState.season - 1} Results</h2>
          <p className="season-result-message">{gameState.lastSeasonFinish.message}</p>
          
          {gameState.lastSeasonFinish.playoffDetails && (
            <div className="playoff-details">
              <h3 className="section-title">Playoff Results - {gameState.lastSeasonFinish.playoffDetails.stage}</h3>
              <div className="playoff-results">
                {gameState.lastSeasonFinish.playoffDetails.results.map((result, idx) => (
                  <div key={idx} className="playoff-match">
                    <div className="playoff-round">
                      {idx < 3 ? `Semi-Final ${idx + 1}` : 'FINAL'}
                    </div>
                    <div className="playoff-match-details">
                      <div className={result.team1 === gameState.teamName ? 'text-bold text-primary' : ''}>
                        {result.team1}
                      </div>
                      <div className="playoff-scores">
                        <div>Leg 1: {result.leg1Score}</div>
                        <div>Leg 2: {result.leg2Score}</div>
                        <div className="playoff-aggregate">Agg: {result.aggregate}</div>
                      </div>
                      <div className={result.team2 === gameState.teamName ? 'text-bold text-primary' : ''}>
                        {result.team2}
                      </div>
                    </div>
                    <div className="playoff-winner">
                      Winner: <span className={result.winner === gameState.teamName ? 'text-success' : ''}>
                        {result.winner}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="season-finances">
            <div className="finance-box">
              <div className="finance-value">{gameState.lastSeasonFinish.points}</div>
              <div className="finance-label">Points</div>
            </div>
            <div className="finance-box finance-positive">
              <div className="finance-value text-success">£{(gameState.lastSeasonFinish.revenue / 1000000).toFixed(2)}M</div>
              <div className="finance-label">Revenue</div>
              {gameState.lastSeasonFinish.promotionBonus > 0 && (
                <div className="finance-bonus">
                  +£{(gameState.lastSeasonFinish.promotionBonus / 1000000).toFixed(1)}M Promotion Bonus!
                </div>
              )}
            </div>
            <div className="finance-box finance-negative">
              <div className="finance-value text-danger">£{(gameState.lastSeasonFinish.costs / 1000000).toFixed(2)}M</div>
              <div className="finance-label">Total Costs</div>
              <div className="finance-breakdown">
                <div>Wages: £{(gameState.lastSeasonFinish.wagesCost / 1000000).toFixed(2)}M</div>
                <div>Facilities: £{(gameState.lastSeasonFinish.facilitiesCost / 1000000).toFixed(2)}M</div>
                <div>Operating: £{(gameState.lastSeasonFinish.operatingCost / 1000000).toFixed(2)}M</div>
              </div>
            </div>
            <div className="finance-box">
              <div className={`finance-value ${gameState.lastSeasonFinish.net > 0 ? 'text-success' : 'text-danger'}`}>
                £{(gameState.lastSeasonFinish.net / 1000000).toFixed(2)}M
              </div>
              <div className="finance-label">Net Income</div>
            </div>
          </div>
          
          {/* Add resign button at the bottom */}
            <div className="season-actions">
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to resign? This will end your career and return to the main menu.')) {
                    deleteSave();
                    setGameState(null);
                    setView('start');
                    setTeamNameInput('');
                  }
                }}
                className="btn btn-danger"
              >
                Resign & Start Over
              </button>
            </div>
          </div>
      )}

      <div className="main-grid">
      {/* Recent Matches - Top during simulation */}
      {gameState.matches.length > 0 && gameState.seasonPhase === 'regular' && (
        <div className="matches-card full-width">
          <h2 className="section-title">Latest Results - Matchday {gameState.matchday}</h2>
          <div className="matches-grid-three">
            {(() => {
              // Separate player match from other matches
              const playerMatch = gameState.matches.find(m => 
                m.homeTeam === gameState.teamName || m.awayTeam === gameState.teamName
              );
              const otherMatches = gameState.matches.filter(m => 
                m.homeTeam !== gameState.teamName && m.awayTeam !== gameState.teamName
              );
              
              // Show player match first, then fill with other matches (max 6 total)
              const matchesToShow = playerMatch 
                ? [playerMatch, ...otherMatches.slice(0, 5)]
                : gameState.matches.slice(0, 6);
              
              return matchesToShow.map((match, index) => {
                const isPlayerMatch = match.homeTeam === gameState.teamName || match.awayTeam === gameState.teamName;
                const playerIsHome = match.homeTeam === gameState.teamName;
                let resultClass = '';
                
                if (isPlayerMatch) {
                  if (match.result === 'draw') {
                    resultClass = 'match-draw';
                  } else if ((playerIsHome && match.result === 'home') || (!playerIsHome && match.result === 'away')) {
                    resultClass = 'match-win';
                  } else {
                    resultClass = 'match-loss';
                  }
                }
                
                return (
                  <div key={index} className={`match-result ${resultClass}`}>
                    <div className="match-team">
                      <span className={match.homeTeam === gameState.teamName ? 'text-bold' : ''}>
                        {match.homeTeam.length > 18 ? match.homeTeam.substring(0, 16) + '...' : match.homeTeam}
                      </span>
                      <span className="match-score-large">{match.homeGoals}</span>
                    </div>
                    <div className="match-team">
                      <span className={match.awayTeam === gameState.teamName ? 'text-bold' : ''}>
                        {match.awayTeam.length > 18 ? match.awayTeam.substring(0, 16) + '...' : match.awayTeam}
                      </span>
                      <span className="match-score-large">{match.awayGoals}</span>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

        {/* Squad */}
        <div className="squad-card">
          <div className="squad-header">
            <h2 className="section-title">
              <Users size={24} /> Squad (Team Rating: {teamRating})
            </h2>
            <div className="squad-validation">
              <div className="squad-size">
                {gameState.squad.length}/25 players
              </div>
              {(() => {
                const validation = validateRoster(gameState.squad);
                return (
                  <div className="squad-breakdown">
                    GK: {validation.counts.gks} | 
                    DEF: {validation.counts.defs} | 
                    MID: {validation.counts.mids} | 
                    FWD: {validation.counts.fwds}
                  </div>
                );
              })()}
            </div>
          </div>
          
          <div className="squad-list">
            {POSITIONS.map(pos => {
              const posPlayers = gameState.squad
                .filter(p => p.position === pos)
                .sort((a, b) => b.rating - a.rating);
              
              if (posPlayers.length === 0) return null;
              
              return (
                <div key={pos} className="position-group">
                  <div className="position-header">{pos}</div>
                  {posPlayers.map(player => (
                    <div key={player.id} className="squad-player">
                      <div className="squad-player-main">
                        <div>
                          <div className="squad-player-name-row">
                            <div className="squad-player-name">{player.name}</div>
                            <div className={`squad-player-rating rating-${player.rating >= 70 ? 'high' : player.rating >= 60 ? 'medium' : 'low'}`}>
                              {player.rating}
                            </div>
                          </div>
                          <div className="squad-player-details">
                            Age: {player.age} | Contract: {player.contractYears}yr | 
                            £{(player.salary / 1000).toFixed(0)}k/yr
                          </div>
                        </div>
                        <button
                          onClick={() => releasePlayer(player.id)}
                          className="btn btn-danger btn-small"
                        >
                          Release
                        </button>
                      </div>
                      <div className="squad-player-stats">
                        <div>PAC {player.stats.pace}</div>
                        <div>SHO {player.stats.shooting}</div>
                        <div>PAS {player.stats.passing}</div>
                        <div>DEF {player.stats.defending}</div>
                        <div>PHY {player.stats.physical}</div>
                      </div>
                      <div className="squad-player-season">
                        {player.seasonStats.appearances} apps, {player.seasonStats.goals}G, {player.seasonStats.assists}A
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          
          <div className="squad-wages">
            <div className="wage-row">
              <span>Weekly Wages:</span>
              <span className="text-bold">£{(weeklyWages / 1000).toFixed(1)}k</span>
            </div>
            <div className="wage-row">
              <span>Annual Wages:</span>
              <span className="text-bold">£{(weeklyWages * 52 / 1000000).toFixed(2)}M</span>
            </div>
          </div>
        </div>

        {/* Facilities & Stats */}
        <div className="sidebar">
          {/* Facilities */}
          <div className="facilities-card">
            <h2 className="section-title">
              <Building size={24} /> Facilities
            </h2>
            
            {gameState.facilities.map(facility => {
              const cost = facility.baseCost * Math.pow(2, facility.level + 1) * (gameState.league / 5);
              const canAfford = gameState.money >= cost;
              const maxedOut = facility.level >= facility.maxLevel;
              
              return (
                <div key={facility.name} className="facility-item">
                  <div className="facility-header">
                    <div>
                      <div className="facility-name">{facility.name}</div>
                      <div className="facility-level">
                        Level {facility.level}/{facility.maxLevel}
                      </div>
                    </div>
                    <button
                      onClick={() => upgradeFacility(facility.name)}
                      disabled={!canAfford || maxedOut}
                      className={`btn btn-small btn-bold ${
                        maxedOut ? 'btn-disabled' :
                        canAfford ? 'btn-primary' : 'btn-disabled'
                      }`}
                    >
                      {maxedOut ? 'MAX' : `£${(cost / 1000000).toFixed(2)}M`}
                    </button>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${(facility.level / facility.maxLevel) * 100}%` }}
                    />
                  </div>
                  <div className="facility-bonus">
                    Performance: +{facility.performanceBonus * facility.level} | 
                    Attendance: +{facility.attendanceBonus * facility.level}%
                    {facility.level === 0 && <span className="facility-hint"> (Upgrade to gain bonuses)</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="stats-card">
            <h2 className="section-title">
              <TrendingUp size={24} /> Club Stats
            </h2>
            
            <div className="stats-list">
              <div className="stat-row">
                <span>Reputation:</span>
                <span className="text-bold">{gameState.reputation}/100</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill progress-fill-warning"
                  style={{ width: `${gameState.reputation}%` }}
                />
              </div>
              
              <div className="stat-row">
                <span>Squad Size:</span>
                <span className="text-bold">{gameState.squad.length}</span>
              </div>
              
              <div className="stat-row">
                <span>Avg Age:</span>
                <span className="text-bold">
                  {gameState.squad.length > 0 
                    ? (gameState.squad.reduce((sum, p) => sum + p.age, 0) / gameState.squad.length).toFixed(1)
                    : 'N/A'}
                </span>
              </div>
              
              {gameState.averageAttendance > 0 && (
                <div className="stat-row">
                  <span>Avg Attendance:</span>
                  <span className="text-bold text-primary">
                    {gameState.averageAttendance.toLocaleString()}
                  </span>
                </div>
              )}
              
              <div className="stat-row">
                <span>Top Scorer:</span>
                <span className="text-bold">
                  {gameState.squad.length > 0 
                    ? (() => {
                        const topScorer = [...gameState.squad].sort((a, b) => b.seasonStats.goals - a.seasonStats.goals)[0];
                        return `${topScorer.name.split(' ')[1]} (${topScorer.seasonStats.goals})`;
                      })()
                    : 'None'}
                </span>
              </div>

              <div className="stat-row">
                <span>Top Assists:</span>
                <span className="text-bold">
                  {gameState.squad.length > 0 
                    ? (() => {
                        const topAssister = [...gameState.squad].sort((a, b) => b.seasonStats.assists - a.seasonStats.assists)[0];
                        return `${topAssister.name.split(' ')[1]} (${topAssister.seasonStats.assists})`;
                      })()
                    : 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default FootballTycoon;