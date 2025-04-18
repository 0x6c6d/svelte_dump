<script lang="ts">
  import { requestSignInOTP, verifyOTP } from "$lib/pocketbase/auth";
  import Button from "$lib/components/ui/button/button.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import type { OTPResponse } from "pocketbase";

  let errorMsg = $state("");
  let otpSend = $state(false);
  let otpResponse: OTPResponse;

  async function sendOTP() {
    errorMsg = "";
    otpSend = false;
    const result = await requestSignInOTP("lucasjmenke@gmail.com");

    if (!result.success) {
      errorMsg = result.message;
      otpSend = false;
    } else {
      errorMsg = "";
      otpSend = true;
      otpResponse = result.data!;
    }
  }

  async function logIn() {
    errorMsg = "";
    console.log("OTPRresponse: ", otpResponse);
    var result = await verifyOTP(otpResponse, "123456");

    if (!result.success) {
      errorMsg = result.message;
    } else {
      errorMsg = "";
    }
  }
</script>

<!-- TODO: form validation with zod-->
{#if !otpSend}
  <form>
    <div class="grid w-full items-center gap-4">
      <div class="flex flex-col space-y-1.5">
        <Label for="email">Email</Label>
        <Input id="email" placeholder="" />
      </div>
      <Button class="mt-5" onclick={sendOTP}>Send OTP</Button>
      <p class="">{errorMsg}</p>
    </div>
  </form>
{:else}
  <form>
    <div class="grid w-full items-center gap-4">
      <div class="flex flex-col space-y-1.5">
        <Label for="otp">OTP</Label>
        <Input id="otp" placeholder="" />
      </div>
      <Button class="mt-5" onclick={logIn}>Log in</Button>
      <p class="">{errorMsg}</p>
    </div>
  </form>
{/if}
