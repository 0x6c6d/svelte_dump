<script lang="ts">
  import { pb } from "$lib/pocketbase/pocketbase";
  import * as Card from "$lib/components/ui/card/index";

  let { children } = $props();
  let loggenIn = $state(pb.authStore.isValid);
</script>

<Card.Root class="w-[500px] mx-auto mt-10">
  <Card.Header>
    <Card.Title>
      {#if loggenIn}
        Sign out
      {:else}
        Sign in
      {/if}
    </Card.Title>
    <Card.Description>
      {#if loggenIn}
        Sign out of your account
      {:else}
        Sign in to your account
      {/if}
    </Card.Description>
  </Card.Header>
  <Card.Content>
    {@render children()}
  </Card.Content>
  <Card.Footer class="flex justify-between"></Card.Footer>
</Card.Root>
