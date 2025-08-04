import { IEnterprise } from "./Ienterprise";
import { IPerson } from "./Iperson";
import { IRol } from "./Irol";


export interface Iuser {
    id: string;
    rol:IRol;
    persona: IPerson;
    nombre: string;
    contrasena: string;
    imagen:string | null;
    usuarioCreacion: string;
    fechaCreacion: string;
    usuarioModificacion: string | null;
    fechaModificacion: string | null;
    activo: boolean;
    token: string;
}

export interface IAuthResponse {
  id: string;
  token: string;
  usuario: Iuser;
  rol: string;
}

export interface IUpdatePassword {
  nuevaContrasena: string;
  usuarioModificacion: string;
}

export interface ITipoDocumento {
  id: number;
  nombre: string;
  descripcion: string;
  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioModificacion: string | null;
  fechaModificacion: string | null;
  activo: boolean;
}
