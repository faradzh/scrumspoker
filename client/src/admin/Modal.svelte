<script lang="ts">
  import {modalStore} from "../store";
  let dialog: HTMLDialogElement | null = $state(null);

  function closeModal() {
    modalStore.update((store) => ({...store, isOpen: false, Content: null, key: Date.now()}));
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog bind:this={dialog} class="modal {$modalStore.isOpen ? 'modal-open' : ''}" onclick={(e) => {if (e.target === dialog) closeModal()}}>
  <div class="modal-box w-11/12 max-w-md m-auto rounded-lg">
    {#key $modalStore.key }
      {#if $modalStore.Content}
        {@const Content = $modalStore.Content}
        <Content {...$modalStore.props}/>
      {/if}
    {/key}
  </div>
</dialog>
