<script lang="ts">
  const pageTitle = "Log in | Final Cut";
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<div
  class="flex flex-1 items-center justify-center bg-stone-200 rounded-md m-1"
>
  <div
    class="flex aspect-square w-md flex-col items-center justify-center gap-4 bg-stone-300 p-6"
  >
    <input
      class="w-full rounded-sm border-2 border-gray-400 p-2"
      type="text"
      placeholder="Username"
      name="username"
      required
    />
    <input
      class="w-full rounded-sm border-2 border-gray-400 p-2"
      type="password"
      placeholder="Password"
      name="password"
      required
    />

    <button
      class="rounded-md border-2 border-gray-400 bg-gray-300 p-2"
      type="submit">Log in</button
    >
  </div>
</div>
