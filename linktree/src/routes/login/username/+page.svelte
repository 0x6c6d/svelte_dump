<script lang="ts">
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
</script>

<div class="flex flex-col">
  {#if $message}
    <span class="text-emerald-400 mb-2">
      {$message}
    </span>
  {/if}
  <form method="POST" use:enhance class="w-full md:w-96 space-y-2 p-4 lg:p-0">
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
            />
            <Description class="text-muted-foreground text-xs mt-1">
              This is your public display name
            </Description>
          {/snippet}
        </Control>
        <FieldErrors class="text-sm text-destructive" />
      </Field>
    </div>
    <div>
      <Button size="sm" type="submit">Submit</Button>
    </div>
  </form>
</div>
