<script lang="ts">
  import { auth } from "../lib/auth.svelte";
  import { updateProfile, getCompletedGames, type CompletedGame } from "../lib/profile";

  const pageTitle = "Profile | Final Cut";

  // the form starts with what we already know about the user
  let form = $state({
    name: auth.user?.name ?? "",
    username: auth.user?.username ?? "",
    email: auth.user?.email ?? "",
  });
  let saving = $state(false);
  let message = $state("");
  let error = $state("");

  let games = $state<CompletedGame[]>([]);
  let gamesLoading = $state(true);
  let gamesError = $state("");

  // only enable save when something actually changed
  const changed = $derived(
    !!auth.user &&
      (form.name !== auth.user.name || form.username !== auth.user.username || form.email !== auth.user.email),
  );

  async function loadGames() {
    const res = await getCompletedGames();
    gamesLoading = false;
    if (res.success) {
      games = res.gameRooms ?? [];
    } else {
      gamesError = res.message ?? "Could not load your games.";
    }
  }
  loadGames();

  async function handleSave(event: SubmitEvent) {
    event.preventDefault();
    saving = true;
    message = "";
    error = "";

    const res = await updateProfile(form);
    saving = false;

    if (res.success && res.user) {
      // update the nav right away, and sync the form with what the backend saved (e.g. lowercase username)
      auth.user = res.user;
      form = { name: res.user.name, username: res.user.username, email: res.user.email };
      message = "Profile saved.";
    } else {
      error = res.message ?? "Could not save your profile.";
    }
  }

  const fields = [
    { key: "name", label: "Name", type: "text" },
    { key: "username", label: "Username", type: "text" },
    { key: "email", label: "Email", type: "email" },
  ] as const;
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<div class="m-1 flex flex-1 flex-col items-center gap-10 rounded-md bg-stone-200 p-6">
  <!-- default avatar, static for now -->
  <div
    class="flex size-32 items-center justify-center rounded-full bg-[#B87458] text-stone-100 shadow-md"
    aria-label="Profile picture"
  >
    <svg viewBox="0 0 24 24" fill="currentColor" class="size-20" aria-hidden="true">
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.76-3.58-5-8-5Z" />
    </svg>
  </div>

  <form onsubmit={handleSave} class="flex w-full max-w-md flex-col gap-4">
    {#each fields as field (field.key)}
      <label class="flex flex-col gap-1">
        <span class="text-sm font-medium">{field.label}</span>
        <input
          type={field.type}
          bind:value={form[field.key]}
          required
          class="rounded-md border border-stone-300 bg-white px-3 py-2 focus:border-[#B87458] focus:outline-none"
        />
      </label>
    {/each}

    {#if error}
      <p class="text-sm text-red-600">{error}</p>
    {:else if message}
      <p class="text-sm text-green-700">{message}</p>
    {/if}

    <button
      type="submit"
      disabled={!changed || saving}
      class="cursor-pointer rounded-md bg-[#B87458] px-4 py-2 font-medium text-stone-100 transition hover:bg-[#a5654b] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {saving ? "Saving..." : "Save"}
    </button>
  </form>

  <section class="w-full max-w-3xl">
    <h2 class="mb-4 text-2xl font-bold tracking-tight">Your games</h2>

    {#if gamesLoading}
      <p class="text-slate-600">Loading...</p>
    {:else if gamesError}
      <p class="text-red-600">{gamesError}</p>
    {:else if !games.length}
      <p class="text-slate-600">No finished games yet.</p>
    {:else}
      <table class="w-full text-left">
        <thead class="border-b border-stone-300 text-sm text-slate-600">
          <tr>
            <th class="py-2 pr-4 font-medium">Players</th>
            <th class="py-2 pr-4 font-medium">Host</th>
            <th class="py-2 font-medium">Winner</th>
          </tr>
        </thead>
        <tbody>
          {#each games as game (game._id)}
            <tr class="border-b border-stone-300/60">
              <td class="py-3 pr-4">{game.players.length}</td>
              <td class="py-3 pr-4">{game.host?.username ?? "—"}</td>
              <td class="py-3">
                <a href="#/movie/{game.winner._id}" class="flex items-center gap-3 hover:underline">
                  {#if game.winner.posterUrl}
                    <img src={game.winner.posterUrl} alt="{game.winner.title} poster" class="h-16 aspect-2/3 rounded object-cover" />
                  {:else}
                    <div class="flex h-16 aspect-2/3 items-center justify-center rounded bg-stone-300 text-xs text-slate-500">?</div>
                  {/if}
                  <span class="font-medium">{game.winner.title}</span>
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </section>
</div>
