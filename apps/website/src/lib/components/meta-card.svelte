<script lang="ts">
  export let filename = "johnhooks_avatar.jpg";
  export let alt =
    "Drawn dizzy eyed avatar of John Hooks, inspired by a drawing done by his daughter Helen when she was three years old.";
  const cardUrl = `https://johnhooks.io/images/${filename}`;
</script>

<meta property="og:image" content={cardUrl} />
<meta property="og:image:width" content="640" />
<meta property="og:image:height" content="640" />
<meta property="og:image:alt" content={alt} />
<meta name="twitter:card" content="summary" />
<meta name="twitter:image" content={cardUrl} />
<meta name="twitter:creator" content="@_johnhooks" />
