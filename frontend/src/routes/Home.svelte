<script lang="ts">
  const pageTitle = "Home | Final Cut";
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<div
  class="m-1 flex flex-1 items-center justify-center rounded-md bg-stone-200 p-4"
>
  <button
    class="flex cursor-pointer items-center justify-center gap-2 bg-slate-600 px-8 py-3 font-medium text-stone-200 transition
           hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2
           focus-visible:outline-orange-700"
    type="submit"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-5"
      aria-hidden="true"
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
