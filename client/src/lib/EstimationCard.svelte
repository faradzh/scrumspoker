<script lang="ts">
  import { addCardRef } from './utils';
  import { currentIssueId, currentUser, issuesStore, sessionInfo } from '../store';
  import type { SelectedCard } from './types';
  import { get } from 'svelte/store';
  import BaseCard from './BaseCard.svelte';

  let cardElement: HTMLDivElement | undefined = $state();
  let { card }: Props = $props();

  $effect(() => {
    if (!shouldAddRef()) {
      addCardRef(cardElement!);
    }
  });

  interface Props {
    card: SelectedCard;
  }

  function shouldAddRef() {
    const session = get(sessionInfo);

    if (!$currentIssueId) {
      return false;
    }

    if (get(currentUser).id === card.userId) {
      return true;
    }
    
    return session[$currentIssueId]?.cardsAreFlipped || session[$currentIssueId]?.estimationIsRevealed;
  }
</script>

<div class="relative cursor-pointer ">
  <div class="poker-card--selected" bind:this={cardElement}>
    <div class="front h-32">
      <BaseCard card={{...card, link: shouldAddRef() ? card.link : "/card-cover.svg"}} />
    </div>
    <div class="back absolute top-0 left-0 h-32">
      <img class="rounded-lg h-full w-full shadow-md" src={card.link} alt="">
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
