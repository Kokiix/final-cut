<script lang="ts">
  type Result = {
    tmdbId: number;
    title: string;
    posterUrl: string | null;
    releaseDate?: string;
  };

  let query = $state("");
  let focused = $state(false);
  let results: Result[] = $state([]);
  let input: HTMLInputElement;

  const open = $derived(focused || !!query);

  // Debounced fetch; cleanup cancels the timer and any in-flight request
  $effect(() => {
    if (!focused) return;
    const q = query.trim();
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const url = q
          ? `/api/search?q=${encodeURIComponent(q)}`
          : "/api/search/top";
        const res = await fetch(url, { signal: ctrl.signal });
        results = (await res.json()).slice(0, 8);
      } catch {}
    }, 200);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  });

  function done() {
    query = "";
    input.blur();
  }
</script>

<div class="relative flex items-center">
  <button
    type="button"
    aria-label="Search"
    class="rounded-md p-1"
    onmousedown={(e) => e.preventDefault()}
    onclick={() => input.focus()}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  </button>

  <input
    bind:this={input}
    bind:value={query}
    onfocus={() => (focused = true)}
    onblur={() => (focused = false)}
    onkeydown={(e) => e.key === "Escape" && done()}
    placeholder="Search..."
    autocomplete="off"
    class="overflow-hidden rounded-md bg-stone-200 py-1 outline-none transition-all duration-300
      {open ? 'ml-1 w-48 px-2 opacity-100' : 'w-0 px-0 opacity-0'}"
  />

  {#if focused && results.length}
    <ul
      class="absolute right-0 top-full z-10 mt-1 w-72 rounded-md bg-stone-100 py-1 shadow-lg"
    >
      {#each results as r (r.tmdbId)}
        <li>
          <a
            href="#/movie/{r.tmdbId}"
            onmousedown={(e) => e.preventDefault()}
            onclick={done}
            class="flex items-center gap-3 px-3 py-1.5 hover:bg-stone-200"
          >
            <img
              src={r.posterUrl}
              alt=""
              class="h-10 w-7 rounded-sm bg-stone-300 object-cover"
            />
            <span class="flex-1 truncate">{r.title}</span>
            {#if r.releaseDate}
              <span class="text-xs text-neutral-500"
                >{r.releaseDate.slice(0, 4)}</span
              >
            {/if}
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</div>
