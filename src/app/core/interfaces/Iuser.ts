import { IPersona } from "./Ipersona";
import { IRol } from "./Irol";


export interface Iuser {
    id: string;
    rol:IRol;
    persona: IPersona;
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