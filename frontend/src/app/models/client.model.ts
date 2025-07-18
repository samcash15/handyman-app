export interface Client {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface ClientForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}