<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";
    import type { Card } from "./types";

    interface Props extends HTMLAttributes<HTMLDivElement> {
        card: Card;
        onSelect?: () => void;
    }
    // @ts-ignore
    const {card, onSelect, ...restProps} = $props<Props>();
  </script>

  <div class="relative cursor-pointer h-32 max-w-[92px]" {...restProps} onclick={onSelect}>
    <span class="absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold">{card.value}</span>
    <img src="{card.link}" alt="" class="rounded-lg shadow-md h-full w-full origin-center"/>
  </div>