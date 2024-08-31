import { Model } from "./Model";

class Message extends Model {
  constructor() {
    const table = 'messages';
    super(table);
  }

  async create(userId: number, conversationId: number, content: string) {
    const query = 'INSERT INTO ' + this.table + ' (user_id, conversation_id, content, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *';
    const values = [userId, conversationId, content];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }
}

export default new Message();