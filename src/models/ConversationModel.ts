import { Model } from "./Model";

class Conversation extends Model {
  constructor() {
    const table = 'conversations';
    super(table);
  }

  create() {

  }

  all() {
    return this.select().get();
  }
}

export default new Conversation();