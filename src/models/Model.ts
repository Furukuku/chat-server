import { pool } from "../config";

export class Model {
  protected static db = pool;

  protected static timestamps() {
    const names: string[] = ['created_at', 'updated_at'];
    const values: string[] = ['NOW()', 'NOW()'];
    return {
      names: names,
      values: values
    };
  }

  protected static convertToPlaceholder(values: any[]) {
    let result = '';

    for (let index = 0; index < values.length; index++) {
      if (index === values.length - 1) {
        result += `$${index + 1}`;
      } else {
        result += `$${index + 1}, `;
      }
    }

    return result;
  }
}