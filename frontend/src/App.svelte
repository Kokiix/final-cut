<script>
  import Router from "svelte-spa-router";
  import Room from "./Room.svelte";

  const routes = new Map();
  routes.set("/room/:id?", Room);
</script>

<Router {routes} />
