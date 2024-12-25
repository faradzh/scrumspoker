<script lang="ts">
  import {modalStore} from "../store";

  let dialog: HTMLDialogElement | null = $state(null);

  function closeModal() {
    modalStore.update((store) => ({...store, isOpen: false}));
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog bind:this={dialog} class="modal {$modalStore.isOpen ? 'modal-open' : ''}" onclick={(e) => {if (e.target === dialog) closeModal()}}>
  <div class="modal-box w-11/12 max-w-5xl">
    <h3 class="text-lg font-bold">Hello!</h3>
    <p class="py-4">Click the button below to close</p>
    <div class="modal-action">
      <form method="dialog">
        <!-- if there is a button, it will close the modal -->
        <button class="btn" onclick={closeModal}>Close</button>
      </form>
    </div>
  </div>
</dialog>
