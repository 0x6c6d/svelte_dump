<script lang="ts">
  import { writable } from "svelte/store";
  import Button from "$lib/components/ui/button/button.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  // form validation
  import { superForm } from "sveltekit-superforms/client";
  import SuperDebug from "sveltekit-superforms";

  let { data } = $props();
  const otpRequested = writable(false);

  const {
    form: mailForm,
    errors: mailErrors,
    enhance: mailEnhance,
  } = superForm(data.mailForm, {
    resetForm: true,
    onResult: ({ result }) => {
      if (result.type === "success") {
        otpRequested.set(true);
      }
    },
  });

  const {
    form: otpForm,
    errors: otpErrors,
    enhance: otpEnhance,
  } = superForm(data.otpForm, {
    resetForm: true,
  });
</script>

<SuperDebug data={$mailForm} />
<SuperDebug data={$otpForm} />

{#if otpRequested}
  <form method="POST" action="?/mail" use:mailEnhance>
    <div class="grid w-full items-center gap-4">
      <div class="flex flex-col space-y-1.5">
        <Label for="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          aria-invalid={$mailErrors.email ? "true" : undefined}
          bind:value={$mailForm.email}
        />
        {#if $mailErrors.email}
          <p class="text-sm text-destructive">{$mailErrors.email}</p>
        {/if}
      </div>
      <Button class="mt-5">Send OTP</Button>
    </div>
  </form>
{:else}
  <form method="POST" action="?/otp" use:otpEnhance>
    <div class="grid w-full items-center gap-4">
      <div class="flex flex-col space-y-1.5">
        <Label for="otp">OTP</Label>
        <Input
          type="text"
          id="otp"
          name="otp"
          placeholder="Enter your OTP"
          aria-invalid={$otpErrors.otp ? "true" : undefined}
          bind:value={$otpForm.otp}
        />
        {#if $otpErrors.otp}
          <p class="text-sm text-destructive">{$otpErrors.otp}</p>
        {/if}
      </div>
      <Button class="mt-5">Log in</Button>
    </div>
  </form>
{/if}
