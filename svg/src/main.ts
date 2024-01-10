import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'

console.log(viteLogo);

// biome-ignore lint/style/noNonNullAssertion: <explanation>
document.querySelector<HTMLDivElement>('#app')!.innerHTML = " <div> </div> ";
