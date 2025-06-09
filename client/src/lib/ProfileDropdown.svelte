<script lang="ts">
  import { onMount } from "svelte";
  import { logout } from "../services/userService";
  import { currentUser } from "../store";
  import { getAbbreviation } from "./utils";

    let isOpen = $state(false);
    let button: HTMLButtonElement | null = null;

    onMount(() => {
        document.addEventListener('click', (e: MouseEvent) => {
            if (button && button.contains(e.target as Node)) {
                isOpen = !isOpen;
            } else {
                isOpen = false;
            }
        });
    })

    function onLogout(e: MouseEvent) {
      e.preventDefault();
      logout().then(() => {
        // Handle successful logout
        window.location.href = "/login";
      }).catch((error) => {
        // Handle error
        console.error("Logout failed", error);
      });
    }
</script>

<div>
    <button bind:this={button} type="button" class="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
        <span class="absolute -inset-1.5"></span>
        <span class="sr-only">Open user menu</span>
        <!-- <img class=" rounded-full" src={$currentUser?.picture} alt=""> -->
        {#if $currentUser?.picture}
              <img class="size-8 rounded-full" src={$currentUser.picture} alt="profile avatar"/>
        {:else}
            <div class="flex bg-gray-800 text-neutral-content size-8 rounded-full items-center justify-center">
                <span class="text-xl">{getAbbreviation($currentUser?.name)}</span>
            </div>
        {/if}
    </button>
</div>

  <!--
    Dropdown menu, show/hide based on menu state.

    Entering: "transition ease-out duration-100"
      From: "transform opacity-0 scale-95"
      To: "transform opacity-100 scale-100"
    Leaving: "transition ease-in duration-75"
      From: "transform opacity-100 scale-100"
      To: "transform opacity-0 scale-95"
  -->
{#if isOpen}
    <div class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
        <!-- Active: "bg-gray-100 outline-hidden", Not Active: "" -->
        <a href="#" onclick={onLogout} class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-2">Sign out</a>
    </div>
{/if}