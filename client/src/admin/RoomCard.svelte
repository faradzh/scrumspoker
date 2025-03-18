<script lang="ts">
    let { room } = $props();

    const origin = window.location.origin;
    const roomLink = `${origin}/rooms/${room.id}`;
</script>

<div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
    <div class="p-4 border-l-4 border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/10">
        <div class="flex justify-between items-start mb-2">
            <h3 class="font-medium text-lg text-black">{room.name}</h3>
            <div class="flex space-x-1">
            <button class="p-1 text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings h-4 w-4" id="uqecvq_0">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            </button>
            <button class="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash h-4 w-4" id="875de7_0">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
            </button>
            </div> 
        </div>
        <div class="flex items-center space-x-2 mb-3">
            <div class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-300 border-violet-200 dark:border-violet-800/30">
                {room.estimationMethod}
            </div>
            <div class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/30">
            8 participants
            </div>
        </div> 
        <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center mb-1">
            <span class="inline-block w-2 h-2 rounded-full bg-teal-500 mr-2">
            </span>
            Jira Integration: PROD
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <svg class="w-3 h-4 text-gray-800 dark:text-white mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961"/>
            </svg>
            <span class="text-xs w-[85%] text-ellipsis overflow-hidden whitespace-nowrap">
                <a href={roomLink}>{roomLink}</a>
            </span>
            <button class="p-1 text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 ml-auto">
                <svg class="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M9 8v3a1 1 0 0 1-1 1H5m11 4h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v1m4 3v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7.13a1 1 0 0 1 .24-.65L7.7 8.35A1 1 0 0 1 8.46 8H13a1 1 0 0 1 1 1Z"/>
                </svg>
            </button>
        </div>
    </div>
</div>