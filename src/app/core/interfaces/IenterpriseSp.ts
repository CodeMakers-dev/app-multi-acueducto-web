export interface IEnterpriseSp {
    usuario: string;
    password: string;
    nombreEmpresa: string;
    codigoEmpresa: string;
    nit: string;
    idDepartamento: number;
    idCiudad: number;
    idCorregimiento?: number | null;
    descripcionDireccion?: string | null;
}
