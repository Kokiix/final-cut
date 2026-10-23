<script lang="ts">
  const pageTitle = "Sign up | Final Cut";
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<div
  class="flex flex-1 items-center justify-center bg-stone-200 m-1 rounded-md"
>
  <div
    class="flex aspect-square w-md flex-col items-center justify-center gap-4 bg-stone-300 p-6"
  >
    <div class="flex w-full gap-4">
      <input
        class="w-full rounded-sm border-2 border-gray-400 p-2"
        type="text"
        placeholder="First Name"
        name="firstname"
        required
      />
      <input
        class="w-full rounded-sm border-2 border-gray-400 p-2"
        type="text"
        placeholder="Last Name"
        name="lastname"
        required
      />
    </div>

    <input
      class="w-full rounded-sm border-2 border-gray-400 p-2"
      type="text"
      placeholder="Username"
      name="username"
      required
    />
    <input
      class="w-full rounded-sm border-2 border-gray-400 p-2"
      type="email"
      placeholder="Email"
      name="email"
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
      type="submit">Sign up</button
    >
  </div>
</div>
