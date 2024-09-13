import { Model } from "./Model";

export interface IUser {
  id: number;
  profile_picture: string | null;
  first_name: string;
  last_name: string;
  company_name: string;
  company_address: string;
  student_no: string;
  email: string;
  email_verified_at: Date | null;
  is_admin: boolean;
  status: string;
  created_at: Date;
  updated_at: Date | null;
}

export class User extends Model {
  private static readonly table: string = 'users';

  /**
   * Gets the user.
   * @param id - The id of a user.
   * @returns Returns the user if exists; otherwise, returns null.
   */
  public static async find(id: number): Promise<IUser | null> {
    try {
      const tableName = this.table;
      const query = `SELECT * FROM ${tableName} where id = $1;`;
      const result = await this.db.query(query, [id]);
      return result.rows[0] || null;
    } catch (err) {
      throw err;
    }
  }
}