<script lang="ts">
  import { addCardRef } from './utils';
  import { currentIssueId, currentUser, sessionInfo } from '../store';
  import type { Card, SelectedCard } from './types';
  import { get } from 'svelte/store';
  import BaseCard from './BaseCard.svelte';

  let cardElement: HTMLDivElement | undefined = $state();
  let { card }: Props = $props();

  $effect(() => {
    if (!shouldBeOpen()) {
      addCardRef(cardElement!);
    }
  });

  interface Props {
    card: SelectedCard;
  }

  function shouldBeOpen() {
    const session = get(sessionInfo);

    if (!$currentIssueId) {
      return;
    }

    if (session[$currentIssueId]?.cardsAreFlipped || session[$currentIssueId]?.cardsAreRevealed) {
      return true;
    }

    if (get(currentUser).id === card.userId) {
      return true;
    }
    
    return false;
  }

</script>

<div class="relative cursor-pointer">
  <div class="poker-card--selected" bind:this={cardElement}>
    <div class="front h-28">
      <BaseCard card={{value: shouldBeOpen() ? card.value : undefined, link: shouldBeOpen() ? card.link : "/card-cover.webp"} as Card} />
    </div>
    <div class="back absolute top-0 left-0 h-32 w-20">
      <BaseCard card={card} />
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
