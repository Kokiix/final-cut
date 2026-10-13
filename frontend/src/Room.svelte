<script lang="ts">
  import { onMount } from "svelte";

  let { params = {} } = $props();

  $effect(() => {
    async function create_room() {
      let generatedID = await fetch("/api/create-room");
      generatedID
        .text()
        .then((roomCode) => window.location.replace(`#/room/${roomCode}`));
    }

    if (params.id == null) {
      create_room();
    }
  });
</script>

<h1>{params.id}</h1>
