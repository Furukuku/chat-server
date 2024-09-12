import { IMessage, Message } from "../models/Message";

export class MessageController {
  /**
   * Handles the creation of new message.
   * @param userId - The id of the sender user.
   * @param conversationId - The id of the conversation.
   * @param content - The content of the message to be send.
   * @returns Returns the newly created message if successful; otherwise, returns null.
   */
  public static async create(userId: number, conversationId: number, content: string): Promise<IMessage | null> {
    try {
      const message = await Message.create({
        user_id: userId,
        conversation_id: conversationId,
        content: content
      });
      
      return message;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Handles the getting of a message.
   * @param id - Id of a message.
   * @returns Returns the message if exists; otherwise, returns null.
   */
  public static async show(id: number): Promise<IMessage | null> {
    try {
      const message = await Message.find(id);
      return message;
    } catch (err) {
      throw err;
    }
  }
}