import { defineConfig } from "unocss";

export default defineConfig({
  rules: [
    [/^w([\.\d]+)$/, ([_, num]) => ({ width: `${num}px` })],
    [/^h([\.\d]+)$/, ([_, num]) => ({ height: `${num}px` })],
    [/^c-(#[a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/, ([_, e]) => ({ color: `${e}` })],

    [/^fs([\.\d]+)$/, ([_, num]) => ({ "font-size": `${num}px` })],

    [/^ml-([\.\d]+)$/, ([_, num]) => ({ "margin-left": `${num}px` })],
    [/^mt-([\.\d]+)$/, ([_, num]) => ({ "margin-top": `${num}px` })],
    [/^mr-([\.\d]+)$/, ([_, num]) => ({ "margin-right": `${num}px` })],
    [/^mb-([\.\d]+)$/, ([_, num]) => ({ "margin-bottom": `${num}px` })],
    [/^m-([\.\d]+)$/, ([_, num]) => ({ margin: `${num}px` })],
    [/^br-([\.\d]+)$/, ([_, num]) => ({ "border-radius": `${num}px` })],

    [/^pl-([\.\d]+)$/, ([_, num]) => ({ "padding-left": `${num}px` })],
    [/^pr-([\.\d]+)$/, ([_, num]) => ({ "padding-right": `${num}px` })],
    [/^pb-([\.\d]+)$/, ([_, num]) => ({ "padding-bottom": `${num}px` })],
    [/^pt-([\.\d]+)$/, ([_, num]) => ({ "padding-top": `${num}px` })],
    [/^p-([\.\d]+)$/, ([_, num]) => ({ padding: `${num}px` })],
    [/^px-([\.\d]+)$/, ([_, num]) => ({ padding: `0 ${num}px` })],
    [/^py-([\.\d]+)$/, ([_, num]) => ({ padding: `${num}px 0` })],
    [/^ls-([\.\d]+)$/, ([_, num]) => ({ "letter-spacing": `${num}px` })],

    ["cursor", { cursor: "pointer" }],
    ["flex-1", { flex: 1 }],
    ["pos-r", { position: "relative" }],
    ["pos-a", { position: "absolute" }],
    [/^t-([\.\d]+)$/, ([_, num]) => ({ top: `${num}px` })],
    [/^r-([\.\d]+)$/, ([_, num]) => ({ right: `${num}px` })],
    [/^b-([\.\d]+)$/, ([_, num]) => ({ bottom: `${num}px` })],
    [/^l-([\.\d]+)$/, ([_, num]) => ({ left: `${num}px` })],
    ["bold", { "font-weight": "bold" }],
    ["flex-column", { "flex-direction": "column" }],
    ["flex-wrap", { "flex-wrap": "wrap" }],
    ["items-center", { "align-items": "center" }],
    ["br50%", { "border-radius": "50%" }],
  ],
});
