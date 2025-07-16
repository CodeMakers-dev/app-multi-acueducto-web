import { IEnterpriseClientCounter } from "./IenterpriseClientCounter";
import { IFactura } from "./Ifactura";

export interface IDeudaCliente {
    id: number;
    empresaClienteContador: IEnterpriseClientCounter;
    tipoDeuda: ITipoDeuda;
    plazoPago: IPlazoPago;
    factura: IFactura;
    fechaDeuda: Date;
    valor: string;
    descripcion: string;
    activo: boolean;
    usuarioCreacion: string;
    fechaCreacion: Date;
    usuarioActualizacion: string;
    fechaModificacion: Date;
}
export interface IPlazoPago {
    id: number;
    nombre: string;
    descripcion: string;
    activo: boolean;
    usuarioCreacion: string;
    fechaCreacion: Date;
    usuarioModificacion: string | null;
    fechaModificacion: Date | null;
}
export interface ITipoDeuda {
    id: number;
    nombre: string;
    descripcion: string;
    activo: boolean;
    usuarioCreacion: string;
    fechaCreacion: Date;
    usuarioModificacion: string | null;
    fechaModificacion: Date | null;
}
export interface IAbonoFactura{
    id: number;
    deudaCliente: IDeudaCliente;
    valor: string;
    codigoFactura: string;
    activo: boolean;
    usuarioCreacion: string;
    fechaCreacion: Date;
    usuarioActualizacion: string;
    fechaModificacion: Date;    
}
