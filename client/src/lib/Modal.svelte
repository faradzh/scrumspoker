<script lang="ts">
  import {modalStore} from "../store";
  import AdminForm from "./AdminForm.svelte";

  let dialog: HTMLDialogElement | null = $state(null);

  function closeModal() {
    modalStore.update((store) => ({...store, isOpen: false}));
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog bind:this={dialog} class="modal {$modalStore.isOpen ? 'modal-open' : ''}" onclick={(e) => {if (e.target === dialog) closeModal()}}>
  <div class="modal-box w-11/12 max-w-xl m-auto">
    <h3 class="text-lg font-bold">Hello!</h3>
    <AdminForm />
    <div class="modal-action">
      <form method="dialog" onsubmit={closeModal}>
        <button class="btn btn-primary">Create</button>
        <button class="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>
