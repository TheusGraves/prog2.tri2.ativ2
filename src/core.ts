import { Database } from "bun:sqlite";

const db = new Database("database.sqlite");

db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
  )
`);

// Queries
const querySelectItems = db.prepare("SELECT * FROM items");

const queryInsertItem = db.prepare(`
  INSERT INTO items (title)
  VALUES (?)
`);

const queryDeleteItem = db.prepare(`
  DELETE FROM items
  WHERE id = ?
`);

const queryUpdateItem = db.prepare(`
  UPDATE items
  SET title = ?
  WHERE id = ?
`);

class Item {
  constructor(
    public title: string,
    public id?: number
  ) {}
}

class TodoList {
  addItem(item: Item) {
    const result = queryInsertItem.run(item.title);

    return {
      id: result.lastInsertRowid,
      title: item.title
    };
  }

  getItems() {
    return querySelectItems.all();
  }

  deleteItem(id: number) {
    const result = queryDeleteItem.run(id);

    return {
      success: result.changes > 0
    };
  }

  updateItem(id: number, newTitle: string) {
    const result = queryUpdateItem.run(newTitle, id);

    return {
      success: result.changes > 0
    };
  }
}