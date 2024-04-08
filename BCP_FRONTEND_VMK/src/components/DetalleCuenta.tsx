import { Show } from "solid-js";
import { Cuenta } from "@/domain";
import { parseCantidad } from "@/utils";

type Props = {
  cuenta: Cuenta | null;
}
export default function DetalleCuenta(props: Props) {
  return (
      <Show when={props.cuenta} fallback={<div />}>
        {(c) => (
          <div class="py-2">
            <p class="text-sm">
              Nombre: <span class="font-medium">{c().nombre}</span>
            </p>
            <p class="text-sm">
              Tipo: <span class="font-medium">{c().tipo}</span>
            </p>
            <p class="text-sm">
              Moneda: <span class="font-medium">{c().moneda.id}</span>
            </p>
            <p class="text-sm">
              Saldo: <span class="font-medium text-success">
                {c().moneda.id}{' '}
                {parseCantidad(c().saldo)}
              </span>
            </p>
          </div>
        )}
      </Show>
  );
}