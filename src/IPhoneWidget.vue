<template>
<section class="iPhoneWidget">
  <gate-button-widget :gateSystem="gateSystem"/>
  <section class="logs">
    <span>Logs:</span>
    <p v-for="(log, index) in logs" :key="index">{{ log }}</p>
  </section>
  <label class="autoCloseTimeout">Auto close timeout<br/>
    <input type="number" v-model.lazy="gateSystem.gate.autoCloseTimeout"/>
  </label>
  <label class="duration">Duration<br/>
    <input type="number" v-model.lazy="gateSystem.gate.duration"/>
  </label>
  <section class="currentStateContainer">
    <span>Gate's current state:</span><br/>
    <span class="currentState">{{ logs[logs.length - 1] }}</span>
  </section>
</section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GateButtonWidget from './GateButtonWidget.vue';

export default defineComponent({
  props: ['gateSystem'],
  components: { GateButtonWidget },
  computed: {
    logs() {
      return this.gateSystem.logs;
    }
  },
  methods: {
    toggleGate() {
      this.gateSystem.gate.toggle();
    }
  }
})
</script>

<style scoped>
  .iPhoneWidget {
    display: flex;
    align-items: flex-start;
  }

  .iPhoneWidget > * {
    margin-right: 20px;
  }

  .logs {
    height: 300px;
    width: 200px;
    overflow: auto;
  }
</style>
