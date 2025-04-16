<script lang="ts">
  import { signOutUser } from "$lib/firebase/firebase";
  import { user } from "$lib/stores/user";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
</script>

<main class="w-[600px] mx-auto">
  <Card.Root class=" mt-10">
    <Card.Header>
      <Card.Title class="text-2xl">Sign out</Card.Title>
      <Card.Description>Welcome, {$user?.displayName}!</Card.Description>
    </Card.Header>
    <Card.Content class="mt-5">
      <Button onclick={() => signOutUser("/")}>Sign out</Button>
    </Card.Content>
    <Card.Footer></Card.Footer>
  </Card.Root>
</main>
