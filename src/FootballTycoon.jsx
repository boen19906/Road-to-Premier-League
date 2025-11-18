import React, { useState, useEffect } from 'react';
import { Play, Pause, Users, TrendingUp, Building, Trophy, DollarSign, UserPlus, FileText, BarChart3 } from 'lucide-react';
import './FootballTycoon.css';

const FootballTycoon = () => {
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
  { name: 'Training Ground', level: 0, maxLevel: 5, baseCost: 500000, performanceBonus: 2, attendanceBonus: 0, maintenanceCost: 30000 },
  { name: 'Stadium', level: 0, maxLevel: 5, baseCost: 1000000, performanceBonus: 1, attendanceBonus: 5, maintenanceCost: 50000, capacity: 5000 },
  { name: 'Youth Academy', level: 0, maxLevel: 5, baseCost: 300000, performanceBonus: 1, attendanceBonus: 0, maintenanceCost: 20000 },
  { name: 'Medical Center', level: 0, maxLevel: 5, baseCost: 200000, performanceBonus: 2, attendanceBonus: 0, maintenanceCost: 15000 }
];

const STADIUM_CAPACITIES = {
  0: 3000,
  1: 5000,
  2: 8000,
  3: 12000,
  4: 18000,
  5: 25000
};

const POSITIONS = ['GK', 'DEF', 'MID', 'FWD'];

const TEAM_NAMES = {
  5: [ // National League
    'Eastleigh FC', 'Halifax Town', 'Barrow AFC', 'Gateshead FC', 'Aldershot Town',
    'Southend United', 'Yeovil Town', 'Oldham Athletic', 'Bromley FC', 'Solihull Moors',
    'Hartlepool United', 'Dagenham & Redbridge', 'Ebbsfleet United', 'Sutton United',
    'Woking FC', 'Altrincham FC', 'Maidenhead United', 'Boreham Wood', 'Dorking Wanderers',
    'Wealdstone FC', 'York City', 'Rochdale AFC', 'FC Halifax Town'
  ],
  4: [ // League Two
    'Stockport County', 'Wrexham AFC', 'Notts County', 'Mansfield Town', 'Crawley Town',
    'Doncaster Rovers', 'Crewe Alexandra', 'Bradford City', 'Grimsby Town', 'Salford City',
    'Harrogate Town', 'Colchester United', 'Swindon Town', 'Walsall FC', 'Newport County',
    'Tranmere Rovers', 'Barrow AFC', 'AFC Wimbledon', 'Morecambe FC', 'Gillingham FC',
    'Carlisle United', 'Accrington Stanley', 'Chesterfield FC'
  ],
  3: [ // League One
    'Bolton Wanderers', 'Derby County', 'Portsmouth FC', 'Oxford United', 'Barnsley FC',
    'Peterborough United', 'Blackpool FC', 'Lincoln City', 'Stevenage FC', 'Northampton Town',
    'Reading FC', 'Exeter City', 'Charlton Athletic', 'Wycombe Wanderers', 'Leyton Orient',
    'Burton Albion', 'Bristol Rovers', 'Shrewsbury Town', 'Cambridge United', 'Fleetwood Town',
    'Port Vale', 'Cheltenham Town', 'Carlisle United'
  ],
  2: [ // Championship
    'Leeds United', 'Leicester City', 'Ipswich Town', 'Southampton FC', 'West Bromwich Albion',
    'Norwich City', 'Coventry City', 'Hull City', 'Middlesbrough FC', 'Preston North End',
    'Bristol City', 'Swansea City', 'Sheffield Wednesday', 'Stoke City', 'Millwall FC',
    'Blackburn Rovers', 'Watford FC', 'Queens Park Rangers', 'Cardiff City', 'Plymouth Argyle',
    'Birmingham City', 'Rotherham United', 'Huddersfield Town'
  ],
  1: [ // Premier League
    'Manchester City', 'Arsenal FC', 'Liverpool FC', 'Aston Villa', 'Tottenham Hotspur',
    'Chelsea FC', 'Newcastle United', 'Manchester United', 'West Ham United', 'Brighton & Hove Albion',
    'Bournemouth AFC', 'Crystal Palace', 'Fulham FC', 'Wolverhampton Wanderers', 'Everton FC',
    'Brentford FC', 'Nottingham Forest', 'Luton Town', 'Burnley FC'
  ]
};

