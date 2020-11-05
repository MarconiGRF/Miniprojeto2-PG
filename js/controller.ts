/* DEFINIÇÕES DE TIPOS */

type ElementAppearanceSettings = {
    color: string,
    thickness: number
};
type CanvasPanelRenderingSettings = {
    showCurves: boolean,
    showControlPoints: boolean,
    showControlPolygons: boolean,
    curvesEvaluation: number,
    appearance: {
        curves: ElementAppearanceSettings
        controlPoints: ElementAppearanceSettings
        controlPolygons: ElementAppearanceSettings
    }
};
type Point = {
    x: number,
    y: number
};
type Curve = {
    controlPoints: Point[],
    curvePoints?: Point[]
};
type CanvasSelectEventDetails = {
    curveSelected: Curve,
    pointSelected: Point
}
enum InterfaceMode {
    selectCurve = 'curve-select-button',
    newCurve = 'curve-new-button',
    addControlPoints = 'add-control-points-button',
    moveControlPoints = 'move-control-points-button',
    deleteControlPoints = 'delete-control-points-button',
    deleteCurve = 'delete-curve-button'
}

/* VARIÁVEIS GLOBAIS */

// Estado e configurações
let renderingSettings: CanvasPanelRenderingSettings
let curves: Curve[];
let selectedInterfaceMode: InterfaceMode;
let selectedCurve: Curve;
let toastAlertsPresented: Map<InterfaceMode, boolean>;

// Elementos da interface
let canvasElement: HTMLCanvasElement;
let canvasContext: CanvasRenderingContext2D;
let canvasBoundingRectangle: DOMRect;
let toastAlert: HTMLElement;

/* INICIALIZAÇÃO */

(function() {
    
    toastAlert = document.getElementById('toast-alert');
    toastAlertsPresented = new Map();

    configureVisualizationController({
        showCurves: true,
        showControlPoints: true,
        showControlPolygons: true,
        curvesEvaluation: 200,
        appearance: {
            curves: {
                color: '#009DFF',
                thickness: 4
            },
            controlPoints: {
                color: '#004F80',
                thickness: 10
            },
            controlPolygons: {
                color: '#73828C',
                thickness: 2
            }
        }
    });
    curves = [];
    selectInterfaceMode(InterfaceMode.newCurve);
    selectCurve(null);

    let isCanvasUpdating = false;
    let optimizedUpdateCanvas = function() {
        if (isCanvasUpdating) {
            return;
        }
        isCanvasUpdating = true;
        requestAnimationFrame(function() {
            updateCanvas();
            isCanvasUpdating = false;
        });
    };
    window.addEventListener('resize', optimizedUpdateCanvas);
    updateCanvas();

    canvasElement.addEventListener('click', onCanvasClick);
    canvasElement.addEventListener('mousedown', onCanvasMouseDown);

})();

/* FUNÇÕES DA INTERFACE */

function updateCanvas() {

    canvasElement = document.getElementById('canvas-panel') as HTMLCanvasElement;
    
    if (window.innerWidth > 800) {
        canvasElement.width = Math.max(window.innerWidth * 0.65, window.innerWidth - 512);
        canvasElement.height = window.innerHeight;
    } else {
        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight;
    }
    canvasContext = canvasElement.getContext('2d');
    canvasBoundingRectangle = canvasElement.getBoundingClientRect();
    
    renderFrame();
}

function onCanvasClick(event: MouseEvent) {

    const clickCoordinates = getCanvasClickCoordinates(event);

    if (selectedInterfaceMode === InterfaceMode.selectCurve) {
        const curve = getCurveFromPoint(clickCoordinates);
        selectCurve(curve);
    }

    if (selectedInterfaceMode === InterfaceMode.newCurve) {
        const curve = {
            controlPoints: [clickCoordinates]
        }

        curves.push(curve);
        selectCurve(curve);
        selectInterfaceMode(InterfaceMode.addControlPoints);
    }

    if (selectedInterfaceMode === InterfaceMode.addControlPoints) {
        selectedCurve?.controlPoints.push(clickCoordinates);
    }

    if (selectedInterfaceMode === InterfaceMode.deleteControlPoints) {
        const selectedControlPoint = getControlPoint(clickCoordinates);
        selectedCurve.controlPoints = selectedCurve.controlPoints.filter(controlPoint => controlPoint !== selectedControlPoint);
        if (selectedCurve.controlPoints.length === 0) {
            curves = curves.filter(curve => curve !== selectedCurve);
            selectCurve(null);
            if (curves.length > 0) {
                selectInterfaceMode(InterfaceMode.selectCurve);
            } else {
                selectInterfaceMode(InterfaceMode.newCurve);
            }
        }
    }

    renderFrame();

}

