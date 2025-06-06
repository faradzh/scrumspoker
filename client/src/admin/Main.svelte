<script lang="ts">
    let { children } = $props();
</script>

<section class="relative min-h-42 mx-auto p-8 max-w-screen-2xl bg-white mt-16 rounded-lg overflow-y-auto">
    {@render children()}
</section>