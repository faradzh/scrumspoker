<script lang="ts">
  import { onMount } from 'svelte';

  import cardBack from '../assets/card-cover.svg';
  import { selectedCards, userStore } from '../store';
  import type { SelectedCard, User } from './types';

  let cardElement: HTMLDivElement;
  $: currentUser = {} as User;

  userStore.subscribe((user) => currentUser = user);

  onMount(() => {
    selectedCards.update((prevCards) => {
      const nextCards = [...prevCards];
      const cardToUpdateIndex = prevCards.findIndex((prevCard) => prevCard.id == pokerCard.id);
      nextCards[cardToUpdateIndex].ref = cardElement;
      return nextCards;
    });
  });


  export let pokerCard: SelectedCard;
  const isMyCard = currentUser.id === pokerCard.userId;
</script>

<div class="poker-card--selected mr-4 basis-[100px] shrink-0 cursor-pointer" bind:this={cardElement}>
  <div class="front w-full h-full">
    <img src={isMyCard ? pokerCard.link : cardBack} alt="">
  </div>
  <div class="back absolute top-0 left-0 w-full h-full">
    <img src={pokerCard.link} alt="">
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
