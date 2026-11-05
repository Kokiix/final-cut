<script lang="ts">
  import { onMount } from "svelte";
  import { push, replace } from "svelte-spa-router";
  import MovieCard from "../components/MovieCard.svelte";
  import { getRoom, leaveRoom, type GameRoom } from "../lib/rooms";

  // svelte-spa-router passes the room code from /room/:code/ban
  let { params }: { params: { code: string } } = $props();

  let room = $state<GameRoom | null>(null);
  let errorMessage = $state("");

  // Gets the room and its movie pool from the backend.
  async function loadRoom() {
    const res = await getRoom(params.code);
    if (!res.success || !res.gameRoom) {
      errorMessage = res.message ?? "Could not load the room.";
      return;
    }

    // The game hasn't started, so there's no pool to show yet.
    if (res.gameRoom.status === "lobby") {
      replace("/room/" + params.code);
      return;
    }
    room = res.gameRoom;
  }

  // Leaves the room and goes back home.
  async function handleLeave() {
    await leaveRoom(params.code);
    push("/");
  }

  onMount(loadRoom);
</script>

<svelte:head>
  <title>Ban Room {params.code} | Final Cut</title>
</svelte:head>

<div class="m-1 flex flex-1 flex-col rounded-md bg-stone-200 p-6">
  {#if errorMessage}
    <p class="m-auto text-lg text-red-600">{errorMessage}</p>
  {:else if !room}
    <p class="m-auto text-lg text-slate-600">Loading...</p>
  {:else}
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="text-xs font-semibold tracking-widest text-orange-700 uppercase">Room {params.code.toUpperCase()}</p>
        <h1 class="text-3xl font-bold tracking-tight">Ban room</h1>
        <p class="mt-1 text-sm text-neutral-500">{room.remaining_movies.length} movies in the pool</p>
      </div>
      <button
        type="button"
        onclick={handleLeave}
        class="cursor-pointer rounded-lg border-2 border-slate-700 px-6 py-2 font-semibold text-slate-700 hover:bg-stone-100"
      >Leave room</button>
    </div>

    <ul class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {#each room.remaining_movies as movie (movie._id)}
        <li>
          <MovieCard {movie} />
        </li>
      {/each}
    </ul>
  {/if}
</div>
