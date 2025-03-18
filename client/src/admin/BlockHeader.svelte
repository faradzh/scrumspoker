<script lang="ts">
  import { modalStore } from "../store";

  function openModal() {
    modalStore.update((store) => ({ ...store, isOpen: true }));
  }
</script>

<div class="pb-6">
  <div class="flex justify-between items-center">
    <div class="sm:text-center lg:text-left">
      <h1 class="text-2xl font-semibold text-black dark:text-violet-300">
        Estimation Rooms
      </h1>
    </div>

    <button class="btn bg-violet-600 hover:bg-violet-700 text-white min-h-10 h-10 pl-2" onclick={openModal}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Create Room
    </button>
  </div>
</div>
