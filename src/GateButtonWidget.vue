<template>
<div>
  <button @click="toggleGate">Toggle Gate</button><br>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: ['gateSystem'],
  methods: {
    toggleGate() {
      this.gateSystem.gate.toggle();
    }
  }
});
</script>
