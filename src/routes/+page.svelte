<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<svelte:head>
  <title>johnhooks.io</title>
  <meta
    name="description"
    content="This is my website. I use it to learn new web tech and document my journey."
  />
  <link rel="canonical" href="https://johnhooks.io" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://johnhooks.io" />
  <meta property="og:title" content="johnhooks.io homepage" />
  <meta
    property="og:description"
    content="This is my website. I use it to learn new web tech and document my journey."
  />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6">
  <div class="mt-8 sm:mt-16 text-center">
    <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
      <span class="block xl:inline">johnhooks.io</span>
    </h1>
    <p
      class="mt-5 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
    >
      just a guy learning web dev
    </p>

    <div class="mt-6 flex justify-center gap-6">
      <a
        class="group -m-1 p-1"
        aria-label="Follow on Twitter"
        href="https://twitter.com/_johnhooks"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          class="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300"
        >
          <path
            d="M20.055 7.983c.011.174.011.347.011.523 0 5.338-3.92 11.494-11.09 11.494v-.003A10.755 10.755 0 0 1 3 18.186c.308.038.618.057.928.058a7.655 7.655 0 0 0 4.841-1.733c-1.668-.032-3.13-1.16-3.642-2.805a3.753 3.753 0 0 0 1.76-.07C5.07 13.256 3.76 11.6 3.76 9.676v-.05a3.77 3.77 0 0 0 1.77.505C3.816 8.945 3.288 6.583 4.322 4.737c1.98 2.524 4.9 4.058 8.034 4.22a4.137 4.137 0 0 1 1.128-3.86A3.807 3.807 0 0 1 19 5.274a7.657 7.657 0 0 0 2.475-.98c-.29.934-.9 1.729-1.713 2.233A7.54 7.54 0 0 0 22 5.89a8.084 8.084 0 0 1-1.945 2.093Z"
          />
        </svg>
      </a>

      <a class="group -m-1 p-1" aria-label="Follow on GitHub" href="https://github.com/johnhooks">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          class="h-6 w-6 fill-zinc-500 transition group-hover:fill-zinc-600 dark:fill-zinc-400 dark:group-hover:fill-zinc-300"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 2C6.475 2 2 6.588 2 12.253c0 4.537 2.862 8.369 6.838 9.727.5.09.687-.218.687-.487 0-.243-.013-1.05-.013-1.91C7 20.059 6.35 18.957 6.15 18.38c-.113-.295-.6-1.205-1.025-1.448-.35-.192-.85-.667-.013-.68.788-.012 1.35.744 1.538 1.051.9 1.551 2.338 1.116 2.912.846.088-.666.35-1.115.638-1.371-2.225-.256-4.55-1.14-4.55-5.062 0-1.115.387-2.038 1.025-2.756-.1-.256-.45-1.307.1-2.717 0 0 .837-.269 2.75 1.051.8-.23 1.65-.346 2.5-.346.85 0 1.7.115 2.5.346 1.912-1.333 2.75-1.05 2.75-1.05.55 1.409.2 2.46.1 2.716.637.718 1.025 1.628 1.025 2.756 0 3.934-2.337 4.806-4.562 5.062.362.32.675.936.675 1.897 0 1.371-.013 2.473-.013 2.82 0 .268.188.589.688.486a10.039 10.039 0 0 0 4.932-3.74A10.447 10.447 0 0 0 22 12.253C22 6.588 17.525 2 12 2Z"
          />
        </svg>
      </a>
    </div>
  </div>

  <div class="relative divide-y-2 divide-gray-200 mt-8 sm:mt-16">
    <div class="text-center">
      <h2 class="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">Posts</h2>
    </div>

    <ul class="mt-6 pt-10 grid gap-16 lg:grid-cols-2 lg:gap-x-5 lg:gap-y-12">
      {#each data.posts as post}
        <li>
          <!-- <p class="text-sm text-gray-500">
            <time datetime="{formatDate(post.publishedOn, "yyyy-MM-dd")}">
              {formatDate(post.publishedOn, "LLLL d, Y")}
            </time>
          </p> -->
          <a href="/posts/{post.slug}" class="mt-2 block">
            <p class="text-xl font-semibold text-gray-900">
              {post.title}
            </p>
            <p class="mt-3 text-base text-gray-500">
              {post.abstract}
            </p>
          </a>
          <div class="mt-3">
            <a
              href="/posts/{post.slug}"
              class="text-base font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Read full story
            </a>
          </div>
        </li>
      {/each}
    </ul>
  </div>

  <div class="mt-8 sm:mt-16 text-center">
    <p>
      This is my personal website, the source code is on
      <a
        href="https://github.com/johnhooks/johnhooks.github.io"
        class="text-base font-semibold text-indigo-600 hover:text-indigo-500">GitHub</a
      >
    </p>
  </div>
</div>
