import { ICity } from "./Icity";
import { ICorregimiento } from "./Icorregimiento";
import { IDepartament } from "./Idepartament";

export interface IAddress {
  id: number;
  departamentoId: IDepartament;
  ciudadId: ICity;
  corregimientoId: ICorregimiento;
  descripcion: string | null;
  activo: boolean;
  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioModificacion: string | null;
  fechaModificacion: string | null;
}