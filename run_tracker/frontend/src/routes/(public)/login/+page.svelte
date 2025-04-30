<script lang="ts">
  import Login from "$lib/components/custom/Login.svelte";
  import * as Card from "$lib/components/ui/card/index";
  import { onMount } from "svelte";
  import { user } from "$lib/pb/auth";
  import { goto } from "$app/navigation";

  onMount(() => {
    if ($user) {
      goto("/dashboard");
    }
  });
</script>

<Card.Root class="w-[500px] mx-auto mt-10">
  <Card.Header></Card.Header>
  <Card.Content>
    <Login />
  </Card.Content>
  <Card.Footer class="flex justify-between"></Card.Footer>
</Card.Root>
