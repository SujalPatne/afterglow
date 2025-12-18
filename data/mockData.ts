import { Attendee, Match, MatchStatus, Outcome, Role } from '../types';

const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Avery', 'Quinn', 'Sam', 'Dakota', 'Reese'];
const LAST_NAMES = ['Chen', 'Smith', 'Gupta', 'Rivera', 'Kim', 'Patel', 'Wu', 'Johnson', 'Davis', 'Rodriguez', 'Martinez'];
const COMPANIES = ['Acme AI', 'Nebula', 'Vertex', 'Horizon', 'BlueChip', 'Elevate', 'Synthetix', 'Orbit', 'Flow', 'Spark'];
const ROLES: Role[] = ['Founder', 'Investor', 'Hiring Manager', 'Operator', 'Media'];

const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateData = (count: number = 100) => {
  const attendees: Attendee[] = Array.from({ length: count }).map((_, i) => {
    const role = Math.random() > 0.7 ? 'Investor' : (Math.random() > 0.4 ? 'Founder' : randomItem(ROLES));
    return {
      id: `att-${i}`,
      name: `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`,
      company: randomItem(COMPANIES),
      role: role as Role,
      avatar: `https://picsum.photos/seed/${i}/64/64`,
      clusterId: ROLES.indexOf(role as Role),
    };
  });

  const matches: Match[] = [];
  const outcomes: Outcome[] = [];

  // Generate matches with realistic funnel distribution
  // 30% suggested -> 20% accepted -> 10% scheduled -> 5% held -> 2% outcome
  for (let i = 0; i < count; i++) {
    const source = attendees[i];
    // Each person matches with 3-8 others
    const matchCount = randomInt(3, 8);
    
    for (let j = 0; j < matchCount; j++) {
      const target = attendees[randomInt(0, count - 1)];
      if (source.id === target.id) continue;
      
      const exists = matches.find(m => (m.sourceId === source.id && m.targetId === target.id) || (m.sourceId === target.id && m.targetId === source.id));
      if (exists) continue;

      const rand = Math.random();
      let status = MatchStatus.SUGGESTED;
      let notes = '';

      if (rand > 0.3) status = MatchStatus.ACCEPTED;
      if (rand > 0.5) status = MatchStatus.SCHEDULED;
      if (rand > 0.7) status = MatchStatus.HELD;
      if (rand > 0.9) {
        status = MatchStatus.OUTCOME_LOGGED;
        outcomes.push({
          id: `out-${matches.length}`,
          matchId: `match-${matches.length}`,
          type: Math.random() > 0.5 ? 'Partnership' : 'Investment',
          value: Math.random() > 0.7 ? '$50k - $100k' : undefined,
          notes: 'Promising discussion regarding seed round participation.',
          sentiment: 'Positive',
          nextStepDate: '2024-06-01'
        });
      }

      matches.push({
        id: `match-${matches.length}`,
        sourceId: source.id,
        targetId: target.id,
        status,
        lastActivity: new Date(Date.now() - randomInt(0, 100000000)).toISOString(),
        confidenceScore: Math.floor(Math.random() * 40) + 60,
        notes: status === MatchStatus.SUGGESTED ? '' : 'Discussed initial synergy.',
        timeline: [
          { date: new Date().toISOString(), type: 'status_change', description: `Status updated to ${status}` }
        ]
      });
    }
  }

  return { attendees, matches, outcomes };
};
