<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { get } from "svelte/store";
  
  import { currentUser } from "./store";
  import Navbar from "./lib/Navbar.svelte";
  import CardsDeck from "./lib/CardsDeck.svelte";
  import { socket } from "./sockets";
  import { initRoom } from "./utils";
  import Stories from "./lib/Stories.svelte";
  import Session from "./lib/Session.svelte";
  import { estimationHandler, onRoomJoin, onRoomLeave } from "./lib/utils";
  import { getCurrentUser } from "./services/userService";
  import { getRoomData } from "./services/roomService";
  import ToastWrapper from "./lib/ToastWrapper.svelte";
  

  onMount(() => {
    getCurrentUser().then((user) => {
      currentUser.set(user);

      socket.emit('joinRoom', {user: {...user, online: true}});
    });

    getRoomData().then((roomData) => {
      initRoom(roomData);
    });

    socket.on('joinRoom', onRoomJoin)
    socket.on('estimation', estimationHandler);
    socket.on("leaveRoom", onRoomLeave);


    return () => {
      socket.off("estimation", estimationHandler);
      socket.off("leaveRoom", onRoomLeave);
      socket.off("joinRoom", onRoomJoin);
    };
  });

  onMount(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        
        socket.emit('leaveRoom', {user: get(currentUser)});
    };

    // fires when the user closes the tab
    window.addEventListener("beforeunload", handleBeforeUnload);

    onDestroy(() => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    });
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
