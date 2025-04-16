<script lang="ts">
  import { user } from "$lib/stores/user";
  import SignIn from "$lib/components/custom/SignIn.svelte";
  import SignOut from "$lib/components/custom/SignOut.svelte";
</script>

{#if !$user}
  <SignIn />
{:else}
  <SignOut />
{/if}
