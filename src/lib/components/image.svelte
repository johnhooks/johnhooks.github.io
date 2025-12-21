<script lang="ts">
  export let alt: string | undefined = undefined;
  export let filename: string | undefined = undefined;
</script>

{#if filename}
  <div class="flex justify-center my-4">
    <img src="/images/{filename}" class="w-32 h-32 sm:w-64 sm:h-64" {alt} />
  </div>
{/if}
