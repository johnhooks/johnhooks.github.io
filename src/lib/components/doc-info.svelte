<p><slot /></p>

<style>
  p {
    color: #53818e;
    border-color: currentColor;
    border-left-width: 2px;
    border-radius: 0.5rem;
    border-right-width: 2px;
    display: block;
    margin-bottom: 0.75rem;
    margin-top: 0;
    padding: 0.5rem 1rem;
    position: relative;
  }

  p:before {
    --tw-bg-opacity: 1;
    --tw-content: "";
    background-color: rgb(57 146 255 / var(--tw-bg-opacity));
    bottom: 0;
    content: var(--tw-content);
    left: 0;
    opacity: 0.1;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
  }
</style>
