<script lang="ts">
  import { QueryClientProvider } from "@tanstack/svelte-query";

  import queryClient from "./admin/queryClient";
  import App from "./App.svelte";
</script>

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>