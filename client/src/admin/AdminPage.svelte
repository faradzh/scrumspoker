<script lang="ts">
  import { onMount } from "svelte";
  import { QueryClientProvider } from '@tanstack/svelte-query';

  import Modal from "./Modal.svelte";
  import RoomsList from "./RoomsList.svelte";
  import { currentUser, rooms } from "../store";
  import Main from "./Main.svelte";
  import BlockHeader from "./BlockHeader.svelte";
  import FormWrapper from "./FormWrapper.svelte";
  import { queryClient } from "./constants";
  import { getCurrentUser } from "../services/userService";

  async function fetchRooms() {
    try {
      const response =  await fetch('/rooms');
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      const data = await response.json();
      rooms.set(data);
    } catch (error) {
      console.error(error);
    }
  }

  onMount(() => {
      fetchRooms();
      getCurrentUser().then((user) => {
        currentUser.set(user)}
      );
  });
</script>

<QueryClientProvider client={queryClient}>
  <div class="min-h-full">
    <Main>
      <BlockHeader />
      <RoomsList />
    </Main>
  </div>
  <Modal>
    <FormWrapper />
  </Modal>
</QueryClientProvider>
