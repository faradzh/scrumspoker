<script lang="ts">
    import { toastState } from "../state.svelte";
    import Toast from "./Toast.svelte";
</script>

  <div class="toast toast-end toast-top">
      {#each toastState.messages as message}
          <Toast toast={message} />
      {/each}
  </div>