<script>
  /** @type {string} */
  export let title;
  /** @type {string} */
  export let seoTitle;
  /** @type {string} */
  // export let slug;
  /** @type {string} */
  export let abstract;
  /** @type {boolean} */
  // export let isPublished;
  /** @type {string} */
  // export let publishedOn;
</script>

<svelte:head>
  <title>{seoTitle}</title>
</svelte:head>

<div class="antialiased text-gray-900">
  <div class="px-4 py-10 max-w-3xl mx-auto sm:px-6 sm:py-12 lg:max-w-4xl lg:py-16 lg:px-8">
    <article>
      <div class="space-y-10 sm:space-y-12 lg:space-y-20 ">
        <div class="prose prose-sm sm:prose lg:prose-lg mx-auto">
          <h1>
            <span
              class="block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
            >
              {title}
            </span>
            <!-- <span class="mt-2 block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase">
              <time datetime="{formatDate(publishedOn, "yyyy-MM-dd")}">
                {formatDate(publishedOn, "LLLL d, Y")}
              </time>
            </span> -->
          </h1>
          <p class="mt-8 text-center text-gray-500 leading-8">
            {abstract}
          </p>
          <slot />
        </div>
      </div>
    </article>
  </div>
</div>
