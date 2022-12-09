import { s } from "hastscript";

export default function () {
  return s(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewbox: "0 0 24 24",
      strokeWidth: "1.5",
      stroke: "currentColor",
      class: "w-5 h-5 ml-2 inline-block text-gray-400 hover:text-gray-700",
      ariaHidden: "true",
    },
    [
      s("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244",
      }),
    ]
  );
}
