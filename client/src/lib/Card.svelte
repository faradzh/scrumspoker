<script lang="ts">
  import cardBack from '../assets/Cover option 2.svg';
  import { onMount } from 'svelte';
  import { selectedCards, type SelectedCard } from '../store';

  let cardElement: HTMLDivElement;

  onMount(() => {
    selectedCards.update((prevCards) => {
      const nextCards = [...prevCards];
      const cardToUpdateIndex = prevCards.findIndex((prevCard) => prevCard.id == pokerCard.id);
      nextCards[cardToUpdateIndex].ref = cardElement;
      return nextCards;
    });
  });

  export let pokerCard: SelectedCard;
</script>

<div class="poker-card--selected mr-4 basis-[100px] shrink-0 cursor-pointer" bind:this={cardElement}>
  <div class="front w-full h-full">
    <img src={cardBack} alt="">
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
