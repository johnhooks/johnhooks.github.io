<script>
  import { page } from "$app/stores";

  import Footer from "$lib/components/footer.svelte";
  import Navigation from "$lib/components/navigation.svelte";
  import "../app.css";
</script>

<svelte:head>
  <meta property="og:locale" content="en_US" />
  <meta property="og:site_name" content="johnhooks.io" />

  <meta name="twitter:card" content="summary" />
  <meta name="twitter:creator" content="@_johnhooks" />
</svelte:head>

<Navigation pathname={$page.url.pathname} />

<slot />

<Footer pathname={$page.url.pathname} />