const [freeAgentMessage, setFreeAgentMessage] = useState(null);

const [view, setView] = useState('start'); // start, main, freeagents, standings, contracts, gameover
const [selectedPlayer, setSelectedPlayer] = useState(null);
const [contractOffer, setContractOffer] = useState({ years: 1, salary: 0 });
const [teamNameInput, setTeamNameInput] = useState('');
const [gameOverReason, setGameOverReason] = useState(null);

// Initialize game state
const [gameState, setGameState] = useState(null);

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
    homeGames: 0
  };
  
  // Generate initial squad
  const positions = { GK: 1, DEF: 8, MID: 8, FWD: 6 };
  
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
    // Generate team rating based on league with more variance
    const baseRating = 50 + (6 - league) * 8;
    const variance = 12; // Teams can be ±12 from average
    const teamRating = Math.round(baseRating + (Math.random() - 0.5) * variance * 2);
    
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
      rating: team === playerTeam ? 0 : Math.max(40, Math.min(85, teamRating))
    };
  });
}

function calculateTeamRating(squad) {
  const top11 = [...squad]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 11);
  
  const baseRating = top11.reduce((sum, p) => sum + p.rating, 0) / 11;
  
  const facilityBonus = gameState.facilities.reduce((sum, f) => 
    sum + (f.level * f.performanceBonus), 0);
  
  const moraleBonus = (squad.reduce((sum, p) => sum + p.morale, 0) / squad.length - 50) / 5;
  
  return Math.round(baseRating + facilityBonus + moraleBonus);
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
    // Get top 11 players by rating (the starters)
    const starters = [...prev.squad]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 11);
    
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
    
    const updatedSquad = prev.squad.map(player => {
      const isStarter = starterIds.has(player.id);
      
      // Starters play 95% of games, bench players 30%
      const playChance = isStarter ? 0.95 : 0.3;
      const isPlaying = Math.random() < playChance;
      
      if (!isPlaying) return player;
      
      const newStats = { ...player.seasonStats, appearances: player.seasonStats.appearances + 1 };
      
      // Assign goals based on our pre-calculated goal scorers
      const goalsThisMatch = goalScorers.filter(id => id === player.id).length;
      newStats.goals += goalsThisMatch;
      
      // Assists - for each goal, someone gets an assist
      if (goalsScored > 0 && player.position !== 'GK') {
        let assistChance = 0;
        
        if (player.position === 'MID') {
          assistChance = isStarter ? 0.35 : 0.1;
        } else if (player.position === 'FWD') {
          assistChance = isStarter ? 0.25 : 0.08;
        } else if (player.position === 'DEF') {
          assistChance = isStarter ? 0.08 : 0.02;
        }
        
        const passingMultiplier = (player.stats.passing / 65);
        assistChance *= passingMultiplier;
        
        // Check for each goal
        for (let i = 0; i < goalsScored; i++) {
          if (Math.random() < assistChance) {
            newStats.assists++;
            break; // Max 1 assist per match
          }
        }
      }
      
      // Cards - more likely for defenders and physical players
      const cardChance = player.position === 'DEF' ? 0.12 : 0.08;
      if (Math.random() < cardChance) newStats.yellowCards++;
      if (Math.random() < 0.008) newStats.redCards++;
      
      return { ...player, seasonStats: newStats };
    });
    
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
          money: prev.money + ticketRevenue,
          totalAttendance: prev.totalAttendance + attendance,
          homeGames: prev.homeGames + 1,
          averageAttendance: Math.round((prev.totalAttendance + attendance) / (prev.homeGames + 1))
        }));
      }
    }
  }
  
  setGameState(prev => ({
    ...prev,
    matches: [...newMatches, ...prev.matches].slice(0, 50), // Keep last 50 matches
    matchday: prev.matchday + 1
  }));
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
    message = `Finished ${playerStanding.position}${getOrdinal(playerStanding.position)} in ${leagueData.name}.`;
  }

  // Calculate season finances with variance
  const tvRevenue = leagueData.tvRevenue * (0.9 + Math.random() * 0.2);
  
  // Add promotion bonus
  let promotionBonus = 0;
  if (promoted) {
    if (gameState.league === 5) promotionBonus = 2000000; // National League to League Two
    else if (gameState.league === 4) promotionBonus = 4000000; // League Two to League One
    else if (gameState.league === 3) promotionBonus = 8000000; // League One to Championship
    else if (gameState.league === 2) promotionBonus = 30000000; // Championship to Premier League
  }
  
  const totalRevenue = tvRevenue + prize + promotionBonus;
  
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
      }
    };
  });

  // Generate new standings and free agents
  const newLeague = gameState.league;
  const newStandings = generateStandings(newLeague, gameState.teamName);
  
  // Update AI team ratings based on previous season performance
  const updatedStandings = newStandings.map(team => {
    if (team.isPlayer) return team;
    
    // Each offseason, teams can change rating by -3 to +3
    const ratingChange = Math.floor(Math.random() * 7) - 3; // -3, -2, -1, 0, 1, 2, 3
    const newRating = Math.max(40, Math.min(85, team.rating + ratingChange));
    
    return { ...team, rating: newRating };
  });
  
  const newFreeAgents = generateFreeAgents(newLeague, gameState.reputation, 30);

  setGameState(prev => ({
    ...prev,
    squad: updatedSquad,
    standings: updatedStandings,
    freeAgents: newFreeAgents,
    matches: [],
    seasonPhase: 'regular',
    contractNegotiations: [],
    paused: true,
    lastSeasonFinish: null,
    averageAttendance: 0,
    totalAttendance: 0,
    homeGames: 0
  }));
  
  setView('main');
  setFreeAgentMessage(null);
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
  const marketValue = calculateMarketValue(player, gameState.league);
  const yearlyOffer = offer.salary;
  
  const offerRatio = yearlyOffer / marketValue;
  
  const optimalRatio = 1.05;
  const deviation = 0.18;
  
  const distance = Math.abs(offerRatio - optimalRatio);
  
  let acceptChance = Math.exp(-Math.pow(distance / deviation, 2)) * 0.88;
  
  if (offerRatio < 0.6) {
    acceptChance = 0.01;
  } else if (offerRatio < 0.75) {
    acceptChance = 0.03 + (offerRatio - 0.6) * 0.2;
  } else if (offerRatio >= 1.25) {
    acceptChance = 0.95;
  }
  
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
  
  // Ensure counteroffer is never less than what was offered
  const counterofferValue = Math.max(yearlyOffer, marketValue);
  
  return { accepted, marketValue: counterofferValue };
}

