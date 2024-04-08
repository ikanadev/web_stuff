import { For, createResource, Show } from "solid-js"
import { A, RouteSectionProps } from "@solidjs/router"
import { getCuentas, getMovimientos } from "@/api";
import { TipoMovimiento } from "@/domain";
import { DetalleCuenta } from "@/components";
import { parseCantidad } from "@/utils";

export default function Movimientos(props: RouteSectionProps) {
  const [cuentasRes] = createResource(getCuentas);
  const [movimientosRes] = createResource(() => getMovimientos(props.params.id));

  const cuenta = () => {
    const cuentas = cuentasRes()
    if (!cuentas) return null;
    return cuentas.find(c => c.nro_cuenta === props.params.id) ?? null;
  }

  return (
    <div>
      <A href="/cuentas" class="text-xl font-medium">{'<----'}</A>
      <h1 class="font-bold text-2xl">Transferencias</h1>
      <DetalleCuenta cuenta={cuenta()} />
      <Show when={movimientosRes()} fallback={<p>Cargando...</p>}>
        {(movs) => (
          <div>
            <div class="overflow-x-auto">
              <table class="table table-sm table-zebra">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Importe</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={movs()}>
                    {(mov) => (
                      <tr>
                        <td>{(new Date(mov.fecha)).toLocaleDateString()}</td>
                        <td class="font-medium text-right" classList={{
                          "text-success": mov.tipo === TipoMovimiento.Abono,
                          "text-error": mov.tipo === TipoMovimiento.Debito,
                        }}>
                          {mov.tipo === TipoMovimiento.Debito ? '-' : ''}
                          {parseCantidad(mov.importe)}
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
    </div>
  );
}