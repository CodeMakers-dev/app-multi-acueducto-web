export interface IPersona {
    id: string;
    nombre: string;
    segundoNombre: string;
    apellido: string;
    segundoApellido: string;
}

export interface ICorreoPersona {
    id: string;
    persona: IPersona;
    correo: string;
}