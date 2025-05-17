<script lang="ts">
    let { children } = $props();
</script>

<section class="relative mx-auto p-8 max-w-screen-2xl h-screen bg-white mt-16 rounded-lg overflow-y-auto">
    <div class="h-screen">
        {@render children()}
    </div>
</section>