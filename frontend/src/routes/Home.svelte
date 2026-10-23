<script lang="ts">
  const pageTitle = "Home | Final Cut";
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<div
  class="flex flex-1 items-center justify-center bg-stone-200 m-1 rounded-md"
>
  <button
    class="rounded-md border-2 border-gray-400 bg-gray-300 p-2 flex gap-2"
    type="submit"
    ><svg
      xmlns="http://w3.org"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
    Create Room
  </button>
</div>
