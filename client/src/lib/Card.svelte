<script lang="ts">
  import { onMount } from 'svelte';

  import cardBack from '../../public/card-cover.svg';
  import { addCardRef, currentUser, session } from '../store';
  import type { SelectedCard } from './types';
  import { get } from 'svelte/store';

  let cardElement: HTMLDivElement | undefined = $state();
  let { card }: Props = $props();

  onMount(() => {
    addCardRef(card, cardElement!);
  });

  interface Props {
    card: SelectedCard;
  }

  function isMyCard() {
    if (get(currentUser).id === card.userId) {
      return true;
    }
    return get(session).estimationIsRevealed;
  }
</script>

<div class="poker-card--selected mr-4 basis-[100px] shrink-0 cursor-pointer" bind:this={cardElement}>
  <div class="front w-full h-full">
    <img src={isMyCard() ? card.link : cardBack} alt="">
  </div>
  <div class="back absolute top-0 left-0 w-full h-full">
    <img src={card.link} alt="">
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
