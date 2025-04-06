<script>
  import "../app.css";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { User } from "@lucide/svelte";

  let { data, children } = $props();
  let { session, supabase } = $derived(data);

  // Log out function
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      invalidate("supabase:auth");
    }
  }

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate("supabase:auth");
      }
    });

    return () => data.subscription.unsubscribe();
  });
</script>

<svelte:head>
  <title>Auth</title>
  <!-- TODO: put meta infos in -->
  <meta name="" content="" />
</svelte:head>

<nav class="flex items-center justify-between p-6 border-b">
  <!-- Logo -->
  <a href="/" class="text-xl font-bold">Auth</a>

  <!-- Buttons -->
  <div class="flex items-center space-x-4">
    {#if session}
      <Button class="mb-5" variant="outline" size="icon" href="/account"
        ><User class="h-4 w-4" /></Button
      >
      <Button on:click={signOut} class="font-semibold">Sign out</Button>
    {:else}
      <Button href="/sign-up" variant="ghost" class="font-semibold"
        >Sign Up</Button
      >
      <Button href="/sign-in" class="font-semibold">Log In</Button>
    {/if}
  </div>
</nav>

{@render children()}
