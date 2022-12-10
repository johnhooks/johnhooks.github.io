<script>
  /** @type {import('./$types').LayoutData} */
  export let data;

  const avatarUrl = `${data.base_url}/images/johnhooks_avatar.jpg`;
</script>

<svelte:head>
  <meta property="og:image" content={avatarUrl} />
  <meta property="og:image:width" content="640" />
  <meta property="og:image:height" content="640" />
  <meta
    property="og:image:alt"
    content="Drawn dizzy eyed avatar of John Hooks, inspired by a drawing done by his daughter Helen when she was three years old."
  />
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:image" content={avatarUrl} />
  <meta name="twitter:creator" content="@_johnhooks" />
</svelte:head>

<slot />
