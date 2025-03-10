<script lang="ts">
  import { onMount } from "svelte";
  
  import Navbar from "./lib/Navbar.svelte";
  import CardsDeck from "./lib/CardsDeck.svelte";
  import { socket } from "./sockets";
  import { selectedCards, currentUser, sessionInfo, participants } from "./store";
  import { getCardByValue } from "./utils";
  import Stories from "./lib/Stories.svelte";
  import Session from "./lib/Session.svelte";
  import { estimationHandler } from "./lib/utils";
  import { get } from "svelte/store";
  import { getCurrentUser } from "./services/userService";
  import { getRoomData } from "./services/roomService";

  async function fetchRoomData() {
    getRoomData().then((data) => {
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
    })
  }

  onMount(() => {
    Promise.all([getCurrentUser(), fetchRoomData()]).then((values) => {
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
<main class="bg-gray-50 h-full overflow-y-hidden">
  <div class="mx-auto px-8 max-w-screen-2xl">
    <div class="mt-10 pb-10 grid gap-4 sm:mt-16 lg:grid-cols-[280px_1fr] lg:grid-rows-[235px_240px]">
      <Stories />
      <Session />
      <CardsDeck />
    </div>
  </div>
</main>
