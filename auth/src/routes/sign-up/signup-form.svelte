<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { formSchema, type FormSchema } from "./schema";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  export let data: SuperValidated<Infer<FormSchema>>;

  const form = superForm(data, {
    validators: zodClient(formSchema),
  });

  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
  <div class="flex flex-row">
    <Form.Field {form} name="first_name" class="me-2">
      <Form.Control let:attrs>
        <Form.Label>First Name</Form.Label>
        <Input {...attrs} bind:value={$formData.first_name} type="string" />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="last_name" class="ms-2">
      <Form.Control let:attrs>
        <Form.Label>Last Name</Form.Label>
        <Input {...attrs} bind:value={$formData.last_name} type="string" />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
  </div>

  <Form.Field {form} name="email">
    <Form.Control let:attrs>
      <Form.Label>Email</Form.Label>
      <Input {...attrs} bind:value={$formData.email} type="email" />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="password">
    <Form.Control let:attrs>
      <Form.Label>Password</Form.Label>
      <Input {...attrs} bind:value={$formData.password} type="password" />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Button class="w-full font-semibold mt-5 rounded-full"
    >Create new account</Form.Button
  >
</form>
