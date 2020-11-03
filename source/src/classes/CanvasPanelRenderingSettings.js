export default class CanvasPanelRenderingSettings {
    constructor(showCurves, showControlPoints, showControlPolygons, curvesEvaluation, canvasWidth, canvasHeight) {
        this._showCurves = showCurves;
        this._showControlPoints = showControlPoints;
        this._showControlPolygons = showControlPolygons;
        this._curvesEvaluation = curvesEvaluation;
        this._canvasWidth = canvasWidth,
        this._canvasHeight = canvasHeight;
    }

    get showCurves() {
        return this._showCurves;
    }

    set showCurves(showCurves) {
        this._showCurves = showCurves;
    }

    get showControlPoints() {
        return this._showControlPoints;
    }

    set showControlPoints(showControlPoints) {
        this._showControlPoints = showControlPoints;
    }

    get showControlPolygons() {
        return this._showControlPolygons;
    }

    set showControlPolygons(showControlPolygons) {
        this._showControlPolygons = showControlPolygons;
    }

    get curvesEvaluation() {
        return this._curvesEvaluation;
    }

    set curvesEvaluation(curvesEvaluation) {
        this._curvesEvaluation = curvesEvaluation;
    }

    get canvasWidth() {
        return this._canvasWidth;
    }

    set canvasWidth(canvasWidth) {
        this._canvasWidth = canvasWidth;
    }

    get canvasHeight() {
        return this._canvasHeight;
    }

    set canvasHeight(canvasHeight) {
        this._canvasHeight = canvasHeight;
    }
}
