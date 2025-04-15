<script lang="ts">
    import { createQuery } from '@tanstack/svelte-query';
    import { extractErrorMessage } from "./validators";
    import { testIntegration } from '../services/integrationService';
    import { formData } from './state.svelte';

    let {id, label, value = $bindable(), type = 'text', placeholder, error, ...rest} = $props();

    const errorClassName = $derived(error ? 'input-error' : '');
    const errorMessage = $derived(extractErrorMessage(error));

    const query = createQuery({
        queryKey: ['connectionTest', () => [formData.integration?.id, formData.integration?.email, formData.integration?.apiToken]],
        queryFn: () => testIntegration({id: formData.integration?.id, email: formData.integration?.email, apiToken: formData.integration?.apiToken}),
        enabled: false,
        retry: 1,
        staleTime: Infinity
    });

    const testConnection = (e) => {
        e.preventDefault();
        $query.refetch();
    };
</script>

<label for={id} class="label text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 pl-0">{label}</label>
<div class="flex space-x-1">
    <input id={id} type={type} placeholder={placeholder} class={`input input-bordered ${errorClassName} w-full h-9 rounded-md placeholder:text-[14px]`} bind:value={value} {...rest} />
    <button onclick={testConnection} type="button" class="btn bg-violet-600 hover:bg-violet-700 text-white min-h-9 h-9 float-right">
        {#if $query.isFetching}
            <span class="loading loading-spinner h-4 w-4"></span>
        {:else if $query.error}
            <svg height="16px" width="16px" fill="#d33636" viewBox="0 -8 528 528" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>fail</title><path d="M264 456Q210 456 164 429 118 402 91 356 64 310 64 256 64 202 91 156 118 110 164 83 210 56 264 56 318 56 364 83 410 110 437 156 464 202 464 256 464 310 437 356 410 402 364 429 318 456 264 456ZM264 288L328 352 360 320 296 256 360 192 328 160 264 224 200 160 168 192 232 256 168 320 200 352 264 288Z"></path></g></svg>        
        {:else if $query.isSuccess}
            <svg height="16px" width="16px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>success</title> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="add-copy" fill="#ffffff" transform="translate(42.666667, 42.666667)"> <path d="M213.333333,3.55271368e-14 C95.51296,3.55271368e-14 3.55271368e-14,95.51296 3.55271368e-14,213.333333 C3.55271368e-14,331.153707 95.51296,426.666667 213.333333,426.666667 C331.153707,426.666667 426.666667,331.153707 426.666667,213.333333 C426.666667,95.51296 331.153707,3.55271368e-14 213.333333,3.55271368e-14 Z M213.333333,384 C119.227947,384 42.6666667,307.43872 42.6666667,213.333333 C42.6666667,119.227947 119.227947,42.6666667 213.333333,42.6666667 C307.43872,42.6666667 384,119.227947 384,213.333333 C384,307.43872 307.438933,384 213.333333,384 Z M293.669333,137.114453 L323.835947,167.281067 L192,299.66912 L112.916693,220.585813 L143.083307,190.4192 L192,239.335893 L293.669333,137.114453 Z" id="Shape"> </path> </g> </g> </g></svg>
        {:else}
            <svg fill="#ffffff" height="16px" width="16px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 363.457 363.457" xml:space="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M211.331,190.817c-1.885-1.885-4.396-2.922-7.071-2.922c-2.675,0-5.186,1.038-7.07,2.922l-32.129,32.129l-24.403-24.403 l32.129-32.129c3.897-3.899,3.897-10.243-0.001-14.142l-11.125-11.125c-1.885-1.885-4.396-2.922-7.071-2.922 c-2.675,0-5.187,1.038-7.07,2.923l-32.128,32.128l-18.256-18.256c-1.885-1.885-4.396-2.922-7.071-2.922 c-2.675,0-5.186,1.038-7.07,2.922L66.95,171.062c-3.899,3.899-3.899,10.243,0,14.143l3.802,3.802 c-1.596,1.086-3.103,2.325-4.496,3.718l-46.679,46.679c-5.836,5.835-9.049,13.62-9.049,21.92c0,8.301,3.214,16.086,9.049,21.92 l17.943,17.943L5.126,333.582c-6.835,6.835-6.835,17.915,0,24.749c3.417,3.417,7.896,5.125,12.374,5.125s8.957-1.708,12.374-5.125 l32.395-32.395l18.091,18.091c5.834,5.835,13.619,9.048,21.92,9.048s16.086-3.213,21.92-9.048l46.679-46.679 c1.394-1.393,2.633-2.901,3.719-4.497l3.802,3.802c1.885,1.885,4.396,2.923,7.07,2.923c2.675,0,5.186-1.038,7.072-2.923 l16.04-16.042c1.887-1.885,2.925-4.396,2.925-7.072c0-2.676-1.038-5.187-2.924-7.071l-18.255-18.255l32.129-32.129 c3.898-3.899,3.898-10.244-0.001-14.142L211.331,190.817z"></path> <path d="M358.33,5.126c-6.834-6.834-17.914-6.834-24.748,0l-32.686,32.686l-17.944-17.944c-5.834-5.835-13.619-9.048-21.92-9.048 c-8.301,0-16.086,3.213-21.92,9.048l-46.679,46.679c-1.393,1.393-2.632,2.9-3.719,4.497l-3.802-3.802 c-1.885-1.885-4.396-2.923-7.071-2.923c-2.675,0-5.187,1.038-7.071,2.923l-16.042,16.042c-1.886,1.885-2.924,4.396-2.924,7.072 c0,2.675,1.038,5.187,2.924,7.071l111.447,111.448c1.885,1.885,4.396,2.923,7.071,2.923c2.676,0,5.186-1.038,7.071-2.923 l16.043-16.043c3.899-3.899,3.899-10.243,0-14.142l-3.801-3.801c1.596-1.086,3.103-2.325,4.496-3.719l46.679-46.679 c5.835-5.834,9.049-13.62,9.049-21.92s-3.213-16.086-9.049-21.92l-18.09-18.09l32.686-32.686 C365.165,23.04,365.165,11.96,358.33,5.126z"></path> </g> </g></svg>
        {/if}
        Test
    </button>
</div>
{#if error}
    <p class="text-xs text-red-500 mt-2">{errorMessage}</p>
{/if}