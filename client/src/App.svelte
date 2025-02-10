<script lang="ts">
  import { onMount } from "svelte";

  import CardsList from "./lib/CardsList.svelte";
  import Navbar from "./lib/Navbar.svelte";
  import Playground from "./lib/Playground.svelte";
  import SessionButtons from "./lib/SessionButtons.svelte";
  import { socket } from "./sockets";
  import { selectedCards, currentUser, session } from "./store";
  import { getCardByValue } from "./utils";

  function handleEstimation(data) {
    selectedCards.update((prevCards) => [...prevCards, data.selectedCard]);
  }

  function fetchCurrentUser() {
    fetch("/api/current-user", {headers: { 'Accept': 'application/json' }})
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
          return;
        }

        currentUser.set(data);
      });
  }

  function fetchRoomData() {
    const roomId = location.pathname.split("/").pop();
    
    fetch(`/rooms/${roomId}`, {headers: { 'Accept': 'application/json' }})
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
          return;
        }
        currentUser.update((prevUser) => ({ ...prevUser, isModerator: $currentUser.id === data.moderatorId}));
        const initialSelectedCards = data.estimates.map((estimate) => {
          const card = getCardByValue(estimate.value);
          return {
            ...card,
            userId: estimate.userId,
          }
        });
        selectedCards.set(initialSelectedCards);
        session.update((prevSession) => ({ ...prevSession, estimationIsRevealed: data.estimationIsRevealed }));
      });
  }

  onMount(() => {
    Promise.all([fetchCurrentUser(), fetchRoomData()]);

    socket.on('estimation', handleEstimation);

    return () => {
      socket.off("estimation", handleEstimation);
    };
  });
</script>

<Navbar />
<main class="bg-gray-50 h-full">
  <div class="mx-auto px-8">
    <div class="mt-10 pb-10 grid gap-4 sm:mt-16 lg:grid-cols-[1fr_1fr_364px] lg:grid-rows-[250px_250px_200px]">
      <section class="relative lg:row-span-2">
        <div class="absolute inset-px rounded-lg bg-white lg:rounded-tl-[2rem]"></div>
        <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-tl-[calc(2rem+1px)]">
          <div class="px-8 pt-4 sm:px-8">
            <p class="mt-2 text-lg/7 font-medium tracking-tight text-gray-950 max-lg:text-center">Stories</p>
          </div>
        </div>
        <div class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-tl-[2rem]"></div>
      </section>
      <section class="relative max-lg:row-start-1">
        <div class="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
        <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
          <div class="px-8 pt-4 sm:px-8">
            <p class="mt-2 text-lg/7 font-medium tracking-tight text-gray-950 max-lg:text-center">Session</p>
          </div>
          <div class="flex justify-between px-8 pt-8 sm:px-10 sm:pt-10">
            <button type="button" class="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Start</button>
          </div>
        </div>
        <div class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]"></div>
      </section>
      <section class="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
        <div class="absolute inset-px rounded-lg bg-white"></div>
        <SessionButtons />
        <div class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
      </section>
      <section class="relative lg:row-span-2">
        <div class="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-tr-[2rem]"></div>
        <div class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-tr-[calc(2rem+1px)]">
          <CardsList />
        </div>
        <div class="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-tr-[2rem]"></div>
      </section>
      <section class="relative lg:col-span-full">
        <div class="bg-white w-full h-full lg:rounded-b-[calc(2rem+1px)] lg:rounded-t-[calc(theme(borderRadius.lg)+1px)]"></div>
        <div class="absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-b-[2rem]">
          <Playground />
        </div>
      </section>
    </div>
  </div>
</main>
