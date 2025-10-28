// src/controller.ts
import { Controller } from "@hotwired/stimulus";
var controller_default = class extends Controller {
  constructor() {
    super(...arguments);
    this.files = /* @__PURE__ */ new Map();
  }
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
      console.log(event.target);
    }
    if (!this.inputTarget || !this.inputTarget.files || this.inputTarget?.files?.length === 0) {
      this.placeholderTarget.style.display = "block";
    }
    this.updateFileInput();
    this.dispatchEvent("clear");
  }
  onInputChange(event) {
    const files = this.inputTarget.files;
    if (!files || files.length <= 0) {
      return;
    }
    this.files.clear();
    this.addFiles(Array.from(files));
    this.renderPreview();
    this.dispatchEvent("change", files);
  }

  renderPreview() {
    this.element.classList.add("dropzone-preview-container-hidden");
    this.previewTargets.forEach((preview, index) => {
      if (index > 0) preview.remove();
    });
    for (const file of this.files.values()) {
      const preview = this.buildPreview(file);
      if (preview) {
        this.previewContainerTarget.appendChild(preview);
      }
    }
    if (this.previewTargets.length > 0) {
      this.element.classList.remove("dropzone-preview-container-hidden");
    }
  }
  buildPreview(file, element) {
    if (!element) {
      element = this.previewTargets[0].cloneNode(true);
    }
    const fileName = element.querySelector(".dropzone-preview-filename");
    if (fileName) {
      fileName.textContent = file.name;
    }
    const image = element.querySelector(".dropzone-preview-image");
    if (image && this.isImage(file) && typeof FileReader !== "undefined") {
      const reader = new FileReader();
      image.classList.add("dropzone-preview-image-hidden");
      reader.addEventListener("load", (event) => {
        image.querySelector(".dropzone-preview-image-placeholder")?.remove();
        image.style.backgroundImage = `url('${event.target.result}')`;
        image.classList.remove("dropzone-preview-image-hidden");
      });
      reader.readAsDataURL(file);
    }
    element.style.display = "block";
    return element;
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
  updateFileInput() {
    const dataTransfer = new DataTransfer();
    for (const file of this.files.values()) {
      dataTransfer.items.add(file);
    }
    this.inputTarget.files = dataTransfer.files;
  }
  /*private get firstFile(): File | undefined {
      return this.files.values().next().value;
  }*/
  addFiles(files) {
    for (const file of files) {
      this.files.set(file.name, file);
    }
  }
  isImage(file) {
    return typeof file.type !== "undefined" && file.type.indexOf("image") !== -1;
  }
  dispatchEvent(name, payload = {}) {
    this.dispatch(name, { detail: payload, prefix: "dropzone" });
  }
};
controller_default.targets = ["input", "placeholder", "preview", "previewClearButton", "previewFilename", "previewImage", "previewContainer"];
export {
  controller_default as default
};
