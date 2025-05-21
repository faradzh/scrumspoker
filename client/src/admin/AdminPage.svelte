<script lang="ts">
  import { onMount } from "svelte";
  import { QueryClientProvider } from '@tanstack/svelte-query';

  import Modal from "./Modal.svelte";
  import RoomsList from "./RoomsList.svelte";
  import { currentUser } from "../store";
  import Main from "./Main.svelte";
  import BlockHeader from "./BlockHeader.svelte";
  import { fetchCurrentUser } from "../services/userService";
  import Navbar from "../lib/Navbar.svelte";
  import ToastWrapper from "../lib/ToastWrapper.svelte";
  import queryClient from "./queryClient";

  async function getData() {
    const user = await fetchCurrentUser();
    currentUser.set(user)
  }
  
  onMount(() => {
    getData();
  });
</script>

<Navbar />
<main class="h-screen px-8">
  <QueryClientProvider client={queryClient}>
    <Main>
      <BlockHeader />
      <RoomsList />
    </Main>
    <Modal />
  </QueryClientProvider>
</main>
<ToastWrapper />
