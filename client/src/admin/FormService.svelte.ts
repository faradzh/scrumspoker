import type { Component } from "svelte";

type ComponentType = Component<{ values: any, errors: any, onSubmit: any, formRef: HTMLFormElement  | null, onIntegrationInput?: any}, {}>;

class FormService {
    private pages = $state<ComponentType[]>([]);
    private currentPageIdx = $state(0);

    constructor(pages?: ComponentType[]) {
        if (pages) {
            this.pages = pages;
        }
    }

    setPages(pages: ComponentType[]) {
        this.pages = pages;
    }

    getCurrentPage() {
        if (this.pages.length === 0 || this.currentPageIdx < 0 || this.currentPageIdx >= this.pages.length) {
            throw new Error('Empty list of pages or invalid page index');
        }
        return this.pages[this.currentPageIdx];
    }

    prevPage() {
        if (this.currentPageIdx > 0) {
            this.currentPageIdx--;
        }
    }

    nextPage() {
        if (this.currentPageIdx < this.pages.length - 1) {
            this.currentPageIdx += 1;
        }
    }

    isFirstPage() {
        return this.currentPageIdx === 0;
    }
}

export default FormService;