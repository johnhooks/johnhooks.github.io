<script>
  import "../app.css";
  import Navigation from "$lib/components/navigation.svelte";
</script>

<svelte:head>
  <meta property="og:locale" content="en_US" />
  <meta property="og:site_name" content="johnhooks.io" />
</svelte:head>

<Navigation />

<div class="container">
  <slot />

  <div class="text-center pt-10 pb-16">
    <p class="text-sm text-zinc-400 dark:text-zinc-500">
      John Hooks © 2021 —
      <!--  -->
      2022. All rights reserved.
    </p>
  </div>
</div>
