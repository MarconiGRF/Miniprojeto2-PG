<template>
    <div class="panel flex column justify-space-between">
        <div class="text-align-center title">
            <h2 class="inline">{{ title }}</h2> <h2 class="bullet inline">•</h2> <h2 class="blue-color inline">{{ subtitle }}</h2>
        </div>

        <div class="controllers">
            <CurveController :title="controllerNames.curves" :units="units" @add="$emit('canvasControl', $event)" @select="$emit('canvasControl', $event)"/>
            <CurveController :title="controllerNames.controlPoints"/>
            <CurveController :title="controllerNames.visualization"/>
        </div>

        <p class="text-align-center full-width">
            <a class="blue-color" href="https://github.com/MarconiGRF/Miniprojeto2-PG" target="_blank" rel="noopener">Código fonte</a>.
        </p>
    </div>
</template>

<script>
import CurveController from './CurveController';
import ControlUnit from "@/components/ControlUnit";

export default {
    name: 'ControlPanel',
    components: {
        CurveController
    },
    data: function() {
      return {
          controllerNames: {
              curves: 'CURVAS',
              controlPoints: 'PONTOS DE CONTROLE',
              visualization: 'VISUALIZAÇÃO'
          },
          units: [
              {
                  action: 'select',
                  component: ControlUnit,
                  icon: { name: 'cursor', type: 'filled', size: '24'},
                  id: 1,
                  text: 'Selecionar'
              },
              {
                  action: 'add',
                  component: ControlUnit,
                  icon: { name: 'add', type: 'filled', size: '24'},
                  id: 2,
                  text: 'Nova'
              }
          ]
      }
    },
    props: {
        title: String,
        subtitle: String
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.panel {
    background-color: #f8f9f9;
    height: 100vh;
    width: 50vh;
}

.title {
    padding: 2.5em 1em;
}

.bullet {
    font-size: 1.55em;
    padding: 0 .3rem;
}

.controllers {
    padding-right: 3em;
}

.text-align-center {
    text-align: center;
}

.justify-space-between {
    justify-content: space-between;
}
</style>
