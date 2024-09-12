import { Conversation, IConversation } from "../models/Conversation";
import { ConversationUser } from "../models/ConversationUser";
import { User } from "../models/User";

export class ConversationController {
  /**
   * Handles the creation of a new conversation.
   * @returns Returns the newly created conversation if successful; otherwise, returns null.
   */
  public static async create(userId: number, clientId: number): Promise<IConversation | null> {
    try {
      const conversation = await Conversation.create({});
      const user = await User.find(userId);
      const client = await User.find(clientId);

      if (conversation && user && client) {
        await ConversationUser.create({
          conversation_id: conversation.id,
          user_id: user.id,
          client_id: client.id,
          client_name: `${client.first_name} ${client.last_name}`
        });

        const clientUser = await ConversationUser.create({
          conversation_id: conversation.id,
          user_id: client.id,
          client_id: user.id,
          client_name: `${user.first_name} ${user.last_name}`
        });

        if (clientUser) {
          conversation.pivot = clientUser;
        }
      }

      return conversation; // CONTINUE HERE!!! TASK: Fixed the queries.
    } catch (err) {
      throw err;
    }
  }
}