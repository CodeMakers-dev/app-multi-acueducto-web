
import { IPerson } from "./Iperson";

export interface ITelefonoPersona {
    id: number;
    persona: IPerson;
    numero: string | null;
    activo: boolean;
    usuarioCreacion: string;
    fechaCreacion: string;
    usuarioModificacion: string | null;
    fechaModificacion: string | null;
}