function onCanvasMouseDown(event: MouseEvent) {
    if (selectedInterfaceMode === InterfaceMode.moveControlPoints) {
        const clickCoordinates = getCanvasClickCoordinates(event);
        
        let selectedControlPoint = getControlPoint(clickCoordinates);
        
        if (selectedControlPoint) {

            let isFrameRendering = false;
            let optimizedRenderFrame = function() {
                if (isFrameRendering) {
                    return;
                }
                isFrameRendering = true;
                requestAnimationFrame(function() {
                    renderFrame();
                    isFrameRendering = false;
                });
            };

            let onMouseMove = (mouseMoveEvent: MouseEvent) => {
                const draggingCoordinates = getCanvasClickCoordinates(mouseMoveEvent);
                selectedControlPoint.x = draggingCoordinates.x;
                selectedControlPoint.y = draggingCoordinates.y;
                optimizedRenderFrame();
            }

            let onMouseUp = () => {
                canvasElement.removeEventListener('mouseup', onMouseUp)
                canvasElement.removeEventListener('mousemove', onMouseMove)
                renderFrame();
            }

            canvasElement.addEventListener('mousemove', onMouseMove);
            canvasElement.addEventListener('mouseup', onMouseUp);

        } 

    }
}

function selectInterfaceMode(interfaceMode: InterfaceMode) {
    selectedInterfaceMode = interfaceMode;
    let alertToastMessage: string;

    if (selectedInterfaceMode === InterfaceMode.selectCurve) {
        alertToastMessage = 'Selecione uma curva para editá-la.';
        selectCurve(null);
        renderFrame();
    }

    if (selectedInterfaceMode === InterfaceMode.newCurve) {
        alertToastMessage = 'Clique em qualquer lugar do quadro para adicionar o primeiro ponto da sua curva.';
    }

    if (selectedInterfaceMode === InterfaceMode.addControlPoints) {
        alertToastMessage = 'Continue adicionando pontos clicando em qualquer lugar do quadro.';
    }

    if (selectedInterfaceMode === InterfaceMode.moveControlPoints) {
        alertToastMessage = 'Para mover um ponto de controle, arraste-o para o novo local desejado.';
    }

    if (selectedInterfaceMode === InterfaceMode.deleteControlPoints) {
        alertToastMessage = 'Clique em um ponto para apagá-lo.';
    }

    if (selectedInterfaceMode === InterfaceMode.deleteCurve) {
        curves = curves.filter(curve => curve !== selectedCurve);
        selectCurve(null);
        if (curves.length > 0) {
            selectInterfaceMode(InterfaceMode.selectCurve);
        } else {
            selectInterfaceMode(InterfaceMode.newCurve);
        }
        renderFrame();
    }

    if (alertToastMessage && !toastAlertsPresented.get(selectedInterfaceMode)) {
        presentToastAlert(alertToastMessage);
        toastAlertsPresented.set(selectedInterfaceMode, true);
    }

    for (const button of document.querySelectorAll('.controller-button')) {
        button.classList.remove('selected');
    }

    const selectedButton = document.getElementById(selectedInterfaceMode);
    selectedButton.classList.add('selected');
}

function getCanvasClickCoordinates(event: MouseEvent): Point {
    return {
        x: event.clientX - canvasElement.getBoundingClientRect().left,
        y: event.clientY - canvasElement.getBoundingClientRect().top
    }
}

function selectCurve(curve: Curve) {
    const message = document.querySelector('.no-curve-selected-message');
    const controllerButtons = document.querySelector('#control-points-controller .controller-buttons');

    if (curve) {
        selectedCurve = curve;
        
        message.classList.add('hidden-element');
        controllerButtons.classList.remove('hidden-element');

    } else {
        selectedCurve = null;

        message.classList.remove('hidden-element');
        controllerButtons.classList.add('hidden-element');
    }

};

function presentToastAlert(message: string, warning: boolean = false) {
    const toastAlertContent = toastAlert.querySelector('#toast-alert-content');
    const toastAlertIcon = toastAlert.querySelector('sl-icon');
    toastAlertContent.textContent = message;

    if (warning) {
        toastAlert.setAttribute('type', 'warning'); 
        toastAlertIcon.setAttribute('name', 'exclamation-triangle');
    } else {
        toastAlert.setAttribute('type', 'primary');
        toastAlertIcon.setAttribute('name', 'info-circle');
    }

    setTimeout(() => {
        (toastAlert as any).toast();
    }, 300)
}

