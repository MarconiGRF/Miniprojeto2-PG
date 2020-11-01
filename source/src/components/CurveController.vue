<template>
    <div class="controller">
        <h5>{{ title }}</h5>
        <div class="flex units">
            <component v-for="controlUnit in units"
                       v-bind:key="controlUnit.id"
                       v-bind:is="controlUnit.component"
                       :text="controlUnit.text" :icon="controlUnit.icon"
                       :action="controlUnit.action">
            </component>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CurveController',
    props: {
        title: String,
        units: Array
    }
}
</script>

<style scoped>
h5 {
    margin: 0;
    padding-left: 4em;
}

.controller {
    background-color: #e6e9e7;
    padding: 1.5em 0;
    margin: 2em 0;
    border-top-right-radius: 4em;
    border-bottom-right-radius: 4em;
}

.units {
    margin-left: 3.1em;
}
</style>
