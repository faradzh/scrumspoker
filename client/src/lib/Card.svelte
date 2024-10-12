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
      console.log('nextCards', nextCards);

      return nextCards;
    });
  });

  export let pokerCard: SelectedCard;
</script>

<div class="poker-card--selected" bind:this={cardElement}>
  <div class="front">
    <img src={cardBack} alt="">
  </div>
  <div class="back">
    <img src={pokerCard.link} alt="">
  </div>
</div>

<style>
  .poker-card--selected {
    margin-right: 24px;
    flex-basis: 100px;
    flex-shrink: 0;
    cursor: pointer;
    transform-style: preserve-3d;
  }

  .front, .back {
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
  }

  .back {
    position: absolute;
    top: 0;
    left: 0;
    transform: rotateY(180deg);
  }
</style>
