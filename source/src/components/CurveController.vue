<template>
    <div class="controller">
        <h5>{{ title }}</h5>
        <div class="flex units" v-if="units">
            <component v-for="controlUnit in units"
                       :key="controlUnit.id"
                       :is="controlUnit.component"
                       :text="controlUnit.text"
                       :icon="controlUnit.icon"
                       :action="controlUnit.action"
                       @[controlUnit.action]="$emit($event, $event)">
            </component>
        </div>
        <div class="flex units" v-if="!units">
            <span class="small-text">{{ NO_CONTROL_UNITS_MESSAGE }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CurveController',
    props: {
        title: String,
        units: Array
    },
    data: function() {
        return {
            NO_CONTROL_UNITS_MESSAGE: 'Crie ou uma curva ou selecione uma existente para editar seus pontos de controle.'
        }
    }
}
</script>

<style scoped>
h5 {
    margin: 0;
    padding-left: 4em;
}

span {
    color: var(--sl-color-gray-65);
    margin-top: .3em;
    padding: 0 .3em;
}

.controller {
    background-color: #e6e9e7;
    padding: 1.5em 2.6em 1.5em 0;
    margin: 2em 0;
    border-top-right-radius: 4em;
    border-bottom-right-radius: 4em;
}

.units {
    margin-left: 3.1em;
}
</style>
