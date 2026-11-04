<script lang="ts">
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import { joinRoom } from "../lib/rooms";

  const pageTitle = "Join Room | Final Cut";
  const length = 6;

  let form: HTMLFormElement;
  let inputs: HTMLInputElement[] = $state([]);
  let errorMessage = $state("");
  let loading = $state(false);

  onMount(() => inputs[0]?.focus());

  // Keeps only letters and makes them uppercase.
  function cleanLetters(text: string) {
    return text.replace(/[^a-zA-Z]/g, "").toUpperCase();
  }

  function onInput(e: Event, i: number) {
    const el = e.currentTarget as HTMLInputElement;
    el.value = cleanLetters(el.value);
    if (!el.value) return;
    if (i < length - 1) inputs[i + 1].focus();
    else if (inputs.every((input) => input.value)) form.requestSubmit();
  }

  function onKeydown(e: KeyboardEvent, i: number) {
    const el = inputs[i];

    if (e.key === "Backspace" && !el.value && i > 0) inputs[i - 1].focus();

    if (e.key === "ArrowLeft" && el.selectionStart === 0 && i > 0) {
      e.preventDefault();
      inputs[i - 1].focus();
    }
    if (e.key === "ArrowRight" && el.selectionEnd === el.value.length && i < length - 1) {
      e.preventDefault();
      inputs[i + 1].focus();
    }
  }

  function onPaste(e: ClipboardEvent) {
    e.preventDefault();
    const letters = cleanLetters(e.clipboardData?.getData("text") ?? "").slice(0, length);
    letters.split("").forEach((letter, i) => (inputs[i].value = letter));
    inputs[Math.min(letters.length, length - 1)].focus();
    if (letters.length === length) form.requestSubmit();
  }

  // Sends the code to the backend, then opens the waiting room.
  async function handleSubmit(e: SubmitEvent) {
    // stop the browser from reloading the page
    e.preventDefault();
    const code = inputs.map((input) => input.value).join("");

    errorMessage = "";
    loading = true;
    const res = await joinRoom(code);
    loading = false;

    if (!res.success || !res.gameRoom) {
      errorMessage = res.message ?? "Could not join the room.";
      return;
    }

    push("/room/" + res.gameRoom.code);
  }
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<div class="m-1 flex flex-1 items-center justify-center rounded-md bg-stone-200 p-4">
  <form
    bind:this={form}
    class="flex flex-col items-center gap-6"
    onpaste={onPaste}
    onsubmit={handleSubmit}
  >
    <p id="pin-label" class="text-sm font-medium tracking-wide text-slate-600">
      Enter your room code to join
    </p>

    <div class="flex gap-3" role="group" aria-labelledby="pin-label">
      {#each { length } as _, i}
        <input
          bind:this={inputs[i]}
          class="size-12 rounded-full border-2 border-gray-400 bg-stone-300/30 text-center text-lg font-semibold uppercase
                 text-neutral-700 outline-none transition
                 focus:border-orange-700 not-placeholder-shown:border-slate-600"
          type="text"
          inputmode="text"
          autocapitalize="characters"
          maxlength="1"
          placeholder=" "
          name={`letter${i + 1}`}
          aria-label={`Letter ${i + 1}`}
          autocomplete="off"
          oninput={(e) => onInput(e, i)}
          onkeydown={(e) => onKeydown(e, i)}
          onfocus={(e) => e.currentTarget.select()}
          onclick={(e) => e.currentTarget.select()}
          required
        />
      {/each}
    </div>

    {#if errorMessage}
      <p class="text-red-600">{errorMessage}</p>
    {/if}

    <button
      type="submit"
      disabled={loading}
      class="cursor-pointer rounded-lg bg-slate-700 px-8 py-2 font-semibold text-stone-100 hover:bg-neutral-800"
    >Join</button>
  </form>
</div>
