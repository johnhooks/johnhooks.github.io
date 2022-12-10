<script>
  import Article from "$lib/components/article-template.svelte";
</script>

<svelte:head>
  <title>about me / johnhooks.io</title>
  <meta
    name="description"
    content="I am a hobbyist programmer. Maybe someday I'll do it for a living."
  />
  <link rel="canonical" href="https://johnhooks.io/about" />
  <meta property="og:title" content="about me" />
  <meta
    property="og:description"
    content="I am a hobbyist programmer. Maybe someday I'll do it for a living."
  />
  <meta property="og:url" content="https://johnhooks.io/about" />

  <meta property="article:author" content="https://github.com/johnhooks" />
</svelte:head>

<Article
  title="this is my website"
  subtitle=" I use it to learn new web tech and document my journey."
>
  <p>
    I've been interested in web design and JavaScript for over 20 years. Though only recently have I
    committed the time to really learn programming.
  </p>

  <p>
    Coming from an art background, I remember visiting a large web development company in Seattle,
    Washington. My graphic design professor was the lead designer there and was giving my class a
    tour. So clearly I remember seeing a computer screen with a mess of code and my reaction in that
    moment was to be so glad to be studying graphic design and not programming!
  </p>

  <p>
    It feels like a missed opportunity. If I could relive that moment as the person I am now, I
    would have dove in and have seen what that guy was working on. It's taken a while to catch up,
    but I finally feel like I'm making progress in my programming goals.
  </p>

  <h3>Past</h3>

  <ul>
    <li>
      <span class="font-mono mr-2">01-03</span> Columbia Basin College &#8212 Art Program
    </li>
    <li>
      <span class="font-mono mr-2">03-04</span>
      <a href="https://www.cornish.edu/">Cornish College of the Arts</a> &#8212 Graphic Design Program
    </li>
    <li>
      <span class="font-mono mr-2">04-05</span>
      Wenatchee Community College &#8212
      <a href="https://en.wikipedia.org/wiki/Pomology">Pomology</a>
      Program
    </li>
  </ul>

  <h3>Present</h3>
  <ul>
    <li>
      <span class="font-mono mr-2">05-Present</span> Hooks Crane Service, Inc &#8212 Owner
    </li>
  </ul>
</Article>
