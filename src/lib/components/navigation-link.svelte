<script>
  import { page } from "$app/stores";

  /** @type {string} */
  export let to;
</script>

<li>
  {#if $page.url.pathname === to}
    <span class="relative block px-3 py-2 transition text-indigo-500 dark:text-indigo-400">
      <slot />
    </span>
  {:else}
    <a
      href={to}
      class="relative block px-3 py-2 transition hover:text-indigo-500 dark:hover:text-indigo-400"
    >
      <slot />
    </a>
  {/if}
</li>
