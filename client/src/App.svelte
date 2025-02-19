<script lang="ts">
  import { onMount } from "svelte";
  
  import CardsList from "./lib/CardsList.svelte";
  import Navbar from "./lib/Navbar.svelte";
  import Playground from "./lib/Playground.svelte";
  import { socket } from "./sockets";
  import { selectedCards, currentUser, sessionInfo, participants } from "./store";
  import { getCardByValue } from "./utils";
  import Stories from "./lib/Stories.svelte";
  import Session from "./lib/Session.svelte";
  import { estimationHandler } from "./lib/utils";
  import { get } from "svelte/store";

  async function fetchCurrentUser() {
    return fetch("/api/current-user", {headers: { 'Accept': 'application/json' }})
      .then((res) => res.json())
  }

  function fetchRoomData() {
    const roomId = location.pathname.split("/").pop();
    
    fetch(`/rooms/${roomId}`, {headers: { 'Accept': 'application/json' }})
      .then((res) => res.json())
      .then((data) => {
        console.log("Data", data);
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
        sessionInfo.update((prevSession) => ({ ...prevSession, estimationIsRevealed: data.estimationIsRevealed }));
        participants.set(data.participants);
      });
  }

  onMount(() => {
    Promise.all([fetchCurrentUser(), fetchRoomData()]).then((values) => {
      const [user] = values;
      currentUser.set(user);

      socket.emit('joinRoom', {user});

      socket.on('joinRoom', ({user}) => {
        if (get(participants).find((participant) => participant.id === user.id)) {
          return;
        }
        participants.update((prevParticipants) => [...prevParticipants, user]);
      });
    });

    socket.on('estimation', estimationHandler);

    socket.on("leaveRoom", ({user}) => {
      participants.update((prevParticipants) => prevParticipants.filter((participant) => participant.id !== user.id));
    });

    return () => {
      socket.off("estimation", estimationHandler);
      socket.off("leaveRoom");
      socket.off("joinRoom");
    };
  });

  onMount(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        socket.emit('leaveRoom', {user: get(currentUser)});
    };

    // fires when the user closes the tab
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  });
</script>

<Navbar />
<main class="bg-gray-50 h-full">
  <div class="mx-auto px-8">
    <div class="mt-10 pb-10 grid gap-4 sm:mt-16 lg:grid-cols-[1fr_1fr_364px] lg:grid-rows-[250px_250px_200px]">
      <Stories />
      <Session />
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
