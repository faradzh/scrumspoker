<script lang="ts">
  import anime from 'animejs/lib/anime.es';
  import { selectedCards, type SelectedCard } from "../store";
  import Card from "./Card.svelte";

  let pokerCards: SelectedCard[];
  let playing: boolean = false;

  selectedCards.subscribe((value) => pokerCards = value);

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
  };

  function handleReestimate() {
    selectedCards.update(() => []);
  }

</script>

<section class="playground">
  <div class="table-of-cards">
    {#each pokerCards as pokerCard}
      <Card {pokerCard} />
    {/each}
  </div>
  <div class="action-buttons">
    {#if pokerCards.length > 0}
      <button class="reveal" on:click={clickHandler}>Reveal</button>
      <button class="reestimate" on:click={handleReestimate}>Re-estimate</button>
    {/if}
  </div>
</section>

<style>
  .playground {
    grid-area: playground;
    background-color: rgb(52, 36, 117);
  }

  .table-of-cards {
    display: flex;
    padding: 24px;
    overflow-x: auto;
  }

  .action-buttons {
    width: 100%;
    text-align: center;
  }

  button.reveal {
    background-color: orange;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
  }

  button.reestimate {
    background-color:cadetblue;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
  }
</style>
