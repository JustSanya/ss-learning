import { mount } from "@vue/test-utils";
import IPhoneWidget from "@/IPhoneWidget.vue";
import GateButtonWidget from "@/GateButtonWidget.vue";

let componentWrapper: any;
let gateSystemMock: any;

beforeEach(() => {
  gateSystemMock = {
    gate: {
      toggle: jest.fn(),
      autoCloseTimeout: 10000,
      duration: 10000
    },
    logs: ["test log 1"]
  }

  componentWrapper = mount(IPhoneWidget, {
    props: { gateSystem: gateSystemMock }
  });
});

test("should contain GateButtonWidget component", () => {
  expect(componentWrapper.findComponent(GateButtonWidget).exists()).toBe(true);
  expect(componentWrapper.findComponent(GateButtonWidget).props("gateSystem")).toEqual(gateSystemMock);
});

test("should render log", async () => {
  expect(componentWrapper.findAll(".logs p")[0].text()).toEqual(gateSystemMock.logs[0]);
  
  componentWrapper.props("gateSystem").logs.push("test log 2");
  await componentWrapper.vm.$nextTick();

  expect(componentWrapper.findAll(".logs p")[1].text()).toEqual(gateSystemMock.logs[1]);
});

test("should show default `auto close timeout` value", () => {
  expect((componentWrapper.find(".autoCloseTimeout input").element as HTMLInputElement).value).toEqual("10000");
});

test("should set an entered `auto close timeout` value", async () => {
  componentWrapper.find(".autoCloseTimeout input").setValue(5000);
  
  await componentWrapper.vm.$nextTick();
  
  expect(gateSystemMock.gate.autoCloseTimeout).toEqual(5000);
});

test("should show default `duration` value", () => {
  expect((componentWrapper.find(".duration input").element as HTMLInputElement).value).toEqual("10000");
});

test("should set an entered `duration` value", async () => {
  componentWrapper.find(".duration input").setValue(5000);
  
  await componentWrapper.vm.$nextTick();
  
  expect(gateSystemMock.gate.duration).toEqual(5000);
});

test("should show current gate state", async () => {
  expect(componentWrapper.find(".currentState").text()).toEqual(gateSystemMock.logs[0]);
  
  componentWrapper.props("gateSystem").logs.push("test log 2");
  await componentWrapper.vm.$nextTick();

  expect(componentWrapper.find(".currentState").text()).toEqual(gateSystemMock.logs[1]);
});
