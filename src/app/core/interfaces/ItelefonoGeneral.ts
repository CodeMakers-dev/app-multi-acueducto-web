
import { IPerson } from "./Iperson";

export interface ITelefonoGeneral {
    id: number;
    persona: IPerson;
    numero: string | null;
    activo: boolean;
    usuarioCreacion: string;
    fechaCreacion: string;
    usuarioModificacion: string | null;
    fechaModificacion: string | null;
}