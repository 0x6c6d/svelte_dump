<script lang="ts">
  import "../app.css";
  import { ModeWatcher, toggleMode } from "mode-watcher";
  import { Sun, Moon } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { onMount } from "svelte";
  import { initAuthListener } from "$lib/firebase/init";

  let { children } = $props();

  onMount(() => {
    initAuthListener();
  });
</script>

<ModeWatcher />

<div class="min-h-screen flex flex-col">
  <!-- Navbar -->
  <nav class="w-full px-4 py-2 shadow flex justify-between items-center">
    <div class="text-xl font-bold">Linktree</div>
    <div>
      <Button on:click={toggleMode} variant="outline" size="icon">
        <Sun
          class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <Moon
          class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </div>
  </nav>

  <!-- Main content -->
  <main class="flex-1">
    {@render children()}
  </main>
</div>
