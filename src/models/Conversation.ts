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
  private static table: string = 'conversations';

  /**
   * Creates a new conversation.
   * @param properties - Properties of a conversation.
   * @returns Returns the newly created conversation if successful; otherwise, returns null.
   */
  public static async create(properties: TConversation): Promise<IConversation | null> {
    const columns: string = [...Object.keys(properties), ...this.timestamps().names].join(', ');
    const values = [...Object.values(properties), ...this.timestamps().values];
    const placeholders: string = this.convertToPlaceholder(values);
    const query = `INSERT INTO ${this.table} (${columns}) VALUES (${placeholders}) RETURNING *;`;
    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }
}