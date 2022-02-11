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

  it("should show correct markup", () => {
    expect(wrapper.html()).toContain("<button>Toggle Gate</button>");
  });

  it("should call gate's toggle method on click", () => {
    wrapper.find("button").trigger("click");
    expect(wrapper.vm.gateSystem.gate.toggle).toHaveBeenCalled();
  });
});
