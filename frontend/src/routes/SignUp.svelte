<script lang="ts">
  const pageTitle = "Sign up | Final Cut";
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<div
  class="m-1 flex flex-1 items-center justify-center rounded-md bg-stone-200 p-4"
>
  <form class="flex w-full max-w-xs flex-col gap-3">
    <div class="flex gap-3">
      <input
        class="min-w-0 flex-1 border-b-2 border-gray-400 bg-stone-300/30 px-3 py-3 text-neutral-700 outline-none transition
               placeholder:text-slate-600/60 focus:border-orange-700"
        type="text"
        name="firstname"
        placeholder="First name"
        aria-label="First name"
        autocomplete="given-name"
        required
      />
      <input
        class="min-w-0 flex-1 border-b-2 border-gray-400 bg-stone-300/30 px-3 py-3 text-neutral-700 outline-none transition
               placeholder:text-slate-600/60 focus:border-orange-700"
        type="text"
        name="lastname"
        placeholder="Last name"
        aria-label="Last name"
        autocomplete="family-name"
        required
      />
    </div>

    <input
      class="border-b-2 border-gray-400 bg-stone-300/30 px-3 py-3 text-neutral-700 outline-none transition
             placeholder:text-slate-600/60 focus:border-orange-700"
      type="text"
      name="username"
      placeholder="Username"
      aria-label="Username"
      autocomplete="username"
      required
    />
    <input
      class="border-b-2 border-gray-400 bg-stone-300/30 px-3 py-3 text-neutral-700 outline-none transition
             placeholder:text-slate-600/60 focus:border-orange-700"
      type="email"
      name="email"
      placeholder="Email"
      aria-label="Email"
      autocomplete="email"
      required
    />
    <input
      class="border-b-2 border-gray-400 bg-stone-300/30 px-3 py-3 text-neutral-700 outline-none transition
             placeholder:text-slate-600/60 focus:border-orange-700"
      type="password"
      name="password"
      placeholder="Password"
      aria-label="Password"
      autocomplete="new-password"
      required
    />

    <button
      class="mt-3 cursor-pointer bg-slate-600 py-3 font-medium text-stone-200 transition
             hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2
             focus-visible:outline-orange-700"
      type="submit"
    >
      Sign up
    </button>

    <a
      href="/#/login"
      class="mt-1 text-center text-sm text-slate-600 transition hover:text-orange-700"
    >
      Log in instead
    </a>
  </form>
</div>
