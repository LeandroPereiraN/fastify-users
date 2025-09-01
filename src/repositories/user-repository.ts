import { User } from "../types/User.ts";

const users: User[] = [
  { id_usuario: 1, nombre: 'Jorge', isAdmin: true },
  { id_usuario: 2, nombre: 'Alberto', isAdmin: false },
  { id_usuario: 3, nombre: 'Juan', isAdmin: false }
]
let usersCount = users.length;

class UserRepositoty {
  static getUsers = () => {
    return users;
  }

  static getUserById = (id_usuario: number) => {
    return users.find(user => user.id_usuario === id_usuario);
  }

  static getUsersByName = (nombre: string) => {
    return users.filter(user => user.nombre.toLowerCase().includes(nombre.toLowerCase()));
  }

  static createUser = (user: Omit<User, "id_usuario">) => {
    usersCount++;
    const newUser = {
      id_usuario: usersCount,
      ...user
    }

    users.push(newUser);
    return newUser;
  }

  static deleteUser = (id_usuario: number) => {
    const userIndex = users.findIndex(user => user.id_usuario === id_usuario);
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      return true;
    }
    return false;
  }
}

export default UserRepositoty;
