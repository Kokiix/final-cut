<script lang="ts">
  const movie = {
    tmdbId: 603,
    title: "The Matrix",
    overview:
      "lorem ipsum dolor sit amet consectetur adipiscing elit elit consequat nulla quo sit quibusdam consectetur similique est ut expedita eu dolorem optio nostrud cupidatat ullamco elit soluta velit culpa sunt irure harum nihil quod cillum expedita laborum rerum tempor qui ut sint laborum temporibus minim est autem dignissimos occaecat est",
    releaseDate: new Date("1999-03-31"),
    genres: ["Action", "Science Fiction"],
    posterUrl: null as string | null,
    rating: 8.2,
    voteCount: 25000,
  };

  const year = movie.releaseDate.getFullYear();
  const votes = new Intl.NumberFormat().format(movie.voteCount);
</script>

<div
  class="flex flex-1 items-center justify-center bg-slate-600 rounded-md m-1"
>
  <div
    class="flex gap-10 p-10 bg-slate-900 text-slate-100 rounded-xl shadow-2xl w-3/4 aspect-video"
  >
    {#if movie.posterUrl}
      <img
        alt="{movie.title} poster"
        src={movie.posterUrl}
        class="h-full aspect-2/3 object-cover rounded-lg shadow-lg"
      />
    {:else}
      <div
        class="h-full aspect-2/3 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 text-base"
      >
        No poster
      </div>
    {/if}
    <div class="flex flex-col justify-center gap-5 min-w-0">
      <div>
        <h1 class="text-5xl font-bold tracking-tight">{movie.title}</h1>
        <p class="text-slate-400 text-lg mt-2">{year}</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-amber-400 text-2xl">★</span>
        <span class="text-3xl font-semibold">{movie.rating.toFixed(1)}</span>
        <span class="text-slate-400 text-base">/ 10 · {votes} votes</span>
      </div>
      <div class="flex flex-wrap gap-2">
        {#each movie.genres as genre}
          <span
            class="px-4 py-1.5 rounded-full bg-red-900/60 text-red-200 text-base"
          >
            {genre}
          </span>
        {/each}
      </div>
      <p
        class="text-slate-300 text-lg leading-relaxed text-pretty max-w-prose line-clamp-5"
      >
        {movie.overview}
      </p>
    </div>
  </div>
</div>
