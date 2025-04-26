<script lang="ts">
  import "../../app.css";
  import type { Snippet } from "svelte";
  import type { LayoutData } from "./$types";
  import Protected from "$lib/components/custom/Protected.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { goto } from "$app/navigation";
  import { signOut } from "$lib/pocketbase";

  let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<Protected>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <nav class="w-full px-4 py-4 shadow flex justify-between items-center">
      <button class="text-xl font-bold" onclick={() => goto("/dashboard")}
        >Run Tracker</button
      >
      <div class="flex items-center">
        <!-- Sign out -->
        <Button on:click={signOut}>Sign out</Button>
      </div>
    </nav>

    <!-- Main content -->
    <main class="flex-1">
      {@render children()}
    </main>
  </div>
</Protected>
