<template>
<section class="carSensorWidget">
  <div
    class="car"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    :style="carPositionPx"
  >Car</div>
  <section class="preParkingLineArea arrivingArea">Pre-parking</section>
  <section class="parkingLineArea arrivingArea">Gate</section>
  <section class="afterParkingLineArea">After-parking</section>
</section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: ['gateSystem'],
  data() {
    return {
      dragging: false,
      dragStartX: 0,
      dragStartY: 0,
      carPositionX: 0,
      carPositionY: 0
    };
  },
  computed: {
    carPositionPx() {
      return {
        left: this.carPositionX + 'px',
        top: this.carPositionY + 'px'
      };
    }
  },
  methods: {
    onDragStart(event: any) {
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
    },
    async onDragEnd(event: any) {
      const movementX = event.clientX - this.dragStartX;
      const movementY = event.clientY - this.dragStartY;

      this.carPositionX += movementX;
      this.carPositionY += movementY;

      await this.$nextTick();

      if (this.isCarArrived(event.target)) {
        this.gateSystem.sensor.onCarArrived();
      } else {
        this.gateSystem.sensor.onCarLeft();
      }
    },
    isCarArrived(car: HTMLElement): boolean | undefined {
      const rect = car.getBoundingClientRect();
      const x1 = rect.x;
      const x2 = x1 + rect.width;
      const y1 = rect.y;
      const y2 = y1 + rect.height;

      const ARRIVING_AREA_CLASS = 'arrivingArea';

      car.hidden = true;

      const isCarArrived = document.elementFromPoint(x1, y1)?.classList.contains(ARRIVING_AREA_CLASS)
        || document.elementFromPoint(x2, y1)?.classList.contains(ARRIVING_AREA_CLASS)
        || document.elementFromPoint(x1, y2)?.classList.contains(ARRIVING_AREA_CLASS)
        || document.elementFromPoint(x2, y2)?.classList.contains(ARRIVING_AREA_CLASS);

      car.hidden = false;

      return isCarArrived
    }
  }
})
</script>

<style scoped>
  .carSensorWidget {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .car {
    position: absolute;
    height: 50px;
    width: 100px;
    background: grey;
    color: white;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
  }

  .preParkingLineArea {
    height: 300px;
    width: 200px;
    background: rgba(255, 255, 0, .2);
    text-align: center;
    line-height: 300px;
  }

  .parkingLineArea {
    height: 300px;
    width: 100px;
    background: rgba(255, 0, 0, .2);
    text-align: center;
    line-height: 300px;
  }

  .afterParkingLineArea {
    height: 300px;
    width: 200px;
    background: rgba(0, 255, 0, .2);
    text-align: center;
    line-height: 300px;
  }
</style>
