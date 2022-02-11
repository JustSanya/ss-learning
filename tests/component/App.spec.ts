import { mount } from '@vue/test-utils'
import App from "@/App.vue";
import GateButtonWidget from "@/GateButtonWidget.vue";
import IPhoneWidget from "@/IPhoneWidget.vue";
import CarSensorWidget from "@/CarSensorWidget.vue";

describe('App.vue', () => {
  test('should contain "GateButtonWidget", "IPhoneWidget", "CarSensorWidget" components', () => {
    const wrapper = mount(App)

    wrapper.findComponent(GateButtonWidget);
    wrapper.findComponent(IPhoneWidget);
    wrapper.findComponent(CarSensorWidget);
  })
})
