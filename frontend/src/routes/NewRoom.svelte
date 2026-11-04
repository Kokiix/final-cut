<script lang="ts">
  import { replace } from "svelte-spa-router";
  import { createRoom } from "../lib/rooms";

  let errorMessage = $state("");

  // Makes a new room, then opens its waiting room.
  async function makeRoom() {
    const res = await createRoom();
    if (!res.success || !res.gameRoom) {
      errorMessage = res.message ?? "Could not create a room.";
      return;
    }
    // replace instead of push so the back button doesn't make another room
    replace("/room/" + res.gameRoom.code);
  }

  // Runs once when the page opens.
  makeRoom();
</script>

<svelte:head>
  <title>New Room | Final Cut</title>
</svelte:head>

<div class="m-1 flex flex-1 items-center justify-center rounded-md bg-stone-200 p-4">
  {#if errorMessage}
    <p class="text-red-600">{errorMessage}</p>
  {:else}
    <p class="text-neutral-600">Creating your room...</p>
  {/if}
</div>
