import axios from 'axios';

import { API_URL } from "../config";

// Define la interfaz para el rol del usuario
export interface IUserRole {
    id: number;
    name: 'ADMINISTRATOR' | 'FACILITATOR' | 'VOLUNTEER';
    description: string | null;
}

// Define la interfaz para el usuario
export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    registrationNumber: string;
    email: string;
    password?: string;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
    role: IUserRole;
}

// Nueva interfaz para respuesta paginada
export interface IUserPaginatedResponse {
  data: IUser[];
  total: number;
  page: number;
  lastPage: number;
}


// Necesitamos una interfaz para los datos que enviaremos para actualizar
export interface IUserUpdate {
    firstName: string;
    lastName: string;
    registrationNumber: string;
    email: string;
    password?: string;
    status: 'active' | 'inactive';
    role: number; // El ID del rol, no el objeto completo
}


// Necesitamos una interfaz para los datos que enviaremos para actualizar
export interface INewUser {
    firstName: string;
    lastName: string;
    registrationNumber: string;
    email: string;
    password: string;
    status: 'active' | 'inactive';
    roleId: number; // El ID del rol, no el objeto completo
}

// {
//   "firstName": "Peralta",
//   "lastName": "Dias",
//   "registrationNumber": "10031",
//   "email": "peralta@gmail.com",
//   "password": "batista1234",
//   "status": "active",
//   "roleId": 4
// }




const API_URL_BASE = `${API_URL}/users`;

const API_URL_USER = `${API_URL}/users/create-management-user`;

const UserService = {
    /**
     * Obtiene la lista de todos los usuarios desde la API.
     * El token se obtiene directamente de localStorage.
     * @returns Una promesa que resuelve con un array de usuarios.
     */
    // getAllUsers: async (): Promise<IUser[]> => {
    //     try {
    //         const token = localStorage.getItem('token'); // Obtener el token de localStorage

    //         if (!token) {
    //             throw new Error('No se encontró el token de autenticación en localStorage.');
    //         }

    //         const response = await axios.get<IUser[]>(API_URL_BASE, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });
    //         return response.data;
    //     } catch (error) {
    //         console.error("Error al obtener los usuarios:", error);
    //         throw error;
    //     }
    // },


    getAllUsers: async (
    page: number = 1,
    limit: number = 6
  ): Promise<IUserPaginatedResponse> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación en localStorage.');
      }

      const response = await axios.get<IUserPaginatedResponse>(
        `${API_URL_BASE}?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      throw error;
    }
  },






   searchUsersByName: async (userName: string): Promise<IUser[]> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No se encontró el token de autenticación.');

        const response = await axios.get<IUser | IUser[]>(`${API_URL_BASE}/by-name/${userName}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = response.data;

        // ✅ Normalizamos siempre a un array
        return Array.isArray(data) ? data : [data];
    } catch (error) {
        console.error("Error al buscar el usuario:", error);
        throw error;
    }
},


    getUserById: async (userId: number): Promise<IUser> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No se encontró el token de autenticación.');

            const response = await axios.get<IUser>(`${API_URL_BASE}/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error(`Error al obtener el usuario con ID ${userId}:`, error);
            throw error;
        }
    },

    updateUser: async (userId: number, userData: IUserUpdate): Promise<IUser> => {
        console.log('Id del usuario a actualizar: ' + userId + ' Datos a actualizar: ' + userData);


        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No se encontró el token de autenticación.');

            const response = await axios.put<IUser>(`${API_URL_BASE}/${userId}`, userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar el usuario con ID ${userId}:`, error);
            throw error;
        }
    },

    deleteUser: async (userId: number): Promise<void> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No se encontró el token de autenticación.');

            await axios.delete(`${API_URL_BASE}/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error(`Error al eliminar el usuario con ID ${userId}:`, error);
            throw error;
        }
    },

    updateUserStatus: async (userId: number, newStatus: string): Promise<IUser> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No se encontró el token de autenticación.');

            const response = await axios.patch<IUser>(`${API_URL_BASE}/${userId}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar el estado del usuario con ID ${userId}:`, error);
            throw error;
        }
    },



    /**
   * Crea un nuevo usuario.
   * @param userData Los datos del nuevo usuario.
   */
    createUser: async (userData: INewUser): Promise<IUser> => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No se encontró el token de autenticación.');

            // enviamos userData que ya contiene roleId
            const response = await axios.post<IUser>(API_URL_USER, userData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("Error al crear el usuario:", error);
            throw error;
        }
    }


};

export default UserService;