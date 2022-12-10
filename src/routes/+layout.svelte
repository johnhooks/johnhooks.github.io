<script>
  import "../app.css";
  import Navigation from "$lib/components/navigation.svelte";
  import Footer from "$lib/components/footer.svelte";
</script>

<svelte:head>
  <meta property="og:locale" content="en_US" />
  <meta property="og:site_name" content="johnhooks.io" />
</svelte:head>

<Navigation />

<slot />

<Footer />
