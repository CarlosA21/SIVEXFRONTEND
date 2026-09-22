// src/dtos/DtoNewUser.ts



export interface DtoNewUser {
  id?: number;
  firstName: string;
  lastName: string;
  registrationNumber: string;
  email: string;
  password: string;
  status: string;
  //roleId: Number; // Agrega el roleId a la interfaz
}