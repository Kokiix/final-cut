// How many films go into each game.
const POOL_SIZE = 12;

// Returns a shuffled copy of a list.
function shuffle<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

// Picks 12 films fairly from everyone's watchlists, then fills from the catalog.
export function buildPool(watchlists: string[][], catalogIds: string[]): string[] {
  const pool: string[] = [];

  // Shuffles each player's list and the player order so nobody is favored.
  const lists = shuffle(watchlists.map((list) => shuffle(list)));

  // Takes one film from each player in turn until the pool is full or lists run out.
  let addedOne = true;
  while (pool.length < POOL_SIZE && addedOne) {
    addedOne = false;

    for (const list of lists) {
      if (pool.length >= POOL_SIZE) {
        break;
      }

      // Skips films that are already in the pool.
      while (list.length > 0) {
        const movieId = list.shift();
        if (movieId && !pool.includes(movieId)) {
          pool.push(movieId);
          addedOne = true;
          break;
        }
      }
    }
  }

  // Fills any empty spots with random films from the catalog.
  for (const movieId of shuffle(catalogIds)) {
    if (pool.length >= POOL_SIZE) {
      break;
    }
    if (!pool.includes(movieId)) {
      pool.push(movieId);
    }
  }

  return pool;
}