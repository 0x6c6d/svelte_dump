<script lang="ts">
  import { user } from "$lib/firebase";
  import { Button } from "$lib/components/ui/button/index.js";
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();
</script>

{#if $user}
  {@render children?.()}
{:else}
  <p class="text-error my-10">
    You must be signed in to view this page.
    <Button href="/login">Sign in</Button>
  </p>
{/if}
