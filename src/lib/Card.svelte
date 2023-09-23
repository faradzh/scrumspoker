<script lang="ts">
  import anime from 'animejs/lib/anime.es';
  export let pokerCard: string = '';
</script>

<div class="poker-card--selected">
  <div class="front">
    <img src={pokerCard} alt="">
  </div>
  <div class="back"></div>
</div>

<style>
  .poker-card--selected {
    margin-right: 24px;
    flex-basis: 100px;
    flex-shrink: 0;
    cursor: pointer;
    transform-style: preserve-3d;
  }
</style>
