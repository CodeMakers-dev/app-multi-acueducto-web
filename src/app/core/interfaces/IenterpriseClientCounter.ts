import { ICounter } from "@interfaces/Icounter";
import { IEnterprise } from "@interfaces/Ienterprise";
import { IPerson } from "@interfaces/Iperson";

export interface IEnterpriseClientCounter {
    id: number;
    empresa: IEnterprise;
    cliente: IPerson;
    contador: ICounter;
    activo: boolean;
    usuarioCreacion: string;
    fechaCreacion: Date;
    usuarioActualizacion: string;
    fechaModificacion: Date;
}
