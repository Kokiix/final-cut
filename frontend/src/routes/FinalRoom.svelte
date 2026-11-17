<script lang="ts">
  import { onMount } from "svelte";
  import { push, replace } from "svelte-spa-router";
  import MovieCard from "../components/MovieCard.svelte";
  import { getRoom, voteFinal, type GameRoom } from "../lib/rooms";

  let { params }: { params: { code: string } } = $props();

  let room = $state<GameRoom | null>(null);
  let errorMessage = $state("");
  let voteError = $state("");
  let voting = $state(false);
  let inFlight = false;
  let mounted = true;

  const REFRESH_MS = 2000;
  let final = $derived(room?.final ?? null);

  async function loadRoom() {
    if (inFlight) return;
    inFlight = true;
    const res = await getRoom(params.code);
    inFlight = false;

    if (!mounted) return;

    if (!res.success || !res.gameRoom) {
      errorMessage = res.message ?? "Could not load the room.";
      return;
    }

    if (res.gameRoom.currentRound !== "final") {
      replace(
        res.gameRoom.currentRound === "hype"
          ? "/room/" + params.code + "/hype"
          : "/room/" + params.code
      );
      return;
    }

    errorMessage = "";
    room = res.gameRoom;
    voteError = "";
  }

  async function handleVote(movieId: string) {
    if (voting || !final?.can_vote) return;

    voteError = "";
    voting = true;
    const res = await voteFinal(params.code, movieId);
    voting = false;

    if (!res.success) {
      voteError = res.message ?? "Could not submit your vote.";
      return;
    }

    if (res.gameRoom) room = res.gameRoom;
  }

  function handleLeave() {
    push("/");
  }

  onMount(() => {
    loadRoom();
    const timer = setInterval(loadRoom, REFRESH_MS);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  });
</script>

<svelte:head>
  <title>Final Cut {params.code} | Final Cut</title>
</svelte:head>

<div class="m-1 flex flex-1 flex-col items-center justify-center rounded-md bg-stone-200 p-6">
  {#if errorMessage}
    <p class="m-auto text-lg text-red-600">{errorMessage}</p>
  {:else if !room || !final}
    <p class="m-auto text-lg text-slate-600">Loading...</p>
  {:else}
    <section class="w-full max-w-3xl text-center">
      <p class="text-xs font-semibold tracking-widest text-orange-700 uppercase">
        Room {params.code.toUpperCase()}
      </p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight">
        {final.finished ? "The winner is..." : "Final Cut"}
      </h1>
      {#if !final.finished}
        <p class="mt-2 text-neutral-500">
          {#if final.can_vote}
            Choose the movie you want to win.
          {:else}
            {final.submitted} of {final.required} votes are in.
          {/if}
        </p>
      {/if}

      {#if voteError}
        <p class="mt-4 rounded-lg bg-red-100 px-4 py-2 text-red-700">{voteError}</p>
      {/if}

      <div class="mx-auto mt-8 grid max-w-xl grid-cols-2 gap-4 sm:gap-8">
        {#each final.finalists as movie (movie._id)}
          <div class="rounded-2xl bg-stone-100 p-3 shadow-sm sm:p-5">
            {#if final.can_vote}
              <button
                type="button"
                onclick={() => handleVote(movie._id)}
                disabled={voting}
                aria-label={"Vote for " + movie.title}
                class="w-full cursor-pointer rounded-md text-left transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <MovieCard {movie} />
              </button>
            {:else}
              <MovieCard {movie} />
            {/if}
            {#if final.finished}
              <p class="mt-3 text-sm font-semibold text-slate-700">
                {final.votes.find((row) => row.movie._id === movie._id)?.votes ?? 0} votes
              </p>
            {/if}
          </div>
        {/each}
      </div>

      {#if final.finished}
        <p class="mt-6 text-xl font-bold text-orange-700">{final.winner?.title}</p>
        <button
          type="button"
          onclick={handleLeave}
          class="mt-6 cursor-pointer rounded-lg border-2 border-slate-700 px-6 py-2 font-semibold text-slate-700 hover:bg-stone-100"
        >Back home</button>
      {:else if !final.can_vote}
        <p class="mt-6 text-sm text-neutral-500">Your vote is locked in. Waiting for the other players...</p>
      {/if}
    </section>
  {/if}
</div>
