<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/button/button.svelte";
</script>

<div class="w-full">
  <h2 class="mx-auto mt-10">Landing Page</h2>
</div>

<Button on:click={() => goto("/login")}>Login</Button>
