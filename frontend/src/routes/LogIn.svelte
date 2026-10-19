<script lang="ts">
  import { push } from "svelte-spa-router";
  import { login } from "../lib/auth.svelte";

  let email = $state("");
  let password = $state("");
  let errorMessage = $state("");
  let loading = $state(false);

  async function handleSubmit(e: SubmitEvent) {
    // stop the browser from reloading the page
    e.preventDefault();
    errorMessage = "";
    loading = true;

    // also sets auth.user, so the nav shows the user right away
    const res = await login({ email, password });
    loading = false;

    if (!res.success) {
      errorMessage = res.message ?? "Log in failed.";
      return;
    }

    push("/");
  }
</script>

<div class="flex h-svh w-full items-center justify-center bg-gray-100">
  <form
    class="flex aspect-square w-md flex-col items-center justify-center gap-4 bg-gray-200 p-6"
    onsubmit={handleSubmit}
  >
    <input
      class="w-full rounded-sm border-2 border-gray-400 p-2"
      type="email"
      placeholder="Email"
      name="email"
      bind:value={email}
      required
    />
    <input
      class="w-full rounded-sm border-2 border-gray-400 p-2"
      type="password"
      placeholder="Password"
      name="password"
      bind:value={password}
      required
    />

    {#if errorMessage}
      <p class="text-red-600">{errorMessage}</p>
    {/if}

    <button
      class="rounded-md border-2 border-gray-400 bg-gray-300 p-2"
      type="submit"
      disabled={loading}>Log in</button
    >
  </form>
</div>
