<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/button/button.svelte";
</script>

<div
  class="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4"
>
  <div class="max-w-xl text-center space-y-6">
    <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
      Welcome to Your Run Tracking App
    </h1>
    <p class="text-lg text-gray-600">
      Track your runs today. Start managing your training sessions with ease and
      clarity.
    </p>
    <div class="flex justify-center space-x-4">
      <Button on:click={() => goto("/login")}>Login</Button>
    </div>
  </div>
</div>
