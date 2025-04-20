<script lang="ts">
  import { writable } from "svelte/store";
  import type { OTPResponse } from "pocketbase";
  import Button from "$lib/components/ui/button/button.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  // form validation
  import { superForm } from "sveltekit-superforms/client";

  let { data } = $props();
  const otpRequested = writable(false);
  const otpResponse = writable<OTPResponse | null>(null);

  const {
    form: mailForm,
    message: mailMessage,
    errors: mailErrors,
    enhance: mailEnhance,
  } = superForm(data.mailForm, {
    resetForm: true,
    onResult: ({ result }) => {
      console.log("MailForm onResult: ", JSON.stringify(result));
      if (result.type === "success" && result.data && result.data.otpResponse) {
        otpRequested.set(true);
        otpResponse.set(result.data!.otpResponse);
      }
    },
  });

  const {
    form: otpForm,
    message: otpMessage,
    errors: otpErrors,
    enhance: otpEnhance,
  } = superForm(data.otpForm, {
    resetForm: true,
  });
</script>

{#if !$otpRequested}
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
        {:else if $mailMessage}
          <p class="text-sm text-emerald-400">{$mailMessage}</p>
        {/if}
      </div>
      <Button type="submit" class="mt-5">Send OTP</Button>
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
        <!-- Hidden input to send the otpId -->
        <input type="hidden" name="otpId" value={$otpResponse?.otpId || ""} />
        {#if $otpErrors.otp}
          <p class="text-sm text-destructive">{$otpErrors.otp}</p>
        {:else if $otpMessage}
          <p class="text-sm text-emerald-400">{$otpMessage}</p>
        {/if}
      </div>
      <Button type="submit" class="mt-5">Log in</Button>
    </div>
  </form>
{/if}
