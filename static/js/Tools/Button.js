export class Button {
    constructor(type, element, f) {
        this.type = type
        this.element = element
        this.element.addEventListener('click', f)
    }
    disable() {
        this.element.classList.add('disabled')
    }
    enable() {
        this.element.classList.remove('disabled')
    }
}