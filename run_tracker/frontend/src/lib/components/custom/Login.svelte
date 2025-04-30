<script lang="ts">
  import { user } from "$lib/pb/auth";
  import { pb } from "$lib/pb/pb";
  import { signOut, requestSignInOTP } from "$lib/pb/auth";
  import type { OTPResponse } from "pocketbase";
  import { goto } from "$app/navigation";
  import { schemaMail, schemaOtp } from "$lib/common/schemas";
  import { ZodError } from "zod";

  import Button from "../ui/button/button.svelte";
  import Label from "../ui/label/label.svelte";
  import Input from "../ui/input/input.svelte";

  let email: string = "";
  let otp: string = "";
  let msg: string = "";
  let emailError: string = "";
  let otpError: string = "";
  let otpResponse: OTPResponse;
  let showOtp = false;
  let isLoading = false;

  async function sendOtp() {
    msg = "";
    emailError = "";
    isLoading = true;

    try {
      const validatedEmail = schemaMail.parse({ email });

      const result = await requestSignInOTP(validatedEmail.email);
      if (!result.success || !result.data) {
        msg = result.message ?? "Error during request of the OTP";
        isLoading = false;
        return;
      }

      otpResponse = result.data;
      showOtp = true;
      msg = "OTP sent to your email. Please check your inbox.";
    } catch (error) {
      if (error instanceof ZodError) {
        error.errors.forEach((err) => {
          if (err.path.includes("email")) {
            emailError = err.message;
          }
        });
      } else {
        msg = "An unexpected error occurred. Please try again.";
        console.error(error);
      }
    } finally {
      isLoading = false;
    }
  }

  async function login() {
    msg = "";
    otpError = "";
    isLoading = true;

    try {
      const validatedOtp = schemaOtp.parse({ otp });

      console.log(otpResponse.otpId, validatedOtp.otp);
      const result = await pb
        .collection("users")
        .authWithOTP(otpResponse.otpId, validatedOtp.otp);

      if (!result) {
        console.log("OTP verification failed.");
        msg = "OTP verification failed. Please try again.";
        isLoading = false;
        return;
      }

      console.log("Verifying OTP success:", JSON.stringify(result));
      goto("/dashboard");
    } catch (error) {
      if (error instanceof ZodError) {
        error.errors.forEach((err) => {
          console.log(err.message);
          otpError += `${err.message} `;
        });
      } else {
        msg = "OTP verification failed. Please try again.";
        console.error("Verifying OTP failed:", error);
      }
    } finally {
      isLoading = false;
    }
  }

  function resetForm() {
    showOtp = false;
    email = "";
    otp = "";
    msg = "";
    emailError = "";
    otpError = "";
  }
</script>

{#if $user}
  <p class="text-lg">
    Signed in as <span class="font-semibold">{$user.username}</span>
  </p>
  <Button on:click={signOut} variant="outline">Sign Out</Button>
{:else}
  <h2 class="text-2xl font-bold mb-12 text-center">
    {showOtp ? "Enter OTP" : "Sign In"}
  </h2>

  <form on:submit|preventDefault class="space-y-4">
    {#if !showOtp}
      <div class="space-y-2">
        <Label for="email">Email</Label>
        <Input
          placeholder="your@email.com"
          type="email"
          id="email"
          bind:value={email}
          class={emailError ? "border-red-500" : ""}
        />
        {#if emailError}
          <p class="text-sm text-red-500">{emailError}</p>
        {/if}
      </div>

      {#if msg}
        <p
          class={msg.toLowerCase().includes("error") ||
          msg.toLowerCase().includes("fail")
            ? "text-red-500 text-sm"
            : "text-green-600 text-sm"}
        >
          {msg}
        </p>
      {/if}

      <Button on:click={sendOtp} class="w-full" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send OTP"}
      </Button>
    {:else}
      <div class="space-y-2">
        <Label for="otp">One-Time Password</Label>
        <Input
          placeholder="Enter OTP"
          type="text"
          id="otp"
          bind:value={otp}
          class={otpError ? "border-red-500" : ""}
        />
        {#if otpError}
          <p class="text-sm text-red-500">{otpError}</p>
        {/if}
      </div>

      {#if msg}
        <p
          class={msg.toLowerCase().includes("error") ||
          msg.toLowerCase().includes("fail")
            ? "text-red-500 text-sm"
            : "text-green-600 text-sm"}
        >
          {msg}
        </p>
      {/if}

      <div class="flex gap-2">
        <Button
          on:click={resetForm}
          variant="outline"
          class="flex-1"
          disabled={isLoading}
        >
          Back
        </Button>
        <Button on:click={login} class="flex-1" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Login"}
        </Button>
      </div>
    {/if}
  </form>
{/if}
