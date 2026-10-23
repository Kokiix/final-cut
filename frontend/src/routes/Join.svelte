<script lang="ts">
  import { onMount } from "svelte";

  const pageTitle = "Join Room | Final Cut";

  onMount(() => {
    const inputs = document.querySelectorAll<HTMLInputElement>(
      ".pin-container input",
    );

    inputs.forEach((input, index) => {
      input.addEventListener("input", () => {
        if (input.value && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      });

      input.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Backspace" && !input.value && index > 0) {
          inputs[index - 1].focus();
        }
      });

      input.addEventListener("paste", (e: ClipboardEvent) => {
        const input = e.clipboardData?.getData("text") ?? "";
        for (let i = 0; i < input.length && index + i < inputs.length; i++) {
          inputs[index + i].value = input[i];
        }
      });
    });
  });
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<div
  class="flex flex-1 items-center justify-center bg-stone-200 m-1 rounded-md"
>
  <div
    class="pin-container flex items-center justify-center gap-4 bg-stone-300 p-6"
  >
    <input
      class="w-10 aspect-square rounded-full bg-gray-400 text-center"
      maxlength="1"
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      name="pin1"
      required
    />
    <input
      class="w-10 aspect-square rounded-full bg-gray-400 text-center"
      maxlength="1"
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      name="pin2"
      required
    />
    <input
      class="w-10 aspect-square rounded-full bg-gray-400 text-center"
      maxlength="1"
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      name="pin3"
      required
    />
    <input
      class="w-10 aspect-square rounded-full bg-gray-400 text-center"
      maxlength="1"
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      name="pin4"
      required
    />
    <input
      class="w-10 aspect-square rounded-full bg-gray-400 text-center"
      maxlength="1"
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      name="pin5"
      required
    />
    <input
      class="w-10 aspect-square rounded-full bg-gray-400 text-center"
      maxlength="1"
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      name="pin6"
      required
    />
  </div>
</div>
