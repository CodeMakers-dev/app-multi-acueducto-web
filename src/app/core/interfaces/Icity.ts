import { IDepartament } from "@interfaces/Idepartament";

export interface ICity {
    id: number;
    nombre: string;
    departamento: IDepartament;
    activo: boolean;
    usuarioCreacion: string;
    fechaCreacion: Date;
    usuarioModificacion: string;
    fechaModificacion: Date;
}