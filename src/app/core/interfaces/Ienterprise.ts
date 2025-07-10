import { IAddress } from "@interfaces/Iaddress";
import { Iuser } from "@interfaces/Iuser";

export interface IEnterprise {
    id: number;
    usuario: Iuser;
    estado: string;
    direccion: IAddress;
    nombre: string;
    nit: string;
    codigo: string;
    activo: boolean;
    usuarioCreacion: string;
    fechaCreacion: Date;
    usuarioActualizacion: string;
    fechaModificacion: Date;
}
