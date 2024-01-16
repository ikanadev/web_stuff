import './style.css'
import viteLogo from '/vite.svg'

console.log(viteLogo);

// biome-ignore lint/style/noNonNullAssertion: <explanation>
document.querySelector<HTMLDivElement>('#app')!.innerHTML = " <div> </div> ";

window.addEventListener("DOMContentLoaded", () => {
  const hoursEl: SVGLineElement | null = document.querySelector("#hours");
  const minutesEl: SVGLineElement | null = document.querySelector("#minutes");
  const secondsEl: SVGLineElement | null = document.querySelector("#seconds");
  if (!hoursEl || !minutesEl || !secondsEl) return;
  updateClock(hoursEl, minutesEl, secondsEl);
  setInterval(function () {
    updateClock(hoursEl, minutesEl, secondsEl);
  }, 1000);
});

function updateClock(hours: SVGLineElement, minutes: SVGLineElement, seconds: SVGLineElement) {
  const now = new Date();
  hours.setAttribute("transform", `rotate(${360 / 12 * now.getHours()})`);
  minutes.setAttribute("transform", `rotate(${360 / 60 * now.getMinutes()})`);
  seconds.setAttribute("transform", `rotate(${360 / 60 * now.getSeconds()})`);
}
