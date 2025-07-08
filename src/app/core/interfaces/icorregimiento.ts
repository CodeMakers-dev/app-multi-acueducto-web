import { ICity } from "@interfaces/Icity";

export interface ICorregimiento {
    id: number;
    nombre: string;
    cityId: ICity;
    activo: boolean;
    usuarioCreacion: string;
    fechaCreacion: Date;
    usuarioModificacion: string;
    fechaModificacion: Date;
}
