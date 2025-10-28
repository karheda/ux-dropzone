/*
 * This file is part of the Symfony package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    declare readonly inputTarget: HTMLInputElement;
    declare readonly placeholderTarget: HTMLDivElement;
    declare readonly previewTarget: HTMLDivElement;
    declare readonly previewClearButtonTarget: HTMLButtonElement;
    declare readonly previewFilenameTarget: HTMLDivElement;
    declare readonly previewImageTarget: HTMLDivElement;
    declare readonly previewsContainerTarget: HTMLDivElement;

    static targets = ['input', 'placeholder', 'preview', 'previewClearButton', 'previewFilename', 'previewImage', 'previewsContainer'];

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

    clear(event = {}) {
        const button = event?.target;
        const id = event?.params?.id;
        if (!button) return;

        const preview = button.closest('[data-symfony--ux-dropzone--dropzone-target="preview"]')
        if (!preview) return;

        if (typeof id === 'number') {
            if (id > 0) {
                preview.remove();
            } else {
                this.previewTargets[0].style.display = "none";
                this.previewImageTargets[0].style.display = "none";
                this.previewImageTargets[0].style.backgroundImage = "none";
                this.previewFilenameTargets[0].textContent = "";
            }
        }

        this.inputTarget.value = "";
        this.inputTarget.style.display = "block";
        if (this.previewTargets.length === 1 && this.previewTargets[0].style.display === "none") {
            this.placeholderTarget.style.display = "block";
        }

        this.dispatchEvent("clear");
    }

    onInputChange(event: any) {
        const files = event.target.files;
        if (files.length <= 0) {
            return;
        }

        this.placeholderTarget.style.display = "none";
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            this._renderFiles(i, file);
            if (file.type && file.type.indexOf("image") !== -1) {
                this._populateImagePreview(i, file);
            }
        }
        this.dispatchEvent("change", files);
    }

    _renderFiles(key, file) {
        if (this.previewTargets.length >1 || (this.previewTargets.length === 1 && this.previewTargets[0].style.display === "flex")) {
            if (key <= 0) {
                key = this.previewTargets.length;
            }

            const elementToInsert = this.previewTargets[0].cloneNode(true);
            elementToInsert.style.display = 'flex';
            this.previewsContainerTarget.appendChild(elementToInsert);
            const clearButton = elementToInsert.querySelector('[data-symfony--ux-dropzone--dropzone-id-param]');
            this.previewFilenameTargets[key].textContent = file.name;
            if (clearButton) {
                clearButton.setAttribute('data-symfony--ux-dropzone--dropzone-id-param', key);
            }
        } else {
            this.previewFilenameTargets[0].textContent = file.name;
            this.previewImageTargets[0].style.display = "none";
            this.previewTargets[0].style.display = "flex";
        }
    }

    _populateImagePreview(key, file: Blob) {
        if (typeof FileReader === "undefined" || !file) {
            return;
        }
        if (this.previewTargets.length > 1 && key <= 0) {
            key = this.previewTargets.length - 1;
        }
        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
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

    private dispatchEvent(name: string, payload: any = {}) {
        this.dispatch(name, { detail: payload, prefix: 'dropzone' });
    }
}
