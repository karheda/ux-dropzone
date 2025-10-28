import { Controller } from '@hotwired/stimulus';

declare class export_default extends Controller {
    readonly inputTarget: HTMLInputElement;
    readonly placeholderTarget: HTMLDivElement;
    readonly previewTarget: HTMLDivElement;
    readonly previewClearButtonTarget: HTMLButtonElement;
    readonly previewFilenameTarget: HTMLDivElement;
    readonly previewImageTarget: HTMLDivElement;
    readonly previewClearButtonTargets: HTMLButtonElement;
    readonly previewTargets: HTMLDivElement[];
    readonly previewFilenameTargets: HTMLDivElement[];
    readonly previewImageTargets: HTMLDivElement[];
    readonly previewContainerTarget: HTMLDivElement;
    static targets: string[];
    files: Map<string, File>;
    initialize(): void;
    connect(): void;
    disconnect(): void;
    clear(event?: {
        target?: HTMLElement;
        params?: {
            id?: number;
        };
    }): void;
    onInputChange(event: any): void;
    private renderPreview;
    private buildPreview;
    _populateImagePreview(key: number, file: Blob): void;
    onDragEnter(): void;
    onDragLeave(event: any): void;
    private updateFileInput;
    private addFiles;
    private isImage;
    private dispatchEvent;
}

export { export_default as default };
