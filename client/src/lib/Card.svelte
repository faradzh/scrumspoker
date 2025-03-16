<script lang="ts">
  import { addCardRef } from './utils';
  import { currentUser, sessionInfo } from '../store';
  import type { SelectedCard } from './types';
  import { get } from 'svelte/store';
  import { storiesState } from '../state.svelte';

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
    const selectedStoryId = storiesState.selectedStory?.id;

    if (!selectedStoryId) {
      return false;
    }

    if (get(currentUser).id === card.userId) {
      return true;
    }
    
    return get(sessionInfo)[selectedStoryId]?.estimationIsRevealed;
  }
</script>

<div class="relative basis-[200px] shrink-0 cursor-pointer min-w-[80px]">
  <div class="poker-card--selected " bind:this={cardElement}>
    <div class="front w-full h-full">
      <img class="rounded-lg" src={shouldAddRef() ? card.link : "/card-cover.svg"} alt="">
    </div>
    <div class="back absolute top-0 left-0 w-full h-full">
      <img class="rounded-lg" src={card.link} alt="">
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
