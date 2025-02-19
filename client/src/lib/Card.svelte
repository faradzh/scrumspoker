<script lang="ts">
  import type { SelectedCard } from './types';
  import { addCardRef } from './utils';
  import { currentUser, participants, sessionInfo } from '../store';
  import { get } from 'svelte/store';

  let cardElement: HTMLDivElement | undefined = $state();
  let { card }: Props = $props();

  $effect(() => {
    if (!isMyCard()) {
      addCardRef(cardElement!);
    }
  });
    
  interface Props {
    card: SelectedCard;
  }

  function isMyCard() {
    if ($currentUser.id === card.userId) {
      return true;
    }
    return get(sessionInfo).estimationIsRevealed;
  }
  
  const userPicture = get(participants).find((participant) => {
    return participant.id === card.userId;
  })?.picture ?? '';

</script>

<div class="relative mr-8 basis-[100px] shrink-0 cursor-pointer">
  <div class="avatar placeholder absolute top-[-16px] right-[-16px] z-[1]">
    {#if userPicture}
      <div class="ring-primary ring-offset-base-100 ring ring-offset-2 w-12 rounded-full">
        <img src={userPicture} alt="User avatar"/>
      </div>
    {:else}
      <div class="bg-neutral text-neutral-content w-12 rounded-full">
        <span class="text-xl">RJ</span>
      </div>
    {/if}
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
