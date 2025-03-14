<script lang="ts">
  import { onMount } from "svelte";
  import { toastState, type Toast } from "../state.svelte";

    let { toast } = $props<{toast: Toast}>();

    onMount(() => {
        setTimeout(() => {
           toastState.messages = toastState.messages.filter((msg) => msg.message !== toast.message);
        }, 3000);
    });

    const typeColors: Record<string, string[]> = {
        success: ['bg-emerald-600', 'border-emerald-700'],
        error: ['bg-rose-500', 'border-rose-600'],
        info: ['bg-emerald-600', 'border-emerald-700'],
    };
</script>

<div class={`alert text-white rounded-lg ${typeColors[toast.type].join(' ')}`}>
    <span>{toast.message}</span>
</div>