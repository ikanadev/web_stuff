import { For, createResource, Show } from "solid-js"
import {A} from "@solidjs/router"
import { getCuentas } from "@/api";
import { parseCantidad } from "@/utils";

export default function Cuentas() {
  const [cuentasRes] = createResource(getCuentas);
  return (
    <Show when={cuentasRes()} fallback={<p>Cargando...</p>}>
      {(cuentas) => (
        <div>
          <h1 class="font-bold text-2xl">Todas las cuentas</h1>
          <div class="overflow-x-auto">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Moneda</th>
                  <th>Cuenta</th>
                  <th>Titular</th>
                  <th>Saldo</th>
                  <th>Movimientos</th>
                </tr>
              </thead>
              <tbody>
                <For each={cuentas()}>
                  {(cuenta) => (
                    <tr>
                      <td>{cuenta.tipo}</td>
                      <td>{cuenta.moneda.id}</td>
                      <td>{cuenta.nro_cuenta}</td>
                      <td>{cuenta.nombre}</td>
                      <td class="text-right">{parseCantidad(cuenta.saldo)}</td>
                      <td>
                        <A
                          href={`/cuentas/${cuenta.nro_cuenta}/movimientos`}
                          class="btn btn-sm btn-neutral font-medium"
                        >
                          Ver
                        </A>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Show>
  );
}