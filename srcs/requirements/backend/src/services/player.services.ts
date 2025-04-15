import { Match, MatchMode } from '@prisma/client';

export function getPlayerClassicStats(matches: Match[], playerId: string) {
  const classicMatches = matches.filter((match) => match.mode === MatchMode.CLASSIC);
  const totalMatches = classicMatches.length;
  const wins = classicMatches.filter((match) => match.winnerId === playerId).length;
  const losses = totalMatches - wins;

  return {
    totalMatches,
    wins,
    losses,
    winRate: parseFloat(((wins / totalMatches) * 100).toFixed(2)) || 0,
    points: wins * 3 + losses, // Assuming 3 points for a win and 1 for a loss
  };
}

export function getPlayerCustomStats(matches: Match[], playerId: string) {
  const customMatches = matches.filter((match) => match.mode === MatchMode.CUSTOM);
  const totalMatches = customMatches.length;
  const wins = customMatches.filter((match) => match.winnerId === playerId).length;
  const losses = totalMatches - wins;

  return {
    totalMatches,
    wins,
    losses,
    winRate: parseFloat(((wins / totalMatches) * 100).toFixed(2)) || 0,
    points: wins * 3 + losses, // Assuming 3 points for a win and 1 for a loss
  };
}
