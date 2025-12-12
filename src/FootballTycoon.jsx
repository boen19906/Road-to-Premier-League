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
const LEAGUES = {
  5: { 
    name: 'National League', 
    teams: 24, 
    avgSalary: 65000,
    avgRevenue: 1800000,
    tvRevenue: 100000,
    sponsorshipRevenue: 50000,
    merchandiseRevenue: 30000,
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
    sponsorshipRevenue: 200000,
    merchandiseRevenue: 150000,
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
    sponsorshipRevenue: 600000,
    merchandiseRevenue: 400000,
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
    sponsorshipRevenue: 2000000,
    merchandiseRevenue: 1500000,
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
    sponsorshipRevenue: 25000000,
    merchandiseRevenue: 15000000,
    prizeFirst: 50000000,
    prizePlayoff: 0,
    facilityBaseCost: 30000000
  }
};

const FACILITIES = [
  { name: 'Training Ground', level: 0, maxLevel: 5, baseCost: 500000, performanceBonus: 0, attendanceBonus: 0, maintenanceCost: 30000 },
  { name: 'Stadium', level: 0, maxLevel: 5, baseCost: 0, performanceBonus: 0, attendanceBonus: 5, maintenanceCost: 150000 },
  { name: 'Youth Academy', level: 0, maxLevel: 5, baseCost: 400000, performanceBonus: 0, attendanceBonus: 0, maintenanceCost: 100000 }, // Changed maintenanceCost
  { name: 'Medical Center', level: 0, maxLevel: 5, baseCost: 400000, performanceBonus: 0, attendanceBonus: 0, maintenanceCost: 20000 }
];

const STADIUM_CAPACITIES = {
  0: 3000,
  1: 8000,
  2: 18000,
  3: 25000,
  4: 40000,
  5: 65000
};

const POSITIONS = ['GK', 'DEF', 'MID', 'FWD'];

const TEAM_NAMES = {
  5: [ // National League - add more teams
    'Aldershot Town','Altrincham','Boston United','Braintree Town','Brackley Town','Carlisle United','Eastleigh','FC Halifax Town',
    'Forest Green Rovers','Gateshead','Hartlepool United','Morecambe','Rochdale','Scunthorpe United','Solihull Moors','Southend United',
    'Tamworth','Truro City','Woking','Yeovil Town','York City','Boreham Wood','Sutton United','Wealdstone',
    // Add more reserve teams
    "Brackley Town", "Scunthorpe United", "Kidderminster Harriers", "Chester FC", "Chorley","Torquay United","Truro City","Eastbourne Borough","Worthing",
  "Boreham Wood", "Dorking Wanderers", "Maidstone United"
  ],
  4: [ // League Two - add more
    'Accrington Stanley','Barnet','Barrow','Bristol Rovers','Bromley','Cambridge United','Cheltenham Town','Chesterfield',
    'Colchester United','Crawley Town','Crewe Alexandra','Fleetwood Town','Gillingham','Grimsby Town','Harrogate Town',
    'Milton Keynes Dons','Newport County','Notts County','Oldham Athletic','Salford City','Shrewsbury Town','Swindon Town',
    'Tranmere Rovers','Walsall'
  ],
  3: [ // League One - add more
    'AFC Wimbledon','Barnsley','Blackpool','Bolton Wanderers','Bradford City','Burton Albion',
      'Cardiff City','Doncaster Rovers','Exeter City','Huddersfield Town','Leyton Orient','Lincoln City',
      'Luton Town','Mansfield Town','Northampton Town','Peterborough United','Plymouth Argyle','Port Vale',
      'Reading','Rotherham United','Stevenage','Stockport County','Wigan Athletic','Wycombe Wanderers'
  ],
  2: [ // Championship - add more
    'Birmingham City','Blackburn Rovers','Bristol City','Charlton Athletic','Coventry City',
    'Derby County','Hull City','Ipswich Town','Leicester City','Middlesbrough','Millwall',
    'Norwich City','Oxford United','Portsmouth','Preston North End','Queens Park Rangers',
    'Sheffield United','Sheffield Wednesday','Southampton','Stoke City','Swansea City','Watford',
    'West Bromwich Albion','Wrexham'
  ],
  1: [ // Premier League
    'Arsenal','Aston Villa','Bournemouth','Brentford','Brighton & Hove Albion','Burnley',
    'Chelsea','Crystal Palace','Everton','Fulham','Leeds United','Liverpool','Manchester City',
    'Manchester United','Newcastle United','Nottingham Forest','Sunderland','Tottenham Hotspur','West Ham United',
    'Wolverhampton Wanderers'
  ]
};

const [freeAgentMessage, setFreeAgentMessage] = useState(null);
const [transferMessage, setTransferMessage] = useState(null);

const [view, setView] = useState('start'); // start, main, freeagents, standings, contracts, gameover, transfer, academy
const [selectedPlayer, setSelectedPlayer] = useState(null);
const [contractOffer, setContractOffer] = useState({ years: 3, salary: 0 });
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
  money: 3000000,
  reputation: 50,
  facilities: JSON.parse(JSON.stringify(FACILITIES)),
  squad: [],
  seasonGoal: 'Top 7 (Playoffs)',
  paused: true,
  lastSeasonFinish: null,
  teamName: teamName || 'Your Club FC',
  matches: [],
  standings: [], // This will be set below
  freeAgents: [],
  seasonPhase: 'regular',
  contractNegotiations: [],
  averageAttendance: 0,
  totalAttendance: 0,
  accumulatedTicketRevenue: 0,
  homeGames: 0,
  transferOffers: [],
  isTransferWindow: false,
  transferPhase: 'offseason',
  availableFreeAgents: [],
  consecutiveSeasonsInDebt: 0,
  leagueMembership: initializeLeagueMembership(teamName || 'Your Club FC'), // FIRST
  teamRatings: initializeTeamRatings(teamName || 'Your Club FC'), // SECOND
  fixtureSchedule: null,
  academyPlayers: [] // Add this line 
};

// NOW generate standings using both membership and ratings
initialState.standings = generateStandingsFromMembership(5, initialState.teamName, initialState.leagueMembership, initialState.teamRatings);
  
  // Generate initial squad
  const positions = { GK: 3, DEF: 8, MID: 8, FWD: 6 };
  
  Object.entries(positions).forEach(([pos, count]) => {
    for (let i = 0; i < count; i++) {
      initialState.squad.push(generatePlayer(pos, 5, initialState.reputation));
    }
  });

  // Generate initial standings using league membership
  // Generate initial standings using league membership AND ratings
  initialState.standings = generateStandingsFromMembership(5, initialState.teamName, initialState.leagueMembership, initialState.teamRatings);
  
  // Generate free agents
  initialState.freeAgents = generateFreeAgentsByPhase(5, initialState.reputation, 'offseason');
  
  setGameState(initialState);
  setView('main');
}

function initializeLeagueMembership(playerTeam) {
  // Start with all teams from TEAM_NAMES (including duplicates)
  const membership = {
    1: [...TEAM_NAMES[1].slice(0, 20)],
    2: [...TEAM_NAMES[2].slice(0, 24)],
    3: [...TEAM_NAMES[3].slice(0, 24)],
    4: [...TEAM_NAMES[4].slice(0, 24)],
    5: [...TEAM_NAMES[5].slice(0, 23)]
  };
  
  // FIRST: Remove player's chosen name from ALL leagues
  [1, 2, 3, 4, 5].forEach(league => {
    membership[league] = membership[league].filter(t => t !== playerTeam);
  });
  
  // THEN: Add player to National League
  membership[5].push(playerTeam);
  
  // Keep checking and replacing until no duplicates remain
  let hadDuplicates = true;
  let iterations = 0;
  const maxIterations = 10;
  
  while (hadDuplicates && iterations < maxIterations) {
    hadDuplicates = false;
    iterations++;
    
    console.log(`\nDuplicate check iteration ${iterations}:`);
    
    // RESET global tracking each iteration
    const globalAssigned = new Set();
    
    // Check each league in order
    for (const league of [1, 2, 3, 4, 5]) {
      const leagueTeams = membership[league];
      const cleaned = [];
      const duplicatesFound = [];
      
      // Check each team in this league
      for (const team of leagueTeams) {
        // Check if this team is already assigned in a PREVIOUS league this iteration
        if (globalAssigned.has(team)) {
          duplicatesFound.push(team);
          console.log(`Found duplicate: "${team}" in league ${league} (already in another league)`);
        } else {
          cleaned.push(team);
          globalAssigned.add(team);
        }
      }
      
      // Replace duplicates with extras from same league
      for (const duplicate of duplicatesFound) {
        let replaced = false;
        
        // Look through ALL teams in this league's TEAM_NAMES
        for (const candidate of TEAM_NAMES[league]) {
          // Now we can use any team that's not already assigned AND not the player team
          if (!globalAssigned.has(candidate) && candidate !== playerTeam) {
            cleaned.push(candidate);
            globalAssigned.add(candidate);
            console.log(`Replaced "${duplicate}" with "${candidate}" in league ${league}`);
            replaced = true;
            hadDuplicates = true;
            break;
          }
        }
        
        if (!replaced) {
          console.error(`Could not find replacement for "${duplicate}" in league ${league}!`);
        }
      }
      
      membership[league] = cleaned;
    }
  }
  
  if (iterations >= maxIterations) {
    console.error('Max iterations reached - may still have duplicates!');
  } else {
    console.log(`\n✓ Duplicates removed in ${iterations} iteration(s)`);
  }

  // CASCADING FILL SYSTEM - Fill leagues top-down, cascading promotions
  console.log('\n--- Starting cascading fill system ---');
  
  // Check each league from top to bottom
  for (const league of [1, 2, 3, 4, 5]) {
    const expected = LEAGUES[league].teams;
    const actual = membership[league].length;
    const shortage = expected - actual;
    
    if (shortage > 0) {
      console.log(`League ${league} short by ${shortage} teams`);
      
      // Try to fill from this league's own pool first
      const existingTeams = new Set([
        ...membership[1],
        ...membership[2],
        ...membership[3],
        ...membership[4],
        ...membership[5]
      ]);
      
      const availableInLeague = TEAM_NAMES[league].filter(t => 
        !existingTeams.has(t) && t !== playerTeam
      );
      
      let filled = 0;
      
      // Fill from own pool
      for (const team of availableInLeague) {
        if (filled >= shortage) break;
        membership[league].push(team);
        existingTeams.add(team);
        filled++;
        console.log(`  Filled with "${team}" from league ${league} pool`);
      }
      
      // If still short, CASCADE from league below
      if (filled < shortage) {
        const remaining = shortage - filled;
        console.log(`  Still need ${remaining} teams, cascading from below...`);
        
        if (league < 5) {
          // Promote teams from league below
          const lowerLeague = league + 1;
          const teamsToPromote = membership[lowerLeague].slice(0, remaining);
          
          teamsToPromote.forEach(team => {
            membership[league].push(team);
            membership[lowerLeague] = membership[lowerLeague].filter(t => t !== team);
            console.log(`  Cascaded "${team}" from league ${lowerLeague} to ${league}`);
          });
          
          // This will create shortage in lower league, which next iteration will fix
        } else {
          // League 5 (National League) - add from any available pool
          console.log(`  National League short - adding from any available pool`);
          
          for (let srcLeague = 4; srcLeague >= 1; srcLeague--) {
            if (filled >= shortage) break;
            
            const availableFromSrc = TEAM_NAMES[srcLeague].filter(t => 
              !existingTeams.has(t) && t !== playerTeam
            );
            
            for (const team of availableFromSrc) {
              if (filled >= shortage) break;
              membership[5].push(team);
              existingTeams.add(team);
              filled++;
              console.log(`  Added "${team}" from league ${srcLeague} pool to National League`);
            }
          }
        }
      }
    }
  }
  
  // Shuffle each league
  Object.keys(membership).forEach(league => {
    membership[league] = membership[league].sort(() => Math.random() - 0.5);
  });
  
  console.log('\n✓ Final league membership after cascading fill:', {
    PL: membership[1].length,
    Championship: membership[2].length,
    L1: membership[3].length,
    L2: membership[4].length,
    NL: membership[5].length
  });
  
  // Final verification
  [1, 2, 3, 4, 5].forEach(league => {
    const expected = LEAGUES[league].teams;
    const actual = membership[league].length;
    if (actual !== expected) {
      console.error(`❌ League ${league} (${LEAGUES[league].name}): ${actual}/${expected} teams`);
    } else {
      console.log(`✓ League ${league} (${LEAGUES[league].name}): ${actual}/${expected} teams`);
    }
  });
  
  return membership;
}

function initializeTeamRatings(playerTeam) {
  // Track all team ratings separately from league membership
  const ratings = {};
  
  // Helper to generate rating for a team in a league
  const generateRating = (team, league) => {
    let minRating, maxRating;
    switch(league) {
      case 5: minRating = 50; maxRating = 64; break; // Was 50-66, now narrower
      case 4: minRating = 59; maxRating = 71; break; // Was 58-71, now narrower
      case 3: minRating = 66; maxRating = 76; break; // Was 64-76, now narrower
      case 2: minRating = 74; maxRating = 85; break; // Was 73-85, now narrower
      case 1: minRating = 82; maxRating = 95; break; // Was 80-95, keep wide for variance
      default: minRating = 45; maxRating = 62;
    }
    
    // Elite clubs (Big 6 + other top teams)
    const eliteClubs = [
      'Manchester City', 'Arsenal FC', 'Liverpool FC', 'Chelsea FC', 
      'Manchester United', 'Tottenham Hotspur', 'Newcastle United', 'Aston Villa'
    ];
    
    const strongClubs = [
      'West Ham United', 'Brighton & Hove Albion', 'Brentford FC', 'Fulham FC'
    ];
    
    if (league === 1 && eliteClubs.includes(team)) {
      return 88 + Math.floor(Math.random() * 8); // 88-95 (elite)
    }
    
    if (league === 1 && strongClubs.includes(team)) {
      return 80 + Math.floor(Math.random() * 6); // 80-85 (strong)
    }
    
    return Math.round(minRating + Math.random() * (maxRating - minRating));
  };
  
  // Generate ratings for all teams in all leagues
  [1, 2, 3, 4, 5].forEach(league => {
    TEAM_NAMES[league].forEach(team => {
      if (!ratings[team]) {
        ratings[team] = generateRating(team, league);
      }
    });
  });
  
  // Player team starts with low-mid tier National League rating
  ratings[playerTeam] = 52;
  
  return ratings;
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
    id: crypto.randomUUID(),
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


function generateFreeAgentsByPhase(league, reputation, phase) {
  console.log('Generating free agents for phase:', phase);
  
  let count, qualityModifier, freeAgentRatio, oldPlayerRatio;
  
  switch(phase) {
    case 'offseason':
      // Large transfer market after season ends
      count = 40; // More players available
      qualityModifier = 0; // Normal quality
      freeAgentRatio = 0.25; // 25% are free transfers (rest require fees)
      oldPlayerRatio = 0.30; // 30% of free agents are older players
      break;
    case 'emergency':
      // Limited emergency signings during season - only free agents
      count = 20; // Fewer players
      qualityModifier = -5; // Lower quality
      freeAgentRatio = 1.0; // 100% free transfers (no paid transfers mid-season emergency)
      oldPlayerRatio = 0.50; // 50% are older/declining players
      break;
    case 'window':
      // Mid-season transfer window - mostly paid transfers
      count = 35; // Good selection
      qualityModifier = 0; // Normal quality (no premium)
      freeAgentRatio = 0.20; // Only 20% are free transfers
      oldPlayerRatio = 0.35; // 35% of free agents are older
      break;
    default:
      count = 40;
      qualityModifier = 0;
      freeAgentRatio = 0.25;
      oldPlayerRatio = 0.30;
  }
  
  const agents = [];
  const positions = { 
    GK: Math.ceil(count * 0.10), 
    DEF: Math.ceil(count * 0.33), 
    MID: Math.ceil(count * 0.33), 
    FWD: Math.ceil(count * 0.24) 
  };
  
  Object.entries(positions).forEach(([pos, posCount]) => {
    for (let i = 0; i < posCount; i++) {
      // Determine if this player is a free agent or requires transfer fee
      const isFreeAgent = Math.random() < freeAgentRatio;
      
      let player;
      
      if (isFreeAgent) {
        // Free agents: older or lower quality players
        const isOldPlayer = Math.random() < oldPlayerRatio;
        
        if (isOldPlayer) {
          // Old player: 30-35 years old, decent rating but declining
          player = generatePlayer(pos, league, reputation, false);
          player.age = 30 + Math.floor(Math.random() * 6); // 30-35
          // Slightly reduce rating for age
          player.rating = Math.max(40, player.rating - Math.floor(Math.random() * 5));
        } else {
          // Younger free agent but lower quality
          player = generatePlayer(pos, league, reputation, false);
          player.rating = Math.max(40, player.rating + qualityModifier - 3); // Reduce quality
        }
        
        player.requiresTransferFee = false;
        player.transferFee = 0;
      } else {
        // Paid transfer: normal quality player requiring transfer fee
        player = generatePlayer(pos, league, reputation, false);
        player.rating = Math.max(40, Math.min(99, player.rating + qualityModifier));
        player.requiresTransferFee = true;
        player.transferFee = calculateTransferFee(player, league);
      }
      
      // Recalculate salary based on adjusted rating
      player.salary = calculateMarketValue(player, league);
      
      agents.push(player);
    }
  });
  
  console.log('Generated', agents.length, 'agents for phase', phase);
  console.log('Free agents:', agents.filter(a => !a.requiresTransferFee).length);
  console.log('Paid transfers:', agents.filter(a => a.requiresTransferFee).length);
  
  return agents.sort((a, b) => b.rating - a.rating);
}

function generateAcademyPlayers(academyLevel, league, reputation) {
  if (academyLevel === 0) return []; // No academy = no prospects
  
  // Number of prospects: 4-7 players
  const count = 4 + Math.floor(Math.random() * 4);
  
  // Rating ranges based on academy level
  let minRating, maxRating, avgRating;
  switch(academyLevel) {
    case 1:
      minRating = 50;
      maxRating = 65;
      avgRating = 55; // Most will be around here
      break;
    case 2:
      minRating = 55;
      maxRating = 70;
      avgRating = 60;
      break;
    case 3:
      minRating = 60;
      maxRating = 75;
      avgRating = 65;
      break;
    case 4:
      minRating = 65;
      maxRating = 80;
      avgRating = 70;
      break;
    case 5:
      minRating = 70;
      maxRating = 95;
      avgRating = 75;
      break;
    default:
      return [];
  }
  
  const prospects = [];
  const positions = { GK: 1, DEF: 2, MID: 2, FWD: 2 }; // Rough distribution
  
  // Generate prospects
  for (let i = 0; i < count; i++) {
    // Pick random position
    const posArray = ['GK', 'DEF', 'MID', 'FWD'];
    const position = posArray[Math.floor(Math.random() * posArray.length)];
    
    // Use normal distribution to bias toward avgRating
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    
    // Scale z to rating range (std dev of ~5 for academy level)
    let rating = Math.round(avgRating + z * 5);
    rating = Math.max(minRating, Math.min(maxRating, rating));
    
    // Generate young player (16-19 years old)
    const age = 16 + Math.floor(Math.random() * 4);
    
    const player = generatePlayer(position, league, reputation, true);
    player.rating = rating;
    player.age = age;
    player.salary = calculateMarketValue(player, league);
    player.isAcademyProspect = true;
    
    prospects.push(player);
  }
  
  return prospects.sort((a, b) => b.rating - a.rating);
}

function generateStandingsFromMembership(league, playerTeam, leagueMembership, teamRatings) {
  const leagueData = LEAGUES[league];
  const teamsInLeague = leagueMembership[league] || [];
  
  console.log(`Generating standings for league ${league}:`, {
    expectedTeams: leagueData.teams,
    actualTeams: teamsInLeague.length,
    teams: teamsInLeague
  });
  
  // Ensure we have exactly the right number of teams
  let finalTeams = [...teamsInLeague];
  
  // Remove player team if it's in the list
  finalTeams = finalTeams.filter(t => t !== playerTeam);
  
  // Add player team
  finalTeams.push(playerTeam);
  
  // Trim to exact size needed
  finalTeams = finalTeams.slice(0, leagueData.teams);
  
  // If still not enough teams, add from pool
  if (finalTeams.length < leagueData.teams) {
    console.warn(`League ${league} short ${leagueData.teams - finalTeams.length} teams, adding from pool`);
    const availableTeams = TEAM_NAMES[league].filter(t => 
      !finalTeams.includes(t) && t !== playerTeam
    );
    
    const needed = leagueData.teams - finalTeams.length;
    const newTeams = availableTeams.slice(0, needed);
    finalTeams.push(...newTeams);
  }
  
  console.log(`Final team count for league ${league}:`, finalTeams.length);
  
  const standings = finalTeams.map((team, index) => {
    // Use stored rating from teamRatings object, or calculate for player
    const teamRating = team === playerTeam ? 0 : (teamRatings[team] || 60);
    
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
      rating: teamRating
    };
  });
  
  // Sort by rating (highest first), but keep isPlayer flag intact
  standings.sort((a, b) => {
    // Player team always goes first (or last if you prefer)
    if (a.isPlayer) return -1;
    if (b.isPlayer) return 1;
    return b.rating - a.rating;
  });
  
  // Update positions after sort
  standings.forEach((team, index) => {
    team.position = index + 1;
  });
  
  return standings;
}

function updateAllTeamRatings(teamRatings) {
  // All teams improve/decline with same random variation
  const updatedRatings = { ...teamRatings };
  
  // Elite clubs (have rating floor but same random variations)
  const eliteClubs = [
    'Manchester City', 'Arsenal FC', 'Liverpool FC', 'Chelsea FC', 
    'Manchester United', 'Tottenham Hotspur'
  ];
  
  Object.keys(updatedRatings).forEach(team => {
    const currentRating = updatedRatings[team];
    
    // Normal distribution approximation using Box-Muller transform
    const u1 = Math.random();
    const u2 = Math.random();
    
    // Box-Muller transform to get normal distribution
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    
    // Scale to range -3 to +3
    let change = Math.round(z * 1.2);
    
    // Clamp to -3 to +3 range
    change = Math.max(-3, Math.min(3, change));
    
    let newRating = currentRating + change;
    
    // Elite clubs have a floor at 85
    if (eliteClubs.includes(team)) {
      newRating = Math.max(85, Math.min(95, newRating));
    } else {
      // Regular teams: 40-95 range (will be capped by league in updateLeagueMembership)
      newRating = Math.max(40, Math.min(95, newRating));
    }
    
    updatedRatings[team] = newRating;
  });
  
  return updatedRatings;
}

function updateTeamRatings(leagueMembership, league) {
  // Update ratings for all teams in a league (simulate squad changes)
  const teamsInLeague = Object.keys(leagueMembership[league]);
  
  teamsInLeague.forEach(team => {
    const currentRating = leagueMembership[league][team];
    
    // Teams can improve/decline by -3 to +3 each season
    let ratingChange = Math.floor(Math.random() * 7) - 3; // -3 to +3
    
    // 70% chance of small changes (-1, 0, +1), 30% chance of bigger changes
    if (Math.random() > 0.3) {
      ratingChange = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
    }
    
    // Get league-appropriate bounds
    let minRating, maxRating;
    switch(league) {
      case 5: minRating = 50; maxRating = 66; break;
      case 4: minRating = 58; maxRating = 71; break;
      case 3: minRating = 64; maxRating = 76; break;
      case 2: minRating = 73; maxRating = 85; break;
      case 1: minRating = 80; maxRating = 95; break;
      default: minRating = 50; maxRating = 66;
    }
    
    const newRating = Math.max(minRating, Math.min(maxRating, currentRating + ratingChange));
    leagueMembership[league][team] = newRating;
  });
}

