<script lang="ts">
  import Link from "./navigation-link.svelte";
  export let pathname: string;
</script>

<div class="mx-auto max-w-7xl px-4 sm:px-6">
  <header>
    <nav class="flex justify-center pt-6">
      <ul class="flex px-3 text-sm font-medium text-zinc-800">
        <Link to="/" {pathname}>johnhooks.io</Link>
        <Link to="/about" {pathname}>about</Link>
      </ul>
    </nav>
  </header>
</div>
