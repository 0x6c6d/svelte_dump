<script lang="ts">
  import Login from "$lib/components/custom/Login.svelte";
  import * as Card from "$lib/components/ui/card/index";
</script>

<Card.Root class="w-[500px] mx-auto mt-10">
  <Card.Header></Card.Header>
  <Card.Content>
    <Login />
  </Card.Content>
  <Card.Footer class="flex justify-between"></Card.Footer>
</Card.Root>
