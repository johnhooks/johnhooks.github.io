<script>
  import Link from "./navigation-link.svelte";
</script>

<footer class="mx-auto max-w-7xl px-4 sm:px-6">
  <nav class="flex justify-center pt-6">
    <ul class="flex px-3 text-sm font-medium text-zinc-800">
      <Link to="/">home</Link>
      <Link to="/about">about</Link>
    </ul>
  </nav>
  <div class="text-center pt-10 pb-16">
    <p class="text-sm text-zinc-400 dark:text-zinc-500">
      John Hooks © 2021 —
      <!--  -->
      2022. All rights reserved.
    </p>
  </div>
</footer>
