<script lang="ts">
  import "../../app.css";
  import { ModeWatcher, toggleMode } from "mode-watcher";
  import { Sun, Moon } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { goto } from "$app/navigation";

  let { children } = $props();
</script>

<ModeWatcher />

<div class="min-h-screen flex flex-col">
  <!-- Navbar -->
  <nav class="w-full px-4 py-4 shadow flex justify-between items-center">
    <button class="text-xl font-bold" onclick={() => goto("/dashboard")}
      >ToDo</button
    >
    <div class="flex items-center">
      <!-- Logout -->
      <form action="/login?/logout" method="post">
        <Button type="submit" class="mr-4">Log Out</Button>
      </form>
      <!-- Toggle theme -->
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
