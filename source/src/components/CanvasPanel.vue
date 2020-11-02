<template>
    <canvas id="panel-canvas" :width="renderingSettings.canvasWidth" :height="renderingSettings.canvasHeight"></canvas>
</template>

<script>
// type ElementAppearanceSettings = {
//     color: string,
//     thickness: number
// };
// type CanvasPanelRenderingSettings = {
//     showCurves: boolean,
//     showControlPoints: boolean,
//     showControlPolygons: boolean,
//     curvesEvaluation: number
// };
// type Point = {
//     x: number,
//     y: number
// };
// type Curve = {
//     controlPoints: Point[],
//     appearance: {
//         curve: ElementAppearanceSettings
//         controlPoints: ElementAppearanceSettings
//         controlPolygons: ElementAppearanceSettings
//     }
// };
// type CanvasSelectEventDetails = {
//     curveSelected: Curve,
//     pointSelected: Point
// }

export default {
    name: 'CanvasPanel',
    data: function() {
        return {
            canvasElement: null,
            canvasContext: null,
            canvasBoundingRectangle: null,
            curves: [],
            renderingSettings: {
                showCurves: true,
                showControlPoints: true,
                showControlPolygons: true,
                curvesEvaluation: 200,
                canvasWidth: 800,
                canvasHeight: 600
            }
        }
    },
    mounted() {
        this.canvasElement = document.getElementById('panel-canvas');
        this.canvasContext = this.canvasElement.getContext('2d');
        this.canvasBoundingRectangle = this.canvasElement.getBoundingClientRect();

        this.curves = [{
            controlPoints: [{
                x: 100,
                y: 200
            }, {
                x: 300,
                y: 60
            }, {
                x: 470,
                y: 340
            }, {
                x: 640,
                y: 260
            }],
            appearance: {
                curve: {
                    color: 'pink',
                    thickness: 4
                },
                controlPoints: {
                    color: 'red',
                    thickness: 8
                },
                controlPolygons: {
                    color: 'gray',
                    thickness: 2
                }
            }
        }];
        this.renderFrame();

    },
    methods: {
        renderFrame: function() { // (selectedCurve = null) => {
            this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
            for (const curve of this.curves) {
                if (this.renderingSettings.showControlPolygons) {
                    this.drawLines(curve.controlPoints, curve.appearance.controlPolygons);
                }
                if (this.renderingSettings.showCurves) {
                    this.drawCurve(curve);
                }
                if (this.renderingSettings.showControlPoints) {
                    for (const controlPoint of curve.controlPoints) {
                        this.drawPoint(controlPoint, curve.appearance.controlPoints);
                    }
                }
            }
        },
        drawPoint: function(point, appearance) {
            this.canvasContext.strokeStyle = appearance.color;
            this.canvasContext.fillStyle = appearance.color;
            this.canvasContext.beginPath();
            this.canvasContext.arc(point.x, point.y, (appearance.thickness / 2), 0, 2 * Math.PI, true);
            this.canvasContext.stroke();
            this.canvasContext.fill();
        },
        drawLines: function(points, appearance) {
            if (!points && points.length < 2) {
                return;
            }
            for (const [startingPoint, endingPoint] of this.pairwise(points)) {
                this.canvasContext.lineWidth = appearance.thickness;
                this.canvasContext.strokeStyle = appearance.color;
                this.canvasContext.beginPath();
                this.canvasContext.moveTo(startingPoint.x, startingPoint.y);
                this.canvasContext.lineTo(endingPoint.x, endingPoint.y);
                this.canvasContext.stroke();
            }
        },
        drawCurve: function(curve) {
            const curvePoints = [];
            for (let evaluationsPerformed = 0; evaluationsPerformed < this.renderingSettings.curvesEvaluation; evaluationsPerformed++) {
                curvePoints.push(this.deCasteljau(curve.controlPoints, evaluationsPerformed));
            }
            this.drawLines(curvePoints, curve.appearance.curve);
        },
        deCasteljau: function(controlPoints, currentEvaluation) {
             if (controlPoints && controlPoints.length === 1) {
                return controlPoints[0];
            }
            const points = [];
            for (const [startingPoint, endingPoint] of this.pairwise(controlPoints)) {
                const currentEvaluationRatio = currentEvaluation / this.renderingSettings.curvesEvaluation;
                const point = {
                    x: (startingPoint.x * (1 - currentEvaluationRatio)) + (endingPoint.x * currentEvaluationRatio),
                    y: (startingPoint.y * (1 - currentEvaluationRatio)) + (endingPoint.y * currentEvaluationRatio)
                };
                points.push(point);
            }
            return this.deCasteljau(points, currentEvaluation);
        },
        pairwise: function* (iterable) {
            const iterator = iterable[Symbol.iterator]();
            let currentResult = iterator.next();
            let nextResult = iterator.next();
            while (!nextResult.done) {
                yield [currentResult.value, nextResult.value];
                currentResult = nextResult;
                nextResult = iterator.next();
            }
        }
    }
}
</script>

<style scoped>

</style>
