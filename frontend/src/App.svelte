<script lang="ts">
  import Router from "svelte-spa-router";
  import Home from "./routes/Home.svelte";
  import SignUp from "./routes/SignUp.svelte";
  import LogIn from "./routes/LogIn.svelte";
  import Join from "./routes/Join.svelte";
  import WatchList from "./routes/WatchList.svelte";
  import SearchBar from "./components/SearchBar.svelte";

  const routes = {
    "/": Home,
    "/signup": SignUp,
    "/login": LogIn,
    "/join": Join,
    "/watchlist": WatchList,
  };

  const links = [
    { path: "/", label: "Home" },
    { path: "/signup", label: "Sign up" },
    { path: "/login", label: "Log in" },
    { path: "/join", label: "Join Room" },
    { path: "/watchlist", label: "Watchlist" },
  ];

  const getPath = () => window.location.hash.slice(1) || "/";
  let currentPath = $state(getPath());
</script>

<svelte:window onhashchange={() => (currentPath = getPath())} />

<div class="bg-[#B87458] h-svh w-full flex flex-col text-neutral-700">
  <nav class="w-full h-11 flex items-center gap-8 pl-10 font-medium">
    {#each links as link}
      <a
        href="#{link.path}"
        class="rounded-md p-1 w-28 text-center transition-colors hover:bg-stone-200"
        class:bg-stone-200={currentPath === link.path}
        class:bg-stone-300={currentPath !== link.path}
        aria-current={currentPath === link.path ? "page" : undefined}
      >
        {link.label}
      </a>
    {/each}
    <SearchBar />
  </nav>

  <main class="flex-1 min-h-0 flex flex-col">
    <Router {routes} />
  </main>
</div>
