<script>
  import { calcKeyPos } from "./keyboard";

  export let size = 32;
  export let spacing = 8;

  const keyPos = calcKeyPos(size, spacing, { x: 5, y: 5 });
</script>

<div class="my-6 mx-auto flex justify-center">
  <svg width="580" height="200" version="1.1" xmlns="http://www.w3.org/2000/svg">
    {#each keyPos as { x, y, width }}
      <rect
        x="0"
        y="0"
        rx="5"
        ry="5"
        {width}
        height={size}
        stroke="#999"
        fill="transparent"
        stroke-width="1"
        transform="translate({x},{y})"
      />
    {/each}
  </svg>
</div>
