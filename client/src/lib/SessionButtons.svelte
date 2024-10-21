<script lang="ts">
  import anime from 'animejs/lib/anime.es';

  import { socket } from "../sockets";
  import { selectedCards, type SelectedCard, userStore, type User } from "../store";

  let pokerCards: SelectedCard[];
  let user: User;

  let playing: boolean = false;

  selectedCards.subscribe((value) => pokerCards = value);
  userStore.subscribe((value) => user = value);

  socket.on('reveal', () => {
    const refList = pokerCards.map((pokerCard) => pokerCard.ref!);
    flip(refList);
  });

  function flip(targets: HTMLDivElement[]) {
    if(playing)
      return;

    playing = true;

    anime({
      targets,
      scale: [{value: 1}, {value: 1.4}, {value: 1, delay: 250}],
      rotateY: {value: '+=180', delay: 200},
      easing: 'easeInOutSine',
      duration: 400,
      complete: function(anim){
        playing = false;
      }
    });
  }

  function clickHandler() {
    const refList = pokerCards.map((pokerCard) => pokerCard.ref!);
    flip(refList);

    socket.emit('reveal');
  };


  function reestimeHandler() {
    selectedCards.update(() => []);
  }
</script>

<div class="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
  <div class="flex justify-between px-8 pt-8 sm:px-10 sm:pt-10">
    {#if user?.isModerator}
      <button type="button" on:click={clickHandler} class="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Reveal</button>
    {/if}
    <button type="button" on:click={reestimeHandler} class="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Re-estimate</button>
    <button type="button" class="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Save</button>
  </div>
</div>
