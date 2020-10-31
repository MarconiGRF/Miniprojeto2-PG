<template>
    <div class="panel flex column justify-space-between">
        <div class="text-align-center title">
            <h2 class="inline">{{ title }}</h2> <h2 class="bullet inline">•</h2> <h2 class="blue-color inline">{{ subtitle }}</h2>
        </div>

        <div class="controllers">
            <CurveController title="CURVAS" v-bind:units="units"/>
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
          units: [
              {
                  component: ControlUnit,
                  icon: { name: 'cursor', type: 'filled', size: '24'},
                  text: 'Selecionar',
                  action: function() {console.log('Ready, set, action!');} }
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
