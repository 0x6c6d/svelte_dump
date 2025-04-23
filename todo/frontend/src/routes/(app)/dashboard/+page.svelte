<script lang="ts">
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  console.log("Dashboard:", JSON.stringify(data));
</script>
