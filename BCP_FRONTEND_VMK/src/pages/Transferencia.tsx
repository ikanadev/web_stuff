import { For, createResource, Show, createSignal } from "solid-js"
import { getCuentas, guardarTransferencia } from "@/api";
import { useAppState } from "@/store";
import { DetalleCuenta } from "@/components";
import { esMontoValido, parseMonto } from "@/utils";

const DEFAULT = "default"
export default function Transferencia() {
  const { addWarningMessage, addErrorMessage, addSuccessMessage } = useAppState();
  const [cuentasRes, { refetch }] = createResource(getCuentas);
  const [nroCuentaOrigen, setNroCuentaOrigen] = createSignal(DEFAULT);
  const [nroCuentaDestino, setNroCuentaDestino] = createSignal(DEFAULT);
  const [monto, setMonto] = createSignal("");

  const cuentaOrigenSel = () => {
    if (nroCuentaOrigen() === DEFAULT) return null;
    const cuentas = cuentasRes();
    if (!cuentas) return null;
    return cuentas.find((c) => c.nro_cuenta === nroCuentaOrigen()) ?? null;
  }

  const cuentaDestinoSel = () => {
    if (nroCuentaDestino() === DEFAULT) return null;
    const cuentas = cuentasRes();
    if (!cuentas) return null;
    return cuentas.find((c) => c.nro_cuenta === nroCuentaDestino()) ?? null;
  }

  const handleTransfer = () => {
    if (nroCuentaOrigen() === DEFAULT || nroCuentaDestino() === DEFAULT) {
      addWarningMessage("Seleccione ambas cuentas");
      return;
    }
    if (!esMontoValido(monto())) {
      addWarningMessage("El monto debe tener 2 decimales y debe estar separado por un punto Ej. 5.05");
      return;
    }
    const montoFinal = parseMonto(monto());
    if (montoFinal <= 0) {
      addWarningMessage("El monto debe ser positivo");
      return;
    }
    guardarTransferencia({
      origen_id: nroCuentaOrigen(),
      destino_id: nroCuentaDestino(),
      importe: montoFinal,
    }).then(() => {
      addSuccessMessage("Transaccion realizada");
      refetch();
      setMonto("0");
    }).catch((err) => {
      addErrorMessage(err?.body?.detail ?? "Error realizando la transaccion");
    })
  }

  const handleCancel = () => {
    setNroCuentaDestino(DEFAULT);
    setNroCuentaOrigen(DEFAULT);
    setMonto("");
  }

  return (
    <Show when={cuentasRes()} fallback={<p>Cargando...</p>}>
      {(cuentas) => (
        <div>
          <h1 class="font-bold text-2xl">Transferencias</h1>
          <DetalleCuenta cuenta={cuentaOrigenSel()} />
          <label class="form-control w-full max-w-xs">
            <div class="label pb-0">
              <span class="label-text">Cuenta origen</span>
            </div>
            <select
              class="select select-sm select-bordered"
              value={nroCuentaOrigen()}
              onInput={(e) => {
                setNroCuentaOrigen(e.currentTarget.value);
                setNroCuentaDestino(DEFAULT);
              }}
            >
              <option value={DEFAULT} disabled selected>Elije una cuenta</option>
              <For each={cuentas()}>
                {(cuenta) => (
                  <option value={cuenta.nro_cuenta}>{cuenta.nro_cuenta}</option>
                )}
              </For>
            </select>
          </label>
          <label class="form-control w-full max-w-xs">
            <div class="label pb-0">
              <span class="label-text">Monto</span>
            </div>
            <input
              type="text"
              placeholder="Ej. 5.05"
              class="input input-sm input-bordered w-full max-w-xs"
              value={monto()}
              onInput={(e) => setMonto(e.currentTarget.value)}
            />
          </label>

          
          <label class="form-control w-full max-w-xs mt-2">
            <div class="label pb-0">
              <span class="label-text">Cuenta destino</span>
            </div>
            <select
              class="select select-sm select-bordered"
              value={nroCuentaDestino()}
              onInput={(e) => {
                setNroCuentaDestino(e.currentTarget.value);
              }}
            >
              <option value={DEFAULT} disabled selected>Elije una cuenta</option>
              <For each={cuentas().filter((c) => c.nro_cuenta !== cuentaOrigenSel()?.nro_cuenta)}>
                {(cuenta) => (
                  <option value={cuenta.nro_cuenta}>{cuenta.nro_cuenta}</option>
                )}
              </For>
            </select>
          </label>
          <DetalleCuenta cuenta={cuentaDestinoSel()} />

          <div class="flex gap-3 mt-4">
            <button class="btn btn-sm btn-success flex-1" onClick={handleTransfer}>
              Aceptar
            </button>
            <button class="btn btn-sm btn-neutral flex-1" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </Show>
  );
}