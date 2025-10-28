// src/controller.ts
import { Controller } from "@hotwired/stimulus";
var controller_default = class extends Controller {
  initialize() {
    this.clear = this.clear.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
  }
  connect() {
    this.clear();
    this.inputTarget.addEventListener("change", this.onInputChange);
    this.element.addEventListener("dragenter", this.onDragEnter);
    this.element.addEventListener("dragleave", this.onDragLeave);
    this.dispatchEvent("connect");
  }
  disconnect() {
    this.inputTarget.removeEventListener("change", this.onInputChange);
    this.element.removeEventListener("dragenter", this.onDragEnter);
    this.element.removeEventListener("dragleave", this.onDragLeave);
  }
  clear(event) {
    if (event) {
      const button = event?.target;
      const id = event?.params?.id;
      if (!button) return;
      const preview = button.closest('[data-symfony--ux-dropzone--dropzone-target="preview"]');
      if (!preview) return;
      if (typeof id === "number") {
        if (id > 0) {
          preview.remove();
        } else {
          this.previewTargets[0].style.display = "none";
          this.previewImageTargets[0].style.display = "none";
          this.previewImageTargets[0].style.backgroundImage = "none";
          this.previewFilenameTargets[0].textContent = "";
        }
      }
    }
    this.inputTarget.value = "";
    this.inputTarget.style.display = "block";
    if (this.previewTargets.length === 1 && this.previewTargets[0].style.display === "none") {
      this.placeholderTarget.style.display = "block";
    }
    this.dispatchEvent("clear");
  }
  onInputChange(event) {
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
    if (this.previewTargets.length > 1 || this.previewTargets.length === 1 && this.previewTargets[0].style.display === "flex") {
      if (key <= 0) {
        key = this.previewTargets.length;
      }
      const elementToInsert = this.previewTargets[0].cloneNode(true);
      this.previewsContainerTarget.appendChild(elementToInsert);
      const newPreviewTarget = this.previewTargets[this.previewTargets.length - 1];
      newPreviewTarget.style.display = "flex";
      const clearButton = newPreviewTarget.querySelector("[data-symfony--ux-dropzone--dropzone-id-param]");
      this.previewFilenameTargets[key].textContent = file.name;
      if (clearButton) {
        clearButton.setAttribute("data-symfony--ux-dropzone--dropzone-id-param", key.toString());
      }
    } else {
      this.previewFilenameTargets[0].textContent = file.name;
      this.previewImageTargets[0].style.display = "none";
      this.previewTargets[0].style.display = "flex";
    }
  }
  _populateImagePreview(key, file) {
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
    this.inputTarget.style.display = "block";
    this.placeholderTarget.style.display = "block";
    this.previewTarget.style.display = "none";
  }
  onDragLeave(event) {
    event.preventDefault();
    if (!this.element.contains(event.relatedTarget)) {
      this.inputTarget.style.display = "none";
      this.placeholderTarget.style.display = "none";
      this.previewTarget.style.display = "block";
    }
  }
  dispatchEvent(name, payload = {}) {
    this.dispatch(name, { detail: payload, prefix: "dropzone" });
  }
};
controller_default.targets = ["input", "placeholder", "preview", "previewClearButton", "previewFilename", "previewImage", "previewsContainer"];
export {
  controller_default as default
};
