<script lang="ts">
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import { getRoom, leaveRoom, type GameRoom } from "../lib/rooms";
  import { auth } from "../lib/auth.svelte";

  // svelte-spa-router passes the room code from /room/:code
  let { params }: { params: { code: string } } = $props();

  let room = $state<GameRoom | null>(null);
  let errorMessage = $state("");

  // How often the page checks for new players, in milliseconds.
  const REFRESH_MS = 2000;

  // Gets the latest room info from the backend.
  async function loadRoom() {
    const res = await getRoom(params.code);
    if (!res.success || !res.gameRoom) {
      errorMessage = res.message ?? "Could not load the room.";
      return;
    }
    errorMessage = "";
    room = res.gameRoom;
  }

  // Leaves the room and goes back home.
  async function handleLeave() {
    await leaveRoom(params.code);
    push("/");
  }

  // Loads the room now, then every 2 seconds so new players show up.
  onMount(() => {
    loadRoom();
    const timer = setInterval(loadRoom, REFRESH_MS);
    // Stops the timer when the user leaves this page.
    return () => clearInterval(timer);
  });
</script>

<svelte:head>
  <title>Room | Final Cut</title>
</svelte:head>

<div class="m-1 flex flex-1 items-center justify-center rounded-md bg-stone-200 p-4">
  <section class="w-full max-w-md rounded-3xl bg-stone-100 p-8 shadow-lg">
    <div class="text-center">
      <p class="text-xs font-semibold tracking-widest text-orange-700 uppercase">Room code</p>
      <p class="mt-1 text-3xl font-extrabold tracking-[0.35em]">{params.code.toUpperCase()}</p>
    </div>

    {#if errorMessage}
      <p class="mt-6 text-center text-red-600">{errorMessage}</p>
    {/if}

    {#if room}
      <div class="mt-8 flex items-baseline justify-between">
        <h1 class="text-xs font-semibold tracking-widest text-slate-600 uppercase">Players</h1>
        <p class="text-sm text-neutral-500">{room.players.length} in the room</p>
      </div>

      <ul class="mt-3 flex flex-col gap-2">
        {#each room.players as player (player._id)}
          <li class="flex items-center gap-3 rounded-2xl bg-stone-200 px-3 py-2.5">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-stone-100 uppercase">
              {player.username.slice(0, 1)}
            </span>
            <span class="font-medium">
              {player.username}
              {#if auth.user && auth.user._id === player._id}(you){/if}
            </span>
            {#if room.host._id === player._id}
              <span class="ml-auto rounded-full bg-orange-700/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-orange-700 uppercase">host</span>
            {/if}
          </li>
        {/each}
      </ul>

      <p class="mt-8 flex items-center justify-center gap-2 text-sm text-neutral-500">
        <span class="size-2 animate-pulse rounded-full bg-orange-700"></span>
        Waiting for the host to start...
      </p>
    {/if}

    <button
      type="button"
      onclick={handleLeave}
      class="mt-6 w-full cursor-pointer rounded-lg border-2 border-slate-700 py-2 font-semibold text-slate-700 hover:bg-stone-200"
    >Leave room</button>
  </section>
</div>
