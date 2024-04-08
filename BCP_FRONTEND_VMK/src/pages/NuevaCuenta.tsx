import { createResource, For, Show, createSignal, JSX } from "solid-js";
import { getMonedas, guardarCuenta } from "@/api";
import { TipoCuenta } from "@/domain";
import { useAppState } from "@/store";

const DEFAULT = "default"

export default function NuevaCuenta() {
	const { addWarningMessage, addErrorMessage, addSuccessMessage } = useAppState();
	const [monedasRes] = createResource(getMonedas);
	const [nroCuenta, setNroCuenta] = createSignal("");
	const [nombre, setNombre] = createSignal("");
	const [moneda, setMoneda] = createSignal(DEFAULT);
	const [tipoCuenta, setTipoCuenta] = createSignal<TipoCuenta | typeof DEFAULT>(DEFAULT);

	const handleSubmit: JSX.EventHandlerUnion<HTMLFormElement, Event>= (e) => {
		e.preventDefault();
		if (nroCuenta().length < 13 || nroCuenta().length > 14) {
			addWarningMessage("El nro. de cuenta debe tener entre 13 y 14 caracteres");
			return;
		}
		if (moneda() === DEFAULT) {
			addWarningMessage("Elija una moneda");
			return;
		}
		if (tipoCuenta() === DEFAULT) {
			addWarningMessage("Elija un tipo de cuenta");
			return;
		}
		if (nombre().length === 0) {
			addWarningMessage("Ingrese un nombre");
			return;
		}
		guardarCuenta({
			moneda_id: moneda(),
			nombre: nombre(),
			nro_cuenta: nroCuenta(),
			tipo: tipoCuenta(),
		}).then(() => {
			setNombre("");
			setNroCuenta("");
			setMoneda(DEFAULT);
			setTipoCuenta(DEFAULT);
			addSuccessMessage("Cuenta creada");
		}).catch((err) => {
      addErrorMessage(err?.body?.detail ?? "Error guardando cuenta");
		})
	}

	return (
		<Show when={monedasRes()} fallback={<p>Cargando...</p>}>
			{(monedas) => (
				<div>
					<h1 class="font-bold text-2xl">Nueva Cuenta</h1>
					<form class="flex flex-col w-72 gap-2" onSubmit={handleSubmit}>

						<label class="form-control w-full max-w-xs">
							<div class="label pb-0">
								<span class="label-text">Nro. cuenta</span>
							</div>
							<input
								type="text"
								placeholder="Entre 13 y 14 caracteres"
								class="input input-sm input-bordered w-full max-w-xs"
								value={nroCuenta()}
								onInput={(e) => setNroCuenta(e.currentTarget.value)}
							/>
						</label>

						<label class="form-control w-full max-w-xs">
							<div class="label pb-0">
								<span class="label-text">Moneda</span>
							</div>
							<select
								class="select select-sm select-bordered"
								value={moneda()}
								onInput={(e) => setMoneda(e.currentTarget.value)}
							>
								<option value={DEFAULT} disabled selected>Elije una opción</option>
								<For each={monedas()}>
									{(moneda) => (
										<option value={moneda.id}>{moneda.nombre}</option>
									)}
								</For>
							</select>
						</label>

						<label class="form-control w-full max-w-xs">
							<div class="label pb-0">
								<span class="label-text">Tipo cuenta</span>
							</div>
							<select
								class="select select-sm select-bordered"
								value={tipoCuenta()}
								onInput={(e) => {
									setTipoCuenta(e.currentTarget.value as TipoCuenta);
								}}
							>
								<option value={DEFAULT} disabled selected>Elije una opción</option>
								<option value={TipoCuenta.Corriente}>Corriente</option>
								<option value={TipoCuenta.Ahorro}>Ahorro</option>
							</select>
						</label>

						<label class="form-control w-full max-w-xs">
							<div class="label pb-0">
								<span class="label-text">Nombre</span>
							</div>
							<input
								type="text"
								placeholder="..."
								class="input input-sm input-bordered w-full max-w-xs"
								value={nombre()}
								onInput={(e) => setNombre(e.currentTarget.value)}
							/>
						</label>

						<button type="submit" class="btn btn-success btn-sm">Aceptar</button>

					</form>
				</div>
			)}
		</Show>
	);
}