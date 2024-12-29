import { Parser } from "expr-eval";

document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("calc-display") as HTMLInputElement;
  const entry = document.getElementById("calc-entry") as HTMLInputElement;
  const answer = document.getElementById("calc-answer") as HTMLInputElement;
  const buttons = document.getElementsByClassName("calc-btn");
  let openBracketCount = 0;
  let rightBracket = false;

  Array.from(buttons).forEach((button) => {
    const btn = button as HTMLButtonElement;
    btn.addEventListener("click", () => {
      switch (btn.innerText) {
        case "AC":
          display.value = "";
          entry.value = "";
          answer.value = "";
          (document.getElementById("close-bracket-btn") as HTMLButtonElement).disabled = true;
          (document.getElementById("equals-btn") as HTMLButtonElement).disabled = false;
          openBracketCount = 0;
          rightBracket = false;
          break;
        case "CE":
          entry.value = "";
          break;
        case "=":
          display.value += entry.value;
          entry.value = "";
          rightBracket = false;
          answer.value = evaluateExpression(display.value);
          break;
        case "(":
          openBracketCount++;
          (document.getElementById("equals-btn") as HTMLButtonElement).disabled = true;
          (document.getElementById("close-bracket-btn") as HTMLButtonElement).disabled = false;
          if (entry.value !== "" || rightBracket) {
            display.value += entry.value + "*" + btn.innerText;
          } else {
            display.value += btn.innerText;
          }
          rightBracket = false;
          entry.value = "";
          break;
        case ")":
          rightBracket = true;
          openBracketCount--;
          if (openBracketCount === 0) {
            btn.disabled = true;
            (document.getElementById("equals-btn") as HTMLButtonElement).disabled = false;
            (document.getElementById("close-bracket-btn") as HTMLButtonElement).disabled = true;
          }
          display.value += entry.value + btn.innerText;
          entry.value = "";
          break;
        case "ANS":
          entry.value = answer.value;
          break;
        default:
          if (btn.classList.contains("operator")) {
            let rb = false;
            if (rightBracket && entry.value !== "") {
              display.value += "*" + entry.value + btn.innerText;
            } else {
              display.value += entry.value + btn.innerText;
            }
            if (btn.innerText === "%") {
              display.value = display.value.replace(
                /(\d+)\s*\+\s*(\d+)%/,
                (_match, base, percent) => `percentAdd(${base}, ${percent})`
              );
              display.value = display.value.replace(
                /(\d+)\s*\-\s*(\d+)%/,
                (_match, base, percent) => `percentSub(${base}, ${percent})`
              );
              display.value = display.value.replace(/(\d+)%/, (_match, percent) => `(${percent}/100)`);
              rb = true;
            }
            entry.value = "";
            rightBracket = rb;
          } else {
            entry.value += btn.innerText;
          }
      }
    });
  });
});

function evaluateExpression(expression: string): string {
  try {
    const parser = new Parser();
    parser.functions.percentAdd = (base: number, percent: number) => base + base * (percent / 100);
    parser.functions.percentSub = (base: number, percent: number) => base - base * (percent / 100);
    return parser.evaluate(expression).toString();
  } catch (error) {
    return "Error";
  }
}
