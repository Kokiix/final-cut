<script lang="ts">
  import Router, { push } from "svelte-spa-router";
  import Home from "./routes/Home.svelte";
  import SignUp from "./routes/SignUp.svelte";
  import LogIn from "./routes/LogIn.svelte";
  import Join from "./routes/Join.svelte";
  import WatchList from "./routes/WatchList.svelte";
  import Search from "./routes/Search.svelte";
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

<nav class="w-full h-8 flex items-center gap-8 pl-10 bg-black text-white">
  <a href="#/">Home</a>
  {#if auth.user}
    <span>Hi, {auth.user.username}</span>
    <button onclick={handleLogOut}>Log out</button>
  {:else}
    <a href="#/signup">Sign up</a>
    <a href="#/login">Log in</a>
  {/if}
  <a href="#/join">Join Game</a>
  <a href="#/watchlist">Watchlist</a>
  <a href="#/search">Search</a>
</nav>

<Router {routes} />
