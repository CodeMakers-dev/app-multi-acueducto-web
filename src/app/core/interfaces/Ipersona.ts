export interface IPersona {
    id: string;
    nombre: string;
}

export interface ICorreoPersona {
    id: string;
    persona: IPersona;
    correo: string;
}