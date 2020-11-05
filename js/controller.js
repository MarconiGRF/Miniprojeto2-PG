/* DEFINIÇÕES DE TIPOS */
var InterfaceMode;
(function (InterfaceMode) {
    InterfaceMode["selectCurve"] = "curve-select-button";
    InterfaceMode["newCurve"] = "curve-new-button";
    InterfaceMode["addControlPoints"] = "add-control-points-button";
    InterfaceMode["moveControlPoints"] = "move-control-points-button";
    InterfaceMode["deleteControlPoints"] = "delete-control-points-button";
    InterfaceMode["deleteCurve"] = "delete-curve-button";
})(InterfaceMode || (InterfaceMode = {}));
/* VARIÁVEIS GLOBAIS */
// Estado e configurações
let renderingSettings;
let curves;
let selectedInterfaceMode;
let selectedCurve;
let toastAlertsPresented;
// Elementos da interface
let canvasElement;
let canvasContext;
let canvasBoundingRectangle;
let toastAlert;
/* INICIALIZAÇÃO */
(function () {
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
    let optimizedUpdateCanvas = function () {
        if (isCanvasUpdating) {
            return;
        }
        isCanvasUpdating = true;
        requestAnimationFrame(function () {
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
    canvasElement = document.getElementById('canvas-panel');
    if (window.innerWidth > 800) {
        canvasElement.width = Math.max(window.innerWidth * 0.65, window.innerWidth - 512);
        canvasElement.height = window.innerHeight;
    }
    else {
        canvasElement.width = window.innerWidth;
        canvasElement.height = window.innerHeight;
    }
    canvasContext = canvasElement.getContext('2d');
    canvasBoundingRectangle = canvasElement.getBoundingClientRect();
    renderFrame();
}
function onCanvasClick(event) {
    const clickCoordinates = getCanvasClickCoordinates(event);
    if (selectedInterfaceMode === InterfaceMode.selectCurve) {
        const curve = getCurveFromPoint(clickCoordinates);
        selectCurve(curve);
    }
    if (selectedInterfaceMode === InterfaceMode.newCurve) {
        const curve = {
            controlPoints: [clickCoordinates]
        };
        curves.push(curve);
        selectCurve(curve);
        selectInterfaceMode(InterfaceMode.addControlPoints);
    }
    if (selectedInterfaceMode === InterfaceMode.addControlPoints) {
        selectedCurve === null || selectedCurve === void 0 ? void 0 : selectedCurve.controlPoints.push(clickCoordinates);
    }
    if (selectedInterfaceMode === InterfaceMode.deleteControlPoints) {
        const selectedControlPoint = getControlPoint(clickCoordinates);
        selectedCurve.controlPoints = selectedCurve.controlPoints.filter(controlPoint => controlPoint !== selectedControlPoint);
        if (selectedCurve.controlPoints.length === 0) {
            curves = curves.filter(curve => curve !== selectedCurve);
            selectCurve(null);
            if (curves.length > 0) {
                selectInterfaceMode(InterfaceMode.selectCurve);
            }
            else {
                selectInterfaceMode(InterfaceMode.newCurve);
            }
        }
    }
    renderFrame();
}
function onCanvasMouseDown(event) {
    if (selectedInterfaceMode === InterfaceMode.moveControlPoints) {
        const clickCoordinates = getCanvasClickCoordinates(event);
        let selectedControlPoint = getControlPoint(clickCoordinates);
        if (selectedControlPoint) {
            let isFrameRendering = false;
            let optimizedRenderFrame = function () {
                if (isFrameRendering) {
                    return;
                }
                isFrameRendering = true;
                requestAnimationFrame(function () {
                    renderFrame();
                    isFrameRendering = false;
                });
            };
            let onMouseMove = (mouseMoveEvent) => {
                const draggingCoordinates = getCanvasClickCoordinates(mouseMoveEvent);
                selectedControlPoint.x = draggingCoordinates.x;
                selectedControlPoint.y = draggingCoordinates.y;
                optimizedRenderFrame();
            };
            let onMouseUp = () => {
                canvasElement.removeEventListener('mouseup', onMouseUp);
                canvasElement.removeEventListener('mousemove', onMouseMove);
                renderFrame();
            };
            canvasElement.addEventListener('mousemove', onMouseMove);
            canvasElement.addEventListener('mouseup', onMouseUp);
        }
    }
}
function selectInterfaceMode(interfaceMode) {
    selectedInterfaceMode = interfaceMode;
    let alertToastMessage;
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
        }
        else {
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
function getCanvasClickCoordinates(event) {
    return {
        x: event.clientX - canvasElement.getBoundingClientRect().left,
        y: event.clientY - canvasElement.getBoundingClientRect().top
    };
}
function selectCurve(curve) {
    const message = document.querySelector('.no-curve-selected-message');
    const controllerButtons = document.querySelector('#control-points-controller .controller-buttons');
    if (curve) {
        selectedCurve = curve;
        message.classList.add('hidden-element');
        controllerButtons.classList.remove('hidden-element');
    }
    else {
        selectedCurve = null;
        message.classList.remove('hidden-element');
        controllerButtons.classList.add('hidden-element');
    }
}
;
function presentToastAlert(message, warning = false) {
    const toastAlertContent = toastAlert.querySelector('#toast-alert-content');
    const toastAlertIcon = toastAlert.querySelector('sl-icon');
    toastAlertContent.textContent = message;
    if (warning) {
        toastAlert.setAttribute('type', 'warning');
        toastAlertIcon.setAttribute('name', 'exclamation-triangle');
    }
    else {
        toastAlert.setAttribute('type', 'primary');
        toastAlertIcon.setAttribute('name', 'info-circle');
    }
    setTimeout(() => {
        toastAlert.toast();
    }, 300);
}
function configureVisualizationController(standardRenderingSettings) {
    renderingSettings = standardRenderingSettings;
    const curvesEvaluationInput = document.getElementById('curves-evaluation-input');
    const showCurvesSwitch = document.getElementById('show-curves-switch');
    const showControlPointsSwitch = document.getElementById('show-control-points-switch');
    const showControlPolygonsSwitch = document.getElementById('show-control-polygons-switch');
    const curvesThicknessRange = document.getElementById('curves-thickness-range');
    const controlPointsThicknessRange = document.getElementById('control-points-thickness-range');
    const controlPolygonsThicknessRange = document.getElementById('control-polygons-thickness-range');
    const curvesColorPicker = document.getElementById('curves-color-picker');
    const controlPointsColorPicker = document.getElementById('control-points-color-picker');
    const controlPolygonsColorPicker = document.getElementById('control-polygons-color-picker');
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
                presentToastAlert('Avaliações muito pequenas podem degradar a qualidade da renderização e dificultar a seleção das curvas. Sugerimos o valor 200.', true);
            }
            if (renderingSettings.curvesEvaluation > 3000) {
                presentToastAlert('Avaliações muito grandes podem deixar a aplicação lenta. Sugerimos o valor 200.', true);
            }
        }
        else {
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
    });
    controlPointsThicknessRange.addEventListener('sl-change', (event) => {
        renderingSettings.appearance.controlPoints.thickness = event.target.value;
        renderFrame();
        if (renderingSettings.appearance.controlPoints.thickness < 4) {
            presentToastAlert('Talvez seja difícil mover e apagar os pontos de controle com a espessura muito pequena. Caso enfrente problemas, tente aumentar a espessura.', true);
        }
    });
    controlPolygonsThicknessRange.addEventListener('sl-change', (event) => {
        renderingSettings.appearance.controlPolygons.thickness = event.target.value;
        renderFrame();
    });
    curvesColorPicker.addEventListener('sl-change', (event) => {
        renderingSettings.appearance.curves.color = event.target.value;
        renderFrame();
    });
    controlPointsColorPicker.addEventListener('sl-change', (event) => {
        renderingSettings.appearance.controlPoints.color = event.target.value;
        renderFrame();
    });
    controlPolygonsColorPicker.addEventListener('sl-change', (event) => {
        renderingSettings.appearance.controlPolygons.color = event.target.value;
        renderFrame();
    });
}
/* MANIPULAÇÃO DO CANVAS */
function renderFrame() {
    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
    for (const curve of curves) {
        if (renderingSettings.showControlPolygons) {
            drawLines(curve.controlPoints, selectedCurve === curve ? renderingSettings.appearance.controlPolygons : {
                color: '#D5DADD',
                thickness: renderingSettings.appearance.controlPolygons.thickness
            });
        }
        if (renderingSettings.showCurves) {
            drawCurve(curve, selectedCurve === curve ? renderingSettings.appearance.curves : {
                color: '#D5DADD',
                thickness: renderingSettings.appearance.curves.thickness
            });
        }
        if (renderingSettings.showControlPoints) {
            for (const controlPoint of curve.controlPoints) {
                drawPoint(controlPoint, selectedCurve === curve ? renderingSettings.appearance.controlPoints : {
                    color: '#D5DADD',
                    thickness: renderingSettings.appearance.controlPoints.thickness
                });
            }
        }
    }
}
function drawPoint(point, appearance) {
    canvasContext.strokeStyle = appearance.color;
    canvasContext.fillStyle = appearance.color;
    canvasContext.beginPath();
    canvasContext.arc(point.x, point.y, (appearance.thickness / 2), 0, 2 * Math.PI, true);
    canvasContext.fill();
}
function drawLines(points, appearance) {
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
function drawCurve(curve, appearance) {
    const curvePoints = [];
    for (let evaluationsPerformed = 0; evaluationsPerformed < renderingSettings.curvesEvaluation; evaluationsPerformed++) {
        curvePoints.push(deCasteljau(curve.controlPoints, evaluationsPerformed));
    }
    curve.curvePoints = curvePoints;
    drawLines(curvePoints, appearance);
}
function deCasteljau(controlPoints, currentEvaluation) {
    if (controlPoints && controlPoints.length === 1) {
        return controlPoints[0];
    }
    const points = [];
    for (const [startingPoint, endingPoint] of pairwise(controlPoints)) {
        const currentEvaluationRatio = currentEvaluation / renderingSettings.curvesEvaluation;
        const point = {
            x: (startingPoint.x * (1 - currentEvaluationRatio)) + (endingPoint.x * currentEvaluationRatio),
            y: (startingPoint.y * (1 - currentEvaluationRatio)) + (endingPoint.y * currentEvaluationRatio)
        };
        points.push(point);
    }
    return deCasteljau(points, currentEvaluation);
}
function getControlPoint(selectedPoint) {
    return selectedCurve.controlPoints.find(point => {
        const vector = {
            x: (selectedPoint.x - point.x),
            y: (selectedPoint.y - point.y)
        };
        if ((Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))) <= renderingSettings.appearance.controlPoints.thickness) {
            return true;
        }
        return false;
    });
}
function getCurveFromPoint(selectedPoint) {
    return curves.find(curve => {
        return curve.curvePoints.find(point => {
            const vector = {
                x: (selectedPoint.x - point.x),
                y: (selectedPoint.y - point.y)
            };
            if ((Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))) <= renderingSettings.appearance.curves.thickness) {
                return true;
            }
            return false;
        });
    });
}
function* pairwise(iterable) {
    const iterator = iterable[Symbol.iterator]();
    let currentResult = iterator.next();
    let nextResult = iterator.next();
    while (!nextResult.done) {
        yield [currentResult.value, nextResult.value];
        currentResult = nextResult;
        nextResult = iterator.next();
    }
}
