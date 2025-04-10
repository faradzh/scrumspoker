<script lang="ts">
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  
  import { currentUser, participants } from "./store";
  import Navbar from "./lib/Navbar.svelte";
  import CardsDeck from "./lib/CardsDeck.svelte";
  import { socket } from "./sockets";
  import { initRoom } from "./utils";
  import Stories from "./lib/Stories.svelte";
  import Session from "./lib/Session.svelte";
  import { estimationHandler } from "./lib/utils";
  import { getCurrentUser } from "./services/userService";
  import { getRoomData } from "./services/roomService";
  import ToastWrapper from "./lib/ToastWrapper.svelte";
  

  onMount(() => {
    Promise.all([getCurrentUser(), getRoomData()]).then((values) => {
      const [user, roomData] = values;

      currentUser.set(user);
      initRoom(roomData);

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
        socket.disconnect();
    };

    // fires when the user closes the tab
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  });
</script>

<Navbar />
<main class="bg-gray-50 h-screen overflow-y-hidden">
  <div class="mx-auto px-8 max-w-screen-2xl h-screen">
    <div class="pb-20 grid gap-4 sm:mt-16 lg:grid-cols-[1fr_4fr] lg:grid-rows-[auto_225px] h-screen">
      <Stories />
      <Session />
      <CardsDeck />
    </div>
  </div>
</main>
<ToastWrapper />
