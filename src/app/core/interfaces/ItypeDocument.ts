export interface ITypeDocument {
    id: number;
    nombre: string;
    descripcion: string | null;
    activo: boolean;
    usuarioCreacion: string;
    fechaCreacion: string;
    usuarioModificacion: string | null;
    fechaModificacion: string | null;
}