function adjustRatingForLeagueChange(currentRating, oldLeague, newLeague) {

  // Normal distribution approximation using Box-Muller transform
    // Generate two uniform random numbers
    const u1 = Math.random();
    const u2 = Math.random();
    
    // Box-Muller transform to get normal distribution
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  // Just apply a small random change, no special promotion/relegation logic
  let adjustment = Math.round(z * 1.2);
    
  // Clamp to -3 to +3 range
  adjustment = Math.max(-3, Math.min(3, adjustment));
  
  // Get target league bounds
  let minRating, maxRating;
  switch(newLeague) {
    case 5: minRating = 45; maxRating = 68; break; // National League (free agency: 45-68)
    case 4: minRating = 55; maxRating = 72; break; // League Two (free agency: 55-72)
    case 3: minRating = 60; maxRating = 77; break; // League One (free agency: 60-76)
    case 2: minRating = 65; maxRating = 84; break; // Championship (free agency: 65-82)
    case 1: minRating = 70; maxRating = 95; break; // Premier League (free agency: 70-92)
    default: minRating = 45; maxRating = 68;
  }
  
  return Math.max(minRating, Math.min(maxRating, currentRating + adjustment));
}

function updateLeagueMembership(oldMembership, standings, oldLeague, newLeague, playoffWinners = {}, teamRatings) {
  const newMembership = JSON.parse(JSON.stringify(oldMembership)); // Deep clone
  const newRatings = updateAllTeamRatings(teamRatings); // Update all ratings first
  
  // First, handle the player's league movement
  const playerTeam = standings.find(s => s.isPlayer).team;
  newMembership[oldLeague] = newMembership[oldLeague].filter(t => t !== playerTeam);
  if (!newMembership[newLeague].includes(playerTeam)) {
    newMembership[newLeague].push(playerTeam);
  }
  
  // Now simulate promotion/relegation for the player's OLD league
  const sortedStandings = [...standings].sort((a, b) => a.position - b.position);
  const nonPlayerStandings = sortedStandings.filter(t => !t.isPlayer);
  
  let promotedTeams = [];
  let relegatedTeams = [];
  
  if (oldLeague === 5) {
  // National League: 1 auto + 1 playoff = 2 promoted total, bottom 4 relegated
  
  const playerWasAutoPromoted = playerStanding.position === 1 && newLeague < oldLeague;
  
  let autoPromoted = [];
  if (!playerWasAutoPromoted) {
    autoPromoted = nonPlayerStandings.slice(0, 1).map(t => t.team);
  }
  
  const playoffWinner = playoffWinners[5];
  let finalPlayoffWinner = playoffWinner;
  const playerWonPlayoff = playoffWinner === playerTeam;
  
  if (!playoffWinner || playerWonPlayoff) {
    const playoffTeams = nonPlayerStandings
      .filter(t => t.position >= 2 && t.position <= 7)
      .map(t => ({ team: t.team, rating: newRatings[t.team] || 60 }))
      .sort((a, b) => b.rating - a.rating);
    
    if (playoffTeams.length >= 6) {
      const totalRating = playoffTeams.reduce((sum, t) => sum + t.rating, 0);
      const random = Math.random() * totalRating;
      let cumulative = 0;
      
      for (const team of playoffTeams) {
        cumulative += team.rating;
        if (random <= cumulative) {
          finalPlayoffWinner = team.team;
          break;
        }
      }
      
      console.log(`NL Playoff simulated: ${playoffTeams.map(t => t.team).join(', ')} → Winner: ${finalPlayoffWinner}`);
    }
  }
  
  if (playerWonPlayoff) {
    promotedTeams = autoPromoted;
  } else if (finalPlayoffWinner && finalPlayoffWinner !== playerTeam) {
    promotedTeams = [...autoPromoted, finalPlayoffWinner];
  } else {
    promotedTeams = autoPromoted;
  }
  
  promotedTeams = promotedTeams.filter(t => t !== playerTeam);
  
  // Check if player was relegated
  const playerWasRelegated = playerStanding.position >= 21 && newLeague > oldLeague;
  
  if (playerWasRelegated) {
    // Player took one relegation spot, relegate 3 other teams
    relegatedTeams = nonPlayerStandings.slice(-3).map(t => t.team);
  } else {
    // Player didn't relegate, relegate bottom 4 teams
    relegatedTeams = nonPlayerStandings.slice(-4).map(t => t.team);
  }
  
  console.log(`NL: Promoting ${promotedTeams.length} other teams (player ${playerWasAutoPromoted ? 'auto-promoted' : playerWonPlayoff ? 'won playoff' : 'not promoted'}), Relegating ${relegatedTeams.length} other teams (player ${playerWasRelegated ? 'relegated' : 'not relegated'})`);
  
  // Move promoted teams up to L2
  promotedTeams.forEach(team => {
    newMembership[5] = newMembership[5].filter(t => t !== team);
    newMembership[1] = newMembership[1].filter(t => t !== team);
    newMembership[2] = newMembership[2].filter(t => t !== team);
    newMembership[3] = newMembership[3].filter(t => t !== team);
    newMembership[4] = newMembership[4].filter(t => t !== team);
    
    newMembership[4].push(team);
    newRatings[team] = adjustRatingForLeagueChange(newRatings[team], 5, 4);
  });
  
  // Relegate teams out of football league
  relegatedTeams.forEach(team => {
    newMembership[5] = newMembership[5].filter(t => t !== team);
  });
  
  console.log(`NL after promotions/relegations: ${newMembership[5].length} teams`);
  
} else if (oldLeague === 4) {
  // League Two: 3 auto + 1 playoff = 4 promoted total, bottom 2 relegated
  
  const playerWasAutoPromoted = playerStanding.position <= 3 && newLeague < oldLeague;
  
  let autoPromoted = [];
  if (playerWasAutoPromoted) {
    autoPromoted = nonPlayerStandings.slice(0, 2).map(t => t.team);
  } else {
    autoPromoted = nonPlayerStandings.slice(0, 3).map(t => t.team);
  }
  
  const playoffWinner = playoffWinners[4];
  let finalPlayoffWinner = playoffWinner;
  const playerWonPlayoff = playoffWinner === playerTeam;
  
  if (!playoffWinner || playerWonPlayoff) {
    const playoffTeams = nonPlayerStandings
      .filter(t => t.position >= 4 && t.position <= 7)
      .map(t => ({ team: t.team, rating: newRatings[t.team] || 60 }))
      .sort((a, b) => b.rating - a.rating);
    
    if (playoffTeams.length >= 4) {
      const totalRating = playoffTeams.reduce((sum, t) => sum + t.rating, 0);
      const random = Math.random() * totalRating;
      let cumulative = 0;
      
      for (const team of playoffTeams) {
        cumulative += team.rating;
        if (random <= cumulative) {
          finalPlayoffWinner = team.team;
          break;
        }
      }
      
      console.log(`L2 Playoff simulated: ${playoffTeams.map(t => t.team).join(', ')} → Winner: ${finalPlayoffWinner}`);
    }
  }
  
  if (playerWonPlayoff) {
    promotedTeams = autoPromoted;
  } else if (finalPlayoffWinner && finalPlayoffWinner !== playerTeam) {
    promotedTeams = [...autoPromoted, finalPlayoffWinner];
  } else {
    promotedTeams = autoPromoted;
  }
  
  promotedTeams = promotedTeams.filter(t => t !== playerTeam);
  
  // Check if player was relegated
  const playerWasRelegated = playerStanding.position >= 23 && newLeague > oldLeague;
  
  if (playerWasRelegated) {
    // Player took one relegation spot, relegate 1 other team
    relegatedTeams = nonPlayerStandings.slice(-1).map(t => t.team);
  } else {
    // Player didn't relegate, relegate bottom 2 teams
    relegatedTeams = nonPlayerStandings.slice(-2).map(t => t.team);
  }
  
  console.log(`L2: Promoting ${promotedTeams.length} other teams (player ${playerWasAutoPromoted ? 'auto-promoted' : playerWonPlayoff ? 'won playoff' : 'not promoted'}), Relegating ${relegatedTeams.length} other teams (player ${playerWasRelegated ? 'relegated' : 'not relegated'})`);
  
  // Move promoted teams up
  promotedTeams.forEach(team => {
    newMembership[4] = newMembership[4].filter(t => t !== team);
    newMembership[1] = newMembership[1].filter(t => t !== team);
    newMembership[2] = newMembership[2].filter(t => t !== team);
    newMembership[3] = newMembership[3].filter(t => t !== team);
    newMembership[5] = newMembership[5].filter(t => t !== team);
    
    newMembership[3].push(team);
    newRatings[team] = adjustRatingForLeagueChange(newRatings[team], 4, 3);
  });
  
  // Move relegated teams down
  relegatedTeams.forEach(team => {
    newMembership[4] = newMembership[4].filter(t => t !== team);
    newMembership[1] = newMembership[1].filter(t => t !== team);
    newMembership[2] = newMembership[2].filter(t => t !== team);
    newMembership[3] = newMembership[3].filter(t => t !== team);
    newMembership[5] = newMembership[5].filter(t => t !== team);
    
    newMembership[5].push(team);
    newRatings[team] = adjustRatingForLeagueChange(newRatings[team], 4, 5);
  });
  
} else if (oldLeague === 3) {
  // League One: 2 auto + 1 playoff = 3 promoted total, bottom 4 relegated
  
  const playerWasAutoPromoted = playerStanding.position <= 2 && newLeague < oldLeague;
  
  let autoPromoted = [];
  if (playerWasAutoPromoted) {
    autoPromoted = nonPlayerStandings.slice(0, 1).map(t => t.team);
  } else {
    autoPromoted = nonPlayerStandings.slice(0, 2).map(t => t.team);
  }
  
  const playoffWinner = playoffWinners[3];
  let finalPlayoffWinner = playoffWinner;
  const playerWonPlayoff = playoffWinner === playerTeam;
  
  if (!playoffWinner || playerWonPlayoff) {
    const playoffTeams = nonPlayerStandings
      .filter(t => t.position >= 3 && t.position <= 6)
      .map(t => ({ team: t.team, rating: newRatings[t.team] || 60 }))
      .sort((a, b) => b.rating - a.rating);
    
    if (playoffTeams.length >= 4) {
      const totalRating = playoffTeams.reduce((sum, t) => sum + t.rating, 0);
      const random = Math.random() * totalRating;
      let cumulative = 0;
      
      for (const team of playoffTeams) {
        cumulative += team.rating;
        if (random <= cumulative) {
          finalPlayoffWinner = team.team;
          break;
        }
      }
      
      console.log(`L1 Playoff simulated: ${playoffTeams.map(t => t.team).join(', ')} → Winner: ${finalPlayoffWinner}`);
    }
  }
  
  if (playerWonPlayoff) {
    promotedTeams = autoPromoted;
  } else if (finalPlayoffWinner && finalPlayoffWinner !== playerTeam) {
    promotedTeams = [...autoPromoted, finalPlayoffWinner];
  } else {
    promotedTeams = autoPromoted;
  }
  
  promotedTeams = promotedTeams.filter(t => t !== playerTeam);
  
  // Check if player was relegated
  const playerWasRelegated = playerStanding.position >= 21 && newLeague > oldLeague;
  
  if (playerWasRelegated) {
    // Player took one relegation spot, relegate 3 other teams
    relegatedTeams = nonPlayerStandings.slice(-3).map(t => t.team);
  } else {
    // Player didn't relegate, relegate bottom 4 teams
    relegatedTeams = nonPlayerStandings.slice(-4).map(t => t.team);
  }
  
  console.log(`L1: Promoting ${promotedTeams.length} other teams (player ${playerWasAutoPromoted ? 'auto-promoted' : playerWonPlayoff ? 'won playoff' : 'not promoted'}), Relegating ${relegatedTeams.length} other teams (player ${playerWasRelegated ? 'relegated' : 'not relegated'})`);
  
  // Move promoted teams up
  promotedTeams.forEach(team => {
    newMembership[3] = newMembership[3].filter(t => t !== team);
    newMembership[1] = newMembership[1].filter(t => t !== team);
    newMembership[2] = newMembership[2].filter(t => t !== team);
    newMembership[4] = newMembership[4].filter(t => t !== team);
    newMembership[5] = newMembership[5].filter(t => t !== team);
    
    newMembership[2].push(team);
    newRatings[team] = adjustRatingForLeagueChange(newRatings[team], 3, 2);
  });
  
  // Move relegated teams down
  relegatedTeams.forEach(team => {
    newMembership[3] = newMembership[3].filter(t => t !== team);
    newMembership[1] = newMembership[1].filter(t => t !== team);
    newMembership[2] = newMembership[2].filter(t => t !== team);
    newMembership[4] = newMembership[4].filter(t => t !== team);
    newMembership[5] = newMembership[5].filter(t => t !== team);
    
    newMembership[4].push(team);
    newRatings[team] = adjustRatingForLeagueChange(newRatings[team], 3, 4);
  });
  
} else if (oldLeague === 2) {
  // Championship: 2 auto + 1 playoff = 3 promoted total, bottom 3 relegated
  
  const playerWasAutoPromoted = playerStanding.position <= 2 && newLeague < oldLeague;
  
  let autoPromoted = [];
  if (playerWasAutoPromoted) {
    autoPromoted = nonPlayerStandings.slice(0, 1).map(t => t.team);
  } else {
    autoPromoted = nonPlayerStandings.slice(0, 2).map(t => t.team);
  }
  
  const playoffWinner = playoffWinners[2];
  let finalPlayoffWinner = playoffWinner;
  const playerWonPlayoff = playoffWinner === playerTeam;
  
  if (!playoffWinner || playerWonPlayoff) {
    const playoffTeams = nonPlayerStandings
      .filter(t => t.position >= 3 && t.position <= 6)
      .map(t => ({ team: t.team, rating: newRatings[t.team] || 60 }))
      .sort((a, b) => b.rating - a.rating);
    
    if (playoffTeams.length >= 4) {
      const totalRating = playoffTeams.reduce((sum, t) => sum + t.rating, 0);
      const random = Math.random() * totalRating;
      let cumulative = 0;
      
      for (const team of playoffTeams) {
        cumulative += team.rating;
        if (random <= cumulative) {
          finalPlayoffWinner = team.team;
          break;
        }
      }
      
      console.log(`Championship Playoff simulated: ${playoffTeams.map(t => t.team).join(', ')} → Winner: ${finalPlayoffWinner}`);
    }
  }
  
  if (playerWonPlayoff) {
    promotedTeams = autoPromoted;
  } else if (finalPlayoffWinner && finalPlayoffWinner !== playerTeam) {
    promotedTeams = [...autoPromoted, finalPlayoffWinner];
  } else {
    promotedTeams = autoPromoted;
  }
  
  promotedTeams = promotedTeams.filter(t => t !== playerTeam);
  
  // Check if player was relegated
  const playerWasRelegated = playerStanding.position >= 22 && newLeague > oldLeague;
  
  if (playerWasRelegated) {
    // Player took one relegation spot, relegate 2 other teams
    relegatedTeams = nonPlayerStandings.slice(-2).map(t => t.team);
  } else {
    // Player didn't relegate, relegate bottom 3 teams
    relegatedTeams = nonPlayerStandings.slice(-3).map(t => t.team);
  }
  
  console.log(`Championship: Promoting ${promotedTeams.length} other teams (player ${playerWasAutoPromoted ? 'auto-promoted' : playerWonPlayoff ? 'won playoff' : 'not promoted'}), Relegating ${relegatedTeams.length} other teams (player ${playerWasRelegated ? 'relegated' : 'not relegated'})`);
  
  // Move promoted teams up
  promotedTeams.forEach(team => {
    newMembership[2] = newMembership[2].filter(t => t !== team);
    newMembership[1] = newMembership[1].filter(t => t !== team);
    newMembership[3] = newMembership[3].filter(t => t !== team);
    newMembership[4] = newMembership[4].filter(t => t !== team);
    newMembership[5] = newMembership[5].filter(t => t !== team);
    
    newMembership[1].push(team);
    newRatings[team] = adjustRatingForLeagueChange(newRatings[team], 2, 1);
  });
  
  // Move relegated teams down
  relegatedTeams.forEach(team => {
    newMembership[2] = newMembership[2].filter(t => t !== team);
    newMembership[1] = newMembership[1].filter(t => t !== team);
    newMembership[3] = newMembership[3].filter(t => t !== team);
    newMembership[4] = newMembership[4].filter(t => t !== team);
    newMembership[5] = newMembership[5].filter(t => t !== team);
    
    newMembership[3].push(team);
    newRatings[team] = adjustRatingForLeagueChange(newRatings[team], 2, 3);
  });
  
} else if (oldLeague === 1) {
  // Premier League: Bottom 3 relegated only (no promotion from PL)
  
  // Check if player was relegated
  const playerWasRelegated = playerStanding.position >= 18 && newLeague > oldLeague;
  
  if (playerWasRelegated) {
    // Player took one relegation spot, relegate 2 other teams
    relegatedTeams = nonPlayerStandings.slice(-2).map(t => t.team);
  } else {
    // Player didn't relegate, relegate bottom 3 teams
    relegatedTeams = nonPlayerStandings.slice(-3).map(t => t.team);
  }
  
  console.log(`Premier League: Relegating ${relegatedTeams.length} other teams (player ${playerWasRelegated ? 'relegated' : 'not relegated'})`);
  
  // Move relegated teams down
  relegatedTeams.forEach(team => {
    newMembership[1] = newMembership[1].filter(t => t !== team);
    newMembership[2] = newMembership[2].filter(t => t !== team);
    newMembership[3] = newMembership[3].filter(t => t !== team);
    newMembership[4] = newMembership[4].filter(t => t !== team);
    newMembership[5] = newMembership[5].filter(t => t !== team);
    
    newMembership[2].push(team);
    newRatings[team] = adjustRatingForLeagueChange(newRatings[team], 1, 2);
  });
}
  
  // CRITICAL: Now simulate the OTHER leagues
const leaguesToSimulate = [1, 2, 3, 4, 5].filter(l => l !== oldLeague);

console.log(`Simulating other leagues (excluding ${oldLeague}):`, leaguesToSimulate);

// Track teams that have already been promoted/relegated this season
const alreadyMoved = new Set();

// Add teams from player's league movements to the "already moved" set
if (oldLeague === 5) {
  promotedTeams.forEach(t => alreadyMoved.add(t));
  relegatedTeams.forEach(t => alreadyMoved.add(t));
} else if (oldLeague === 4) {
  promotedTeams.forEach(t => alreadyMoved.add(t));
  relegatedTeams.forEach(t => alreadyMoved.add(t));
} else if (oldLeague === 3) {
  promotedTeams.forEach(t => alreadyMoved.add(t));
  relegatedTeams.forEach(t => alreadyMoved.add(t));
} else if (oldLeague === 2) {
  promotedTeams.forEach(t => alreadyMoved.add(t));
  relegatedTeams.forEach(t => alreadyMoved.add(t));
} else if (oldLeague === 1) {
  relegatedTeams.forEach(t => alreadyMoved.add(t));
}

leaguesToSimulate.forEach(league => {
  const leagueData = LEAGUES[league];
  const teamsInLeague = newMembership[league];
  
  console.log(`Simulating league ${league} (${leagueData.name}):`, {
    currentTeams: teamsInLeague.length,
    expectedTeams: leagueData.teams
  });
  
  // Filter out teams that have already been moved this season
  const eligibleTeams = teamsInLeague.filter(team => !alreadyMoved.has(team));
  
  console.log(`League ${league}: ${teamsInLeague.length} total teams, ${eligibleTeams.length} eligible for simulation (${teamsInLeague.length - eligibleTeams.length} already moved)`);
  
  // Simulate based on team ratings (more realistic)
  const simulatedStandings = eligibleTeams.map(team => {
    const rating = newRatings[team] || 60;
    // Points roughly correlate with rating
    const basePoints = (rating - 40) * 1.2 + Math.random() * 20;
    
    return { team, rating, points: basePoints };
  }).sort((a, b) => b.points - a.points);
  
  // Determine promotion and relegation for this league
  let promoted = [];
  let relegated = [];
  
  if (league === 5) {
    // National League: 1 auto + 1 playoff promoted, 4 relegated
    const standingsWithoutPlayer = simulatedStandings.filter(s => s.team !== playerTeam);
    
    promoted = standingsWithoutPlayer.slice(0, 2); // Top 2
    relegated = standingsWithoutPlayer.slice(-4); // Bottom 4
    
    console.log(`NL Simulation: Promoting ${promoted.map(t => t.team).join(', ')}`);
    console.log(`NL Simulation: Relegating ${relegated.map(t => t.team).join(', ')}`);
    
    // Mark these teams as moved
    promoted.forEach(p => alreadyMoved.add(p.team));
    relegated.forEach(r => alreadyMoved.add(r.team));
    
    // Promote to L2
    promoted.forEach(p => {
      newMembership[5] = newMembership[5].filter(t => t !== p.team);
      if (!newMembership[4].includes(p.team)) {
        newMembership[4].push(p.team);
        newRatings[p.team] = adjustRatingForLeagueChange(newRatings[p.team], 5, 4);
      }
    });
    
    // Relegate out of football league
    relegated.forEach(r => {
      newMembership[5] = newMembership[5].filter(t => t !== r.team);
    });
    
    // Add new teams from pool
    const slotsNeeded = leagueData.teams - newMembership[5].length;
    if (slotsNeeded > 0) {
      const existingTeams = newMembership[1]
        .concat(newMembership[2])
        .concat(newMembership[3])
        .concat(newMembership[4])
        .concat(newMembership[5]);
      
      const availableTeams = TEAM_NAMES[5].filter(t => 
        !existingTeams.includes(t) && t !== playerTeam
      );
      
      console.log(`NL needs ${slotsNeeded} new teams, available:`, availableTeams.length);
      
      availableTeams.slice(0, slotsNeeded).forEach(team => {
        newMembership[5].push(team);
        if (!newRatings[team]) {
          newRatings[team] = 52 + Math.floor(Math.random() * 8);
        }
      });
    }
    
  } else if (league === 4) {
    // League Two: 3 auto + 1 playoff promoted, 2 relegated
    const standingsWithoutPlayer = simulatedStandings.filter(s => s.team !== playerTeam);
    
    promoted = standingsWithoutPlayer.slice(0, 4); // Top 4
    relegated = standingsWithoutPlayer.slice(-2); // Bottom 2
    
    console.log(`L2 Simulation: Promoting ${promoted.map(t => t.team).join(', ')}`);
    console.log(`L2 Simulation: Relegating ${relegated.map(t => t.team).join(', ')}`);
    
    // Mark these teams as moved
    promoted.forEach(p => alreadyMoved.add(p.team));
    relegated.forEach(r => alreadyMoved.add(r.team));
    
    // Promote to L1
    promoted.forEach(p => {
      newMembership[4] = newMembership[4].filter(t => t !== p.team);
      if (!newMembership[3].includes(p.team)) {
        newMembership[3].push(p.team);
        newRatings[p.team] = adjustRatingForLeagueChange(newRatings[p.team], 4, 3);
      }
    });
    
    // Relegate to NL
    relegated.forEach(r => {
      newMembership[4] = newMembership[4].filter(t => t !== r.team);
      if (!newMembership[5].includes(r.team)) {
        newMembership[5].push(r.team);
        newRatings[r.team] = adjustRatingForLeagueChange(newRatings[r.team], 4, 5);
      }
    });
    
  } else if (league === 3) {
    // League One: 2 auto + 1 playoff promoted, 4 relegated
    const standingsWithoutPlayer = simulatedStandings.filter(s => s.team !== playerTeam);
    
    promoted = standingsWithoutPlayer.slice(0, 3); // Top 3
    relegated = standingsWithoutPlayer.slice(-4); // Bottom 4
    
    console.log(`L1 Simulation: Promoting ${promoted.map(t => t.team).join(', ')}`);
    console.log(`L1 Simulation: Relegating ${relegated.map(t => t.team).join(', ')}`);
    
    // Mark these teams as moved
    promoted.forEach(p => alreadyMoved.add(p.team));
    relegated.forEach(r => alreadyMoved.add(r.team));
    
    // Promote to Championship
    promoted.forEach(p => {
      newMembership[3] = newMembership[3].filter(t => t !== p.team);
      if (!newMembership[2].includes(p.team)) {
        newMembership[2].push(p.team);
        newRatings[p.team] = adjustRatingForLeagueChange(newRatings[p.team], 3, 2);
      }
    });
    
    // Relegate to L2
    relegated.forEach(r => {
      newMembership[3] = newMembership[3].filter(t => t !== r.team);
      if (!newMembership[4].includes(r.team)) {
        newMembership[4].push(r.team);
        newRatings[r.team] = adjustRatingForLeagueChange(newRatings[r.team], 3, 4);
      }
    });
    
  } else if (league === 2) {
    // Championship: 2 auto + 1 playoff promoted, 3 relegated
    const standingsWithoutPlayer = simulatedStandings.filter(s => s.team !== playerTeam);
    
    promoted = standingsWithoutPlayer.slice(0, 3); // Top 3
    relegated = standingsWithoutPlayer.slice(-3); // Bottom 3
    
    console.log(`Champ Simulation: Promoting ${promoted.map(t => t.team).join(', ')}`);
    console.log(`Champ Simulation: Relegating ${relegated.map(t => t.team).join(', ')}`);
    
    // Mark these teams as moved
    promoted.forEach(p => alreadyMoved.add(p.team));
    relegated.forEach(r => alreadyMoved.add(r.team));
    
    // Promote to PL
    promoted.forEach(p => {
      newMembership[2] = newMembership[2].filter(t => t !== p.team);
      if (!newMembership[1].includes(p.team)) {
        newMembership[1].push(p.team);
        newRatings[p.team] = adjustRatingForLeagueChange(newRatings[p.team], 2, 1);
      }
    });
    
    // Relegate to L1
    relegated.forEach(r => {
      newMembership[2] = newMembership[2].filter(t => t !== r.team);
      if (!newMembership[3].includes(r.team)) {
        newMembership[3].push(r.team);
        newRatings[r.team] = adjustRatingForLeagueChange(newRatings[r.team], 2, 3);
      }
    });
    
  } else if (league === 1) {
    // Premier League: 3 relegated
    const standingsWithoutPlayer = simulatedStandings.filter(s => s.team !== playerTeam);
    
    relegated = standingsWithoutPlayer.slice(-3); // Bottom 3
    
    console.log(`PL Simulation: Relegating ${relegated.map(t => t.team).join(', ')}`);
    
    // Mark these teams as moved
    relegated.forEach(r => alreadyMoved.add(r.team));
    
    // Relegate to Championship
    relegated.forEach(r => {
      newMembership[1] = newMembership[1].filter(t => t !== r.team);
      if (!newMembership[2].includes(r.team)) {
        newMembership[2].push(r.team);
        newRatings[r.team] = adjustRatingForLeagueChange(newRatings[r.team], 1, 2);
      }
    });
  }
});

// NOW fix National League - after L2 has relegated teams down
const nlTeamsAfterSimulation = newMembership[5].length;
const nlTeamsNeeded = LEAGUES[5].teams - nlTeamsAfterSimulation;

console.log(`NL after all simulations: ${nlTeamsAfterSimulation} teams, needs ${nlTeamsNeeded} more`);

if (nlTeamsNeeded > 0) {
  // Get all teams currently in ANY league
  const existingTeams = newMembership[1]
    .concat(newMembership[2])
    .concat(newMembership[3])
    .concat(newMembership[4])
    .concat(newMembership[5]);
  
  const availableTeams = TEAM_NAMES[5].filter(t => 
    !existingTeams.includes(t) && t !== playerTeam
  );
  
  // Add teams one by one, rechecking after each addition
  let added = 0;
  for (const team of availableTeams) {
    if (added >= nlTeamsNeeded) break;
    
    // Double-check this team doesn't exist in ANY league
    const allCurrentTeams = newMembership[1]
      .concat(newMembership[2])
      .concat(newMembership[3])
      .concat(newMembership[4])
      .concat(newMembership[5]);
    
    if (!allCurrentTeams.includes(team)) {
      newMembership[5].push(team);
      if (!newRatings[team]) {
        newRatings[team] = 52 + Math.floor(Math.random() * 8);
      }
      added++;
      console.log(`Added "${team}" to NL (${added}/${nlTeamsNeeded})`);
    } else {
      console.warn(`Skipped "${team}" - already exists in another league`);
    }
  }
  
  console.log(`NL after adding new teams: ${newMembership[5].length} teams (added ${added})`);
  
  // If we still don't have enough, try other leagues' team pools
  if (added < nlTeamsNeeded) {
    const stillNeeded = nlTeamsNeeded - added;
    console.warn(`Still need ${stillNeeded} more teams for NL, pulling from other leagues...`);
    
    for (const otherLeague of [4, 3, 2, 1]) {
      if (added >= nlTeamsNeeded) break;
      
      const otherAvailable = TEAM_NAMES[otherLeague].filter(t => {
        const allCurrentTeams = newMembership[1]
          .concat(newMembership[2])
          .concat(newMembership[3])
          .concat(newMembership[4])
          .concat(newMembership[5]);
        return !allCurrentTeams.includes(t) && t !== playerTeam;
      });
      
      for (const team of otherAvailable) {
        if (added >= nlTeamsNeeded) break;
        
        newMembership[5].push(team);
        if (!newRatings[team]) {
          newRatings[team] = 52 + Math.floor(Math.random() * 8);
        }
        added++;
        console.log(`Added "${team}" from league ${otherLeague} pool to NL (${added}/${nlTeamsNeeded})`);
      }
    }
  }
}
  
  // VERIFICATION AND FINAL BALANCING: Ensure all leagues have correct team counts
Object.keys(LEAGUES).forEach(league => {
  const leagueNum = parseInt(league);
  const expectedCount = LEAGUES[leagueNum].teams;
  const actualCount = newMembership[leagueNum].length;
  
  if (actualCount !== expectedCount) {
    console.error(`League ${leagueNum} (${LEAGUES[leagueNum].name}) has ${actualCount} teams, expected ${expectedCount}`);
    console.log('Teams:', newMembership[leagueNum]);
    
    // Fix: add or remove teams to match
    if (actualCount < expectedCount) {
      const needed = expectedCount - actualCount;
      const existingTeams = newMembership[1]
        .concat(newMembership[2])
        .concat(newMembership[3])
        .concat(newMembership[4])
        .concat(newMembership[5]);
      
      const availableTeams = TEAM_NAMES[leagueNum].filter(t => 
        !existingTeams.includes(t) && t !== playerTeam
      );
      
      console.log(`Adding ${needed} teams to league ${leagueNum}:`, availableTeams.slice(0, needed));
      availableTeams.slice(0, needed).forEach(team => {
        newMembership[leagueNum].push(team);
        if (!newRatings[team]) {
          let minRating, maxRating;
          switch(leagueNum) {
            case 5: minRating = 50; maxRating = 66; break;
            case 4: minRating = 58; maxRating = 71; break;
            case 3: minRating = 64; maxRating = 76; break;
            case 2: minRating = 73; maxRating = 85; break;
            case 1: minRating = 80; maxRating = 95; break;
            default: minRating = 50; maxRating = 66;
          }
          newRatings[team] = Math.round(minRating + Math.random() * (maxRating - minRating));
        }
      });
    } else if (actualCount > expectedCount) {
      const excess = actualCount - expectedCount;
      console.log(`Removing ${excess} excess teams from league ${leagueNum}`);
      newMembership[leagueNum] = newMembership[leagueNum].slice(0, expectedCount);
    }
  }
});

console.log('Final verification after balancing:', {
  PL: newMembership[1].length,
  Championship: newMembership[2].length,
  L1: newMembership[3].length,
  L2: newMembership[4].length,
  NL: newMembership[5].length
});

// This ensures no team exceeds the max rating for their division
Object.keys(newMembership).forEach(league => {
  const leagueNum = parseInt(league);
  let maxRating;
  
  switch(leagueNum) {
    case 5: maxRating = 68; break; // National League
    case 4: maxRating = 72; break; // League Two
    case 3: maxRating = 77; break; // League One
    case 2: maxRating = 84; break; // Championship
    case 1: maxRating = 95; break; // Premier League (allows for elite 88-95 teams)
    default: maxRating = 68;
  }
  
  newMembership[leagueNum].forEach(team => {
    if (newRatings[team] > maxRating) {
      // Don't just cap - reduce gradually to max
      newRatings[team] = Math.max(maxRating - 3, Math.min(maxRating, newRatings[team] - 2));
    }
  });
});
  
  return { membership: newMembership, ratings: newRatings };
}


