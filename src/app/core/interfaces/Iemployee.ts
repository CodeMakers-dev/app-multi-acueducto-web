export interface IEmpleadoEmpresaResponse {
    id: number;
    empresaId: number;
    empresaNombre: string;
    personaId: number;
    personaNombreCompleto: string;
    numeroCedula: string;
    codigo: string;
    activo: boolean;
    usuarioCreacion: string;
    fechaCreacion: Date;
    usuarioActualizacion: string;
    fechaModificacion: Date;
}

export interface IEmpleadoEmpresaRequest {
  id_tipo_documento: number;
  numero_cedula: string;
  codigo: string;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  id_departamento: number;
  id_ciudad: number;
  id_corregimiento: number;
  descripcion_direccion: string;
  correo: string;
  telefono: string;
  usuario_creacion: string;
  id_empresa: number;
}

export interface IEmpleadoResponse {
  id_persona: number;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  numero_cedula: string;
}