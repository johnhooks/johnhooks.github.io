<script>
  import { page } from "$app/stores";

  import Footer from "$lib/components/footer.svelte";
  import Navigation from "$lib/components/navigation.svelte";
  import "../app.css";
</script>

<svelte:head>
  <meta property="og:locale" content="en_US" />
  <meta property="og:site_name" content="johnhooks.io" />
  <meta property="og:image" content="https://johnhooks.io/images/johnhooks_avatar.jpg" />
  <meta property="og:image:width" content="640" />
  <meta property="og:image:height" content="640" />
  <meta
    property="og:image:alt"
    content="Drawn dizzy eyed avatar of John Hooks, inspired by a drawing done by his daughter Helen when she was three years old."
  />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:image" content="https://johnhooks.io/images/johnhooks_avatar.jpg" />
  <meta name="twitter:creator" content="@_johnhooks" />
</svelte:head>

<Navigation pathname={$page.url.pathname} />

<slot />

<Footer pathname={$page.url.pathname} />
