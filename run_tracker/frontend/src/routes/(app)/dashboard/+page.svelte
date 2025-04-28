<script lang="ts">
  import { onMount } from "svelte";
  import type { Run, CreateRunInput } from "$lib/common/types";
  import { user } from "$lib/pb/auth";
  import * as Button from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as Input from "$lib/components/ui/input";
  import * as Label from "$lib/components/ui/label";
  import * as Textarea from "$lib/components/ui/textarea";
  import { addRunAsync } from "$lib/pb/runs";

  // State for runs and form
  let runs: Run[] = $state([]);
  let showAddDialog = $state(false);
  let newRun: CreateRunInput = $state({
    userId: $user?.id ?? "",
    date: new Date(),
    distance: 0,
    comment: "",
  });

  // TODO: Load runs from PB
  onMount(() => {});

  // Add a new run
  async function addRun() {
    const result = await addRunAsync(newRun);

    runs = [
      ...runs,
      {
        id: result,
        userId: newRun.userId,
        date: newRun.date,
        distance: newRun.distance,
        comment: newRun.comment,
      },
    ];

    resetForm();
    showAddDialog = false;
  }

  // TODO: Delete a run
  function deleteRun(id: string) {}

  // Reset the form
  function resetForm() {
    newRun = {
      userId: $user?.id ?? "",
      distance: 0,
      date: new Date(),
      comment: "",
    };
  }
</script>

<div class="container mx-auto py-8">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-3xl font-bold">My Runs</h1>
    <Button.Root on:click={() => (showAddDialog = true)}>Add Run</Button.Root>
  </div>

  <!-- Runs Table -->
  <div class="bg-white rounded-lg shadow overflow-hidden">
    {#if runs.length === 0}
      <div class="p-8 text-center">
        <p class="text-gray-500">
          No runs added yet. Click the "Add Run" button to get started!
        </p>
      </div>
    {:else}
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Date</th
            >
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Distance (km)</th
            >
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Comment</th
            >
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Actions</th
            >
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each runs as run (run.id)}
            <tr>
              <td class="px-6 py-4 whitespace-nowrap"
                >{new Date(run.date).toLocaleDateString()}</td
              >
              <td class="px-6 py-4 whitespace-nowrap">{run.distance}</td>
              <td class="px-6 py-4">{run.comment}</td>
              <td class="px-6 py-4 text-right">
                <Button.Root
                  variant="destructive"
                  size="sm"
                  on:click={() => deleteRun(run.id)}
                >
                  Delete
                </Button.Root>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>

  <!-- Add Run Dialog -->
  <Dialog.Root bind:open={showAddDialog}>
    <Dialog.Content class="sm:max-w-md">
      <Dialog.Header>
        <Dialog.Title>Add New Run</Dialog.Title>
        <Dialog.Description>
          Enter the details of your run below
        </Dialog.Description>
      </Dialog.Header>

      <form class="space-y-4">
        <div class="space-y-2">
          <Label.Root for="date">Date</Label.Root>
          <Input.Root type="date" id="date" bind:value={newRun.date} required />
        </div>

        <div class="space-y-2">
          <Label.Root for="distance">Distance (km)</Label.Root>
          <Input.Root
            type="number"
            id="distance"
            step="0.01"
            min="0"
            bind:value={newRun.distance}
            required
          />
        </div>

        <div class="space-y-2">
          <Label.Root for="comment">Comment</Label.Root>
          <Textarea.Root
            id="comment"
            bind:value={newRun.comment}
            placeholder="How did your run go?"
          />
        </div>

        <div class="flex justify-end space-x-2">
          <Button.Root
            type="button"
            variant="outline"
            on:click={() => {
              resetForm();
              showAddDialog = false;
            }}
          >
            Cancel
          </Button.Root>
          <Button.Root type="submit" on:click={addRun}>Save Run</Button.Root>
        </div>
      </form>
    </Dialog.Content>
  </Dialog.Root>
</div>
