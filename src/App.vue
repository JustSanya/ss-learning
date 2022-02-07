<template>
<div class="widgets">
  <h2>Widget 1</h2>
  <gate-button-widget :gateSystem="gateSystem"/>
  <hr/>

  <h2>Widget 2</h2>
  <i-phone-widget :gateSystem="gateSystem"/>
  <hr/>

  <h2>Widget 3</h2>
  <car-sensor-widget :gateSystem="gateSystem"/>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GateSystem from './logic/GateSystem';
import GateButtonWidget from './GateButtonWidget.vue';
import IPhoneWidget from './IPhoneWidget.vue';
import CarSensorWidget from './CarSensorWidget.vue';

export default defineComponent({
  name: 'App',
  data() {
    return { gateSystem: new GateSystem() };
  },
  components: {
    GateButtonWidget,
    IPhoneWidget,
    CarSensorWidget
  }
});
</script>
