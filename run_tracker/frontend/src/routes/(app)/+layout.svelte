<script lang="ts">
  import type { Snippet } from "svelte";
  import type { LayoutData } from "./$types";
  import Protected from "$lib/components/custom/Protected.svelte";

  let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<Protected>
  {@render children()}
</Protected>