function offerContract(player, years, salary) {
  const totalCost = salary * years;
  
  if (totalCost > gameState.money) {
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
      
      setFreeAgentMessage({ player: player.name, accepted: true, marketValue });
      setSelectedPlayer(null);
    } else {
      setGameState(prev => ({
        ...prev,
        freeAgents: prev.freeAgents.map(p => 
          p.id === player.id ? { ...p, status: 'rejected', offer: { years, salary }, marketValue } : p
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
          ? { ...n, offer: { years, salary }, status: accepted ? 'accepted' : 'rejected', marketValue }
          : n
      )
    }));
    
    if (accepted) {
      setFreeAgentMessage({ player: player.name, accepted: true, isRenewal: true, marketValue });
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

const leagueData = gameState ? LEAGUES[gameState.league] : null;
const totalMatches = leagueData ? (leagueData.teams - 1) * 2 : 0;
const weeklyWages = gameState ? gameState.squad.reduce((sum, p) => sum + p.salary, 0) / 52 : 0;
const teamRating = gameState ? calculateTeamRating(gameState.squad) : 0;
const playerStanding = gameState ? gameState.standings.find(t => t.team === gameState.teamName) : null;

// Start Screen
if (view === 'start') {
  return (
    <div className="game-container">
      <div className="content-wrapper">
        <div className="start-screen">
          <h1 className="start-title">Road to the Premier League</h1>
          <p className="start-subtitle">Build your club from the National League to the top of English football</p>
          
          <div className="start-form">
            <h2 className="start-form-title">Create Your Club</h2>
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
                const name = teamNameInput.trim() || 'Your Club FC';
                initializeGame(name);
              }}
              className="btn btn-success btn-large btn-bold start-button"
            >
              Start Journey
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
            <button onClick={() => { setView('main'); setFreeAgentMessage(null); }} className="btn btn-secondary">
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
            {freeAgentMessage.marketValue && (
              <div className="message-details">
                {freeAgentMessage.accepted ? (
                  <span className="text-success">
                    Agreed Terms: £{(freeAgentMessage.marketValue / 1000).toFixed(0)}k/year
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
            <button onClick={() => setView('main')} className="btn btn-secondary">
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

        {gameState.matches.length > 0 && (
          <div className="matches-card">
            <h3 className="section-title">Recent Results</h3>
            <div className="matches-grid">
              {gameState.matches.slice(0, 10).map((match, index) => (
                <div 
                  key={index} 
                  className={`match-result ${
                    match.homeTeam === gameState.teamName || match.awayTeam === gameState.teamName 
                      ? 'match-player' 
                      : ''
                  }`}
                >
                  <div className="match-content">
                    <span className={match.homeTeam === gameState.teamName ? 'text-bold' : ''}>
                      {match.homeTeam}
                    </span>
                    <span className="match-score">{match.homeGoals} - {match.awayGoals}</span>
                    <span className={match.awayTeam === gameState.teamName ? 'text-bold' : ''}>
                      {match.awayTeam}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
                onClick={() => setGameState(prev => ({ ...prev, paused: !prev.paused }))}
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
            onClick={() => setView('freeagents')}
            className="btn btn-primary btn-bold"
          >
            <UserPlus size={20} />
            Free Agents
          </button>
          
          <button
            onClick={() => setView('standings')}
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
        </div>
      )}

      <div className="main-grid">
        {/* Recent Matches - Top during simulation */}
        {gameState.matches.length > 0 && gameState.seasonPhase === 'regular' && (
          <div className="matches-card full-width">
            <h2 className="section-title">Latest Results - Matchday {gameState.matchday}</h2>
            <div className="matches-grid-three">
              {gameState.matches.slice(0, 6).map((match, index) => {
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
              })}
            </div>
          </div>
        )}

        {/* Squad */}
        <div className="squad-card">
          <div className="squad-header">
            <h2 className="section-title">
              <Users size={24} /> Squad (Team Rating: {teamRating})
            </h2>
            <div className="squad-size">
              {gameState.squad.length}/25 players
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

          {/* Recent Matches */}
          {gameState.matches.length > 0 && (
            <div className="recent-matches-card">
              <h2 className="section-title">Recent Results</h2>
              <div className="recent-matches-list">
                {gameState.matches.slice(0, 5).map((match, index) => {
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
                    <div key={index} className={`recent-match ${resultClass}`}>
                      <div className="recent-match-content">
                        <span className={match.homeTeam === gameState.teamName ? 'text-bold' : ''}>
                          {match.homeTeam.length > 15 ? match.homeTeam.substring(0, 13) + '...' : match.homeTeam}
                        </span>
                        <span className="text-bold">{match.homeGoals} - {match.awayGoals}</span>
                        <span className={match.awayTeam === gameState.teamName ? 'text-bold' : ''}>
                          {match.awayTeam.length > 15 ? match.awayTeam.substring(0, 13) + '...' : match.awayTeam}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
};

export default FootballTycoon;