<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<svelte:head>
  <title>johnhooks.io</title>
</svelte:head>

<div class="mt-8 sm:mt-16 text-center">
  <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
    <span class="block xl:inline">johnhooks.io</span>
  </h1>
  <p
    class="mt-5 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
  >
    just a guy learning web dev
  </p>
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
