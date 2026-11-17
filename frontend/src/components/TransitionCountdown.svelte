<script lang="ts">
  import { onMount } from "svelte";

  let { endsAt, label }: { endsAt: string | null | undefined; label: string } = $props();

  let now = $state(Date.now());
  let secondsLeft = $derived(
    endsAt ? Math.max(0, Math.ceil((new Date(endsAt).getTime() - now) / 1000)) : 0
  );

  onMount(() => {
    const timer = setInterval(() => {
      now = Date.now();
    }, 250);
    return () => clearInterval(timer);
  });
</script>

<p
  class="sticky top-2 z-10 mx-auto mb-6 w-fit max-w-full rounded-xl bg-stone-100 px-5 py-3 text-center text-sm font-medium text-neutral-600 shadow-sm"
  aria-live="polite"
>
  {label} in
  <span class="ml-1 inline-flex min-w-8 justify-center rounded-lg bg-slate-700 px-2 py-1 font-bold tabular-nums text-stone-100">
    {secondsLeft}
  </span>
  seconds
</p>
