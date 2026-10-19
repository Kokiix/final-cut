<script lang="ts">
  import { push } from "svelte-spa-router";
  import { signup } from "../lib/api";

  let firstName = $state("");
  let lastName = $state("");
  let username = $state("");
  let email = $state("");
  let password = $state("");
  let errorMessage = $state("");
  let loading = $state(false);

  async function handleSubmit(e: SubmitEvent) {
    // stop the browser from reloading the page
    e.preventDefault();
    errorMessage = "";
    loading = true;

    // backend only has one `name` field
    const name = `${firstName.trim()} ${lastName.trim()}`;
    const res = await signup({ name, username, email, password });
    loading = false;

    if (!res.success) {
      errorMessage = res.message ?? "Sign up failed.";
      return;
    }

    push("/login");
  }
</script>

<div class="flex h-svh w-full items-center justify-center bg-gray-100">
  <form
    class="flex aspect-square w-md flex-col items-center justify-center gap-4 bg-gray-200 p-6"
    onsubmit={handleSubmit}
  >
    <div class="flex w-full gap-4">
      <input
        class="w-full rounded-sm border-2 border-gray-400 p-2"
        type="text"
        placeholder="First Name"
        name="firstname"
        bind:value={firstName}
        required
      />
      <input
        class="w-full rounded-sm border-2 border-gray-400 p-2"
        type="text"
        placeholder="Last Name"
        name="lastname"
        bind:value={lastName}
        required
      />
    </div>

    <input
      class="w-full rounded-sm border-2 border-gray-400 p-2"
      type="text"
      placeholder="Username"
      name="username"
      bind:value={username}
      required
    />
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
      minlength="8"
      bind:value={password}
      required
    />

    {#if errorMessage}
      <p class="text-red-600">{errorMessage}</p>
    {/if}

    <button
      class="rounded-md border-2 border-gray-400 bg-gray-300 p-2"
      type="submit"
      disabled={loading}>Sign up</button
    >
  </form>
</div>
