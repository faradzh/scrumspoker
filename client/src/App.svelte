<script lang="ts">
  import CardsList from "./lib/CardsList.svelte";
  import Playground from "./lib/Playground.svelte";
</script>

<main>
    <header>
        <nav></nav>
    </header>
    <section class="integration"></section>
    <section class="active-board"></section>
    <CardsList />
    <Playground />
</main>

<style>
  .integration {
    grid-area: integration;
    background-color: rgb(223, 128, 128);
  }

  .active-board {
    grid-area: active-board;
    background-color:rgb(46, 92, 137)
  }

  header {
    grid-area: header;
    background-color: rgb(77, 39, 39);
  }

  main {
    display: grid;
    height: calc(100vh - 16px);
    grid-template-columns: 1fr 1fr 362px;
    grid-template-rows: 55px 450px auto;
    grid-template-areas:
      "header header header"
      "integration active-board list-of-cards"
      "playground playground list-of-cards";
  }
</style>
