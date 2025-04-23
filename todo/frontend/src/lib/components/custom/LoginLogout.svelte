<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { user } from "$lib/common/stores/userStore";
</script>

{#if !$user.isLoggedIn}
  <Button href="/login" class="mr-3 align-middle">Login / Sign up</Button>
{:else}
  <Button on:click={() => user.logout("/")} class="mr-3 align-middle"
    >Sign out</Button
  >
{/if}
