/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Controller} from '@hotwired/stimulus';

export default class extends Controller {
    declare readonly inputTarget: HTMLInputElement;
    declare readonly placeholderTarget: HTMLDivElement;
    declare readonly previewTarget: HTMLDivElement;
    declare readonly previewClearButtonTarget: HTMLButtonElement;
    declare readonly previewFilenameTarget: HTMLDivElement;
    declare readonly previewImageTarget: HTMLDivElement;
    declare readonly previewClearButtonTargets: HTMLButtonElement;
    declare readonly previewTargets: HTMLDivElement[];
    declare readonly previewFilenameTargets: HTMLDivElement[];
    declare readonly previewImageTargets: HTMLDivElement[];
    declare readonly previewContainerTarget: HTMLDivElement;

    static targets = ['input', 'placeholder', 'preview', 'previewClearButton', 'previewFilename', 'previewImage', 'previewContainer'];

    files: Map<string, File> = new Map<string, File>();

    initialize() {
        this.clear = this.clear.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
    }

    connect() {
        // Reset when connecting to work with Turbolinks
        this.clear();

        // Listen on input change and display preview
        this.inputTarget.addEventListener('change', this.onInputChange);

        // Add dragenter event listener
        this.element.addEventListener('dragenter', this.onDragEnter);

        // Add dragleave event listener
        this.element.addEventListener('dragleave', this.onDragLeave);

        this.dispatchEvent('connect');
    }

    disconnect() {
        this.inputTarget.removeEventListener('change', this.onInputChange);
        this.element.removeEventListener('dragenter', this.onDragEnter);
        this.element.removeEventListener('dragleave', this.onDragLeave);
    }

    clear(event?: { target?: HTMLElement; params?: { id?: number } }) {
        if (event) {
            console.log(event.target)
        }
        if (!this.inputTarget || !this.inputTarget.files || this.inputTarget?.files?.length === 0) {
            this.placeholderTarget.style.display = "block";
        }
        this.updateFileInput();
        this.dispatchEvent("clear");
    }

    onInputChange(event: any) {
        const files = this.inputTarget.files;
        if (!files || files.length <= 0) {
            return;
        }
        this.files.clear();
        this.addFiles(Array.from(files));
        this.renderPreview();
        this.dispatchEvent("change", files);
    }

    /*_renderFiles() {
        console.log(this.previewTargets);
        if (this.previewTargets.length > 1) {
            this.previewTargets.splice(1, this.previewTargets.length - 1);
        }
        console.log(this.previewTargets);
        for (let i = 0; i < this.inputTarget.files.length; i++) {
            const file = this.inputTarget.files[i];
            this._renderFile(i, file);
            if (file.type && file.type.indexOf("image") !== -1) {
                this._populateImagePreview(i, file);
            }
        }
    }

    _renderFile(key: any, file: File) {
        const elementToInsert = this.previewTargets[0].cloneNode(true);
        this.previewContainerTarget.appendChild(elementToInsert);
        const newPreviewTarget = this.previewTargets[this.previewTargets.length - 1];
        newPreviewTarget.style.display = "flex";
        const clearButton = newPreviewTarget.querySelector("[data-symfony--ux-dropzone--dropzone-id-param]");
        this.previewFilenameTargets[key].textContent = file.name;
        const uniqueId = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
        if (clearButton) {
            clearButton.setAttribute("data-symfony--ux-dropzone--dropzone-id-param", uniqueId);
            clearButton.setAttribute("data-symfony--ux-dropzone--dropzone-filename-param", file.name);
        }
    }*/

    private renderPreview() {
        this.element.classList.add('dropzone-preview-container-hidden');
        for(const preview of this.previewTargets) {
            preview.remove();
        }
        // @ts-ignore
        for (const file of this.files.values()) {
            const preview = this.buildPreview(file);
            if (preview) {
                this.previewContainerTarget.appendChild(preview);
            }

        }

        if (this.previewTargets.length > 0) {
            this.element.classList.remove('dropzone-preview-container-hidden');
        }
    }

    private buildPreview(file: File, element?: HTMLElement): HTMLElement {
        if (!element) {
            element = this.previewContainerTarget.firstElementChild?.cloneNode(true) as HTMLElement;
        }

        const fileName = element.querySelector('.dropzone-preview-filename');
        if (fileName) {
            fileName.textContent = file.name
        }

        const image = <HTMLElement>element.querySelector('.dropzone-preview-image');

        if (image && this.isImage(file) && typeof FileReader !== 'undefined') {
            const reader = new FileReader();

            image.classList.add('dropzone-preview-image-hidden');
            reader.addEventListener('load', (event: any) => {
                image.querySelector('.dropzone-preview-image-placeholder')?.remove();
                image.style.backgroundImage = `url('${event.target.result}')`;
                image.classList.remove('dropzone-preview-image-hidden');
            });

            reader.readAsDataURL(file as Blob);
        }
        return element;
    }

    _populateImagePreview(key: number, file: Blob) {
        if (typeof FileReader === "undefined" || !file) {
            return;
        }
        if (this.previewTargets.length > 1 && key <= 0) {
            key = this.previewTargets.length - 1;
        }
        const reader = new FileReader();
        reader.addEventListener("load", (event: any) => {
            this.previewImageTargets[key].style.display = "block";
            this.previewImageTargets[key].style.backgroundImage = `url("${event.target.result}")`;
        });
        reader.readAsDataURL(file);
    }

    onDragEnter() {
        this.inputTarget.style.display = 'block';
        this.placeholderTarget.style.display = 'block';
        this.previewTarget.style.display = 'none';
    }

    onDragLeave(event: any) {
        event.preventDefault();

        // Check if we really leave the main drag area
        if (!this.element.contains(event.relatedTarget as Node)) {
            this.inputTarget.style.display = 'none';
            this.placeholderTarget.style.display = 'none';
            this.previewTarget.style.display = 'block';
        }
    }

    private updateFileInput() {
        const dataTransfer = new DataTransfer();
        // @ts-ignore
        for (const file of this.files.values()) {
            dataTransfer.items.add(file);
        }
        this.inputTarget.files = dataTransfer.files;
    }

    /*private get firstFile(): File | undefined {
        return this.files.values().next().value;
    }*/

    private addFiles(files: File[]) {
        for (const file of files) {
            this.files.set(file.name, file);
        }
    }

    private isImage(file: File): boolean {
        return typeof file.type !== 'undefined' && file.type.indexOf('image') !== -1;
    }

    private dispatchEvent(name: string, payload: any = {}) {
        this.dispatch(name, {detail: payload, prefix: 'dropzone'});
    }
}
