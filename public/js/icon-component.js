class UIIcon extends HTMLElement {
  connectedCallback() {
    const type = this.getAttribute("type");
    const alt = this.getAttribute("alt") || type;
    const size = this.getAttribute("size") || "24";
    const srcMap = {
      check: "/img/check-icon.png",
      cross: "/img/cross-icon.png",
      dollar: "/img/dollar-icon.png",
      arrows: "/img/dropdown-icon.png"
    };

    this.innerHTML = `
      <img
        src="${srcMap[type] || '/img/placeholder.png'}"
        alt="${alt}"
        class="ui-icon"
        width="${size}"
        height="${size}"
      />
    `;
  }
}

customElements.define("ui-icon", UIIcon);