function configureVisualizationController(standardRenderingSettings: CanvasPanelRenderingSettings) {
    renderingSettings = standardRenderingSettings;

    const curvesEvaluationInput: any = document.getElementById('curves-evaluation-input');

    const showCurvesSwitch: any = document.getElementById('show-curves-switch');
    const showControlPointsSwitch: any = document.getElementById('show-control-points-switch');
    const showControlPolygonsSwitch: any = document.getElementById('show-control-polygons-switch');

    const curvesThicknessRange: any = document.getElementById('curves-thickness-range');
    const controlPointsThicknessRange: any = document.getElementById('control-points-thickness-range');
    const controlPolygonsThicknessRange: any = document.getElementById('control-polygons-thickness-range');

    const curvesColorPicker: any = document.getElementById('curves-color-picker');
    const controlPointsColorPicker: any = document.getElementById('control-points-color-picker');
    const controlPolygonsColorPicker: any = document.getElementById('control-polygons-color-picker');

    curvesEvaluationInput.value = renderingSettings.curvesEvaluation;

    showCurvesSwitch.checked = renderingSettings.showCurves;
    showControlPointsSwitch.checked = renderingSettings.showControlPoints;
    showControlPolygonsSwitch.checked = renderingSettings.showControlPolygons;

    curvesThicknessRange.value = renderingSettings.appearance.curves.thickness;
    controlPointsThicknessRange.value = renderingSettings.appearance.controlPoints.thickness;
    controlPolygonsThicknessRange.value = renderingSettings.appearance.controlPolygons.thickness;

    curvesColorPicker.value = renderingSettings.appearance.curves.color;
    controlPointsColorPicker.value = renderingSettings.appearance.controlPoints.color;
    controlPolygonsColorPicker.value = renderingSettings.appearance.controlPolygons.color;

    curvesEvaluationInput.addEventListener('sl-change', (event) => {
        if (event.target.value > 0) {
            renderingSettings.curvesEvaluation = event.target.value;
            if (renderingSettings.curvesEvaluation < 20) {
                presentToastAlert('Avaliações muito pequenas podem degradar a qualidade da renderização e dificultar a seleção das curvas. Sugerimos o valor 200.', true)
            }

            if (renderingSettings.curvesEvaluation > 3000) {
                presentToastAlert('Avaliações muito grandes podem deixar a aplicação lenta. Sugerimos o valor 200.', true)
            }
        } else {
            renderingSettings.curvesEvaluation = 200;
            curvesEvaluationInput.value = renderingSettings.curvesEvaluation;
        }

        renderFrame();
    });

    showCurvesSwitch.addEventListener('sl-change', (event) => {
        renderingSettings.showCurves = event.target.checked;
        renderFrame();
    });

    showControlPointsSwitch.addEventListener('sl-change', (event) => {
        renderingSettings.showControlPoints = event.target.checked;
        renderFrame();
    });

    showControlPolygonsSwitch.addEventListener('sl-change', (event) => {
        renderingSettings.showControlPolygons = event.target.checked;
        renderFrame();
    });

    curvesThicknessRange.addEventListener('sl-change', (event) => {
        renderingSettings.appearance.curves.thickness = event.target.value;
        renderFrame();

        if (renderingSettings.appearance.curves.thickness < 4) {
            presentToastAlert('Talvez seja difícil selecionar as curvas com a espessura muito pequena. Caso enfrente problemas, tente aumentar a espessura.', true);
        } 
    })

    controlPointsThicknessRange.addEventListener('sl-change', (event) => {
        renderingSettings.appearance.controlPoints.thickness = event.target.value;
        renderFrame();
        if (renderingSettings.appearance.controlPoints.thickness < 4) {
            presentToastAlert('Talvez seja difícil mover e apagar os pontos de controle com a espessura muito pequena. Caso enfrente problemas, tente aumentar a espessura.', true);
        } 
    })

    controlPolygonsThicknessRange.addEventListener('sl-change', (event) => {
        renderingSettings.appearance.controlPolygons.thickness = event.target.value;
        renderFrame();
    })

    curvesColorPicker.addEventListener('sl-change', (event) => {
        renderingSettings.appearance.curves.color = event.target.value;
        renderFrame();
    })

    controlPointsColorPicker.addEventListener('sl-change', (event) => {
        renderingSettings.appearance.controlPoints.color = event.target.value;
        renderFrame();
    })

    controlPolygonsColorPicker.addEventListener('sl-change', (event) => {
        renderingSettings.appearance.controlPolygons.color = event.target.value;
        renderFrame();
    })

}

