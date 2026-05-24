export const titleTransitionAnimation = {
  forwards: {
    old: {
      name: "page-fade-out",
      duration: "1ms",
      fillMode: "both",
    },
    new: {
      name: "root-fade-in",
      duration: "180ms",
      easing: "ease-out",
      fillMode: "both",
    },
  },
  backwards: {
    old: {
      name: "page-fade-out",
      duration: "1ms",
      fillMode: "both",
    },
    new: {
      name: "root-fade-in",
      duration: "180ms",
      easing: "ease-out",
      fillMode: "both",
    },
  },
} as const;
