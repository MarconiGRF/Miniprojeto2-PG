export default class ElementAppearanceSettings {
    constructor(color, thickness) {
        this._color = color;
        this._thickness = thickness;
    }

    get color() {
        return this._color;
    }

    set color(color) {
        this._color = color;
    }

    get thickness() {
        return this._thickness;
    }

    set thickness(thickness) {
        this._thickness = thickness;
    }
}
