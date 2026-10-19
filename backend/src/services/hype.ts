// Each player hands out exactly this many points.
const TOTAL_POINTS = 10;

// One player's points, like { "movieA": 3, "movieB": 7 }.
export type HypePoints = Record<string, number>;

// Checks one player's points. Returns an error message, or null if valid.
export function validateHypePoints(points: HypePoints, poolIds: string[]): string | null {
  let sum = 0;

  for (const movieId in points) {
    const value = points[movieId];

    if (!poolIds.includes(movieId)) {
      return "Movie " + movieId + " is not in this game";
    }

    if (!Number.isInteger(value) || value < 0) {
      return "Points must be whole numbers 0 or higher";
    }

    sum = sum + value;
  }

  if (sum !== TOTAL_POINTS) {
    return "Points must add up to exactly " + TOTAL_POINTS + ", got " + sum;
  }

  return null;
}

// Adds up every player's points for each movie.
export function totalHypePoints(allPoints: HypePoints[], poolIds: string[]): HypePoints {
  const totals: HypePoints = {};

  // Starts every movie at 0 so movies with no points still show up.
  for (const movieId of poolIds) {
    totals[movieId] = 0;
  }

  for (const points of allPoints) {
    for (const movieId in points) {
      // Skips movies that aren't in the pool.
      if (totals[movieId] !== undefined) {
        totals[movieId] = totals[movieId] + points[movieId];
      }
    }
  }

  return totals;
}