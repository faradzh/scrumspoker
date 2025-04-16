<script lang="ts">
  import { modalStore } from "../store";

  function openModal() {
    modalStore.update((store) => ({ ...store, isOpen: true }));
  }
</script>

<div class="pb-6">
  <div class="flex justify-between items-center">
    <div class="sm:text-center lg:text-left">
      <h1 class="text-2xl font-semibold text-[var(--color-text)]">
        Estimation Rooms
      </h1>
    </div>

    <button class="btn btn-primary" onclick={openModal}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span> 
        Create Room
      </span>
    </button>
  </div>
</div>
