import { AppMessages } from "@/components";
import { AppStateProvider } from "@/store";
import type { ParentProps } from "solid-js";
import { A } from "@solidjs/router";

function App(props: ParentProps) {
	return (
		<AppStateProvider>
			<div class="py-4 flex max-w-[800px] mx-auto min-h-window">
				<nav>
					<ul class="menu bg-base-200 w-56 rounded-box font-medium">
						<li><A href="/nueva_cuenta">Registrar cuenta</A></li>
						<li><A href="/movimiento">Depósitos/retiros</A></li>
						<li><A href="/transferencia">Transferencias</A></li>
						<li><A href="/cuentas">Saldos</A></li>
					</ul>
				</nav>
				<main class="flex-1 px-4">
					{props.children}
				</main>
			</div>
			<AppMessages />
		</AppStateProvider>
	)
}

export default App;