function generateStandingsFromMembership(league, playerTeam, leagueMembership, teamRatings, playerTeamRating) {
  const leagueData = LEAGUES[league];
  const teamsInLeague = leagueMembership[league] || [];
  
  console.log(`Generating standings for league ${league}:`, {
    expectedTeams: leagueData.teams,
    actualTeams: teamsInLeague.length,
    teams: teamsInLeague
  });
  
  // Ensure we have exactly the right number of teams
  let finalTeams = [...teamsInLeague];
  
  // Remove player team if it's in the list
  finalTeams = finalTeams.filter(t => t !== playerTeam);
  
  // Add player team
  finalTeams.push(playerTeam);
  
  // Trim to exact size needed
  finalTeams = finalTeams.slice(0, leagueData.teams);
  
  // If still not enough teams, add from pool
  if (finalTeams.length < leagueData.teams) {
    console.warn(`League ${league} short ${leagueData.teams - finalTeams.length} teams, adding from pool`);
    const availableTeams = TEAM_NAMES[league].filter(t => 
      !finalTeams.includes(t) && t !== playerTeam
    );
    
    const needed = leagueData.teams - finalTeams.length;
    const newTeams = availableTeams.slice(0, needed);
    finalTeams.push(...newTeams);
  }
  
  console.log(`Final team count for league ${league}:`, finalTeams.length);
  
  const standings = finalTeams.map((team, index) => {
    // Use player's actual rating or stored rating from teamRatings object
    const teamRating = team === playerTeam ? playerTeamRating : (teamRatings[team] || 60);
    
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
      rating: teamRating
    };
  });
  
  // Sort by rating (highest first), but keep isPlayer flag intact
  standings.sort((a, b) => {
    // Player team always goes first
    if (a.isPlayer) return -1;
    if (b.isPlayer) return 1;
    return b.rating - a.rating;
  });
  
  // Update positions after sort
  standings.forEach((team, index) => {
    team.position = index + 1;
  });
  
  return standings;
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
  
  // Facility impact - penalties for inadequate, small bonuses for excellent
  const facilityBonus = calculateFacilityImpact(gameState.facilities, gameState.league);
  
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
  const homeBaseExpected = 1.4 + (ratingDiff / 20);
  const awayBaseExpected = 1.2 - (ratingDiff / 25);

  // Generate goals using realistic distribution
  function generateGoalsFromDistribution(expectedGoals) {
    // Adjust probabilities based on expected goals
    // Base distribution for ~1.5 expected goals per team
    const multiplier = expectedGoals / 1.5;
    
    const roll = Math.random() * 100;
    
    // Realistic distribution: 20% 0g, 30% 1g, 25% 2g, 15% 3g, 7% 4g, 2% 5g, 1% 6g+
    const distribution = [
      { goals: 0, probability: 20 * (1 / multiplier) },      // Lower if strong team
      { goals: 1, probability: 30 },                         // Most common
      { goals: 2, probability: 25 * multiplier },            // More if strong team
      { goals: 3, probability: 15 * Math.pow(multiplier, 1.2) },
      { goals: 4, probability: 7 * Math.pow(multiplier, 1.5) },
      { goals: 5, probability: 2 * Math.pow(multiplier, 2) },
      { goals: 6, probability: 1 * Math.pow(multiplier, 2.5) }
    ];
    
    // Normalize probabilities to sum to 100
    const totalProb = distribution.reduce((sum, d) => sum + d.probability, 0);
    let cumulative = 0;
    
    for (const dist of distribution) {
      cumulative += (dist.probability / totalProb) * 100;
      if (roll < cumulative) {
        return dist.goals;
      }
    }
    
    return 0; // Fallback
  }

  const homeGoals = generateGoalsFromDistribution(homeBaseExpected);
  const awayGoals = generateGoalsFromDistribution(awayBaseExpected);
  
  // Update player stats if player team involved
  if (homeTeam === gameState.teamName || awayTeam === gameState.teamName) {
    const isPlayerTeam = homeTeam === gameState.teamName;
    const playerGoals = isPlayerTeam ? homeGoals : awayGoals;
    const opponentGoals = isPlayerTeam ? awayGoals : homeGoals;
    
    updatePlayerMatchStats(playerGoals, opponentGoals);
  }
  
  return {
    homeTeam,
    awayTeam,
    homeGoals,
    awayGoals,
    result: homeGoals > awayGoals ? 'home' : homeGoals < awayGoals ? 'away' : 'draw'
  };
}

