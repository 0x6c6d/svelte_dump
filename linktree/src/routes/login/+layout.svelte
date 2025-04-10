<script lang="ts">
  import { page } from "$app/stores";
  import * as Card from "$lib/components/ui/card";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";

  let { children } = $props();
</script>

<main class="w-[600px] mx-auto">
  <Breadcrumb.Root class="mt-20">
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link>
          <a href="/login" class="font-bold text-xl"> Login</a>
        </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link>
          <a
            href="/login/username"
            class="text-xl"
            class:font-bold={$page.route.id?.match(/username|photo/g)}
            >Choose Username</a
          >
        </Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link>
          <a
            href="/login/photo"
            class="text-xl"
            class:font-bold={$page.route.id?.includes("photo")}>Choose Photo</a
          >
        </Breadcrumb.Link>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>

  <Card.Root class=" mt-10">
    <Card.Header>
      {#if $page.url.pathname.includes("/username")}
        <Card.Title>Username</Card.Title>
        <Card.Description>Choose a unique username</Card.Description>
      {:else if $page.url.pathname.includes("/photo")}
        <Card.Title>Photo</Card.Title>
        <Card.Description>Choose a cool profile picture</Card.Description>
      {:else}
        <Card.Title>Sign In</Card.Title>
        <Card.Description>Sign in to create your profile</Card.Description>
      {/if}
    </Card.Header>
    <Card.Content>
      {@render children()}
    </Card.Content>
    <Card.Footer>
      <p>Card Footer</p>
    </Card.Footer>
  </Card.Root>
</main>
