import { pool } from "../config";

export class Model {
  protected static readonly db = pool;
  protected static readonly updatedAt = {
    name: 'updated_at',
    value: 'NOW()'
  };

  protected static timestamps() {
    const names: string[] = ['created_at', 'updated_at'];
    const values: string[] = ['NOW()', 'NOW()'];
    return {
      names: names,
      values: values
    };
  }

  protected static convertToUpdatePlaceholder(columns: string[]): string {
    let result = '';

    for (let index = 0; index < columns.length; index++) {
      if (index === columns.length - 1) {
        result += `${columns[index]} = $${index + 1}`;
      } else {
        result += `${columns[index]} = ${index + 1}, `;
      }
    }

    return result;
  }

  protected static convertToPlaceholder(values: any[]): string {
    let result = '';

    for (let index = 1; index <= values.length; index++) {
      if (index === values.length) {
        result += `$${index}`;
      } else {
        result += `$${index}, `;
      }
    }

    return result;
  }
}