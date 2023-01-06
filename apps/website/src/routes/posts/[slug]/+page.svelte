<script>
  import Article from "$lib/components/article-template.svelte";
  import MetaCard from "$lib/components/meta-card.svelte";

  /** @type {import('./$types').PageData} */
  export let data;

  const postUrl = `https://johnhooks.io/posts/${data.slug}`;
</script>

<svelte:head>
  <title>{data.seoTitle} / johnhooks.io</title>
  <meta name="description" content={data.abstract} />
  <link rel="canonical" href={postUrl} />
  <meta property="og:title" content={data.title} />
  <meta property="og:description" content={data.abstract} />
  <meta property="og:url" content={postUrl} />

  <MetaCard filename={data.cardFilename} alt={data.cardAlt} />

  <meta property="article:author" content="https://github.com/johnhooks" />
  <!-- <meta property="article:published_time" content={data.publishedAt} /> -->
  <!-- <meta property="article:modified_time" content={data.updatedAt} /> -->
</svelte:head>

<Article title={data.title} subtitle={data.abstract}>
  <svelte:component this={data.content} />
</Article>