/* MANIPULAÇÃO DO CANVAS */

function renderFrame() {
    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);

    for (const curve of curves) {

        if (renderingSettings.showControlPolygons) {
            drawLines(curve.controlPoints,
                selectedCurve === curve ? renderingSettings.appearance.controlPolygons : {
                    color: '#D5DADD',
                    thickness: renderingSettings.appearance.controlPolygons.thickness
                });
        }

        if (renderingSettings.showCurves) {
            drawCurve(curve,
                selectedCurve === curve ? renderingSettings.appearance.curves : {
                    color: '#D5DADD',
                    thickness: renderingSettings.appearance.curves.thickness 
                });
        }

        if (renderingSettings.showControlPoints) {
            for (const controlPoint of curve.controlPoints) {
                drawPoint(controlPoint,
                    selectedCurve === curve ? renderingSettings.appearance.controlPoints : {
                        color: '#D5DADD',
                        thickness: renderingSettings.appearance.controlPoints.thickness
                    });
            }
        }
    }
}

function drawPoint(point: Point, appearance: ElementAppearanceSettings) {
    canvasContext.strokeStyle = appearance.color;
    canvasContext.fillStyle = appearance.color;

    canvasContext.beginPath();
    canvasContext.arc(point.x, point.y, (appearance.thickness / 2), 0, 2 * Math.PI, true);
    
    canvasContext.fill();
}

function drawLines(points: Point[], appearance: ElementAppearanceSettings) {
    if (!points && points.length < 2) {
        return;
    }

    for (const [startingPoint, endingPoint] of pairwise(points)) {
        canvasContext.lineWidth = appearance.thickness;
        canvasContext.strokeStyle = appearance.color;
        
        canvasContext.beginPath();
        canvasContext.moveTo(startingPoint.x, startingPoint.y);
        canvasContext.lineTo(endingPoint.x, endingPoint.y);
        canvasContext.stroke();
    }
}

function drawCurve(curve: Curve, appearance: ElementAppearanceSettings) {
    const curvePoints: Point[] = [];
    
    for (let evaluationsPerformed = 0; evaluationsPerformed < renderingSettings.curvesEvaluation; evaluationsPerformed++) {
        curvePoints.push(deCasteljau(curve.controlPoints, evaluationsPerformed));
    }

    curve.curvePoints = curvePoints;
    drawLines(curvePoints, appearance);
}

function deCasteljau(controlPoints: Point[], currentEvaluation: number): Point {
    if (controlPoints && controlPoints.length === 1) {
        return controlPoints[0];
    }

    const points: Point[] = [];

    for (const [startingPoint, endingPoint] of pairwise(controlPoints)) {
        const currentEvaluationRatio = currentEvaluation / renderingSettings.curvesEvaluation;
        const point: Point = {
            x: (startingPoint.x * (1 - currentEvaluationRatio)) + (endingPoint.x * currentEvaluationRatio),
            y: (startingPoint.y * (1 - currentEvaluationRatio)) + (endingPoint.y * currentEvaluationRatio) 
        }
        points.push(point);
    }

    return deCasteljau(points, currentEvaluation);
}

function getControlPoint(selectedPoint: Point): Point {
    return selectedCurve.controlPoints.find(point => {
        const vector: Point = {
            x: (selectedPoint.x - point.x),
            y: (selectedPoint.y - point.y)
        }
        if ((Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))) <= renderingSettings.appearance.controlPoints.thickness) {
            return true;
        }
        return false;
    })
}

function getCurveFromPoint(selectedPoint: Point): Curve {
    return curves.find(curve => {
        return curve.curvePoints.find(point => {
            const vector: Point = {
                x: (selectedPoint.x - point.x),
                y: (selectedPoint.y - point.y)
            }
            if ((Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))) <= renderingSettings.appearance.curves.thickness) {
                return true;
            }
            return false;
        })
    })
}

function* pairwise <T>(iterable: Iterable<T>) {
    const iterator = iterable[Symbol.iterator]();

    let currentResult = iterator.next();
    let nextResult = iterator.next();

    while (!nextResult.done) {
        yield [currentResult.value as T, nextResult.value as T];
        currentResult = nextResult;
        nextResult = iterator.next();
    }
}
