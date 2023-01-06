<script>
  import Article from "$lib/components/article-template.svelte";
  import MetaCard from "$lib/components/meta-card.svelte";
  /** @type {import('./$types').PageData} */
  export let data;

  const image = { filename: data.imageFilename, alt: data.cardAlt || data.imageAlt };
  const project = `https://johnhooks.io/projects/${data.slug}`;
</script>

<svelte:head>
  <title>{data.seoTitle} / johnhooks.io</title>
  <meta name="description" content={data.abstract} />
  <link rel="canonical" href={project} />
  <meta property="og:title" content={data.title} />
  <meta property="og:description" content={data.abstract} />
  <meta property="og:url" content={project} />
  <meta property="og:type" content="article" />

  <MetaCard filename={data.cardFilename} alt={data.cardAlt} />

  <meta property="article:author" content="https://github.com/johnhooks" />
  <!-- <meta property="article:published_time" content={data.publishedAt} /> -->
  <!-- <meta property="article:modified_time" content={data.updatedAt} /> -->
</svelte:head>

<Article title={data.title} subtitle={data.abstract} {image}>
  <svelte:component this={data.content} />
</Article>
