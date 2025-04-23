<script lang="ts">
  import "../../app.css";
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/button/button.svelte";

  let { children } = $props();
</script>

<div class="min-h-screen flex flex-col">
  <!-- Navbar -->
  <nav class="w-full px-4 py-4 shadow flex justify-between items-center">
    <button class="text-xl font-bold" onclick={() => goto("/")}>ToDo</button>
    <div class="flex items-center">
      <!-- Login -->
      <Button on:click={() => goto("/login")}>Login</Button>
    </div>
  </nav>

  <!-- Main content -->
  <main class="flex-1">
    {@render children()}
  </main>
</div>
