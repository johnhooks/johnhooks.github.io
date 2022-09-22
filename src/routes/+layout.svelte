<script>
  import "../app.css";
  import Navigation from "$lib/components/navigation.svelte";
</script>

<Navigation />

<div class="container">
  <slot />

  <div class="text-center">
    <p class="tracking-tight text-gray-900">
      John Hooks © 2021 —
      <!--  -->
      2022
    </p>
  </div>
</div>
