<script lang="ts">
  import Image from "$lib/components/image.svelte";

  export let title: string;
  export let subtitle: string;
  export let image: { filename?: string; alt?: string } = {};
</script>

<div class="antialiased text-gray-900">
  <div
    class="px-4 pt-2 pb-16 max-w-3xl mx-auto sm:px-6 sm:pt-6 sm:pb-12 lg:max-w-4xl lg:pt-8 lg:pb-16 lg:px-8"
  >
    <article>
      <div class="space-y-10 sm:space-y-12 lg:space-y-20 ">
        {#if image.filename}
          <Image {...image} />
        {/if}

        <div class="prose lg:prose-lg mx-auto">
          <h1>
            <span
              class="block text-xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
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
            {subtitle}
          </p>
          <slot />
        </div>
      </div>
    </article>
  </div>
</div>
