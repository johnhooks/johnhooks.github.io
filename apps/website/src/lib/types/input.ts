export type InputEvent = Event & {
  currentTarget: EventTarget & HTMLInputElement;
};
