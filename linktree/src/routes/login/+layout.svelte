<script lang="ts">
  import { page } from "$app/stores";
  import { user } from "$lib/firebase";
  import * as Card from "$lib/components/ui/card";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";

  let { children } = $props();
</script>

<main class="w-[600px] mx-auto">
  <Breadcrumb.Root class="mt-20">
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/login" class="font-bold text-xl">
          Login
        </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        {#if $page.route.id?.match(/username|photo/g)}
          <Breadcrumb.Link href="/login/username" class="text-xl font-bold">
            Choose Username
          </Breadcrumb.Link>
        {:else}
          <Breadcrumb.Link href="/login/username" class="text-xl">
            Choose Username
          </Breadcrumb.Link>
        {/if}
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        {#if $page.route.id?.includes("photo")}
          <Breadcrumb.Link href="/login/photo" class="text-xl font-bold"
            >Choose Photo
          </Breadcrumb.Link>
        {:else}
          <Breadcrumb.Link href="/login/photo" class="text-xl"
            >Choose Photo
          </Breadcrumb.Link>
        {/if}
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>

  <Card.Root class=" mt-10">
    <Card.Header>
      {#if $page.url.pathname.includes("/username")}
        <Card.Title class="text-2xl">Username</Card.Title>
        <Card.Description>Choose a unique username</Card.Description>
      {:else if $page.url.pathname.includes("/photo")}
        <Card.Title class="text-2xl">Photo</Card.Title>
        <Card.Description>Choose a cool profile picture</Card.Description>
      {:else if $user}
        <Card.Title class="text-2xl">Welcome, {$user.displayName}</Card.Title>
        <Card.Description>Your are logged in</Card.Description>
      {:else}
        <Card.Title class="text-2xl">Sign in</Card.Title>
        <Card.Description>Sign in to create your profile</Card.Description>
      {/if}
    </Card.Header>
    <Card.Content class="mt-5">
      {@render children()}
    </Card.Content>
    <Card.Footer></Card.Footer>
  </Card.Root>
</main>
