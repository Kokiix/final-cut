<script>
  import Router from "svelte-spa-router";
  import Home from "./routes/Home.svelte";
  import SignUp from "./routes/SignUp.svelte";
  import LogIn from "./routes/LogIn.svelte";
  import Join from "./routes/Join.svelte";
  import WatchList from "./routes/WatchList.svelte";
  import Search from "./routes/Search.svelte";

  const routes = {
    "/": Home,
    "/signup": SignUp,
    "/login": LogIn,
    "/join": Join,
    "/watchlist": WatchList,
    "/search": Search,
  };

  async function getTestData() {
    let test = await fetch("api");
    return await test.text();
  }
  let testPromise = getTestData();
</script>

<nav class="w-full h-8 flex items-center gap-8 pl-10 bg-black text-white">
  <a href="#/">Home</a>
  <a href="#/signup">Sign up</a>
  <a href="#/login">Log in</a>
  <a href="#/join">Join Game</a>
  <a href="#/watchlist">Watchlist</a>
  <a href="#/search">Search</a>
</nav>

<Router {routes} />
