import { IAddress } from "@interfaces/Iaddress";
import { ITypeDocument } from "@interfaces/ItypeDocument";
import { ITelefonoPersona } from "./ItelefonoPersona";

export interface IPerson {
  id: number;
  direccion: IAddress;
  tipoDocumento: ITypeDocument;
  numeroCedula: string;
  nombre: string;
  segundoNombre: string | null;
  apellido: string;
  segundoApellido: string | null;
  codigo: string;
  descripcion: string | null;
  activo: boolean;
  usuarioCreacion: string;
  fechaCreacion: Date;
  usuarioModificacion: string | null;
  fechaModificacion: Date | null;
  telefono?: ITelefonoPersona[];
  correo?: ICorreoPerson[];
}

export interface ICorreoPerson {
  id: string;
  persona: IPerson;
  correo: string;
  activo: boolean;
  usuarioCreacion: string;
  fechaCreacion: Date;
  usuarioModificacion: string | null;
  fechaModificacion: Date | null;
}