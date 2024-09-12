import { Controller } from "./Controller";
import { IUser, User } from "../models/User";

class UserController extends Controller {
  constructor() {
    const table = 'users';
    super(table);
  }

  async show(userId: number): Promise<IUser | null> {
    const user = await User.find(userId);
    return user;
  }

  // async show(userId: number) {
  //   try {
  //     const query = `SELECT * FROM ${this.table} where id = $1;`;
  //     const result = await this.db.query(query, [userId]);
  //     return result.rows[0] || null;
  //   } catch (err) {
  //     throw err;
  //   }
  // }
}

export default new UserController();