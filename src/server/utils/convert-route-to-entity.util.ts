const mapping: Record<string, string> = {
  academies: 'academy',
  'development-plans': 'development_plan',
  players: 'player',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
