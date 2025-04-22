<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import pb from "$lib/pocketbase/pocketbase";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let loggedIn = $state(pb.authStore.isValid);

  // TODO: create user store
  onMount(() => {
    pb.authStore.onChange(() => {
      loggedIn = pb.authStore.isValid;
    });
  });

  function handleSignOut() {
    pb.authStore.clear();
    goto("/login");
  }
</script>

{#if !loggedIn}
  <Button href="/login" class="mr-3 align-middle">Login / Sign up</Button>
{:else}
  <Button on:click={handleSignOut} class="mr-3 align-middle">Sign out</Button>
{/if}
