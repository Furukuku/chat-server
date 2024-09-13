import { ConversationUser } from "./ConversationUser";
import { Message } from "./Message";
import { Model } from "./Model";

export interface IConversation {
  id: number;
  name: string | null;
  pivot?: ConversationUser;
  conversation_user?: ConversationUser;
  latest_message: Message | null;
  messages?: Message[];
  created_at: Date | null;
  updated_at: Date | null;
}

type TConversation = {
  name?: string;
}

export class Conversation extends Model {
  private static readonly table: string = 'conversations';

  /**
   * Creates a new conversation.
   * @param properties - Properties of a conversation.
   * @returns Returns the newly created conversation if successful; otherwise, returns null.
   */
  public static async create(properties: TConversation): Promise<IConversation | null> {
    try {
      const columns: string = [...Object.keys(properties), ...this.timestamps().names].join(', ');
      const values = [...Object.values(properties), ...this.timestamps().values];
      const placeholders: string = this.convertToPlaceholder(values);
      const query = `INSERT INTO ${this.table} (${columns}) VALUES (${placeholders}) RETURNING *;`;
      const result = await this.db.query(query, values);
      return result.rows[0] || null;
    } catch (err) {
      throw err;
    }
  }

  /**
   * 
   * @param id - The id of the conversation to update.
   * @param properties - The properties of the conversation to update.
   * @returns Returns the updated conversation if successful; otherwise, returns null.
   */
  public static async update(id: number, properties?: TConversation): Promise<IConversation | null> {
    try {
      if (!properties || Object.keys(properties).length < 1) {
        const query: string = `UPDATE ${this.table} SET ${this.updatedAt.name} = $1 WHERE id = $2 RETURNING *;`;
        const result = await this.db.query(query, [this.updatedAt.value, id]);
        return result.rows[0] || null;
      }

      const columns: string[] = [...Object.keys(properties), this.updatedAt.name];
      const values = [...Object.values(properties), this.updatedAt.value, id];
      const placeholders: string = this.convertToUpdatePlaceholder(columns);
      const query = `UPDATE ${this.table} SET ${placeholders} WHERE id = $${columns.length + 1} RETURNING *;`;
      const result = await this.db.query(query, values);
      return result.rows[0] || null;
    } catch (err) {
      throw err;
    }
  }
}