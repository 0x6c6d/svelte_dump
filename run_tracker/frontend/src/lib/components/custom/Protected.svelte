<script lang="ts">
  import { goto } from "$app/navigation";
  import { user } from "$lib/common/stores/auth";
  import { onMount } from "svelte";

  let { children } = $props();

  onMount(() => {
    if (!$user) {
      goto("/login");
    }
  });
</script>

{@render children()}
