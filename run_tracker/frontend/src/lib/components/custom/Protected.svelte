<script lang="ts">
  import { goto } from "$app/navigation";
  import { user } from "$lib/pb/auth";
  import { onMount } from "svelte";

  let { children } = $props();
  let isLoading = $state(true);

  onMount(() => {
    if (!$user) {
      goto("/login");
    }
    isLoading = false;
  });
</script>

{#if isLoading}
  <div class="min-h-screen flex items-center justify-center">Loading...</div>
{:else}
  {@render children()}
{/if}
