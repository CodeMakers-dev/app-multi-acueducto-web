import { ToastType } from "./ToastType";

export interface IToast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  timeout?: number;
}
