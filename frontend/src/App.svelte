<script lang="ts">
  import Router, { push } from "svelte-spa-router";
  import Home from "./routes/Home.svelte";
  import SignUp from "./routes/SignUp.svelte";
  import LogIn from "./routes/LogIn.svelte";
  import Join from "./routes/Join.svelte";
  import WatchList from "./routes/WatchList.svelte";
  import Search from "./routes/Search.svelte";
  import SearchBar from "./components/SearchBar.svelte";
  import { auth, loadUser, logOut } from "./lib/auth.svelte";

  const routes = {
    "/": Home,
    "/signup": SignUp,
    "/login": LogIn,
    "/join": Join,
    "/watchlist": WatchList,
    "/search": Search,
  };

  // on page load/refresh, check if the cookie still logs us in
  loadUser();

  async function handleLogOut() {
    await logOut();
    push("/login");
  }
</script>

<div class="bg-[#B87458] h-svh w-full flex flex-col text-neutral-700">
  <nav class="w-full h-11 flex items-center gap-6 pl-10 font-medium">
    <a
      href="#/"
      class="rounded-md p-1 w-28 text-center transition-colors hover:bg-stone-200"
      >Home</a
    >

    {#if auth.user}
      <span>Hi, {auth.user.username}</span>
      <button
        type="button"
        onclick={handleLogOut}
        class="rounded-md p-1 text-center transition-colors hover:bg-stone-200"
        >Log out</button
      >
    {:else}
      <a
        href="#/signup"
        class="rounded-md p-1 w-28 text-center transition-colors hover:bg-stone-200"
        >Sign up</a
      >
      <a
        href="#/login"
        class="rounded-md p-1 w-28 text-center transition-colors hover:bg-stone-200"
        >Log in</a
      >
    {/if}

    <a
      href="#/join"
      class="rounded-md p-1 w-28 text-center transition-colors hover:bg-stone-200"
      >Join Game</a
    >
    <a
      href="#/watchlist"
      class="rounded-md p-1 w-28 text-center transition-colors hover:bg-stone-200"
      >Watchlist</a
    >
    <a
      href="#/search"
      class="rounded-md p-1 w-28 text-center transition-colors hover:bg-stone-200"
      >Search</a
    >
    <SearchBar />
  </nav>

  <main class="flex-1 min-h-0 flex flex-col">
    <Router {routes} />
  </main>
</div>
