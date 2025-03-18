<script lang="ts">
  import { onMount } from "svelte";
  import AdminForm from "./lib/AdminForm.svelte";
  import Modal from "./lib/Modal.svelte";
  import RoomsList from "./lib/RoomsList.svelte";
  import { rooms } from "./store";
  import Main from "./admin/Main.svelte";
  // import MainHeader from "./admin/MainHeader.svelte";
  import BlockHeader from "./admin/BlockHeader.svelte";

  const formData = $state({
    name: '',
    estimationMethod: ''
  });

  let formRef: HTMLFormElement | null = $state(null);

  const triggerFormSubmit = () => {
    if (formRef) {
      formRef.requestSubmit(); // Triggers the form's submit event
    }
  };

  async function onSubmit(event: Event) {
    event?.preventDefault();
    console.log(JSON.stringify(formData));

    const response = await fetch('/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const room = await response.json();
    rooms.update((prevRooms) => [...prevRooms, room]);
  };

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
  });
</script>



<div class="min-h-full">
  <!-- <MainHeader /> -->
  <Main>
    <BlockHeader />
    <RoomsList />
  </Main>
</div>
<Modal onClose={triggerFormSubmit}>
  <AdminForm bind:formRef values={formData} onSubmit={onSubmit}/>
</Modal>
