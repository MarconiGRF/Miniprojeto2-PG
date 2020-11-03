// type Curve = {
//     controlPoints: Point[],
//     appearance: {
//         curve: ElementAppearanceSettings
//         controlPoints: ElementAppearanceSettings
//         controlPolygons: ElementAppearanceSettings
//     }
// };

export default class Curve {
    constructor(controlPoints, appearance) {
        this._controlPoints = controlPoints;
        this._appearance = appearance;
    }

    get controlPoints() {
        return this._controlPoints;
    }

    set controlPoints(controlPoints) {
        this._controlPoints = controlPoints;
    }

    get appearance() {
        return this._appearance;
    }

    set appearance(appearance) {
        this._appearance = appearance;
    }
}
