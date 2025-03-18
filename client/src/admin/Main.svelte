<script lang="ts">
    let { children } = $props();
</script>

<div class="max-w-7xl m-auto bg-white rounded-lg shadow-md p-6 min-h-[500px] mt-20">{@render children()}</div>