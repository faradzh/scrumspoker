<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  import { currentUser, sessionInfo } from '../store';
  import type { SelectedCard } from './types';
  import { addCardRef } from './utils';

  let cardElement: HTMLDivElement | undefined = $state();
  let { card }: Props = $props();

  onMount(() => {
    addCardRef(card, cardElement!);
  });

  interface Props {
    card: SelectedCard;
  }

  function isMyCard() {
    if (get(currentUser).id === card.user.id) {
      return true;
    }
    return get(sessionInfo).estimationIsRevealed;
  }
  const userPicture = card.user.picture;
</script>

<div class="relative mr-4 basis-[100px] shrink-0 cursor-pointer">
  <div class="avatar placeholder absolute top-[-16px] right-[-16px] z-[1]">
    <div class="ring-primary ring-offset-base-100 ring ring-offset-2 w-12 rounded-full">
      <!-- <span class="text-xl">AI</span> -->
      <img src={userPicture} alt="User avatar"/>
    </div>
  </div>
  <div class="poker-card--selected " bind:this={cardElement}>
    <div class="front w-full h-full">
      <img src={isMyCard() ? card.link : "/card-cover.svg"} alt="">
    </div>
    <div class="back absolute top-0 left-0 w-full h-full">
      <img src={card.link} alt="">
    </div>
  </div>
</div>


<style>
  .poker-card--selected {
    transform-style: preserve-3d;
  }

  .front, .back {
    backface-visibility: hidden;
  }

  .back {
    transform: rotateY(180deg);
  }
</style>
