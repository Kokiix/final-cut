<script lang="ts">
  import MovieCard from "../lib/MovieCard.svelte";
  import { searchMovies, GENRES, type Movie } from "../lib/movies";

  let query = $state("");
  let genre = $state("");
  let movies = $state<Movie[]>([]);
  let errorMessage = $state("");
  let loading = $state(false);

  // Asks the backend for movies that match the search.
  async function runSearch() {
    errorMessage = "";
    loading = true;

    const res = await searchMovies(query, genre);
    loading = false;

    if (!res.success) {
      errorMessage = res.message ?? "Search failed.";
      movies = [];
      return;
    }

    movies = res.movies ?? [];
  }

  // Runs when the form is submitted.
  function handleSubmit(e: SubmitEvent) {
    // stop the browser from reloading the page
    e.preventDefault();
    runSearch();
  }

  // Shows popular movies when the page first opens.
  runSearch();
</script>

<div class="min-h-svh w-full bg-gray-100 p-6">
  <form class="mx-auto flex max-w-4xl flex-wrap gap-4" onsubmit={handleSubmit}>
    <input
      class="min-w-0 flex-1 rounded-sm border-2 border-gray-400 p-2"
      type="text"
      placeholder="Search movies by title"
      bind:value={query}
    />

    <select
      class="rounded-sm border-2 border-gray-400 p-2"
      bind:value={genre}
      onchange={runSearch}
    >
      <option value="">All genres</option>
      {#each GENRES as g}
        <option value={g}>{g}</option>
      {/each}
    </select>

    <button
      class="rounded-md border-2 border-gray-400 bg-gray-300 px-4 py-2"
      type="submit"
      disabled={loading}>Search</button
    >
  </form>

  <div class="mx-auto mt-6 max-w-6xl">
    {#if loading}
      <p class="text-gray-600">Loading...</p>
    {:else if errorMessage}
      <p class="text-red-600">{errorMessage}</p>
    {:else if movies.length === 0}
      <p class="text-gray-600">No movies found.</p>
    {:else}
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {#each movies as movie (movie._id)}
          <MovieCard {movie} />
        {/each}
      </div>
    {/if}
  </div>
</div>