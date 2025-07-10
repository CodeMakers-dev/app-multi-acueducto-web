import { IPerson } from "@interfaces/Iperson";
import { ITypeCounter } from "@interfaces/ItypeCounter";

export interface ICounter {
    id: number;
    cliente: IPerson;
    tipoContador: ITypeCounter;
    serial: string;
    activo: string;
    usuarioCreacion: string;
    fechaCreacion: Date;
    usuarioActualizacion: string;
    fechaModificacion: Date;
}
