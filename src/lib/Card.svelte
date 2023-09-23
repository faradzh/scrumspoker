<script lang="ts">
  import anime from 'animejs/lib/anime.es';
  import cardBack from '../assets/Cover option 2.svg';

  let playing: boolean = false;
  let cardElement: HTMLDivElement;

  function flip(target: HTMLDivElement) {
    if(playing)
      return;

    playing = true;

    anime({
      targets: target,
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
    flip(cardElement);
  };

  export let pokerCard: string = '';
</script>

<div class="poker-card--selected" bind:this={cardElement} on:click={clickHandler}>
  <div class="front">
    <img src={cardBack} alt="">
  </div>
  <div class="back">
    <img src={pokerCard} alt="">
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
