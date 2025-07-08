import { IDepartament } from "@interfaces/Idepartament";

export interface ICity {
    id: number;
    nombre: string;
    departamentoId: IDepartament;
    activo: boolean;
    usuarioCreacion: string;
    fechaCreacion: Date;
    usuarioModificacion: string;
    fechaModificacion: Date;
}