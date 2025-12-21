<script>
  import Article from "$lib/components/article-template.svelte";
  import { SITE_URL } from "$lib/constants";

  const pageUrl = `${SITE_URL}/about`;
</script>

<svelte:head>
  <title>about me / johnhooks.io</title>
  <meta
    name="description"
    content="Web developer, former crane operator. Now building automation systems in Laravel."
  />
  <link rel="canonical" href={pageUrl} />
  <meta property="og:title" content="about me" />
  <meta
    property="og:description"
    content="Web developer, former crane operator. Now building automation systems in Laravel."
  />
  <meta property="og:url" content={pageUrl} />

  <meta property="article:author" content="https://github.com/johnhooks" />
</svelte:head>

<Article
  title="about me"
  subtitle="Web developer, former crane operator."
  image={{
    filename: "johnhooks_avatar_512.jpg",
    alt: "Drawn dizzy eyed avatar of John Hooks, inspired by a drawing done by his daughter Helen when she was three years old.",
  }}
>
  <p>
    In art school I visited a web development company in Seattle. A professor was giving us a tour
    and I remember seeing a screen full of code - dense, monochrome, nothing like the work I was
    making. I thought, "I'm glad that's not me."
  </p>

  <p>
    I've changed my mind. Programming might be the most creative medium there is. It's the biggest
    set of LEGO blocks you can get your hands on, and you can build almost anything.
  </p>

  <p>
    I ran a crane business for 18 years. I liked the independence - all the power to succeed or
    fail, nobody else to blame. That's also what made it scary. The whole time I was tinkering on
    the side, learning to program, going down rabbit holes. I have trouble letting problems go. If
    something doesn't make sense I keep pulling at it until it does.
  </p>

  <p>
    In 2023 I made the switch to software full-time and joined Liquid Web. I like learning how
    things work. This site is where I write about it.
  </p>

  <h3>Past</h3>

  <ul>
    <li>
      <span class="mr-2">01-03</span> Columbia Basin College, Art Program. Drawing, painting,
      sculpture.
    </li>
    <li>
      <span class="mr-2">03-04</span>
      <a href="https://www.cornish.edu/">Cornish College of the Arts</a>, Graphic Design.
    </li>
    <li>
      <span class="mr-2">04-05</span>
      Wenatchee Community College,
      <a href="https://en.wikipedia.org/wiki/Pomology">Pomology</a>.
    </li>
    <li>
      <span class="mr-2">05-23</span> Hooks Crane Service. Ran my own business for 18 years.
      Scheduling, operations, maintenance, books. High stakes and early mornings.
    </li>
  </ul>

  <h3>Present</h3>
  <ul>
    <li>
      <span class="mr-2">23-Present</span>
      Liquid Web. Came in knowing JavaScript and React, learned PHP and Laravel on the job. Now
      building queue orchestration and API systems for WordPress automation.
    </li>
  </ul>
</Article>
