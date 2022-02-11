import { mount } from "@vue/test-utils";
import GateButtonWidget from "@/GateButtonWidget.vue";

describe("GateButtonSwitch component", () => {
  const wrapper = mount(GateButtonWidget, {
    props: {
      gateSystem: {
        gate: {
          toggle: jest.fn(),
        },
      },
    },
  });

  it("shows correct markup", () => {
    expect(wrapper.html()).toContain("<button>Toggle Gate</button>");
  });

  it("calls gate's toggle methods on click", async () => {
    await wrapper.find("button").trigger("click");
    expect(wrapper.vm.gateSystem.gate.toggle).toHaveBeenCalled();
  });
});
