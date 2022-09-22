<script>
  /** @type {import('./$types').PageData} */
  export let data;
</script>

<svelte:head>
  <title>{data.seoTitle}</title>
</svelte:head>

<div class="antialiased text-gray-900">
  <div class="px-4 py-10 max-w-3xl mx-auto sm:px-6 sm:py-12 lg:max-w-4xl lg:py-16 lg:px-8">
    <article>
      <div class="space-y-10 sm:space-y-12 lg:space-y-20 ">
        <div class="prose prose-sm sm:prose lg:prose-lg mx-auto">
          <h1>
            <span
              class="block text-xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
            >
              {data.title}
            </span>
            <!-- <span class="mt-2 block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase">
              <time datetime="{formatDate(publishedOn, "yyyy-MM-dd")}">
                {formatDate(publishedOn, "LLLL d, Y")}
              </time>
            </span> -->
          </h1>
          <p class="mt-8 text-center text-gray-500 leading-8">
            {data.abstract}
          </p>
          <svelte:component this={data.content} />
        </div>
      </div>
    </article>
  </div>
</div>
