<script lang="ts">
  import AuthCheck from "$lib/components/shared/AuthCheck.svelte";
  import { db, user, userData } from "$lib/firebase";
  import { doc, getDoc, writeBatch } from "firebase/firestore";
  // form validation
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import type { PageData } from "./$types";
  import { usernameSchema } from "$lib/schemas/username";
  // > bun add formsnap
  import { Field, Control, Label, Description, FieldErrors } from "formsnap";
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";

  // form validation
  let { data }: { data: PageData } = $props();

  const form = superForm(data.form, {
    validators: zodClient(usernameSchema),
  });

  const { form: formData, enhance, message } = form;

  // data validation
  let debounceTimer: NodeJS.Timeout;
  let username = $state("");
  let loading = $state(false);
  let isAvailable = $state(false);
  let isTouched = $derived(username.length > 0);
  let isTaken = $derived(!isAvailable && !loading && isTouched);

  function checkAvailability() {
    username = $formData.username;
    isAvailable = false;
    clearTimeout(debounceTimer);
    loading = true;

    debounceTimer = setTimeout(async () => {
      console.log("checking availability of", username);

      const ref = doc(db, "usernames", username);
      const exists = await getDoc(ref).then((doc) => doc.exists());

      isAvailable = !exists;
      loading = false;
    }, 500);
  }

  async function confirmUsername(e: SubmitEvent) {
    e.preventDefault();
    console.log("confirming username", username);
    const batch = writeBatch(db);
    batch.set(doc(db, "usernames", username), { uid: $user?.uid });
    batch.set(doc(db, "users", $user!.uid), {
      username,
      photoURL: $user?.photoURL ?? null,
      published: true,
      bio: "I am the Walrus",
      links: [
        {
          title: "Test Link",
          url: "https://google.com",
          icon: "custom",
        },
      ],
    });

    await batch.commit();

    username = "";
    isAvailable = false;
  }
</script>

<AuthCheck>
  {#if $userData?.username}
    <p class="text-lg">
      Your username is <span class="font-bold">@{$userData.username}</span>
    </p>
    <p class="text-sm">(Usernames cannot be changed)</p>
    <a class="btn btn-primary" href="/login/photo">Upload Profile Image</a>
  {:else}
    <div class="flex flex-col">
      {#if $message}
        <span class="text-emerald-400 mb-2">
          {$message}
        </span>
      {/if}
      <form
        method="POST"
        use:enhance
        class="w-full md:w-96 space-y-2 p-4 lg:p-0"
        onsubmit={confirmUsername}
      >
        <div>
          <Field {form} name="username">
            <Control>
              {#snippet children({ props })}
                <Label class="font-medium mb-1">Username</Label>
                <Input
                  {...props}
                  type="text"
                  placeholder="Enter your username"
                  bind:value={$formData.username}
                  oninput={checkAvailability}
                />
                <Description class="text-muted-foreground text-xs mt-1">
                  {#if loading}
                    Checking availability of @{username}...
                  {:else if isTaken}
                    The username is already taken
                  {:else}
                    This is your public display name
                  {/if}
                </Description>
              {/snippet}
            </Control>
            <FieldErrors class="text-sm text-destructive" />
          </Field>
        </div>
        {#if isAvailable}
          <div>
            <Button size="sm" type="submit">Submit</Button>
          </div>
        {/if}
      </form>
    </div>
  {/if}
</AuthCheck>
