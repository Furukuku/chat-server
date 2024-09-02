import { Model } from "./Model";

class Message extends Model {
  constructor() {
    const table = 'messages';
    super(table);
  }

  async create(userId: number, conversationId: number, content: string) {
    try {
      const insertQuery = `INSERT INTO ${this.table} (user_id, conversation_id, content, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *;`;
      const insertValues = [userId, conversationId, content];
      const insertResult = await this.db.query(insertQuery, insertValues);
  
      if (insertResult.rowCount == 1) {
        const updateQuery = 'UPDATE conversations SET updated_at = $1 WHERE id = $2';
        await this.db.query(updateQuery, [insertResult.rows[0].created_at, conversationId]);
      }

      return insertResult.rows[0];
    } catch (err) {
      throw err;
    }
  }
}

export default new Message();