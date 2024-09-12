import { Controller } from "./Controller";

class ConversationUserController extends Controller {
  constructor() {
    const table = 'conversation_user';
    super(table);
  }

  async create(senderId: number, receiverId: number, conversationId: number) {
    const query = `INSERT INTO ${this.table} (created_at, updated_at) VALUES (NOW(), NOW()) RETURNING *;`;
  }
}