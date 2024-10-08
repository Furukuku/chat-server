import { Model } from "./Model";

export interface IMessage {
  id: number;
  user_id: number;
  conversation_id: number;
  content: string;
  created_at: Date;
  updated_at: Date | null;
}

type TMessage = {
  user_id: number;
  conversation_id: number;
  content: string;
}

export class Message extends Model {
  private static readonly table: string = 'messages';

  /**
   * Creates a new message.
   * @param properties - Properties of a message.
   * @returns Returns the newly created message if successful; otherwise, returns null.
   */
  public static async create(properties: TMessage): Promise<IMessage | null> {
    const columns: string = [...Object.keys(properties), ...this.timestamps().names].join(', ');
    const values = [...Object.values(properties), ...this.timestamps().values];
    const placeholders: string = this.convertToPlaceholder(values);
    const query = `INSERT INTO ${this.table} (${columns}) VALUES (${placeholders}) RETURNING *;`;
    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Gets the message.
   * @param id - The id of a message.
   * @returns Returns the message if exists; otherwise, returns null.
   */
  public static async find(id: number): Promise<IMessage | null> {
    const query = `SELECT * FROM ${this.table} WHERE id = $1;`;
    const values = [id];
    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }
}