function updatePlayerMatchStats(goalsScored, goalsAgainst) {
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

    // Determine match result
    const won = goalsScored > goalsAgainst;
    const lost = goalsScored < goalsAgainst;
    const drew = goalsScored === goalsAgainst;
    
    // Track goals assigned to ensure we match the match score
    const goalScorers = [];
    
    // First pass: determine who scored
    if (goalsScored > 0) {
      const eligibleScorers = prev.squad
        .filter(p => starterIds.has(p.id) && p.position !== 'GK')
        .map(player => {
          let goalChance = 0;
          
          // Base chances by position (aligned with real-world data)
          if (player.position === 'FWD') {
            goalChance = 0.55; // 55% of goals from forwards (midpoint of 45-60%)
          } else if (player.position === 'MID') {
            goalChance = 0.35; // 35% of goals from midfielders (midpoint of 30-40%)
          } else if (player.position === 'DEF') {
            goalChance = 0.10; // 10% of goals from defenders (midpoint of 10-15%)
          }
          
          // Rating multiplier - heavily weight better players
          // A 70-rated player is 1.0x, 80-rated is 1.4x, 60-rated is 0.7x
          const ratingMultiplier = (player.rating / 70);
          
          // Shooting stat multiplier - critical for goal scoring
          // A 70 shooting stat is 1.0x, 80 is 1.4x, 60 is 0.7x
          const shootingMultiplier = (player.stats.shooting / 70);
          
          // Combined multiplier (both matter significantly)
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
      
      // Goalkeepers: starting GK plays 98% of games, backup almost never
      // Other positions: starters 95%, bench 30%
      let playChance;
      if (player.position === 'GK') {
        playChance = isStarter ? 0.98 : 0.02;
      } else {
        playChance = isStarter ? 0.95 : 0.30;
      }
      
      const isPlaying = Math.random() < playChance;
      
      if (!isPlaying) {
        // Didn't play - morale impact
        let moraleChange = 0;
        
        if (!isStarter) {
          // Bench players lose morale, but with diminishing effect
          const currentMorale = player.morale;
          
          if (currentMorale > 60) {
            moraleChange = -1;
          } else if (currentMorale > 45) {
            moraleChange = -0.5;
          } else if (currentMorale > 30) {
            moraleChange = -0.3;
          } else {
            moraleChange = 0;
          }
          
          moraleChange += (Math.random() - 0.5) * 0.3;
        }
        
        return {
          ...player,
          morale: Math.round(Math.max(30, Math.min(100, player.morale + moraleChange)))
        };
      }
      
      const newStats = { ...player.seasonStats, appearances: player.seasonStats.appearances + 1 };
      
      // Assign goals based on our pre-calculated goal scorers
      const goalsThisMatch = goalScorers.filter(id => id === player.id).length;
      newStats.goals += goalsThisMatch;
      
      // Cards - more likely for defenders and physical players
      const cardChance = player.position === 'DEF' ? 0.12 : 0.08;
      if (Math.random() < cardChance) newStats.yellowCards++;
      if (Math.random() < 0.008) newStats.redCards++;
      
      // Calculate morale change based on individual + team performance
      let moraleChange = 0;
      const currentMorale = player.morale;

      // Team result impact (smaller changes)
      if (won) moraleChange += 2;
      else if (drew) moraleChange += 0;
      else if (lost) moraleChange -= 2;

      // Individual performance bonuses (reduced)
      if (goalsThisMatch > 0) {
        moraleChange += goalsThisMatch * 2;
      }

      // Playing time bonus (before diminishing returns)
      if (isStarter) {
        if (currentMorale < 70) {
          moraleChange += 0.5;
        } else {
          moraleChange += 0.2;
        }
      } else {
        if (currentMorale < 50) {
          moraleChange += 1;
        } else if (currentMorale < 65) {
          moraleChange += 0.5;
        }
      }

      // Small randomness
      moraleChange += Math.floor(Math.random() * 3) - 1;

      // Apply diminishing returns
      if (moraleChange > 0) {
        if (currentMorale >= 85) {
          moraleChange *= 0.3;
        } else if (currentMorale >= 75) {
          moraleChange *= 0.5;
        } else if (currentMorale >= 65) {
          moraleChange *= 0.7;
        }
      }

      const newMorale = Math.max(30, Math.min(100, player.morale + moraleChange));
      
      return { 
        ...player, 
        seasonStats: newStats,
        morale: Math.round(newMorale)
      };
    });

    // NOW assign assists - one assist per goal (with some unassisted)
    const eligibleAssisters = updatedSquad.filter(p => {
      const isStarter = starterIds.has(p.id);
      return p.position !== 'GK' && p.seasonStats.appearances > 0;
    });

    for (let i = 0; i < goalsScored; i++) {
      // 8% chance the goal is unassisted (solo effort, defensive error, etc.)
      if (Math.random() < 0.08) continue;
      
      // Calculate assist probability for each player (aligned with real-world data)
      const assistProbabilities = eligibleAssisters.map(player => {
        const isStarter = starterIds.has(player.id);
        let assistChance = 0;
        
        // Base chances by position (aligned with research)
        if (player.position === 'MID') {
          assistChance = isStarter ? 0.50 : 0.12; // 50% of assists from midfielders
        } else if (player.position === 'FWD') {
          assistChance = isStarter ? 0.35 : 0.10; // 35% of assists from forwards
        } else if (player.position === 'DEF') {
          assistChance = isStarter ? 0.10 : 0.03; // 10% of assists from defenders
        }
        
        // Rating multiplier - better players create more chances
        const ratingMultiplier = (player.rating / 70);
        
        // Passing stat is CRITICAL for assists (more important than for goals)
        // Weight it more heavily than rating
        const passingMultiplier = Math.pow((player.stats.passing / 70), 1.3);
        
        // Combined multiplier
        assistChance *= ratingMultiplier * passingMultiplier;
        
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
  const totalMatches = (leagueData.teams - 1) * 2;
  
  // Don't simulate if season is already complete
  if (gameState.matchday >= totalMatches) {
    return;
  }
  
  const newMatches = [];
  let ticketRevenueThisMatchday = 0;
  let attendanceThisMatchday = 0;
  let hadHomeGame = false;
  
  // Generate or retrieve the season's fixture schedule
  if (!gameState.fixtureSchedule) {
    // Generate full season schedule on first matchday
    gameState.fixtureSchedule = generateSeasonFixtures(gameState.standings.map(s => s.team));
  }
  
  // Get matches for this matchday
  const matchdayFixtures = gameState.fixtureSchedule[gameState.matchday];
  
  if (!matchdayFixtures) {
    console.error('No fixtures for matchday', gameState.matchday);
    return;
  }
  
  // Simulate each fixture
  for (const fixture of matchdayFixtures) {
    const isPlayerHome = fixture.home === gameState.teamName;
    const isPlayerAway = fixture.away === gameState.teamName;
    
    const match = simulateMatch(
      fixture.home,
      fixture.away,
      isPlayerHome
    );
    newMatches.push(match);
    updateStandings(match);
    
    // Calculate attendance for player's home games
    if (isPlayerHome) {
      hadHomeGame = true;
      const stadium = gameState.facilities.find(f => f.name === 'Stadium');
      const capacity = STADIUM_CAPACITIES[stadium.level];
      const playerStanding = gameState.standings.find(t => t.team === gameState.teamName);
      
      // REALISTIC FAN BASE - reputation determines your actual support base
      let realisticMaxAttendance;
      
      if (gameState.league === 5) {
        realisticMaxAttendance = 500 + (gameState.reputation * 45);
      } else if (gameState.league === 4) {
        realisticMaxAttendance = 2000 + (gameState.reputation * 60);
      } else if (gameState.league === 3) {
        realisticMaxAttendance = 3000 + (gameState.reputation * 120);
      } else if (gameState.league === 2) {
        realisticMaxAttendance = 8000 + (gameState.reputation * 220);
      } else if (gameState.league === 1) {
        realisticMaxAttendance = 20000 + (gameState.reputation * 400);
      }
      
      const effectiveCapacity = Math.min(capacity, realisticMaxAttendance);
      
      const reputationFactor = gameState.reputation / 100;
      const leagueAppeal = (6 - gameState.league) * 0.08;
      const positionBonus = Math.max(0, (25 - playerStanding.position) / 25);
      const facilityBonus = (stadium.level * stadium.attendanceBonus) / 100;
      
      let baseAttendance = 0.40 + (reputationFactor * 0.50);
      
      let attendanceRate = baseAttendance + 
                          (leagueAppeal * 0.2) + 
                          (positionBonus * 0.15) + 
                          facilityBonus;
      
      if (playerStanding.position <= 3 && gameState.reputation >= 75) {
        attendanceRate += 0.15;
      }
      
      if (playerStanding.position >= leagueData.teams - 5) {
        attendanceRate -= 0.20;
      }
      
      attendanceRate += (Math.random() - 0.5) * 0.12;
      attendanceRate = Math.max(0.30, Math.min(1.0, attendanceRate));
      
      const attendance = Math.floor(effectiveCapacity * attendanceRate);
      
      // Dynamic ticket pricing based on league
      let baseTicketPrice;
      
      if (gameState.league === 5) {
        baseTicketPrice = 12;
      } else if (gameState.league === 4) {
        baseTicketPrice = 15;
      } else if (gameState.league === 3) {
        baseTicketPrice = 18;
      } else if (gameState.league === 2) {
        baseTicketPrice = 25;
      } else if (gameState.league === 1) {
        baseTicketPrice = 45;
      }
      
      let ticketPrice = baseTicketPrice;
      
      if (attendanceRate > 0.95) {
        ticketPrice *= 1.15;
      } else if (attendanceRate < 0.50) {
        ticketPrice *= 0.90;
      }
      
      const ticketRevenue = attendance * ticketPrice;
      
      attendanceThisMatchday = attendance;
      ticketRevenueThisMatchday = ticketRevenue;
    }
  }
  
  // Update state ONCE per matchday (outside the loop)
  setGameState(prev => {
    const newMatchday = prev.matchday + 1;
    const leagueData = LEAGUES[prev.league];
    const transferWindowStart = Math.floor((leagueData.teams - 1) * 0.5);
    const transferWindowEnd = transferWindowStart + 4;
    
    let updatedFreeAgents = prev.freeAgents;
    let updatedTransferPhase = prev.transferPhase;
    
    if (newMatchday === 1 && prev.transferPhase === 'offseason') {
      updatedTransferPhase = 'emergency';
      updatedFreeAgents = generateFreeAgentsByPhase(prev.league, prev.reputation, 'emergency');
    } else if (newMatchday === transferWindowStart && prev.transferPhase === 'emergency') {
      updatedTransferPhase = 'window';
      updatedFreeAgents = generateFreeAgentsByPhase(prev.league, prev.reputation, 'window');
    } else if (newMatchday === transferWindowEnd + 1 && prev.transferPhase === 'window') {
      updatedTransferPhase = 'emergency';
      updatedFreeAgents = generateFreeAgentsByPhase(prev.league, prev.reputation, 'emergency');
    }
    
    return {
      ...prev,
      matches: [...newMatches, ...prev.matches].slice(0, 50),
      matchday: newMatchday,
      isTransferWindow: newMatchday >= transferWindowStart && newMatchday <= transferWindowEnd,
      transferPhase: updatedTransferPhase,
      freeAgents: updatedFreeAgents,
      accumulatedTicketRevenue: hadHomeGame ? prev.accumulatedTicketRevenue + ticketRevenueThisMatchday : prev.accumulatedTicketRevenue,
      totalAttendance: hadHomeGame ? prev.totalAttendance + attendanceThisMatchday : prev.totalAttendance,
      homeGames: hadHomeGame ? prev.homeGames + 1 : prev.homeGames,
      averageAttendance: hadHomeGame ? Math.round((prev.totalAttendance + attendanceThisMatchday) / (prev.homeGames + 1)) : prev.averageAttendance
    };
  });
}

// Add this new function before simulateMatchday
function generateSeasonFixtures(teams) {
  // Round-robin algorithm for balanced home/away schedule
  const numTeams = teams.length;
  const isOdd = numTeams % 2 === 1;
  
  // If odd number of teams, add a "bye" team
  const teamsWithBye = isOdd ? [...teams, null] : [...teams];
  const n = teamsWithBye.length;
  const matchesPerRound = n / 2;
  const totalRounds = n - 1; // Each team plays each other once
  
  // Circle method for round-robin scheduling
  const schedule = [];
  
  // Create a rotating schedule
  const teamsList = [...teamsWithBye];
  
  for (let round = 0; round < totalRounds; round++) {
    const roundFixtures = [];
    
    for (let match = 0; match < matchesPerRound; match++) {
      const home = teamsList[match];
      const away = teamsList[n - 1 - match];
      
      if (home !== null && away !== null) {
        roundFixtures.push({ home, away });
      }
    }
    
    schedule.push(roundFixtures);
    
    // Rotate teams (keep first team fixed, rotate others)
    const fixed = teamsList[0];
    const rotated = [fixed, teamsList[n - 1], ...teamsList.slice(1, n - 1)];
    teamsList.splice(0, n, ...rotated);
  }
  
  // Create return fixtures (swap home/away)
  const returnSchedule = schedule.map(round => 
    round.map(fixture => ({ home: fixture.away, away: fixture.home }))
  );
  
  // Combine first half and second half of season
  const fullSchedule = [...schedule, ...returnSchedule];
  
  // Shuffle the order slightly to make it more realistic (but keep structure)
  // We'll shuffle in blocks to avoid too many consecutive home/away games
  return fullSchedule;
}

function endSeason() {
  const playerStanding = gameState.standings.find(t => t.team === gameState.teamName);
  const leagueData = LEAGUES[gameState.league];
  
  // Check for Premier League Championship WIN
  if (gameState.league === 1 && playerStanding.position === 1) {
    setPlWinner(true);
    setView('plchampion');
    // Don't return - let the season end logic continue
  }
  
  let promoted = false;
  let relegated = false;
  let prize = 0;
  let message = '';
  let playoffDetails = null;

  // Promotion/relegation logic - different per league
  if (gameState.league === 5) {
  // National League: Top 1 auto, 2-7 playoffs (2 promoted total), bottom 4 relegated
  // Playoff structure: QF: 2v7, 3v6 → SF: 4v5, QF winners → Final
  if (playerStanding.position === 1) {
    promoted = true;
    prize = leagueData.prizeFirst;
    message = `🏆 CHAMPIONS! Automatic promotion to ${LEAGUES[4].name}!`;
  } else if (playerStanding.position >= 2 && playerStanding.position <= 7) {
    const playoffTeams = gameState.standings
      .filter(t => t.position >= 2 && t.position <= 7)
      .sort((a, b) => a.position - b.position);
    
    // Quarter-finals: 4v5, 3v6 (SINGLE LEG)
    const qf1 = { team1: playoffTeams[3], team2: playoffTeams[4] }; // 4 vs 5
    const qf2 = { team1: playoffTeams[2], team2: playoffTeams[5] }; // 3 vs 6
    
    const qfResults = [qf1, qf2].map(qf => {
      const team1Rating = qf.team1.isPlayer ? calculateTeamRating(gameState.squad) : qf.team1.rating;
      const team2Rating = qf.team2.isPlayer ? calculateTeamRating(gameState.squad) : qf.team2.rating;
      
      // Single leg match - no draws possible
      const match = simulatePlayoffLeg(team1Rating, team2Rating, true);
      
      return {
        team1: qf.team1.team,
        team2: qf.team2.team,
        score: `${match.home}-${match.away}`,
        winner: match.home > match.away ? qf.team1.team : qf.team2.team,
        winnerObj: match.home > match.away ? qf.team1 : qf.team2
      };
    });
    
    // Semi-finals: 2 vs QF1 winner, 3 vs QF2 winner (SINGLE LEG)
    const sf1Team1 = playoffTeams[0]; // 4th place
    const sf1Team2 = qfResults[1].winnerObj; // 5th place
    const sf2Team1 = qfResults[0].winnerObj; // QF1 winner (4 or 5)
    const sf2Team2 = playoffTeams[1]; // QF2 winner (3 or 6)
    
    const sfResults = [
      { team1: sf1Team1, team2: sf1Team2 },
      { team1: sf2Team1, team2: sf2Team2 }
    ].map(sf => {
      const team1Rating = sf.team1.isPlayer ? calculateTeamRating(gameState.squad) : sf.team1.rating;
      const team2Rating = sf.team2.isPlayer ? calculateTeamRating(gameState.squad) : sf.team2.rating;
      
      const match = simulatePlayoffLeg(team1Rating, team2Rating, true);
      const winner = match.home > match.away ? sf.team1 : 
                    match.away > match.home ? sf.team2 : 
                    Math.random() > 0.5 ? sf.team1 : sf.team2;
      
      return {
        team1: sf.team1.team,
        team2: sf.team2.team,
        score: `${match.home}-${match.away}`,
        winner: winner.team,
        winnerObj: winner
      };
    });
    
    // Final - single leg at neutral venue
    const finalist1 = sfResults[0].winnerObj;
    const finalist2 = sfResults[1].winnerObj;
    
    const final1Rating = finalist1.isPlayer ? calculateTeamRating(gameState.squad) : finalist1.rating;
    const final2Rating = finalist2.isPlayer ? calculateTeamRating(gameState.squad) : finalist2.rating;
    
    const finalMatch = simulatePlayoffLeg(final1Rating, final2Rating, true);
    const finalWinner = finalMatch.home > finalMatch.away ? finalist1 : finalist2;

    const finalResult = {
      team1: finalist1.team,
      team2: finalist2.team,
      score: `${finalMatch.home}-${finalMatch.away}`,
      winner: finalWinner.team
    };
    
    // Determine player's result
    const playerInSemis = qfResults.some(r => r.winner === gameState.teamName) || playerStanding.position <= 5;
    const playerInFinal = sfResults.some(r => r.winner === gameState.teamName);
    const playerWonFinal = finalResult.winner === gameState.teamName;
    
    if (!playerInSemis) {
      prize = leagueData.prizePlayoff * 0.2;
      message = `😔 Lost in playoff quarter-finals. Finished ${playerStanding.position}${getOrdinal(playerStanding.position)}. Stay in ${leagueData.name}.`;
      playoffDetails = { stage: 'Quarter-Final', results: [...qfResults, ...sfResults, finalResult] };
    } else if (!playerInFinal) {
      prize = leagueData.prizePlayoff * 0.4;
      message = `😔 Lost in playoff semi-finals. Finished ${playerStanding.position}${getOrdinal(playerStanding.position)}. Stay in ${leagueData.name}.`;
      playoffDetails = { stage: 'Semi-Final', results: [...qfResults, ...sfResults, finalResult] };
    } else if (playerWonFinal) {
      promoted = true;
      prize = leagueData.prizePlayoff;
      message = `⚽ PLAYOFF WINNERS! Promoted to ${LEAGUES[4].name}!`;
      playoffDetails = { stage: 'Final - WON', results: [...qfResults, ...sfResults, finalResult] };
    } else {
      prize = leagueData.prizePlayoff * 0.7;
      message = `😔 Lost in playoff final. Finished ${playerStanding.position}${getOrdinal(playerStanding.position)}. Stay in ${leagueData.name}.`;
      playoffDetails = { stage: 'Final - LOST', results: [...qfResults, ...sfResults, finalResult] };
    }
  } else if (playerStanding.position >= 21) {
    relegated = true;
    message = `📉 Relegated from ${leagueData.name}. Finished ${playerStanding.position}${getOrdinal(playerStanding.position)}.`;
    deleteSave();
    setGameOverReason({
      reason: 'relegated',
      finalBalance: gameState.money,
      debt: 0,
      season: gameState.season,
      league: leagueData.name,
      position: playerStanding.position
    });
    setView('gameover');
    return;

  } else {
    message = `Finished ${playerStanding.position}${getOrdinal(playerStanding.position)} in ${leagueData.name}.`;
  }
} else if (gameState.league === 4) {
    // League Two: Top 3 auto, 4-7 playoffs (4 promoted total), bottom 2 relegated
    // Playoff structure: SF: 4v7, 5v6 (two legs) → Final (single leg at Wembley)
    if (playerStanding.position <= 3) {
      promoted = true;
      prize = leagueData.prizeFirst;
      message = `🏆 ${playerStanding.position === 1 ? 'CHAMPIONS' : playerStanding.position === 2 ? 'RUNNERS-UP' : 'AUTOMATIC PROMOTION'}! Promoted to ${LEAGUES[3].name}!`;
    } else if (playerStanding.position >= 4 && playerStanding.position <= 7) {
      const playoffTeams = gameState.standings
        .filter(t => t.position >= 4 && t.position <= 7)
        .sort((a, b) => a.position - b.position);
      
      // Semi-finals: 4v7, 5v6 (TWO LEGS)
      const semis = [
        { team1: playoffTeams[0], team2: playoffTeams[3] }, // 4 vs 7
        { team1: playoffTeams[1], team2: playoffTeams[2] }  // 5 vs 6
      ];
      
      const semiResults = semis.map(semi => {
        const team1Rating = semi.team1.isPlayer ? calculateTeamRating(gameState.squad) : semi.team1.rating;
        const team2Rating = semi.team2.isPlayer ? calculateTeamRating(gameState.squad) : semi.team2.rating;
        
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
          // Aggregate tied - check away goals
          const team1AwayGoals = leg2.away;
          const team2AwayGoals = leg1.away;
          
          if (team2AwayGoals > team1AwayGoals) {
            winner = semi.team2;
          } else if (team1AwayGoals > team2AwayGoals) {
            winner = semi.team1;
          } else {
            // STILL TIED - Force a winner based on rating with randomness
            const totalRating = team1Rating + team2Rating;
            const team1Chance = team1Rating / totalRating;
            winner = Math.random() < team1Chance ? semi.team1 : semi.team2;
          }
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
      
      // Final - single leg at Wembley
      const finalist1 = semiResults[0].winnerObj;
      const finalist2 = semiResults[1].winnerObj;
      
      const final1Rating = finalist1.isPlayer ? calculateTeamRating(gameState.squad) : finalist1.rating;
      const final2Rating = finalist2.isPlayer ? calculateTeamRating(gameState.squad) : finalist2.rating;
      
      const finalMatch = simulatePlayoffLeg(final1Rating, final2Rating, true);
      const finalWinner = finalMatch.home > finalMatch.away ? finalist1 : finalist2;

      const finalResult = {
        team1: finalist1.team,
        team2: finalist2.team,
        score: `${finalMatch.home}-${finalMatch.away}`,
        winner: finalWinner.team
      };
      
      // Determine player's result
      const playerInFinal = semiResults.some(r => r.winner === gameState.teamName);
      const playerWonFinal = finalResult.winner === gameState.teamName;
      
      if (!playerInFinal) {
        prize = leagueData.prizePlayoff * 0.3;
        message = `😔 Lost in playoff semi-finals. Finished ${playerStanding.position}${getOrdinal(playerStanding.position)}. Stay in ${leagueData.name}.`;
        playoffDetails = { stage: 'Semi-Final', results: [...semiResults, finalResult] };
      } else if (playerWonFinal) {
        promoted = true;
        prize = leagueData.prizePlayoff;
        message = `⚽ PLAYOFF WINNERS! Promoted to ${LEAGUES[3].name}!`;
        playoffDetails = { stage: 'Final - WON', results: [...semiResults, finalResult] };
      } else {
        prize = leagueData.prizePlayoff * 0.6;
        message = `😔 Lost in playoff final. Finished ${playerStanding.position}${getOrdinal(playerStanding.position)}. Stay in ${leagueData.name}.`;
        playoffDetails = { stage: 'Final - LOST', results: [...semiResults, finalResult] };
      }
    } else if (playerStanding.position >= 23) {
      relegated = true;
      message = `📉 Relegated to ${LEAGUES[5].name}. Finished ${playerStanding.position}${getOrdinal(playerStanding.position)}.`;
    } else {
      message = `Finished ${playerStanding.position}${getOrdinal(playerStanding.position)} in ${leagueData.name}.`;
    }
  } else if (gameState.league === 3) {
    // League One: Top 2 auto, 3-6 playoffs (3 promoted total), bottom 4 relegated
    // Playoff structure: SF: 3v6, 4v5 (two legs) → Final (single leg at Wembley)
    if (playerStanding.position <= 2) {
      promoted = true;
      prize = leagueData.prizeFirst;
      message = `🏆 ${playerStanding.position === 1 ? 'CHAMPIONS' : 'RUNNERS-UP'}! Automatic promotion to ${LEAGUES[2].name}!`;
    } else if (playerStanding.position >= 3 && playerStanding.position <= 6) {
      const playoffTeams = gameState.standings
        .filter(t => t.position >= 3 && t.position <= 6)
        .sort((a, b) => a.position - b.position);
      
      // Semi-finals: 3v6, 4v5 (TWO LEGS)
      const semis = [
        { team1: playoffTeams[0], team2: playoffTeams[3] }, // 3 vs 6
        { team1: playoffTeams[1], team2: playoffTeams[2] }  // 4 vs 5
      ];
      
      const semiResults = semis.map(semi => {
        const team1Rating = semi.team1.isPlayer ? calculateTeamRating(gameState.squad) : semi.team1.rating;
        const team2Rating = semi.team2.isPlayer ? calculateTeamRating(gameState.squad) : semi.team2.rating;
        
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
          // Aggregate tied - check away goals
          const team1AwayGoals = leg2.away;
          const team2AwayGoals = leg1.away;
          
          if (team2AwayGoals > team1AwayGoals) {
            winner = semi.team2;
          } else if (team1AwayGoals > team2AwayGoals) {
            winner = semi.team1;
          } else {
            // STILL TIED - Force a winner based on rating with randomness
            const totalRating = team1Rating + team2Rating;
            const team1Chance = team1Rating / totalRating;
            winner = Math.random() < team1Chance ? semi.team1 : semi.team2;
          }
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
      
      // Final - single leg at Wembley
      const finalist1 = semiResults[0].winnerObj;
      const finalist2 = semiResults[1].winnerObj;
      
      const final1Rating = finalist1.isPlayer ? calculateTeamRating(gameState.squad) : finalist1.rating;
      const final2Rating = finalist2.isPlayer ? calculateTeamRating(gameState.squad) : finalist2.rating;
      
      const finalMatch = simulatePlayoffLeg(final1Rating, final2Rating, true);
      const finalWinner = finalMatch.home > finalMatch.away ? finalist1 : finalist2;

      const finalResult = {
        team1: finalist1.team,
        team2: finalist2.team,
        score: `${finalMatch.home}-${finalMatch.away}`,
        winner: finalWinner.team
      };
      
      // Determine player's result
      const playerInFinal = semiResults.some(r => r.winner === gameState.teamName);
      const playerWonFinal = finalResult.winner === gameState.teamName;
      
      if (!playerInFinal) {
        prize = leagueData.prizePlayoff * 0.3;
        message = `😔 Lost in playoff semi-finals. Finished ${playerStanding.position}${getOrdinal(playerStanding.position)}. Stay in ${leagueData.name}.`;
        playoffDetails = { stage: 'Semi-Final', results: [...semiResults, finalResult] };
      } else if (playerWonFinal) {
        promoted = true;
        prize = leagueData.prizePlayoff;
        message = `⚽ PLAYOFF WINNERS! Promoted to ${LEAGUES[2].name}!`;
        playoffDetails = { stage: 'Final - WON', results: [...semiResults, finalResult] };
      } else {
        prize = leagueData.prizePlayoff * 0.6;
        message = `😔 Lost in playoff final. Finished ${playerStanding.position}${getOrdinal(playerStanding.position)}. Stay in ${leagueData.name}.`;
        playoffDetails = { stage: 'Final - LOST', results: [...semiResults, finalResult] };
      }
    } else if (playerStanding.position >= 21) {
      relegated = true;
      message = `📉 Relegated to ${LEAGUES[4].name}. Finished ${playerStanding.position}${getOrdinal(playerStanding.position)}.`;
    } else {
      message = `Finished ${playerStanding.position}${getOrdinal(playerStanding.position)} in ${leagueData.name}.`;
    }
  } else if (gameState.league === 2) {
    // Championship: Top 2 auto, 3-6 playoffs (3 promoted total), bottom 3 relegated
    // Playoff structure: SF: 3v6, 4v5 (two legs) → Final (single leg at Wembley)
    if (playerStanding.position <= 2) {
      promoted = true;
      prize = leagueData.prizeFirst;
      message = `🏆 ${playerStanding.position === 1 ? 'CHAMPIONS' : 'RUNNERS-UP'}! Automatic promotion to ${LEAGUES[1].name}!`;
    } else if (playerStanding.position >= 3 && playerStanding.position <= 6) {
      const playoffTeams = gameState.standings
        .filter(t => t.position >= 3 && t.position <= 6)
        .sort((a, b) => a.position - b.position);
      
      // Semi-finals: 3v6, 4v5 (TWO LEGS)
      const semis = [
        { team1: playoffTeams[0], team2: playoffTeams[3] }, // 3 vs 6
        { team1: playoffTeams[1], team2: playoffTeams[2] }  // 4 vs 5
      ];
      
      const semiResults = semis.map(semi => {
        const team1Rating = semi.team1.isPlayer ? calculateTeamRating(gameState.squad) : semi.team1.rating;
        const team2Rating = semi.team2.isPlayer ? calculateTeamRating(gameState.squad) : semi.team2.rating;
        
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
          // Aggregate tied - check away goals
          const team1AwayGoals = leg2.away;
          const team2AwayGoals = leg1.away;
          
          if (team2AwayGoals > team1AwayGoals) {
            winner = semi.team2;
          } else if (team1AwayGoals > team2AwayGoals) {
            winner = semi.team1;
          } else {
            // STILL TIED - Force a winner based on rating with randomness
            const totalRating = team1Rating + team2Rating;
            const team1Chance = team1Rating / totalRating;
            winner = Math.random() < team1Chance ? semi.team1 : semi.team2;
          }
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
      
      // Final - single leg at Wembley
      const finalist1 = semiResults[0].winnerObj;
      const finalist2 = semiResults[1].winnerObj;
      
      const final1Rating = finalist1.isPlayer ? calculateTeamRating(gameState.squad) : finalist1.rating;
      const final2Rating = finalist2.isPlayer ? calculateTeamRating(gameState.squad) : finalist2.rating;
      
      const finalMatch = simulatePlayoffLeg(final1Rating, final2Rating, true);
      const finalWinner = finalMatch.home > finalMatch.away ? finalist1 : finalist2;

      const finalResult = {
        team1: finalist1.team,
        team2: finalist2.team,
        score: `${finalMatch.home}-${finalMatch.away}`,
        winner: finalWinner.team
      };
      
      // Determine player's result
      const playerInFinal = semiResults.some(r => r.winner === gameState.teamName);
      const playerWonFinal = finalResult.winner === gameState.teamName;
      
      if (!playerInFinal) {
        prize = leagueData.prizePlayoff * 0.3;
        message = `😔 Lost in playoff semi-finals. Finished ${playerStanding.position}${getOrdinal(playerStanding.position)}. Stay in ${leagueData.name}.`;
        playoffDetails = { stage: 'Semi-Final', results: [...semiResults, finalResult] };
      } else if (playerWonFinal) {
        promoted = true;
        prize = leagueData.prizePlayoff;
        message = `⚽ PLAYOFF WINNERS! Promoted to ${LEAGUES[1].name}!`;
        playoffDetails = { stage: 'Final - WON', results: [...semiResults, finalResult] };
      } else {
        prize = leagueData.prizePlayoff * 0.6;
        message = `😔 Lost in playoff final. Finished ${playerStanding.position}${getOrdinal(playerStanding.position)}. Stay in ${leagueData.name}.`;
        playoffDetails = { stage: 'Final - LOST', results: [...semiResults, finalResult] };
      }
    } else if (playerStanding.position >= 22) {
      relegated = true;
      message = `📉 Relegated to ${LEAGUES[3].name}. Finished ${playerStanding.position}${getOrdinal(playerStanding.position)}.`;
    } else {
      message = `Finished ${playerStanding.position}${getOrdinal(playerStanding.position)} in ${leagueData.name}.`;
    }
  } else if (gameState.league === 1) {
    // Premier League: No playoffs, bottom 3 relegated only
    if (playerStanding.position >= 18) {
      relegated = true;
      message = `📉 Relegated to ${LEAGUES[2].name}. Finished ${playerStanding.position}${getOrdinal(playerStanding.position)}.`;
    } else {
      message = `Finished ${playerStanding.position}${getOrdinal(playerStanding.position)} in ${leagueData.name}.`;
    }
  }

  // Calculate season finances with variance
  const tvRevenue = leagueData.tvRevenue * (0.9 + Math.random() * 0.2);
  const ticketRevenue = gameState.accumulatedTicketRevenue;

  // Sponsorship revenue (varies based on league position and reputation)
  const positionBonus = (25 - playerStanding.position) / 25; // Better position = more sponsors
  const reputationBonus = gameState.reputation / 100;
  const sponsorshipRevenue = leagueData.sponsorshipRevenue * 
    (0.8 + Math.random() * 0.4) * // ±20% variance
    (1 + positionBonus * 0.3) * // Up to +30% for top position
    (1 + reputationBonus * 0.2); // Up to +20% for max reputation

  // Merchandise revenue (scales with reputation and success)
  const merchandiseRevenue = leagueData.merchandiseRevenue * 
    (0.8 + Math.random() * 0.4) *
    (1 + reputationBonus * 0.3) *
    (1 + positionBonus * 0.2);

  // Add promotion bonus - scaled to cover facility upgrades plus operating cushion
  let promotionBonus = 0;
  if (promoted) {
    if (gameState.league === 5) promotionBonus = 5000000;      // £5M (was £2M) - covers L2 facilities + buffer
    else if (gameState.league === 4) promotionBonus = 10000000;  // £15M (was £8M) - covers L1 facilities + buffer
    else if (gameState.league === 3) promotionBonus = 35000000;  // £35M (was £15M) - covers Championship facilities + buffer
    else if (gameState.league === 2) promotionBonus = 75000000;  // £75M (was £30M) - covers PL facilities + buffer
  }

  const totalRevenue = tvRevenue + ticketRevenue + sponsorshipRevenue + merchandiseRevenue + prize + promotionBonus;
  
  const wagesCost = gameState.squad.reduce((sum, p) => sum + p.salary, 0);
  const facilitiesCost = gameState.facilities.reduce((sum, f) => 
    sum + (f.maintenanceCost * f.level), 0);
  const operatingCost = leagueData.facilityBaseCost * (0.5 + Math.random() * 0.1);
  const totalCosts = wagesCost + facilitiesCost + operatingCost;
  
  const netIncome = totalRevenue - totalCosts;
  const newBalance = gameState.money + netIncome;

  // Track consecutive seasons in heavy debt
  let consecutiveDebtSeasons = gameState.consecutiveSeasonsInDebt || 0;
  if (newBalance < -2000000) {
    consecutiveDebtSeasons++;
  } else {
    consecutiveDebtSeasons = 0; // Reset if finances recover
  }

  // Check for immediate bankruptcy (below -£10) OR 2 consecutive seasons in debt
  if (newBalance < -40000000) {
    deleteSave();
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
  } else if (consecutiveDebtSeasons >= 3) {
    deleteSave();
    setGameOverReason({
      reason: 'fired',
      finalBalance: newBalance,
      debt: Math.abs(newBalance),
      season: gameState.season,
      league: leagueData.name,
      position: playerStanding.position,
      seasonsInDebt: consecutiveDebtSeasons
    });
    setView('gameover');
    return;
  }

  // Calculate retiring players and remove them NOW
  const retirees = gameState.squad.filter(p => p.age >= 34 && Math.random() > 0.3);
  const squadAfterRetirements = gameState.squad.filter(p => !retirees.some(r => r.id === p.id));

  // Prepare contract negotiations (from squad after retirements)
  const contractNegotiations = squadAfterRetirements
    .filter(p => p.contractYears <= 1 && p.age < 34)
    .map(p => ({ ...p, offer: null, status: 'pending' }));

  setGameState(prev => ({
    ...prev,
    squad: squadAfterRetirements,
    //league: promoted ? Math.max(1, prev.league - 1) : (relegated ? Math.min(5, prev.league + 1) : prev.league),
    season: prev.season + 1,
    matchday: 0,
    money: newBalance,
    consecutiveSeasonsInDebt: consecutiveDebtSeasons, // Add this
    reputation: (() => {
    let repChange = 0;
    const currentRep = prev.reputation;
    
    // PROMOTION - massive hype boost
    if (promoted) {
      if (prev.league === 5) repChange = 20; // NL → L2
      else if (prev.league === 4) repChange = 25; // L2 → L1
      else if (prev.league === 3) repChange = 30; // L1 → Championship
      else if (prev.league === 2) repChange = 35; // Championship → PL (huge!)
    }
    // RELEGATION - massive reputation hit
    else if (relegated) {
      if (prev.league === 1) repChange = -40; // PL → Championship (disaster)
      else if (prev.league === 2) repChange = -25; // Championship → L1
      else if (prev.league === 3) repChange = -20; // L1 → L2
      else if (prev.league === 4) repChange = -15; // L2 → NL
      else if (prev.league === 5) repChange = -10; // NL → non-league
    }
    // PLAYOFF POSITIONS - building momentum
    else if (playerStanding.position >= 2 && playerStanding.position <= 7) {
      // Playoff contenders get hype
      if (playerStanding.position === 2) repChange = 8;
      else if (playerStanding.position === 3) repChange = 6;
      else if (playerStanding.position <= 5) repChange = 4;
      else repChange = 2;
    }
    // MID-TABLE - slow reputation decay over time
    else if (playerStanding.position <= 15) {
      // Mid-table is "safe" but boring - slow decline
      if (currentRep > 60) repChange = -3; // High rep clubs lose more
      else if (currentRep > 40) repChange = -1;
      else repChange = 0; // Low rep clubs stable
    }
    // RELEGATION BATTLE - reputation bleeds
    else {
      // Bottom of table - reputation damage even if you survive
      const dangerLevel = (leagueData.teams - playerStanding.position);
      if (dangerLevel <= 2) repChange = -8; // Bottom 2-3
      else if (dangerLevel <= 4) repChange = -5; // Near relegation
      else repChange = -3; // Just above relegation
    }
    
    return Math.min(100, Math.max(10, currentRep + repChange));
  })(),
    lastSeasonFinish: { 
    ...playerStanding, 
    message, 
    league: gameState.league, // Store OLD league
    newLeague: promoted ? Math.max(1, prev.league - 1) : (relegated ? Math.min(5, prev.league + 1) : prev.league),
    promoted: promoted, // Store promotion status
    relegated: relegated, // Store relegation status
    revenue: totalRevenue,
    tvRevenue,
    ticketRevenue,
    sponsorshipRevenue,
    merchandiseRevenue,
    prize,
    costs: totalCosts, 
    net: netIncome,
    promotionBonus,
    playoffDetails,
    operatingCost,
    wagesCost,
    facilitiesCost,
    retirees: retirees.map(p => ({ name: p.name, position: p.position, rating: p.rating }))
  },
    seasonPhase: 'offseason',
    contractNegotiations,
    paused: true,
    transferPhase: 'offseason', // Full free agent market
    freeAgents: generateFreeAgentsByPhase(promoted ? Math.max(1, prev.league - 1) : (relegated ? Math.min(5, prev.league + 1) : prev.league, prev.reputation, 'offseason'))
  }));
}

function simulatePlayoffLeg(homeRating, awayRating, isFinal = false) {
  const adjustedHomeRating = homeRating + 3;
  const ratingDiff = adjustedHomeRating - awayRating;
  const homeExpectedGoals = Math.max(0.3, 1.3 + (ratingDiff / 25) + (Math.random() * 1.2 - 0.4));
  const awayExpectedGoals = Math.max(0.3, 1.0 - (ratingDiff / 30) + (Math.random() * 1.2 - 0.4));
  
  let homeGoals = Math.floor(homeExpectedGoals + (Math.random() > 0.7 ? 1 : 0));
  let awayGoals = Math.floor(awayExpectedGoals + (Math.random() > 0.7 ? 1 : 0));
  
  // If it's a draw in ANY playoff match, go to extra time/penalties
  if (homeGoals === awayGoals) {
    // Extra time - reduced scoring
    const extraTimeHome = Math.random() < 0.25 ? 1 : 0; // 25% chance to score
    const extraTimeAway = Math.random() < 0.25 ? 1 : 0;
    
    homeGoals += extraTimeHome;
    awayGoals += extraTimeAway;
    
    // Still a draw? Penalties (50/50 based on rating with slight home advantage)
    if (homeGoals === awayGoals) {
      const totalRating = homeRating + awayRating;
      const homeWinChance = (homeRating / totalRating) * 0.55 + 0.45; // 45-55% based on rating
      
      if (Math.random() < homeWinChance) {
        homeGoals += 1; // Home wins on penalties (represented as +1 goal for clarity)
      } else {
        awayGoals += 1; // Away wins on penalties
      }
    }
  }
  
  return { home: homeGoals, away: awayGoals };
}

function processLeaguePromotionRelegation(league, playerPromoted, playerRelegated) {
  const currentStandings = gameState.standings;
  
  let promotedTeams = [];
  let relegatedTeams = [];
  
  // Get the playoff details from the season finish to see who actually won
  const playoffDetails = gameState.lastSeasonFinish?.playoffDetails;
  
  if (league === 5) {
    // National League: 1 auto + 1 playoff winner = 2 promoted
    promotedTeams.push(currentStandings[0].team); // Champion
    
    // If there were playoffs, get the actual winner
    if (playoffDetails && playoffDetails.results) {
      const finalResult = playoffDetails.results[playoffDetails.results.length - 1];
      if (finalResult && finalResult.winner !== gameState.teamName) {
        promotedTeams.push(finalResult.winner);
      }
    }
    
    // Bottom 4 relegated
    relegatedTeams = currentStandings.slice(-4).map(t => t.team);
  } else if (league === 4) {
    // League Two: 3 auto + 1 playoff winner = 4 promoted
    promotedTeams = currentStandings.slice(0, 3).map(t => t.team);
    
    if (playoffDetails && playoffDetails.results) {
      const finalResult = playoffDetails.results[playoffDetails.results.length - 1];
      if (finalResult && finalResult.winner !== gameState.teamName) {
        promotedTeams.push(finalResult.winner);
      }
    }
    
    // Bottom 2 relegated
    relegatedTeams = currentStandings.slice(-2).map(t => t.team);
  } else if (league === 3) {
    // League One: 2 auto + 1 playoff winner = 3 promoted
    promotedTeams = currentStandings.slice(0, 2).map(t => t.team);
    
    if (playoffDetails && playoffDetails.results) {
      const finalResult = playoffDetails.results[playoffDetails.results.length - 1];
      if (finalResult && finalResult.winner !== gameState.teamName) {
        promotedTeams.push(finalResult.winner);
      }
    }
    
    // Bottom 4 relegated
    relegatedTeams = currentStandings.slice(-4).map(t => t.team);
  } else if (league === 2) {
    // Championship: 2 auto + 1 playoff winner = 3 promoted
    promotedTeams = currentStandings.slice(0, 2).map(t => t.team);
    
    if (playoffDetails && playoffDetails.results) {
      const finalResult = playoffDetails.results[playoffDetails.results.length - 1];
      if (finalResult && finalResult.winner !== gameState.teamName) {
        promotedTeams.push(finalResult.winner);
      }
    }
    
    // Bottom 3 relegated
    relegatedTeams = currentStandings.slice(-3).map(t => t.team);
  } else if (league === 1) {
    // Premier League: Bottom 3 relegated ONLY
    relegatedTeams = currentStandings.slice(-3).map(t => t.team);
    promotedTeams = [];
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
    
    // Rating progression/regression - peaks at 27-29
    let ratingChange = 0;

    if (newAge <= 21) {
      // Young players: high variance, breakthrough potential
      const roll = Math.random();
      if (roll < 0.02) {
        ratingChange = 5 + Math.floor(Math.random() * 2); // 5-6 (2% chance - wonderkid breakthrough)
      } else if (roll < 0.08) {
        ratingChange = 3 + Math.floor(Math.random() * 2); // 3-4 (6% chance - major leap)
      } else if (roll < 0.40) {
        ratingChange = 2; // (32% chance)
      } else if (roll < 0.65) {
        ratingChange = 1; // (25% chance)
      } else if (roll < 0.80) {
        ratingChange = 0; // (15% chance)
      } else {
        ratingChange = -1; // (20% chance - inconsistent)
      }
    } else if (newAge <= 24) {
      // Development phase: consistent improvement with breakthrough chances
      const roll = Math.random();
      if (roll < 0.03) {
        ratingChange = 4 + Math.floor(Math.random() * 2); // 4-5 (3% chance - late bloomer)
      } else if (roll < 0.12) {
        ratingChange = 3; // (9% chance)
      } else if (roll < 0.40) {
        ratingChange = 2; // (28% chance)
      } else if (roll < 0.75) {
        ratingChange = 1; // (35% chance)
      } else if (roll < 0.92) {
        ratingChange = 0; // (17% chance)
      } else {
        ratingChange = -1; // (8% chance - stagnation)
      }
    } else if (newAge <= 27) {
      // Rising to peak: steady growth with occasional spurts
      const roll = Math.random();
      if (roll < 0.02) {
        ratingChange = 3 + Math.floor(Math.random() * 2); // 3-4 (2% chance - finding form)
      } else if (roll < 0.10) {
        ratingChange = 2; // (8% chance)
      } else if (roll < 0.40) {
        ratingChange = 1; // (30% chance)
      } else if (roll < 0.75) {
        ratingChange = 0; // (35% chance)
      } else {
        ratingChange = -1; // (25% chance - slight decline)
      }
    } else if (newAge <= 29) {
      // PEAK: mostly stable, small changes
      const roll = Math.random();
      if (roll < 0.01) {
        ratingChange = 3; // (1% chance - rare late peak)
      } else if (roll < 0.05) {
        ratingChange = 2; // (4% chance)
      } else if (roll < 0.20) {
        ratingChange = 1; // (15% chance)
      } else if (roll < 0.60) {
        ratingChange = 0; // (40% chance - stability)
      } else if (roll < 0.90) {
        ratingChange = -1; // (30% chance)
      } else {
        ratingChange = -2; // (10% chance - early decline)
      }
    } else if (newAge <= 32) {
      // Post-peak: slight decline with stability
      const roll = Math.random();
      if (roll < 0.05) {
        ratingChange = 1; // (5% chance - defying age)
      } else if (roll < 0.25) {
        ratingChange = 0; // (20% chance)
      } else if (roll < 0.55) {
        ratingChange = -1; // (30% chance)
      } else if (roll < 0.80) {
        ratingChange = -2; // (35% chance)
      } else {
        ratingChange = -3; // (10% chance - sharp decline)
      }
    } else if (newAge <= 34) {
      // Decline phase: faster regression
      const roll = Math.random();
      if (roll < 0.10) {
        ratingChange = 0; // (10% chance - maintaining)
      } else if (roll < 0.30) {
        ratingChange = -1; // (20% chance)
      } else if (roll < 0.65) {
        ratingChange = -2; // (35% chance)
      } else if (roll < 0.85) {
        ratingChange = -3; // (20% chance)
      } else {
        ratingChange = -4; // (15% chance - steep drop)
      }
    } else {
      // Veteran: steep decline
      const roll = Math.random();
      if (roll < 0.05) {
        ratingChange = -1; // (5% chance - hanging on)
      } else if (roll < 0.30) {
        ratingChange = -2; // (25% chance)
      } else if (roll < 0.65) {
        ratingChange = -3; // (35% chance)
      } else if (roll < 0.90) {
        ratingChange = -4; // (25% chance)
      } else {
        ratingChange = -5 - Math.floor(Math.random() * 2); // -5 to -6 (10% chance - cliff)
      }
    }
    
    const newRating = Math.max(40, Math.min(99, player.rating + ratingChange));
    
    const statChange = ratingChange;
    const newStats = {
      pace: Math.max(30, Math.min(99, player.stats.pace + statChange)),
      shooting: Math.max(30, Math.min(99, player.stats.shooting + statChange)),
      passing: Math.max(30, Math.min(99, player.stats.passing + statChange)),
      defending: Math.max(30, Math.min(99, player.stats.defending + statChange)),
      physical: Math.max(30, Math.min(99, player.stats.physical + (newAge > 30 ? statChange - 1 : statChange)))
    };
    
    const currentMorale = player.morale;
    let newMorale;
    if (currentMorale > 65) {
      newMorale = currentMorale - (5 + Math.floor(Math.random() * 10));
    } else if (currentMorale < 55) {
      newMorale = currentMorale + (5 + Math.floor(Math.random() * 10));
    } else {
      newMorale = currentMorale + (Math.floor(Math.random() * 5) - 2);
    }
    newMorale = Math.max(40, Math.min(85, newMorale));
    
    return {
      ...player,
      age: newAge,
      rating: newRating,
      stats: newStats,
      morale: newMorale,
      contractYears: negotiation?.status === 'accepted' ? negotiation.offer.years : player.contractYears - 1,
      salary: negotiation?.status === 'accepted' ? negotiation.offer.salary : player.salary,
      seasonStats: {
        appearances: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0
      }
    };
  });

  // NOW apply the league change from lastSeasonFinish
  const oldLeague = gameState.lastSeasonFinish ? (gameState.lastSeasonFinish.league || gameState.league) : gameState.league;
  const newLeague = gameState.lastSeasonFinish?.newLeague || gameState.league;
  const leagueData = LEAGUES[newLeague];

  // Update league membership based on last season's results
  let updatedMembership = gameState.leagueMembership;
  let updatedRatings = gameState.teamRatings;

if (gameState.lastSeasonFinish && gameState.standings) {
  // Determine what league the player was in LAST season
  const playerWasInLeague = gameState.lastSeasonFinish.league || oldLeague;
  
  // Extract playoff winner from playoff details if it exists
  const playoffWinners = {};
  if (gameState.lastSeasonFinish.playoffDetails && 
      gameState.lastSeasonFinish.playoffDetails.results) {
    const results = gameState.lastSeasonFinish.playoffDetails.results;
    const finalResult = results[results.length - 1];
    if (finalResult && finalResult.winner) {
      // Store playoff winner under the league they won FROM (not going TO)
      playoffWinners[playerWasInLeague] = finalResult.winner;
    }
  }
  
  // Destructure both membership AND ratings
  const result = updateLeagueMembership(
    gameState.leagueMembership,
    gameState.standings,
    playerWasInLeague,
    newLeague,
    playoffWinners,
    gameState.teamRatings
  );
  
  updatedMembership = result.membership;
  updatedRatings = result.ratings; // Update the variable declared above
}

const playerRating = calculateTeamRating(updatedSquad);
const newStandings = generateStandingsFromMembership(newLeague, gameState.teamName, updatedMembership, updatedRatings, playerRating);

  // CRITICAL: Verify team count matches league requirements
  const expectedTeamCount = LEAGUES[newLeague].teams;
  if (newStandings.length !== expectedTeamCount) {
    console.error(`TEAM COUNT MISMATCH: Expected ${expectedTeamCount}, got ${newStandings.length}`);
    console.log('Membership state:', updatedMembership);
    console.log('Standings:', newStandings.map(s => s.team));
  }

  const newFreeAgents = generateFreeAgentsByPhase(newLeague, gameState.reputation, 'offseason');

  // Generate academy players based on academy level
  const academy = gameState.facilities.find(f => f.name === 'Youth Academy');
  const newAcademyPlayers = generateAcademyPlayers(academy.level, newLeague, gameState.reputation);

  setGameState(prev => ({
    ...prev,
    league: newLeague,
    squad: updatedSquad,
    standings: newStandings,
    leagueMembership: updatedMembership, // Store updated membership
    teamRatings: updatedRatings,
    freeAgents: newFreeAgents,
    academyPlayers: newAcademyPlayers, // Add this line
    matches: [],
    seasonPhase: 'preseason-transfers',
    contractNegotiations: [],
    paused: true,
    lastSeasonFinish: null,
    averageAttendance: 0,
    totalAttendance: 0,
    homeGames: 0,
    accumulatedTicketRevenue: 0,
    transferOffers: [],
    isTransferWindow: true,
    transferPhase: 'offseason',
    fixtureSchedule: null
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
  
  // Pure rating-based salary (independent of league)
  // Range: 55 rating = £30k, 99 rating = £45M
  // Exponential curve to create realistic wage structure
  
  let baseSalary;
  
  // Define key salary points for exponential curve
  const salaryPoints = [
    { rating: 45, salary: 25000 },      // Minimum (even though rare)
    { rating: 55, salary: 35000 },      // Low National League
    { rating: 60, salary: 55000 },      // Average National League
    { rating: 65, salary: 90000 },      // Good National League / Low L2
    { rating: 68, salary: 130000 },     // National League star
    { rating: 70, salary: 180000 },     // League Two star / L1 average
    { rating: 75, salary: 400000 },     // League One star / Championship average
    { rating: 80, salary: 1200000 },    // Championship star / Low PL
    { rating: 85, salary: 4000000 },    // Premier League regular
    { rating: 88, salary: 8000000 },    // Premier League star
    { rating: 92, salary: 18000000 },   // World class
    { rating: 95, salary: 24000000 },   // Elite
    { rating: 99, salary: 30000000 }    // Absolute best
  ];
  
  // Find the two points to interpolate between
  let lowerPoint = salaryPoints[0];
  let upperPoint = salaryPoints[salaryPoints.length - 1];
  
  for (let i = 0; i < salaryPoints.length - 1; i++) {
    if (rating >= salaryPoints[i].rating && rating <= salaryPoints[i + 1].rating) {
      lowerPoint = salaryPoints[i];
      upperPoint = salaryPoints[i + 1];
      break;
    }
  }
  
  // Exponential interpolation between points
  const ratingRange = upperPoint.rating - lowerPoint.rating;
  const normalizedRating = (rating - lowerPoint.rating) / ratingRange;
  
  // Exponential growth
  const salaryRatio = upperPoint.salary / lowerPoint.salary;
  const growthFactor = Math.pow(salaryRatio, normalizedRating);
  baseSalary = lowerPoint.salary * growthFactor;
  
  // Age factor - salary peaks at prime years (27-29)
  let ageMultiplier = 1.0;
  if (player.age <= 20) {
    ageMultiplier = 0.90; // Young prospects - low wages
  } else if (player.age <= 23) {
    ageMultiplier = 1.00; // Developing - moderate wages
  } else if (player.age <= 26) {
    ageMultiplier = 1.10; // Rising prime - good wages
  } else if (player.age <= 29) {
    ageMultiplier = 1.20; // PEAK - highest wages
  } else if (player.age <= 31) {
    ageMultiplier = 1.10; // Still prime - high wages
  } else if (player.age <= 33) {
    ageMultiplier = 0.85; // Declining - reduced wages
  } else {
    ageMultiplier = 0.60; // Veteran - much lower wages
  }
  
  baseSalary *= ageMultiplier;
  
  // Performance bonuses
  if (player.seasonStats && player.seasonStats.appearances > 0) {
    const goalsPerGame = player.seasonStats.goals / player.seasonStats.appearances;
    const assistsPerGame = player.seasonStats.assists / player.seasonStats.appearances;
    
    if (player.position === 'FWD') {
      if (goalsPerGame > 0.5) baseSalary *= 1.30; // Prolific scorer
      else if (goalsPerGame > 0.3) baseSalary *= 1.15; // Good scorer
    } else if (player.position === 'MID') {
      const contributions = goalsPerGame + assistsPerGame;
      if (contributions > 0.4) baseSalary *= 1.25; // Excellent playmaker
      else if (contributions > 0.25) baseSalary *= 1.12; // Good contributor
    }
    
    // Regular starter bonus
    if (player.seasonStats.appearances > 30) {
      baseSalary *= 1.12;
    }
  }
  
  // Position premium - attackers earn more
  if (player.position === 'FWD') {
    baseSalary *= 1.15;
  } else if (player.position === 'MID') {
    baseSalary *= 1.08;
  }
  
  // Small random variation (±15%)
  const randomFactor = 0.85 + Math.random() * 0.30;
  baseSalary *= randomFactor;
  
  return Math.floor(baseSalary);
}

function calculateTransferFee(player, league) {
  const rating = player.rating;
  let baseTransferFee;
  
  // Transfer fees based PURELY on rating, regardless of league
  
  // 45-58: Free transfers (bottom tier)
  if (rating <= 58) {
    if (Math.random() < 0.85) return 0;
    return Math.floor(Math.random() * 15000); // £0-15k
  }

  // 59-62: Mostly free, some nominal fees (£0-£20k)
  if (rating <= 62) {
    if (Math.random() < 0.70) return 0;
    return Math.floor(5000 + Math.random() * 15000);
  }

  // 63-65: Small fees (£10k-£40k)
  if (rating <= 65) {
    if (Math.random() < 0.40) return 0;
    baseTransferFee = 10000 + ((rating - 63) / (65 - 63)) * 30000;
  }
  // 66-68: League Two level (£40k-£80k)
  else if (rating <= 68) {
    baseTransferFee = 40000 + ((rating - 66) / (68 - 66)) * 40000;
  }
  // 69-72: League Two star / League One average (£80k-£160k)
  else if (rating <= 72) {
    baseTransferFee = 80000 + ((rating - 69) / (72 - 69)) * 80000;
  }
  // 73-75: League One starters (£250k-£600k)
  else if (rating <= 75) {
    baseTransferFee = 250000 + ((rating - 73) / (75 - 73)) * 350000;
  }
  // 76-78: League One star / Championship average (£600k-£1M)
  else if (rating <= 78) {
    baseTransferFee = 600000 + ((rating - 76) / (78 - 76)) * 400000;
  }
  // 79-80: Championship starters (£1M-£2.5M)
  else if (rating <= 80) {
    baseTransferFee = 1000000 + ((rating - 79) / (80 - 79)) * 1500000;
  }
  // 81-83: Championship star / Low PL (£2.5M-£4M)
  else if (rating <= 83) {
    baseTransferFee = 2500000 + ((rating - 81) / (83 - 81)) * 200000;
  }
  // 84-86: Championship top / PL rotation (£6M-£12M)
  else if (rating <= 86) {
    baseTransferFee = 6000000 + ((rating - 84) / (86 - 84)) * 6000000;
  }
  // 87-89: PL regulars (£16M-£30M)
  else if (rating <= 89) {
    baseTransferFee = 16000000 + ((rating - 87) / (89 - 87)) * 14000000;
  }
  // 90-93: PL good players/stars (£28M-£50M)
  else if (rating <= 93) {
    baseTransferFee = 28000000 + ((rating - 90) / (93 - 90)) * 22000000;
  }
  // 94-96: PL stars (£48M-£70M)
  else if (rating <= 96) {
    baseTransferFee = 48000000 + ((rating - 94) / (96 - 94)) * 22000000;
  }
  // 97-98: World class (£68M-£95M)
  else if (rating <= 98) {
    baseTransferFee = 68000000 + ((rating - 97) / (98 - 97)) * 27000000;
  }
  // 99+: Elite (£130M-£180M)
  else {
    baseTransferFee = 130000000 + ((rating - 99) / (99 - 99 + 1)) * 50000000;
  }
  
  // Age modifiers - transfer value peaks earlier (22-25)
  if (player.age <= 20) {
    baseTransferFee *= 1.15; // Young prospect premium (but not highest)
  } else if (player.age <= 22) {
    baseTransferFee *= 1.25; // Rising star - high value
  } else if (player.age <= 25) {
    baseTransferFee *= 1.35; // PEAK transfer value - resale + prime ahead
  } else if (player.age <= 27) {
    baseTransferFee *= 1.15; // Still valuable - entering prime
  } else if (player.age <= 29) {
    baseTransferFee *= 1.00; // Prime years but less resale value
  } else if (player.age <= 31) {
    baseTransferFee *= 0.85; // Declining value
  } else if (player.age <= 33) {
    baseTransferFee *= 0.60; // Aging
  } else {
    baseTransferFee *= 0.40; // Veteran - low transfer value
  }
  
  // Position premiums
  if (player.position === 'FWD') {
    baseTransferFee *= 1.15; // Goalscorers worth more
  } else if (player.position === 'MID') {
    baseTransferFee *= 1.08; // Playmakers premium
  } else if (player.position === 'GK') {
    baseTransferFee *= 0.90; // GKs generally cheaper
  }
  
  // Random market variation (±25%)
  baseTransferFee *= (0.75 + Math.random() * 0.50);
  
  // Enforce reasonable caps per rating tier
  if (rating <= 68) {
    baseTransferFee = Math.min(200000, baseTransferFee);
  } else if (rating <= 74) {
    baseTransferFee = Math.min(750000, baseTransferFee);
  } else if (rating <= 82) {
    baseTransferFee = Math.min(20000000, baseTransferFee);
  } else {
    baseTransferFee = Math.min(150000000, baseTransferFee);
  }
  
  // At the very end, before the final return:
  const finalFee = Math.floor(Math.max(0, baseTransferFee));
  
  // If market value is under £10k, make it free
  return finalFee < 10000 ? 0 : finalFee;
}

function negotiateContract(player, offer) {
  const yearlyOffer = offer.salary;
  
  // Check if player has reached their rejection limit
  if (player.rejectionCount !== undefined && player.rejectionCount >= player.rejectionLimit) {
    // Player is done negotiating - auto-reject
    return { 
      accepted: false, 
      marketValue: player.previousCounteroffer || calculateMarketValue(player, gameState.league),
      reachedLimit: true 
    };
  }
  
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
    // First time - their demand is simply their market value
    const marketValue = calculateMarketValue(player, gameState.league);
    counterofferValue = marketValue;
    
    // Set rejection limit on first negotiation (2-5 rejections before they walk away)
    // Use normal distribution centered at 3.5
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    let limit = Math.round(3.5 + z * 0.8); // Mean of 3.5, std dev of 0.8
    limit = Math.max(2, Math.min(5, limit)); // Clamp to 2-5
    
    player.rejectionLimit = limit;
    player.rejectionCount = 0;
  }
  
  // Calculate offer ratio
  const offerRatio = yearlyOffer / counterofferValue;
  
  // HARD FLOOR: Never accept offers below 60% of market value
  if (offerRatio < 0.60) {
    return { accepted: false, marketValue: counterofferValue };
  }
  
  // If the offer equals or exceeds their counteroffer, they should accept
  if (offerRatio >= 0.98) {
    // Close enough to their demand - very high acceptance
    return { accepted: true };
  }
  
  const optimalRatio = 1.0;
  const deviation = 0.15;
  
  const distance = Math.abs(offerRatio - optimalRatio);
  
  let acceptChance = Math.exp(-Math.pow(distance / deviation, 2)) * 0.85;
  
  // Adjusted penalties for low offers
  if (offerRatio < 0.70) {
    acceptChance = 0.02; // Very low offers
  } else if (offerRatio < 0.75) {
    acceptChance = 0.05; // Way too low
  } else if (offerRatio < 0.85) {
    acceptChance = 0.15; // Still too low
  } else if (offerRatio >= 0.95) {
    acceptChance = 0.80; // Very close - they'll likely accept
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
  // No transfer fees in this function - only for free agents and renewals
  
  const { accepted, marketValue, reachedLimit } = negotiateContract(player, { years, salary });
  
  if (view === 'freeagents') {
    if (accepted) {
      const newPlayer = { 
        ...player, 
        contractYears: years, 
        salary, 
        id: Date.now() + Math.random(),
        morale: 60 + Math.floor(Math.random() * 25),
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
        )
      }));
      
      setFreeAgentMessage({ player: player.name, accepted: true, agreedSalary: salary });
      setSelectedPlayer(null);
    } else {
      // Increment rejection count
      const newRejectionCount = (player.rejectionCount || 0) + 1;
      
      setGameState(prev => ({
        ...prev,
        freeAgents: prev.freeAgents.map(p => 
          p.id === player.id ? { 
            ...p, 
            status: reachedLimit ? 'walked_away' : 'rejected', 
            offer: { years, salary }, 
            marketValue,
            previousCounteroffer: marketValue,
            rejectionCount: newRejectionCount,
            rejectionLimit: player.rejectionLimit
          } : p
        )
      }));
      // No notification for rejection
    }
  } else if (view === 'contracts') {
    // Contract renewal - calculate rejection count first
    const newRejectionCount = (player.rejectionCount || 0) + 1;
    
    // Update state first
    setGameState(prev => ({
      ...prev,
      contractNegotiations: prev.contractNegotiations.map(n => 
        n.id === player.id 
          ? { 
              ...n, 
              offer: { years, salary }, 
              status: accepted ? 'accepted' : (reachedLimit ? 'walked_away' : 'rejected'), 
              marketValue,
              previousCounteroffer: marketValue,
              rejectionCount: accepted ? n.rejectionCount : newRejectionCount, // Only increment if rejected
              rejectionLimit: player.rejectionLimit || n.rejectionLimit
            }
          : n
      )
    }));
  }
}

function offerContractWithFee(player, years, salary, negotiatedTransferFee) {
  // Check if player has reached their transfer fee rejection limit
  if (player.transferFeeRejectionCount !== undefined && player.transferFeeRejectionCount >= 3) {
    setGameState(prev => ({
      ...prev,
      freeAgents: prev.freeAgents.map(p => 
        p.id === player.id ? { 
          ...p, 
          transferFeeRejected: true,
          transferNegotiationEnded: true
        } : p
      )
    }));
    return;
  }

  // Check if offer is reasonable for transfer fee
  if (player.requiresTransferFee && negotiatedTransferFee < player.transferFee) {
    const offerRatio = negotiatedTransferFee / player.transferFee;
    
    // Calculate NEW counteroffer (always lower or equal to previous)
    let newDemandedFee;
    if (player.previousTransferDemand) {
      // Subsequent offer - lower the demand by 5-10%
      const reduction = 0.90 + Math.random() * 0.05; // 90-95% of previous demand
      newDemandedFee = Math.floor(player.previousTransferDemand * reduction);
      // But never go below 70% of original asking price
      newDemandedFee = Math.max(Math.floor(player.transferFee * 0.70), newDemandedFee);
    } else {
      // First rejection - demand 85% of asking price
      newDemandedFee = Math.floor(player.transferFee * 0.85);
    }
    
    // Selling club rejects lowball offers (under 60% of their demand)
    if (negotiatedTransferFee < newDemandedFee * 0.6) {
      const newRejectionCount = (player.transferFeeRejectionCount || 0) + 1;
      
      setGameState(prev => ({
        ...prev,
        freeAgents: prev.freeAgents.map(p => 
          p.id === player.id ? { 
            ...p, 
            transferFeeRejected: true,
            offeredTransferFee: negotiatedTransferFee,
            demandedTransferFee: newDemandedFee,
            previousTransferDemand: newDemandedFee,
            transferFeeRejectionCount: newRejectionCount
          } : p
        )
      }));
      return;
    }
    
    // 60-90% of their demand has reduced acceptance
    const acceptChance = (negotiatedTransferFee / newDemandedFee - 0.6) / 0.3;
    if (Math.random() > acceptChance) {
      const newRejectionCount = (player.transferFeeRejectionCount || 0) + 1;
      
      setGameState(prev => ({
        ...prev,
        freeAgents: prev.freeAgents.map(p => 
          p.id === player.id ? { 
            ...p, 
            transferFeeRejected: true,
            offeredTransferFee: negotiatedTransferFee,
            demandedTransferFee: newDemandedFee,
            previousTransferDemand: newDemandedFee,
            transferFeeRejectionCount: newRejectionCount
          } : p
        )
      }));
      return;
    }
  }

    // IF WE GET HERE, TRANSFER FEE WAS ACCEPTED - Clear rejection flags
  if (player.requiresTransferFee && player.transferFeeRejected) {
    setGameState(prev => ({
      ...prev,
      freeAgents: prev.freeAgents.map(p => 
        p.id === player.id ? { 
          ...p, 
          transferFeeRejected: false,
          transferFeeAccepted: true, // Add this flag
          offeredTransferFee: negotiatedTransferFee,
          demandedTransferFee: null
        } : p
      )
    }));
  }

  

  const { accepted, marketValue, reachedLimit } = negotiateContract(player, { years, salary });
  
  if (view === 'freeagents') {
    if (accepted) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const newPlayer = { 
        ...player, 
        contractYears: years, 
        salary, 
        id: Date.now() + Math.random(),
        morale: 60 + Math.floor(Math.random() * 25),
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
        money: prev.money - negotiatedTransferFee,
        freeAgents: prev.freeAgents.map(p => 
          p.id === player.id ? { ...p, status: 'accepted', offer: { years, salary }, marketValue } : p
        )
      }));
      
      if (negotiatedTransferFee > 0) {
        setFreeAgentMessage({ 
          player: player.name, 
          accepted: true, 
          agreedSalary: salary,
          transferFee: negotiatedTransferFee
        });
      } else {
        setFreeAgentMessage({ player: player.name, accepted: true, agreedSalary: salary });
      }
      setSelectedPlayer(null);
    } else {
      // Increment rejection count
      const newRejectionCount = (player.rejectionCount || 0) + 1;
      
      setGameState(prev => ({
        ...prev,
        freeAgents: prev.freeAgents.map(p => 
          p.id === player.id ? { 
            ...p, 
            status: reachedLimit ? 'walked_away' : 'rejected', 
            offer: { years, salary }, 
            marketValue,
            previousCounteroffer: marketValue,
            rejectionCount: newRejectionCount,
            rejectionLimit: player.rejectionLimit
          } : p
        )
      }));
      // No notification for rejection
    }
  } else if (view === 'contracts') {
    // Existing contract renewal logic (no transfer fees)
    setGameState(prev => ({
      ...prev,
      contractNegotiations: prev.contractNegotiations.map(n => 
        n.id === player.id 
          ? { 
              ...n, 
              offer: { years, salary }, 
              status: accepted ? 'accepted' : 'rejected', 
              marketValue,
              previousCounteroffer: marketValue
            }
          : n
      )
    }));
    
    if (accepted) {
      setFreeAgentMessage({ player: player.name, accepted: true, isRenewal: true, agreedSalary: salary });
    } else {
      setFreeAgentMessage({ player: player.name, accepted: false, isRenewal: true, marketValue, offer: salary });
    }
  }
}

function offerContractToAcademyPlayer(player, years, salary) {
  const { accepted, marketValue, reachedLimit } = negotiateContract(player, { years, salary });
  
  if (accepted) {
    const newPlayer = { 
      ...player, 
      contractYears: years, 
      salary,
      morale: 60 + Math.floor(Math.random() * 25),
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
      academyPlayers: prev.academyPlayers.map(p => 
        p.id === player.id ? { ...p, status: 'accepted', offer: { years, salary }, marketValue } : p
      )
    }));
    
    setFreeAgentMessage({ player: player.name, accepted: true, agreedSalary: salary });
    setSelectedPlayer(null);
  } else {
    const newRejectionCount = (player.rejectionCount || 0) + 1;
    
    setGameState(prev => ({
      ...prev,
      academyPlayers: prev.academyPlayers.map(p => 
        p.id === player.id ? { 
          ...p, 
          status: reachedLimit ? 'walked_away' : 'rejected', 
          offer: { years, salary }, 
          marketValue,
          previousCounteroffer: marketValue,
          rejectionCount: newRejectionCount,
          rejectionLimit: player.rejectionLimit
        } : p
      )
    }));
    
    if (reachedLimit) {
      setFreeAgentMessage({ 
        player: player.name, 
        accepted: false, 
        walkedAway: true,
        rejectionCount: newRejectionCount
      });
    } else {
      setFreeAgentMessage({ 
        player: player.name, 
        accepted: false, 
        marketValue, 
        offer: salary,
        rejectionCount: newRejectionCount,
        rejectionLimit: player.rejectionLimit
      });
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
  // Calculate realistic transfer fee based on rating and age
  const marketValue = calculateTransferFee(player, gameState.league);
  
  // REJECT IMMEDIATELY if asking price is way too high
  const priceRatio = askingPrice / marketValue;
  if (priceRatio > 1.3) {
    return { 
      success: false, 
      message: 'No offers - asking price too high.' 
    };
  }
  
  // Base interest purely on rating (not league context)
  let baseInterest;
  if (player.rating >= 80) {
    baseInterest = 0.95; // Elite players always in demand
  } else if (player.rating >= 70) {
    baseInterest = 0.85; // Good players high demand
  } else if (player.rating >= 60) {
    baseInterest = 0.75; // Solid players moderate-high demand
  } else if (player.rating >= 50) {
    baseInterest = 0.70; // Average players moderate demand
  } else {
    baseInterest = 0.65; // Low-rated players still sellable
  }
  
  // Pricing adjustment (now capped at 1.3x)
  let priceMultiplier = 1.0;
  if (priceRatio > 1.2) {
    priceMultiplier = 0.70; // 1.2-1.3x overpriced
  } else if (priceRatio > 1.1) {
    priceMultiplier = 0.85; // 1.1-1.2x slightly high
  } else if (priceRatio > 1.05) {
    priceMultiplier = 0.95; // 1.05-1.1x fair
  } else if (priceRatio < 0.80) {
    priceMultiplier = 1.25; // Under 80% = bargain
  } else if (priceRatio < 0.90) {
    priceMultiplier = 1.15; // 80-90% = good deal
  }
  // else 0.90-1.05 = keep 1.0 (fair price)
  
  // Age factor (calculateTransferFee already handles this, but affects interest too)
  let ageFactor = 1.0;
  if (player.age <= 23) {
    ageFactor = 1.20; // Young prospects high demand
  } else if (player.age <= 26) {
    ageFactor = 1.10; // Prime age good demand
  } else if (player.age >= 32) {
    ageFactor = 1.15; // Old players wanted by lower leagues
  } else if (player.age >= 30) {
    ageFactor = 1.05; // Experienced players slight boost
  }
  
  // Position factor
  let positionFactor = 1.0;
  if (player.position === 'GK') {
    positionFactor = 0.75; // GKs harder to sell
  } else if (player.position === 'FWD') {
    positionFactor = 1.10; // Goalscorers easier to sell
  }
  
  // Calculate final offer chance
  let offerChance = baseInterest * priceMultiplier * ageFactor * positionFactor;
  offerChance = Math.max(0.15, Math.min(0.98, offerChance));
  
  const hasOffer = Math.random() < offerChance;
  
  if (hasOffer) {
    // Generate counter offer
    let offerMultiplier;
    
    if (priceRatio > 1.2) {
      offerMultiplier = 0.85 + Math.random() * 0.10; // 85-95% if overpriced
    } else if (priceRatio > 1.05) {
      offerMultiplier = 0.92 + Math.random() * 0.08; // 92-100% if slightly high
    } else if (priceRatio >= 0.95 && priceRatio <= 1.05) {
      offerMultiplier = 0.98 + Math.random() * 0.07; // 98-105% at market value
    } else if (priceRatio < 0.80) {
      offerMultiplier = 1.00 + Math.random() * 0.10; // 100-110% for bargains
    } else {
      offerMultiplier = 0.95 + Math.random() * 0.10; // 95-105% for good deals
    }
    
    const counterOffer = Math.floor(askingPrice * offerMultiplier);
    
    setGameState(prev => ({
      ...prev,
      transferOffers: [...prev.transferOffers, {
        player,
        askingPrice,
        counterOffer,
        status: 'pending'
      }]
    }));
    
    return { 
      success: true, 
      message: counterOffer === 0 
        ? `Offer received: Free transfer` 
        : `Offer received: £${(counterOffer / 1000).toFixed(0)}k`, 
      counterOffer 
    };
  } else {
    let reason = 'No offers this time. Try adjusting price or waiting.';
    
    if (priceRatio > 1.15) {
      reason = 'No offers - asking price too high.';
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
  
  let cost;
  
  if (facilityName === 'Stadium') {
    const stadiumCosts = {
      0: 6500000,
      1: 14000000,
      2: 11000000,
      3: 45000000,
      4: 55000000
    };
    cost = stadiumCosts[facility.level];
  } else {
    // Training Ground, Youth Academy, Medical Center
    // Costs scale with level and league expectations
    const facilityCosts = {
      'Training Ground': {
        0: 800000,   // Level 0→1
        1: 2000000,  // Level 1→2
        2: 4500000,  // Level 2→3
        3: 10000000, // Level 3→4
        4: 20000000  // Level 4→5
      },
      'Youth Academy': {
        0: 600000,
        1: 1500000,
        2: 3500000,
        3: 8000000,
        4: 15000000
      },
      'Medical Center': {
        0: 500000,
        1: 1600000,
        2: 3000000,
        3: 7000000,
        4: 14000000
      }
    };
    
    cost = facilityCosts[facilityName][facility.level];
  }
  
  
  
  const updatedFacilities = [...gameState.facilities];
  updatedFacilities[facilityIndex] = { ...facility, level: facility.level + 1 };
  
  setGameState(prev => ({
    ...prev,
    facilities: updatedFacilities,
    money: prev.money - cost
  }));
}

function getRequiredFacilityLevel(league) {
  // Minimum facility level required to avoid penalties
  switch(league) {
    case 5: return 0; // National League - no requirements
    case 4: return 1; // League Two - basic facilities needed
    case 3: return 2; // League One - decent facilities
    case 2: return 3; // Championship - good facilities
    case 1: return 4; // Premier League - excellent facilities
    default: return 0;
  }
}

function calculateFacilityImpact(facilities, league) {
  const requiredLevel = getRequiredFacilityLevel(league);
  let totalImpact = 0;
  
  // Check each non-stadium AND non-academy facility
  const impactFacilities = facilities.filter(f => f.name !== 'Stadium' && f.name !== 'Youth Academy');
  
  impactFacilities.forEach(facility => {
    if (facility.level < requiredLevel) {
      // PENALTY for inadequate facilities
      const deficit = requiredLevel - facility.level;
      totalImpact -= deficit * 2; // -2 rating per level below requirement
    } else if (facility.level > requiredLevel) {
      // Small BONUS for exceeding requirements
      const excess = facility.level - requiredLevel;
      totalImpact += excess * 0.5; // +0.5 rating per level above requirement
    }
    // If at required level, no impact (neutral)
  });
  
  return Math.round(totalImpact);
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

function getStartingLineup(squad) {
  // Use same logic as calculateTeamRating to determine starters
  const gks = squad.filter(p => p.position === 'GK').sort((a, b) => b.rating - a.rating);
  const defs = squad.filter(p => p.position === 'DEF').sort((a, b) => b.rating - a.rating);
  const mids = squad.filter(p => p.position === 'MID').sort((a, b) => b.rating - a.rating);
  const fwds = squad.filter(p => p.position === 'FWD').sort((a, b) => b.rating - a.rating);
  
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
  
  formations.forEach(([numDef, numMid, numFwd]) => {
    if (gks.length < 1 || defs.length < numDef || 
        mids.length < numMid || fwds.length < numFwd) {
      return;
    }
    
    const starter_gk = gks[0];
    const starter_defs = defs.slice(0, numDef);
    const starter_mids = mids.slice(0, numMid);
    const starter_fwds = fwds.slice(0, numFwd);
    
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
  
  if (!bestFormation) {
    const sortedSquad = [...squad].sort((a, b) => b.rating - a.rating);
    bestFormation = { starters: sortedSquad.slice(0, 11) };
  }
  
  // Return set of starter IDs for quick lookup
  return new Set(bestFormation.starters.map(p => p.id));
}

// Reset contract offer when selected player changes in contract renewals
useEffect(() => {
  if (view === 'contracts' && gameState.contractNegotiations) {
    setContractOffer({ years: 3, salary: '', playerId: null });
  }
}, [view]);

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
    }, 500);
    
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

// Clear selected player when returning to main view
useEffect(() => {
  if (view === 'main' && selectedPlayer) {
    setSelectedPlayer(null);
  }
}, [view]);

// Auto-dismiss notifications after 7 seconds
useEffect(() => {
  if (freeAgentMessage || transferMessage) {
    const timer = setTimeout(() => {
      setFreeAgentMessage(null);
      setTransferMessage(null);
    }, 7000);
    
    return () => clearTimeout(timer);
  }
}, [freeAgentMessage, transferMessage]);

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
          {/* Add logo */}
          <img 
            src="/RTP_LOGO.png" 
            alt="Road to the Premier League Logo" 
            className="start-logo"
          />
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
              <li>Inspired by Welcome to Wrexham</li>
              <li>Start in the National League with £3M budget</li>
              <li>Manage squad, sign free agents, and negotiate contracts</li>
              <li>Upgrade facilities to boost performance</li>
              <li>Navigate through 5 divisions to reach the Premier League</li>
              <li>Survive financially - bankruptcy at -£40M or multiple heavy debt seasons end the game</li>
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
                  {gameState?.teamName || 'Your club'} has gone into administration with debts of <span className="text-danger">£{(gameOverReason.debt / 1000000).toFixed(2)}M</span>
                </p>
              </>
            )}

            {gameOverReason.reason === 'relegated' && (
              <>
                <h2 className="gameover-reason">Sacked by the Board</h2>
                <p className="gameover-text">
                  The board has lost confidence in you as {gameState?.teamName || 'Your club'} descends out of its professional status😭
                </p>
              </>
            )}

            
            {gameOverReason.reason === 'fired' && (
              <>
                <h2 className="gameover-reason">Sacked by the Board</h2>
                <p className="gameover-text">
                  After {gameOverReason.seasonsInDebt} consecutive seasons with debts exceeding £2M, the board has lost confidence in your financial management. 
                  <br /><br />
                  {gameState?.teamName || 'Your club'} currently has debts of <span className="text-danger">£{(gameOverReason.debt / 1000000).toFixed(2)}M</span>
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
            <h2>
              {gameState.transferPhase === 'offseason' && 'Free Agent Market - Offseason'}
              {gameState.transferPhase === 'emergency' && 'Emergency Free Agents'}
              {gameState.transferPhase === 'window' && 'Transfer Market - Window Open'}
            </h2>
            <button onClick={() => { 
              setView('main'); 
              setFreeAgentMessage(null); 
              setSelectedPlayer(null);
            }} className="btn btn-secondary">
              Back to Main
            </button>
          </div>
          <div className="header-stats">
            Balance: £{(gameState.money / 1000000).toFixed(2)}M | Squad Size: {gameState.squad.length}/25
            {gameState.transferPhase === 'offseason' && (
              <span className="text-success"> | Offseason Market (Free & Paid Transfers)</span>
            )}
            {gameState.transferPhase === 'emergency' && (
              <span className="text-warning"> | Emergency Free Agents Only</span>
            )}
            {gameState.transferPhase === 'window' && (
              <span className="text-primary"> | Transfer Window (Free & Paid Transfers)</span>
            )}
          </div>
        </div>

        {freeAgentMessage && (
        <div className="notification-modal">
          <div className={`message-card ${freeAgentMessage.accepted ? 'message-success' : 'message-error'}`}>
            <div className="message-title">
              {freeAgentMessage.walkedAway ? (
                `✗ ${freeAgentMessage.player} has walked away from negotiations!`
              ) : freeAgentMessage.accepted ? (
                `✓ ${freeAgentMessage.player} has ${freeAgentMessage.isRenewal ? 'renewed their contract' : 'signed'} with your club!`
              ) : (
                `✗ ${freeAgentMessage.player} has rejected your offer.`
              )}
            </div>
            {freeAgentMessage.walkedAway && (
              <div className="message-details text-walk-away">
                Player has ended negotiations after {freeAgentMessage.rejectionCount} rejected offers.
              </div>
            )}
            {freeAgentMessage.agreedSalary && !freeAgentMessage.walkedAway && (
              <div className="message-details">
                <span className="text-success">
                  Agreed Terms: £{(freeAgentMessage.agreedSalary / 1000).toFixed(0)}k/year
                </span>
                {freeAgentMessage.transferFee && (
                  <span className="text-warning">
                    {' | '}Transfer Fee Paid: £{(freeAgentMessage.transferFee / 1000).toFixed(0)}k
                  </span>
                )}
              </div>
            )}
            {freeAgentMessage.marketValue && !freeAgentMessage.accepted && !freeAgentMessage.walkedAway && (
              <div className="message-details text-warning">
                Your Offer: £{(freeAgentMessage.offer / 1000).toFixed(0)}k/year | 
                Player Counteroffer: £{(freeAgentMessage.marketValue / 1000).toFixed(0)}k/year
                {freeAgentMessage.offer < freeAgentMessage.marketValue && 
                  ` (you offered ${Math.round((freeAgentMessage.offer / freeAgentMessage.marketValue) * 100)}%)`}
                {freeAgentMessage.rejectionLimit && (
                  <span className="text-danger">
                    {' | '}Rejection {freeAgentMessage.rejectionCount}/{freeAgentMessage.rejectionLimit}
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
                    {player.requiresTransferFee && player.transferFee > 0 ? (
                      <span className="badge badge-warning">Paid Transfer</span>
                    ) : (
                      <span className="badge badge-success">Free Transfer</span>
                    )}
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
                  <div className="player-salary">
                    £{(player.salary / 1000).toFixed(0)}k/year
                    {player.requiresTransferFee && player.transferFee > 0 && (
                      <div className="text-warning" style={{ fontSize: '0.875rem' }}>
                        Fee: £{(player.transferFee / 1000).toFixed(0)}k
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPlayer(player);
                      setContractOffer({ years: 3, salary: player.marketValue || player.salary, playerId: player.id });
                    }}
                    className="btn btn-success btn-bold"
                  >
                    Make Offer
                  </button>
                </div>
              </div>

              {selectedPlayer?.id === player.id && (
                <div className="contract-offer-section">
                  <h3 className="section-title">Contract Offer</h3>
                  
                  {/* Player walked away notice */}
                  {player.status === 'walked_away' && (
                    <div className="rejection-notice">
                      <div className="rejection-title">🚫 Player Has Ended Negotiations</div>
                      <div className="text-danger">
                        {player.name} walked away after {player.rejectionCount} rejected offers.
                        They are no longer interested in joining your club.
                      </div>
                    </div>
                  )}
                  
                  {/* Transfer fee status */}
                  {player.transferNegotiationEnded ? (
                    <div className="rejection-notice">
                      <div className="rejection-title">🚫 Transfer Negotiations Ended</div>
                      <div className="text-danger">
                        The selling club has ended negotiations after {player.transferFeeRejectionCount} rejected offers.
                        This player is no longer available for transfer.
                      </div>
                    </div>
                  ) : player.transferFeeAccepted ? (
                    <div className="contract-summary" style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '6px', marginBottom: '12px' }}>
                      <div className="text-success">
                        ✓ Transfer Fee Accepted: £{(player.offeredTransferFee / 1000).toFixed(0)}k
                      </div>
                      <div style={{ fontSize: '0.875rem', marginTop: '4px' }}>
                        Club has agreed to the transfer. Now negotiate personal terms with the player.
                      </div>
                    </div>
                  ) : player.transferFeeRejected && player.offeredTransferFee && player.demandedTransferFee ? (
                    <div className="rejection-notice">
                      <div className="rejection-title">⚠️ Transfer Fee Rejected by Club:</div>
                      <div>Your Offer: £{(player.offeredTransferFee / 1000).toFixed(0)}k</div>
                      <div className="text-warning">
                        Club Demands: £{(player.demandedTransferFee / 1000).toFixed(0)}k
                        {' '}(you offered {Math.round((player.offeredTransferFee / player.demandedTransferFee) * 100)}%)
                      </div>
                      {player.transferFeeRejectionCount && (
                        <div className="text-danger">
                          Rejections: {player.transferFeeRejectionCount}/3
                          {player.transferFeeRejectionCount >= 2 && ' - Final offer!'}
                        </div>
                      )}
                      <div className="rejection-hint">Increase your transfer fee offer below</div>
                    </div>
                  ) : null}
                  
                  {/* Player salary rejection */}
                  {player.status === 'rejected' && player.offer && player.marketValue && (
                    <div className="rejection-notice" style={{ marginTop: player.transferFeeRejected ? '12px' : '0' }}>
                      <div className="rejection-title">⚠️ Contract Rejected by Player:</div>
                      <div>Your Offer: £{(player.offer.salary / 1000).toFixed(0)}k/year for {player.offer.years} years</div>
                      <div className="text-warning">
                        Player Counteroffer: £{(player.marketValue / 1000).toFixed(0)}k/year
                        (you offered {Math.round((player.offer.salary / player.marketValue) * 100)}%)
                      </div>
                      {player.rejectionLimit && (
                        <div className="text-danger">
                          Rejections: {player.rejectionCount}/{player.rejectionLimit}
                          {player.rejectionCount >= player.rejectionLimit - 1 && ' - Final offer!'}
                        </div>
                      )}
                      <div className="rejection-hint">Increase your salary offer above</div>
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
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            setContractOffer(prev => ({ ...prev, years: '' }));
                          } else {
                            const numValue = parseInt(value);
                            if (numValue >= 1 && numValue <= 5) {
                              setContractOffer(prev => ({ ...prev, years: numValue }));
                            }
                          }
                        }}
                        onBlur={(e) => {
                          const value = e.target.value;
                          if (value === '' || isNaN(parseInt(value))) {
                            setContractOffer(prev => ({ ...prev, years: 1 }));
                          } else {
                            const numValue = parseInt(value);
                            if (numValue < 1) {
                              setContractOffer(prev => ({ ...prev, years: 1 }));
                            } else if (numValue > 5) {
                              setContractOffer(prev => ({ ...prev, years: 5 }));
                            }
                          }
                        }}
                        className="form-input"
                        disabled={player.status === 'walked_away'}
                      />
                    </div>
                    <div className="form-group">
                      <label>Annual Salary (£000s)</label>
                      <input
                        type="number"
                        min="10"
                        step="5"
                        placeholder="0"
                        value={
                          contractOffer.playerId === player.id 
                            ? (contractOffer.salary === "" ? "" : Math.round(contractOffer.salary / 1000))
                            : Math.round((player.marketValue || player.salary) / 1000)
                        }
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "") {
                            setContractOffer(prev => ({ ...prev, salary: "", playerId: player.id }));
                            return;
                          }
                          const thousands = parseInt(v, 10);
                          if (!isNaN(thousands)) {
                            setContractOffer(prev => ({ ...prev, salary: thousands * 1000, playerId: player.id }));
                          }
                        }}
                        className="form-input"
                        disabled={player.status === 'walked_away'}
                      />
                      <div className="form-hint">
                        Enter amount in thousands (e.g., 65 = £65,000/year)
                      </div>
                    </div>
                  </div>
                  
                  <div className="contract-summary">
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Contract Terms:</strong>
                      <br />
                      Annual Salary: £{((contractOffer.salary || player.salary) / 1000).toFixed(0)}k/year
                      <br />
                      Total Contract Value: £{((contractOffer.salary || player.salary) * contractOffer.years / 1000).toFixed(0)}k
                    </div>
                    
                    {player.requiresTransferFee && player.transferFee ? (
                      <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(234, 179, 8, 0.2)', borderRadius: '6px' }}>
                        <strong className="text-warning">Transfer Fee:</strong>
                        <br />
                        <input
                          type="number"
                          min="10"
                          step="10"
                          placeholder="0"
                          defaultValue={Math.round(player.transferFee / 1000)}
                          id={`transfer-fee-${player.id}`}
                          className="form-input"
                          style={{ marginTop: '8px' }}
                          disabled={player.status === 'walked_away'}
                        />
                        <div className="form-hint">
                          Selling club wants £{(player.transferFee / 1000).toFixed(0)}k. Negotiate transfer fee in thousands.
                        </div>
                        <div style={{ marginTop: '8px', fontSize: '0.875rem' }}>
                          <strong>Total Cost:</strong> Transfer Fee + (Salary × Years)
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '6px' }}>
                        <strong className="text-success">✓ Free Transfer - No Transfer Fee</strong>
                        <br />
                        <span style={{ fontSize: '0.875rem' }}>Only wages required</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="button-group">
                    <button
                    onClick={() => {
                      const salary = contractOffer.salary || player.salary;
                      const years = contractOffer.years;
                      
                      if (player.requiresTransferFee && player.transferFee) {
                        const feeInput = document.getElementById(`transfer-fee-${player.id}`);
                        const negotiatedFee = (parseInt(feeInput?.value) || Math.round(player.transferFee / 1000)) * 1000;
                        offerContractWithFee(player, years, salary, negotiatedFee);
                      } else {
                        offerContract(player, years, salary);
                      }
                    }}
                    className="btn btn-primary btn-bold"
                    disabled={player.transferNegotiationEnded || player.status === 'walked_away'}
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
                if (team.isPlayer) {
                  rowClass = 'player-row';
                } else {
                  // Color based on league-specific rules
                  if (gameState.league === 5) {
                    // National League: 1 auto, 2-7 playoffs, bottom 4 relegated
                    if (index === 0) rowClass = 'promotion-auto';
                    else if (index >= 1 && index <= 6) rowClass = 'promotion-playoff';
                    else if (index >= 20) rowClass = 'relegation'; // Bottom 4
                  } else if (gameState.league === 4) {
                    // League Two: 3 auto, 4-7 playoffs, bottom 2 relegated
                    if (index <= 2) rowClass = 'promotion-auto';
                    else if (index >= 3 && index <= 6) rowClass = 'promotion-playoff';
                    else if (index >= 22) rowClass = 'relegation'; // Bottom 2
                  } else if (gameState.league === 3) {
                    // League One: 2 auto, 3-6 playoffs, bottom 4 relegated
                    if (index <= 1) rowClass = 'promotion-auto';
                    else if (index >= 2 && index <= 5) rowClass = 'promotion-playoff';
                    else if (index >= 20) rowClass = 'relegation'; // Bottom 4
                  } else if (gameState.league === 2) {
                    // Championship: 2 auto, 3-6 playoffs, bottom 3 relegated
                    if (index <= 1) rowClass = 'promotion-auto';
                    else if (index >= 2 && index <= 5) rowClass = 'promotion-playoff';
                    else if (index >= 21) rowClass = 'relegation'; // Bottom 3
                  } else if (gameState.league === 1) {
                    // Premier League: bottom 3 relegated only (no promotion colors)
                    if (index >= 17) rowClass = 'relegation'; // Bottom 3
                  }
                }
                
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
          <div className="header-content">
            <div className="header-titles">
              <h2>Contract Negotiations - Offseason</h2>
              <p className="header-subtitle">Negotiate with players whose contracts are expiring</p>
            </div>
            <button onClick={() => { 
              setView('main'); 
              setFreeAgentMessage(null); 
              setSelectedPlayer(null);
            }} className="btn btn-secondary">
              Back to Main
            </button>
          </div>
        </div>

        {freeAgentMessage && (
        <div className="notification-modal">
          <div className={`message-card ${freeAgentMessage.accepted ? 'message-success' : 'message-error'}`}>
            <div className="message-title">
              {freeAgentMessage.walkedAway ? (
                `✗ ${freeAgentMessage.player} has walked away from negotiations!`
              ) : freeAgentMessage.accepted ? (
                `✓ ${freeAgentMessage.player} has accepted the contract renewal!`
              ) : (
                `✗ ${freeAgentMessage.player} has rejected your offer.`
              )}
            </div>
            {freeAgentMessage.walkedAway && (
              <div className="message-details text-walk-away">
                Player has ended negotiations after {freeAgentMessage.rejectionCount} rejected offers.
              </div>
            )}
            {freeAgentMessage.agreedSalary && !freeAgentMessage.walkedAway && (
              <div className="message-details">
                <span className="text-success">
                  Agreed Terms: £{(freeAgentMessage.agreedSalary / 1000).toFixed(0)}k/year
                </span>
              </div>
            )}
            {freeAgentMessage.marketValue && !freeAgentMessage.accepted && !freeAgentMessage.walkedAway && (
              <div className="message-details text-warning">
                Your Offer: £{(freeAgentMessage.offer / 1000).toFixed(0)}k/year | 
                Player Counteroffer: £{(freeAgentMessage.marketValue / 1000).toFixed(0)}k/year
                {freeAgentMessage.offer < freeAgentMessage.marketValue && 
                  ` (you offered ${Math.round((freeAgentMessage.offer / freeAgentMessage.marketValue) * 100)}%)`}
                {freeAgentMessage.rejectionLimit && (
                  <span className="text-danger">
                    {' | '}Rejection {freeAgentMessage.rejectionCount}/{freeAgentMessage.rejectionLimit}
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
                      {player.status === 'accepted' ? (
                        <>
                          New Contract: £{(player.offer.salary / 1000).toFixed(0)}k/year for {player.offer.years} years | 
                          <span className="text-success"> Agreed!</span>
                        </>
                      ) : (
                        <>
                          Current Salary: £{(player.salary / 1000).toFixed(0)}k/year | Contract Expires: End of Season
                        </>
                      )}
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

                {(player.status === 'pending' || player.status === 'rejected') && player.status !== 'walked_away' && (
                <div className="contract-offer-section" key={player.id}>
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
                          value={contractOffer.years}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              setContractOffer(prev => ({ ...prev, years: '' }));
                            } else {
                              const numValue = parseInt(value);
                              if (numValue >= 1 && numValue <= 5) {
                                setContractOffer(prev => ({ ...prev, years: numValue }));
                              }
                            }
                          }}
                          onBlur={(e) => {
                            const value = e.target.value;
                            if (value === '' || isNaN(parseInt(value))) {
                              setContractOffer(prev => ({ ...prev, years: 1 }));
                            } else {
                              const numValue = parseInt(value);
                              if (numValue < 1) {
                                setContractOffer(prev => ({ ...prev, years: 1 }));
                              } else if (numValue > 5) {
                                setContractOffer(prev => ({ ...prev, years: 5 }));
                              }
                            }
                          }}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Annual Salary (£000s)</label>
                        <input
                          type="number"
                          min="10"
                          step="5"
                          placeholder="0"
                          value={
                            contractOffer.playerId === player.id 
                              ? (contractOffer.salary === "" ? "" : Math.round(contractOffer.salary / 1000))
                              : Math.round((player.marketValue || player.salary) / 1000)
                          }
                          onChange={(e) => {
                            const v = e.target.value;
                            if (v === "") {
                              setContractOffer(prev => ({ ...prev, salary: "", playerId: player.id }));
                              return;
                            }
                            const thousands = parseInt(v, 10);
                            if (!isNaN(thousands)) {
                              setContractOffer(prev => ({ ...prev, salary: thousands * 1000, playerId: player.id }));
                            }
                          }}
                          className="form-input"
                        />
                        <div className="form-hint">
                          Enter amount in thousands (e.g., 65 = £65,000/year)
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const years = contractOffer.years || 2;
                        // If playerId doesn't match or salary is empty, use player's market value
                        const salary = (contractOffer.playerId === player.id && contractOffer.salary) 
                          ? contractOffer.salary 
                          : (player.marketValue || player.salary);
                        offerContract(player, years, salary);
                      }}
                      className="btn btn-primary btn-bold"
                    >
                      {player.status === 'rejected' ? 'Submit Counter Offer' : 'Submit Offer'}
                    </button>
                  </div>
                )}

                {player.status === 'walked_away' && (
                  <div className="contract-offer-section">
                    <div className="rejection-notice">
                      <div className="rejection-title">🚫 Player Has Ended Negotiations</div>
                      <div className="text-danger">
                        {player.name} walked away after {player.rejectionCount} rejected offers.
                        They will leave the club at the end of their contract.
                      </div>
                    </div>
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
        <div className="notification-modal">
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
              // Store market value in player object if not already there, so it doesn't recalculate
              if (!player.cachedMarketValue) {
                player.cachedMarketValue = calculateTransferFee(player, gameState.league);
              }
              const marketValue = player.cachedMarketValue;
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
                          Current Salary: £{(player.salary / 1000).toFixed(0)}k | 
                          Market Value: £{(marketValue / 1000).toFixed(0)}k
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
                          <label>Transfer Fee (£000s)</label>
                          <input
                            type="number"
                            min="10"
                            step="10"
                            placeholder="0"
                            defaultValue={Math.round(marketValue/1000)} // Default to salary (realistic transfer fee)
                            id={`transfer-${player.id}`}
                            className="form-input"
                          />
                        </div>
                        <div className="button-group">
                          <button
                            onClick={() => {
                              const priceInput = document.getElementById(`transfer-${player.id}`);
                              const priceInThousands = parseInt(priceInput.value) || 0;
                              const askingPrice = priceInThousands * 1000;
                              const result = listPlayerForTransfer(player, askingPrice);
                              setTransferMessage({
                                ...result,
                                askingPrice
                              });
                              setSelectedPlayer(null);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
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

if (view === 'academy') {
  const academy = gameState.facilities.find(f => f.name === 'Youth Academy');
  
  return (
    <div className="game-container">
      <div className="content-wrapper">
        <div className="header-card">
          <div className="header-content">
            <h2>Youth Academy Prospects (Level {academy.level})</h2>
            <button onClick={() => { 
              setView('main'); 
              setFreeAgentMessage(null); 
              setSelectedPlayer(null);
            }} className="btn btn-secondary">
              Back to Main
            </button>
          </div>
          <div className="header-stats">
            Balance: £{(gameState.money / 1000000).toFixed(2)}M | Squad Size: {gameState.squad.length}/25
            <span className="text-primary"> | Youth Academy Graduates (Free Signings)</span>
          </div>
        </div>

        {freeAgentMessage && (
          <div className={`message-card ${freeAgentMessage.accepted ? 'message-success' : 'message-error'}`}>
            <div className="message-title">
              {freeAgentMessage.accepted 
                ? `✓ ${freeAgentMessage.player} has joined the first team from the academy!`
                : `✗ ${freeAgentMessage.player} has rejected your offer.`}
            </div>
            {freeAgentMessage.agreedSalary && (
              <div className="message-details">
                <span className="text-success">
                  Agreed Terms: £{(freeAgentMessage.agreedSalary / 1000).toFixed(0)}k/year
                </span>
              </div>
            )}
            {freeAgentMessage.marketValue && !freeAgentMessage.accepted && (
              <div className="message-details text-warning">
                Your Offer: £{(freeAgentMessage.offer / 1000).toFixed(0)}k/year | 
                Player Counteroffer: £{(freeAgentMessage.marketValue / 1000).toFixed(0)}k/year
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

        {gameState.academyPlayers.length === 0 ? (
          <div className="empty-state-card">
            <p className="empty-state-title">No academy prospects available</p>
            <p className="empty-state-subtitle">Upgrade your Youth Academy to start producing talent!</p>
          </div>
        ) : (
          <div className="player-list">
            {gameState.academyPlayers.map(player => (
            <div key={player.id} className={`player-card ${
              player.status === 'rejected' ? 'player-rejected' : 
              player.status === 'accepted' ? 'player-accepted' : 
              player.status === 'walked_away' ? 'player-rejected' : ''
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
                    <span className="badge badge-success">Academy Graduate</span>
                    {player.status === 'rejected' && (
                      <span className="badge badge-danger">Previously Rejected</span>
                    )}
                    {player.status === 'walked_away' && (
                      <span className="badge badge-danger">Walked Away</span>
                    )}
                    {player.status === 'accepted' && (
                      <span className="badge badge-success">✓ Promoted to First Team</span>
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
                  <div className="player-salary">
                    £{(player.salary / 1000).toFixed(0)}k/year
                  </div>
                  {player.status !== 'accepted' && player.status !== 'walked_away' && (
                    <button
                      onClick={() => {
                        setSelectedPlayer(player);
                        setContractOffer({ years: 3, salary: player.marketValue || player.salary, playerId: player.id });
                      }}
                      className="btn btn-success btn-bold"
                    >
                      Promote to First Team
                    </button>
                  )}
                </div>
              </div>

              {selectedPlayer?.id === player.id && player.status !== 'accepted' && player.status !== 'walked_away' && (
                <div className="contract-offer-section" key={player.id}>
                  <h3 className="section-title">First Team Contract Offer</h3>
                  
                  {player.status === 'rejected' && player.offer && player.marketValue && (
                    <div className="rejection-notice">
                      <div className="rejection-title">⚠️ Contract Rejected:</div>
                      <div>Your Offer: £{(player.offer.salary / 1000).toFixed(0)}k/year for {player.offer.years} years</div>
                      <div className="text-warning">
                        Player Counteroffer: £{(player.marketValue / 1000).toFixed(0)}k/year
                        (you offered {Math.round((player.offer.salary / player.marketValue) * 100)}%)
                      </div>
                      {player.rejectionLimit && (
                        <div className="text-danger">
                          Rejections: {player.rejectionCount}/{player.rejectionLimit}
                          {player.rejectionCount >= player.rejectionLimit - 1 && ' - Final offer!'}
                        </div>
                      )}
                      <div className="rejection-hint">Increase your salary offer</div>
                    </div>
                  )}
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Contract Length (years)</label>
                      <input
                        type="number"
                        min="1"
                        max="3"
                        value={contractOffer.years}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            setContractOffer(prev => ({ ...prev, years: '' }));
                          } else {
                            const numValue = parseInt(value);
                            if (numValue >= 1 && numValue <= 3) {
                              setContractOffer(prev => ({ ...prev, years: numValue }));
                            }
                          }
                        }}
                        onBlur={(e) => {
                          const value = e.target.value;
                          if (value === '' || isNaN(parseInt(value))) {
                            setContractOffer(prev => ({ ...prev, years: 3 }));
                          } else {
                            const numValue = parseInt(value);
                            if (numValue < 1) {
                              setContractOffer(prev => ({ ...prev, years: 1 }));
                            } else if (numValue > 5) {
                              setContractOffer(prev => ({ ...prev, years: 5 }));
                            }
                          }
                        }}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Annual Salary (£000s)</label>
                      <input
                        type="number"
                        min="10"
                        step="5"
                        placeholder="0"
                        value={
                          contractOffer.playerId === player.id 
                            ? (contractOffer.salary === "" ? "" : Math.round(contractOffer.salary / 1000))
                            : Math.round((player.marketValue || player.salary) / 1000)
                        }
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "") {
                            setContractOffer(prev => ({ ...prev, salary: "", playerId: player.id }));
                            return;
                          }
                          const thousands = parseInt(v, 10);
                          if (!isNaN(thousands)) {
                            setContractOffer(prev => ({ ...prev, salary: thousands * 1000, playerId: player.id }));
                          }
                        }}
                        className="form-input"
                        disabled={player.status === 'walked_away'}
                      />
                      <div className="form-hint">
                        Enter amount in thousands (e.g., 65 = £65,000/year)
                      </div>
                    </div>
                  </div>
                  
                  <div className="contract-summary">
                    <strong>Contract Terms: (3-Year Max Length)</strong>
                    <br />
                    Annual Salary: £{((contractOffer.salary || player.salary) / 1000).toFixed(0)}k/year
                    <br />
                    Total Contract Value: £{((contractOffer.salary || player.salary) * contractOffer.years / 1000).toFixed(0)}k
                    <br />
                    <span className="text-success">✓ No Transfer Fee Required</span>
                  </div>
                  
                  <div className="button-group">
                    <button
                      onClick={() => {
                        const salary = (contractOffer.playerId === player.id && contractOffer.salary) 
                          ? contractOffer.salary 
                          : player.salary;
                        const years = contractOffer.years || 1;
                        offerContractToAcademyPlayer(player, years, salary);
                      }}
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

              {/* Add walked away notice */}
              {player.status === 'walked_away' && (
                <div className="contract-offer-section">
                  <div className="rejection-notice">
                    <div className="rejection-title">🚫 Player Has Ended Negotiations</div>
                    <div className="text-danger">
                      {player.name} walked away after {player.rejectionCount} rejected offers.
                      They have declined to join the first team and will remain in the academy.
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Premier League Champion Screen
if (view === 'plchampion') {
  return (
    <div className="game-container">
      <div className="content-wrapper">
        <div className="plchampion-screen">
          <h1 className="plchampion-title">🏆 PREMIER LEAGUE CHAMPIONS! 🏆</h1>
          
          <div className="plchampion-details">
            <h2 className="plchampion-club">{gameState?.teamName || 'Your Club'}</h2>
            <p className="plchampion-text">
              You've reached the pinnacle of English football! From humble beginnings in the National League 
              to conquering the Premier League - an incredible journey!
            </p>
            
            <div className="plchampion-stats">
              <div className="plchampion-stat">
                <div className="plchampion-stat-label">Seasons Played</div>
                <div className="plchampion-stat-value">{gameState?.season}</div>
              </div>
              <div className="plchampion-stat">
                <div className="plchampion-stat-label">Final League</div>
                <div className="plchampion-stat-value">Premier League</div>
              </div>
              <div className="plchampion-stat">
                <div className="plchampion-stat-label">Final Position</div>
                <div className="plchampion-stat-value">1st 🥇</div>
              </div>
              <div className="plchampion-stat">
                <div className="plchampion-stat-label">Points</div>
                <div className="plchampion-stat-value">{playerStanding?.points}</div>
              </div>
              <div className="plchampion-stat">
                <div className="plchampion-stat-label">Team Rating</div>
                <div className="plchampion-stat-value">{calculateTeamRating(gameState.squad)}</div>
              </div>
              <div className="plchampion-stat">
                <div className="plchampion-stat-label">Final Balance</div>
                <div className="plchampion-stat-value">£{(gameState?.money / 1000000).toFixed(2)}M</div>
              </div>
            </div>

            <div className="plchampion-journey">
              <h3>Your Journey:</h3>
              <p>National League → League Two → League One → Championship → Premier League → CHAMPIONS!</p>
            </div>
          </div>
          
          <div className="plchampion-buttons">
            <button
              onClick={() => {
                setPlWinner(false);
                setView('main');
                // Continue playing
              }}
              className="btn btn-success btn-large btn-bold"
            >
              Continue Playing
            </button>
            
            <button
              onClick={() => {
                deleteSave();
                setView('start');
                setGameState(null);
                setTeamNameInput('');
                setPlWinner(false);
              }}
              className="btn btn-primary btn-large btn-bold"
            >
              Start New Journey
            </button>
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
            <div className={`money-amount ${gameState.money < 0 ? 'text-danger' : ''}`}>
              £{(gameState.money / 1000000).toFixed(2)}M
            </div>
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
            
            {/* Transfer Market Button - only show during mid-season window */}
            {gameState.isTransferWindow && (
              <button
                onClick={() => {
                  setGameState(prev => ({ ...prev, paused: true }));
                  setView('transfers');
                }}
                className="btn btn-warning btn-bold btn-pulse"
              >
                <DollarSign size={20} />
                Transfer Market (OPEN)
              </button>
            )}
            
            {/* Buy Players - available during regular season */}
            <button
              onClick={() => {
                setSelectedPlayer(null);
                setFreeAgentMessage(null);
                setView('freeagents');
              }}
              className="btn btn-primary btn-bold"
            >
              <UserPlus size={20} />
              Transfers (Buy Players)
            </button>
          </>
        )}
        
        {gameState.seasonPhase === 'preseason-transfers' && (
          <>
            <button
              onClick={() => {
                const validation = validateRoster(gameState.squad);
                if (!validation.isValid) {
                  alert(`Cannot start season:\n\n${validation.errors.join('\n')}`);
                  return;
                }
                setGameState(prev => ({
                  ...prev,
                  seasonPhase: 'regular',
                  isTransferWindow: false,
                  transferPhase: 'emergency',
                  transferOffers: [],
                  freeAgents: generateFreeAgentsByPhase(prev.league, prev.reputation, 'emergency'),
                  paused: false
                }));
              }}
              className="btn btn-success btn-bold"
            >
              <Play size={20} />
              Start Season {gameState.season}
            </button>
            <button
              onClick={() => {
                setGameState(prev => ({ ...prev, paused: true }));
                setView('transfers');
              }}
              className="btn btn-warning btn-bold btn-pulse"
            >
              <DollarSign size={20} />
              Pre-Season Transfers (Sell Players)
            </button>
            
            {/* Transfers button - only during preseason */}
            <button
              onClick={() => {
                setSelectedPlayer(null);
                setFreeAgentMessage(null);
                setView('freeagents');
              }}
              className="btn btn-primary btn-bold"
            >
              <UserPlus size={20} />
              Transfers (Buy Players)
            </button>
            
            {/* Academy button */}
            {gameState.facilities.find(f => f.name === 'Youth Academy').level >= 1 && gameState.academyPlayers.length > 0 && (
              <button
                onClick={() => {
                  setGameState(prev => ({ ...prev, paused: true }));
                  setView('academy');
                }}
                className="btn btn-purple btn-bold"
              >
                <Users size={20} />
                Academy Prospects ({gameState.academyPlayers.length})
              </button>
            )}
          </>
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
        
        {/* Standings button - always available */}
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
              {gameState.lastSeasonFinish.playoffDetails.results.map((result, idx) => {
                // Determine round label based on number of matches
                const totalMatches = gameState.lastSeasonFinish.playoffDetails.results.length;
                let roundLabel;
                
                if (totalMatches === 5) {
                  // National League: 2 quarters + 2 semis + 1 final
                  if (idx < 2) roundLabel = `Quarter-Final ${idx + 1}`;
                  else if (idx < 4) roundLabel = `Semi-Final ${idx - 1}`;
                  else roundLabel = 'FINAL';
                } else if (totalMatches === 3) {
                  // League Two/One/Championship: 2 semis + 1 final
                  if (idx < 2) roundLabel = `Semi-Final ${idx + 1}`;
                  else roundLabel = 'FINAL';
                } else {
                  roundLabel = 'Match';
                }
                
                // Check if this is a final (single leg) OR a single-leg match
                const isFinal = idx === totalMatches - 1;
                const isTwoLegs = result.leg1Score && result.leg2Score && result.aggregate;
                
                return (
                  <div key={idx} className="playoff-match">
                    <div className="playoff-round">
                      {roundLabel}
                    </div>
                    <div className="playoff-match-details">
                      <div className={`playoff-team-left ${result.team1 === gameState.teamName ? 'text-bold text-primary' : ''}`}>
                        {result.team1}
                      </div>
                      <div className="playoff-scores">
                        {isTwoLegs ? (
                          // Two-legged tie - show both legs and aggregate
                          <>
                            <div className="playoff-leg-scores">
                              <span className="playoff-leg-label">Leg 1:</span>
                              <span className="playoff-score">{result.leg1Score}</span>
                            </div>
                            <div className="playoff-leg-scores">
                              <span className="playoff-leg-label">Leg 2:</span>
                              <span className="playoff-score">{result.leg2Score}</span>
                            </div>
                            <div className="playoff-aggregate">
                              <span className="playoff-leg-label">Aggregate:</span>
                              <span className="playoff-score">{result.aggregate}</span>
                            </div>
                          </>
                        ) : (
                          // Single leg match - just show the score
                          <div className="playoff-final-score">{result.score}</div>
                        )}
                      </div>
                      <div className={`playoff-team-right ${result.team2 === gameState.teamName ? 'text-bold text-primary' : ''}`}>
                        {result.team2}
                      </div>
                    </div>
                    <div className="playoff-winner">
                      Winner: <span className={result.winner === gameState.teamName ? 'text-success' : ''}>
                        {result.winner}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

          
          <div className="season-finances">
            <div className="finance-section">
              <h3 className="finance-section-title text-success">Revenue</h3>
              <div className="finance-breakdown">
                <div className="finance-row">
                  <span>TV Rights:</span>
                  <span>£{(gameState.lastSeasonFinish.tvRevenue / 1000000).toFixed(2)}M</span>
                </div>
                <div className="finance-row">
                  <span>Ticket Sales:</span>
                  <span>£{(gameState.lastSeasonFinish.ticketRevenue / 1000000).toFixed(2)}M</span>
                </div>
                <div className="finance-row">
                  <span>Sponsorships:</span>
                  <span>£{(gameState.lastSeasonFinish.sponsorshipRevenue / 1000000).toFixed(2)}M</span>
                </div>
                <div className="finance-row">
                  <span>Merchandise:</span>
                  <span>£{(gameState.lastSeasonFinish.merchandiseRevenue / 1000000).toFixed(2)}M</span>
                </div>
                {gameState.lastSeasonFinish.prize > 0 && (
                  <div className="finance-row">
                    <span>Prize Money:</span>
                    <span>£{(gameState.lastSeasonFinish.prize / 1000000).toFixed(2)}M</span>
                  </div>
                )}
                {gameState.lastSeasonFinish.promotionBonus > 0 && (
                  <div className="finance-row text-success">
                    <span>🎉 Board Promotion Bonus:</span>
                    <span>£{(gameState.lastSeasonFinish.promotionBonus / 1000000).toFixed(2)}M</span>
                  </div>
                )}
                <div className="finance-row finance-total">
                  <span>Total Revenue:</span>
                  <span className="text-success">£{(gameState.lastSeasonFinish.revenue / 1000000).toFixed(2)}M</span>
                </div>
              </div>
            </div>

            <div className="finance-section">
              <h3 className="finance-section-title text-danger">Costs</h3>
              <div className="finance-breakdown">
                <div className="finance-row">
                  <span>Player Wages:</span>
                  <span>£{(gameState.lastSeasonFinish.wagesCost / 1000000).toFixed(2)}M</span>
                </div>
                <div className="finance-row">
                  <span>Facilities:</span>
                  <span>£{(gameState.lastSeasonFinish.facilitiesCost / 1000000).toFixed(2)}M</span>
                </div>
                <div className="finance-row">
                  <span>Operating Costs:</span>
                  <span>£{(gameState.lastSeasonFinish.operatingCost / 1000000).toFixed(2)}M</span>
                </div>
                <div className="finance-row finance-total">
                  <span>Total Costs:</span>
                  <span className="text-danger">£{(gameState.lastSeasonFinish.costs / 1000000).toFixed(2)}M</span>
                </div>
              </div>
            </div>

            <div className="finance-section">
              <h3 className="finance-section-title">Net Result</h3>
              <div className="finance-breakdown">
                <div className="finance-row finance-total finance-net">
                  <span>Net Income:</span>
                  <span className={gameState.lastSeasonFinish.net > 0 ? 'text-success' : 'text-danger'}>
                    £{(gameState.lastSeasonFinish.net / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>
            </div>
          </div>
          {gameState.money < -2000000 && (
            <div className="debt-warning">
              <h3 className="text-danger">⚠️ HEAVY DEBT WARNING</h3>
              <p>
                Your club is £{(Math.abs(gameState.money) / 1000000).toFixed(2)}M in debt. 
                {gameState.consecutiveSeasonsInDebt === 2 && (
                  <span className="text-warning"> This is your second consecutive season in debt - one more and you'll be sacked!</span>
                )}
                {gameState.consecutiveSeasonsInDebt === 1 && (
                  <span> Another season like this and the board will start losing patience.</span>
                )}
              </p>
            </div>
          )}
          {/* Add retirements section */}
          {gameState.lastSeasonFinish.retirees && gameState.lastSeasonFinish.retirees.length > 0 && (
            <div className="retirements-section">
              <h3 className="section-title">Player Retirements</h3>
              <p className="retirements-intro">The following players have retired from professional football:</p>
              <div className="retirements-list">
                {gameState.lastSeasonFinish.retirees.map((retiree, idx) => (
                  <div key={idx} className="retirement-item">
                    <span className="retirement-name">{retiree.name}</span>
                    <span className="badge badge-position">{retiree.position}</span>
                    <span className={`player-rating rating-${retiree.rating >= 70 ? 'high' : retiree.rating >= 60 ? 'medium' : 'low'}`}>
                      {retiree.rating} OVR
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
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

          {/* Squad legend with formation */}
          <div className="squad-legend">
            <div className="squad-legend-item">
              <div className="squad-legend-box squad-legend-starter"></div>
              <span>Starting XI</span>
            </div>
            <div className="squad-legend-item">
              <div className="squad-legend-box squad-legend-bench"></div>
              <span>Bench / Reserves</span>
            </div>
            <div className="squad-formation">
              Formation: {(() => {
                // Get the formation being used
                const gks = gameState.squad.filter(p => p.position === 'GK').sort((a, b) => b.rating - a.rating);
                const defs = gameState.squad.filter(p => p.position === 'DEF').sort((a, b) => b.rating - a.rating);
                const mids = gameState.squad.filter(p => p.position === 'MID').sort((a, b) => b.rating - a.rating);
                const fwds = gameState.squad.filter(p => p.position === 'FWD').sort((a, b) => b.rating - a.rating);
                
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
                
                formations.forEach(([numDef, numMid, numFwd]) => {
                  if (gks.length < 1 || defs.length < numDef || 
                      mids.length < numMid || fwds.length < numFwd) {
                    return;
                  }
                  
                  const starter_gk = gks[0];
                  const starter_defs = defs.slice(0, numDef);
                  const starter_mids = mids.slice(0, numMid);
                  const starter_fwds = fwds.slice(0, numFwd);
                  
                  const allStarters = [starter_gk, ...starter_defs, ...starter_mids, ...starter_fwds];
                  const formationRating = allStarters.reduce((sum, p) => sum + p.rating, 0) / 11;
                  
                  if (formationRating > bestRating) {
                    bestRating = formationRating;
                    bestFormation = {
                      formation: [numDef, numMid, numFwd]
                    };
                  }
                });
                
                if (!bestFormation) {
                  return '4-4-2'; // Default fallback
                }
                
                return `${bestFormation.formation[0]}-${bestFormation.formation[1]}-${bestFormation.formation[2]}`;
              })()}
            </div>
          </div>
          <div className="squad-list">
          {POSITIONS.map(pos => {
            const posPlayers = gameState.squad
              .filter(p => p.position === pos)
              .sort((a, b) => b.rating - a.rating);
            
            if (posPlayers.length === 0) return null;
            
            // Get starting lineup IDs
            const starterIds = getStartingLineup(gameState.squad);
            
            return (
              <div key={pos} className="position-group">
                <div className="position-header">{pos}</div>
                {posPlayers.map(player => {
                  const isStarter = starterIds.has(player.id);
                  
                  return (
                    <div key={player.id} className={`squad-player ${isStarter ? 'squad-player-starter' : ''}`}>
                      <div className="squad-player-main">
                        <div>
                          <div className="squad-player-name-row">
                            <div className="squad-player-name">
                              {player.name}
                              {isStarter && <span className="starter-badge">⭐</span>}
                            </div>
                            <div className={`squad-player-rating rating-${player.rating >= 70 ? 'high' : player.rating >= 60 ? 'medium' : 'low'}`}>
                              {player.rating}
                            </div>
                          </div>
                          <div className="squad-player-details">
                            Age: {player.age} | Contract: {player.contractYears}yr | 
                            £{(player.salary / 1000).toFixed(0)}k/yr | 
                            Morale: {player.morale}
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
                  );
                })}
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
            // Calculate cost - use custom logic for Stadium
            let cost;
            if (facility.name === 'Stadium') {
              const stadiumCosts = {
                0: 6500000, 1: 14000000, 2: 11000000, 3: 45000000, 4: 150000000
              };
              cost = stadiumCosts[facility.level] || 0;
            } else {
              const facilityCosts = {
                'Training Ground': { 0: 800000, 1: 2000000, 2: 4500000, 3: 10000000, 4: 20000000 },
                'Youth Academy': { 0: 600000, 1: 1000000, 2: 2000000, 3: 20000000, 4: 50000000 },
                'Medical Center': { 0: 500000, 1: 1200000, 2: 3000000, 3: 7000000, 4: 14000000 }
              };
              cost = facilityCosts[facility.name]?.[facility.level] || 0;
            }
            
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
                    className={`btn btn-small btn-bold ${
                      maxedOut ? 'btn-disabled' :
                      canAfford ? 'btn-primary' : 'btn-primary'
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
                  {facility.name === 'Stadium' ? (
                    <>
                      Capacity: {STADIUM_CAPACITIES[facility.level].toLocaleString()} | 
                      Attendance Bonus: +{facility.attendanceBonus * facility.level}%
                      {(() => {
                        // Calculate realistic max attendance for current reputation
                        let realisticMax;
                        if (gameState.league === 5) realisticMax = 500 + (gameState.reputation * 45);
                        else if (gameState.league === 4) realisticMax = 2000 + (gameState.reputation * 60);
                        else if (gameState.league === 3) realisticMax = 3000 + (gameState.reputation * 120);
                        else if (gameState.league === 2) realisticMax = 8000 + (gameState.reputation * 220);
                        else if (gameState.league === 1) realisticMax = 20000 + (gameState.reputation * 400);
                        
                        const currentCapacity = STADIUM_CAPACITIES[facility.level];
                        const nextCapacity = STADIUM_CAPACITIES[facility.level + 1];
                        
                        // Warn if next upgrade would be oversized
                        if (facility.level < facility.maxLevel && nextCapacity > realisticMax * 1.3) {
                          return (
                            <span className="facility-hint">
                              {' '}(Fanbase: ~{Math.floor(realisticMax).toLocaleString()} - upgrade may be premature)
                            </span>
                          );
                        }
                        // Show next capacity if upgrading makes sense
                        else if (facility.level < facility.maxLevel) {
                          return (
                            <span className="facility-hint">
                              {' '}(Next: {nextCapacity.toLocaleString()} capacity)
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </>
                  ) : facility.name === 'Youth Academy' ? (
                    <>
                      {/* Youth Academy - show maintenance cost and prospect info */}
                      Annual Cost: £{(facility.maintenanceCost * facility.level / 1000000).toFixed(2)}M
                      {facility.level === 0 && (
                        <span className="facility-hint"> (Upgrade to start producing prospects)</span>
                      )}
                      {facility.level >= 1 && (
                        <span className="text-primary"> | Produces {4 + Math.floor(Math.random() * 4)} prospects per season</span>
                      )}
                    </>
                  ) : (
                    <>
                      {(() => {
                        const requiredLevel = getRequiredFacilityLevel(gameState.league);
                        const impact = facility.level < requiredLevel ? -(requiredLevel - facility.level) * 2 :
                                      facility.level > requiredLevel ? (facility.level - requiredLevel) * 0.5 : 0;
                        
                        return (
                          <>
                            Level: {facility.level}/{facility.maxLevel} | 
                            {facility.level < requiredLevel && (
                              <span className="text-danger"> Below standard! -{Math.abs(impact)} rating</span>
                            )}
                            {facility.level === requiredLevel && (
                              <span className="text-success"> Meets requirements</span>
                            )}
                            {facility.level > requiredLevel && (
                              <span className="text-primary"> Excellent! +{impact.toFixed(1)} rating</span>
                            )}
                            {facility.level < requiredLevel && (
                              <span className="facility-hint"> (League requires level {requiredLevel})</span>
                            )}
                          </>
                        );
                      })()}
                    </>
                  )}
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
                <span className={`text-bold ${
                  gameState.reputation >= 80 ? 'text-success' :
                  gameState.reputation >= 60 ? 'text-warning' :
                  gameState.reputation >= 40 ? 'text-primary' :
                  'text-danger'
                }`}>
                  {gameState.reputation}/100
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${
                    gameState.reputation >= 80 ? 'progress-fill-success' :
                    gameState.reputation >= 60 ? 'progress-fill-warning' :
                    'progress-fill-danger'
                  }`}
                  style={{ width: `${gameState.reputation}%` }}
                />
              </div>
              <div className="stat-hint">
                {gameState.reputation >= 85 ? '🔥 Elite Status' :
                gameState.reputation >= 70 ? '⭐ Rising Club' :
                gameState.reputation >= 50 ? '📊 Established' :
                gameState.reputation >= 30 ? '⚠️ Struggling' :
                '📉 Crisis Mode'}
              </div>

              <div className="stat-row">
                <span>Team Morale:</span>
                <span className="text-bold">
                  {gameState.squad.length > 0 
                    ? Math.round(gameState.squad.reduce((sum, p) => sum + p.morale, 0) / gameState.squad.length)
                    : 50}/100
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill progress-fill-success"
                  style={{ 
                    width: `${gameState.squad.length > 0 
                      ? gameState.squad.reduce((sum, p) => sum + p.morale, 0) / gameState.squad.length 
                      : 50}%` 
                  }}
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
                <>
                  <div className="stat-row">
                    <span>Avg Attendance:</span>
                    <span className="text-bold text-primary">
                      {gameState.averageAttendance.toLocaleString()}
                    </span>
                  </div>
                  <div className="stat-row">
                    <span>Fanbase Size:</span>
                    <span className="text-bold">
                      {(() => {
                        let fanbase;
                        if (gameState.league === 5) fanbase = 500 + (gameState.reputation * 45);
                        else if (gameState.league === 4) fanbase = 2000 + (gameState.reputation * 60);
                        else if (gameState.league === 3) fanbase = 3000 + (gameState.reputation * 120);
                        else if (gameState.league === 2) fanbase = 8000 + (gameState.reputation * 220);
                        else if (gameState.league === 1) fanbase = 20000 + (gameState.reputation * 400);
                        return `~${Math.floor(fanbase).toLocaleString()}`;
                      })()}
                    </span>
                  </div>
                </>
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