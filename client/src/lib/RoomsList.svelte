<script lang="ts">
    import { onMount } from "svelte";
    import {rooms} from "../store";

    async function fetchRooms() {
        const response =  await fetch('/rooms');
        const data = await response.json();
        rooms.set(data);
    }
    onMount(() => {
        fetchRooms();
    });
</script>

<div class="flex justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-black">
    <table class="table table-zebra">
        <!-- head -->
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Estimation method</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          {#each $rooms as room, index}
            <tr>
              <th>{index + 1}</th>
              <td>{room.name}</td>
              <td>{room.estimationMethod}</td>
              <td><a href="{room.link}">{room.link}</a></td>
            </tr>
          {/each}
        </tbody>
      </table>
  </div>