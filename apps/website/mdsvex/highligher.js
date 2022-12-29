import { toHtml } from "hast-util-to-html";
import { h } from "hastscript";
import rangeParser from "parse-numeric-range";
import rehypeParse from "rehype-parse";
import shiki from "shiki";
import { unified } from "unified";
import { visit } from "unist-util-visit";

//
/**
 * Escape curlies, backtick, \t, \r, \n to avoid breaking output of {@html `here`} in .svelte
 *
 * [reference](https://github.com/pngwn/MDsveX/blob/6c60fe68c335fce559db9690fbf5e69ef539d37d/packages/mdsvex/src/transformers/index.ts#L571)
 * @param {string} str
 * @returns {string}
 */
const escape_svelty = (str) =>
  str
    .replace(/[{}`]/g, (c) => ({ "{": "&#123;", "}": "&#125;", "`": "&#96;" }[c]))
    .replace(/\\([trn])/g, "&#92;$1");

export const reverseString = (s) => s?.split("").reverse().join("");

const hastParser = unified().use(rehypeParse, { fragment: true });

const shikiHighlighter = await shiki.getHighlighter({ theme: "css-variables" });

/**
 * Highlighter function for Mdsvex codeblocks.
 *
 * [reference](https://github.com/atomiks/rehype-pretty-code/blob/e24f8415c8264dc868006ced839d3cb7445e716a/src/index.js#L50)
 * @param {string} raw - Source code to highlight
 * @param {string} lang - Source language
 * @param {string} meta - Source metadata
 * @returns
 */
export async function highlighter(raw, lang, meta) {
  const titleMatch = meta?.match(/title="(.+)"/);
  const title = titleMatch?.[1] ?? null;
  const titleString = titleMatch?.[0] ?? "";
  const metaWithoutTitle = meta?.replace(titleString, "");

  const tree = hastParser.parse(shikiHighlighter.codeToHtml(raw, { lang: lang || "txt" }));

  const lineNumbers = meta ? rangeParser(metaWithoutTitle.match(/{(.*)}/)?.[1] ?? "") : [];
  let lineCounter = 0;

  // inspiration: https://github.com/atomiks/rehype-pretty-code/blob/e24f8415c8264dc868006ced839d3cb7445e716a/src/index.js#L89
  visit(tree, "element", (node) => {
    if (node.tagName === "code" && /srebmuNeniLwohs(?!(.*)(\/))/.test(reverseString(meta))) {
      node.properties["data-line-numbers"] = "";

      const lineNumbersStartAtMatch = reverseString(meta).match(
        /(?:\}(\d+){)?srebmuNeniLwohs(?!(.*)(\/))/
      );
      if (lineNumbersStartAtMatch[1])
        node.properties["style"] = `counter-set: line ${
          reverseString(lineNumbersStartAtMatch[1]) - 1
        };`;
    }

    if (node.properties.className?.[0] === "line") {
      if (lineNumbers.length !== 0 && lineNumbers.includes(++lineCounter)) {
        node.properties["data-highlight"] = "";
      }
    }
  });

  toFragment({ node: tree, lang, title });

  return escape_svelty(toHtml(tree));
}

/**
 *
 * [reference](https://github.com/atomiks/rehype-pretty-code/blob/e24f8415c8264dc868006ced839d3cb7445e716a/src/index.js#L9)
 * @param {{node: , lang: string, title?: string, inline: boolean}} params - Params object
 * @returns
 */
function toFragment({ node, lang, title, inline = false }) {
  node.tagName = inline ? "span" : "div";
  // User can replace this with a real Fragment at runtime
  node.properties = { "data-code-fragment": "" };

  const pre = node.children[0];
  // Remove class="shiki" and the background-color
  pre.properties = {};
  pre.properties["data-language"] = lang;
  pre.properties["data-code-title"] = title;

  const code = pre.children[0];
  code.properties["data-language"] = lang;

  if (inline) {
    node.children = [code];
    return;
  }

  if (title) {
    node.children = [
      h("div", { className: ["codeblock"] }, [
        h("p", { className: ["text-gray-500"], "data-language": lang }, title),
        pre,
      ]),
    ];
    return;
  }

  node.children = [pre];
}
