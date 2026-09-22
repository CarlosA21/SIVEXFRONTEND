// src/models/Usuario.ts
import { Role } from "./Role";

// 2. Interfaz de Usuario corregida
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  registrationNumber?: string; // Este campo es obligatorio en el objeto de usuario completo
  email: string;
  password?: string; // Es una buena práctica que sea opcional, ya que la API puede no devolverla por seguridad
  // status: string;
  role: Role; // Asumiendo que el rol es un objeto completo
}

export interface UpdatedUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
}
// {
//   "firstName": "Santo Manuel",
//   "lastName": "Morillo Cabral",
//   "registrationNumber": "100037914",
//   "email": "santomanuelmorillo@gmail.com",
//   "password": "santo1234",
//   "status": "active",
//   "roleId": 1
// }