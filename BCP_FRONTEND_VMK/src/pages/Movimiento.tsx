import { For, createResource, Show, createSignal } from "solid-js"
import { getCuentas, guardarMovimiento } from "@/api";
import { useAppState } from "@/store";
import { TipoMovimiento } from "@/domain"
import { DetalleCuenta } from "@/components";
import { esMontoValido, parseMonto } from "@/utils";

const DEFAULT = "default"
export default function Movimiento() {
  const { addWarningMessage, addErrorMessage, addSuccessMessage } = useAppState();
  const [cuentasRes, {refetch}] = createResource(getCuentas);
  const [nroCuenta, setNroCuenta] = createSignal(DEFAULT);
  const [monto, setMonto] = createSignal("");

  const cuentaSel = () => {
    if (nroCuenta() === DEFAULT) return null;
    const cuentas = cuentasRes();
    if (!cuentas) return null;
    return cuentas.find((c) => c.nro_cuenta === nroCuenta()) ?? null;
  }

  const handleMovimiento = (mov: TipoMovimiento) => () => {
    if (nroCuenta() === DEFAULT) {
      addWarningMessage("Seleccione una cuenta");
      return;
    }
    if (!esMontoValido(monto())) {
      addWarningMessage("El monto debe tener 2 decimales y debe estar separado por un punto Ej. 5.05");
      return;
    }
    const cuenta = cuentaSel()!;
    const montoFinal = parseMonto(monto());
    if (montoFinal <= 0) {
      addWarningMessage("El monto debe ser positivo");
      return;
    }
    if (mov === TipoMovimiento.Debito && montoFinal > cuenta.saldo) {
      addWarningMessage("El monto a retirar excede al saldo de la cuenta");
      return;
    }
    guardarMovimiento({
      cuenta_id: cuenta.nro_cuenta,
      importe: montoFinal,
      tipo: mov,
    }).then(() => {
      addSuccessMessage("Transaccion realizada")
      setMonto("");
      setNroCuenta(DEFAULT);
      refetch();
    }).catch((err) => {
      addErrorMessage(err?.body?.detail ?? "Error realizando transaccion");
    })
  }

  return (
    <Show when={cuentasRes()} fallback={<p>Cargando...</p>}>
      {(cuentas) => (
        <div class="flex flex-col gap-3">
          <h1 class="font-bold text-2xl">Depósitos o Retiros</h1>
          <DetalleCuenta cuenta={cuentaSel()} />

          <label class="form-control w-full max-w-xs">
            <div class="label pb-0">
              <span class="label-text">Cuenta</span>
            </div>
            <select
              class="select select-sm select-bordered"
              value={nroCuenta()}
              onInput={(e) => setNroCuenta(e.currentTarget.value)}
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
              placeholder="Monto con 2 decimales"
              class="input input-sm input-bordered w-full max-w-xs"
              value={monto()}
              onInput={(e) => setMonto(e.currentTarget.value)}
            />
          </label>

          <div class="flex gap-3">
            <button
              class="btn btn-sm btn-success flex-1"
              onClick={handleMovimiento(TipoMovimiento.Abono)}
            >
              Depósito
            </button>
            <button
              class="btn btn-sm btn-neutral flex-1"
              onClick={handleMovimiento(TipoMovimiento.Debito)}
            >Retiro</button>
          </div>

        </div>
      )}
    </Show>
  );
}