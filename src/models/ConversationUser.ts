import { Model } from "./Model";

export interface IConversationUser {
  conversation_id: number;
  user_id: number;
  client_id: number;
  client_name: string | null;
  created_at: Date;
  updated_at: Date | null;
}

type TConversationUser = {
  conversation_id: number;
  user_id: number;
  client_id: number;
  client_name: string | null;
}

export class ConversationUser extends Model {
  private static readonly table: string = 'conversation_user';

  /**
   * Creates a new conversation_user.
   * @param properties - Properties of a intermediate table (conversation_user).
   * @returns Returns the newly created conversation if successful; otherwise, returns null.
   */
  public static async create(properties: TConversationUser): Promise<IConversationUser | null> {
    const columns: string = [...Object.keys(properties), ...this.timestamps().names].join(', ');
    const values = [...Object.values(properties), ...this.timestamps().values];
    const placeholders: string = this.convertToPlaceholder(values);
    const query = `INSERT INTO ${this.table} (${columns}) VALUES (${placeholders}) RETURNING *;`;
    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }
}