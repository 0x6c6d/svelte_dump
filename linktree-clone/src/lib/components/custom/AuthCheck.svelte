<script lang="ts">
  import { user } from "$lib/stores/user";
  import SignIn from "$lib/components/custom/SignIn.svelte";

  let { children } = $props();
</script>

{#if $user}
  {@render children?.()}
{:else}
  <p class="text-error my-10">You must be signed in to view this page.</p>
  <SignIn />
{/if}
