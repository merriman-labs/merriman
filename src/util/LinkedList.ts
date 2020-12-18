/**
 * ugh
 */
export class LinkedList<T> {
  private _current: T | null = null;
  private _pointer: number | null = null;

  constructor(private _items: Array<T> = []) {
    if (this._items.length > 0) {
      this._pointer = 0;
      this._current = this._items[this._pointer];
    }
  }

  push(item: T | Array<T>) {
    item = Array.isArray(item) ? item : [item];
    if (item.length === 0) return;
    this._items.push(...item);
  }

  async next(): Promise<T | null> {
    if (this._pointer === null && this._items.length > 0) {
      this._pointer = 0;
      this._current = this._items[this._pointer];
      return this._current;
    }
    return this._current;
  }

  prev(): T | null {
    this._pointer =
      this._pointer === null || this._pointer === 0
        ? this._pointer
        : this._pointer - 1;
    this._current = this._pointer === null ? null : this._items[this._pointer];
    return this._current;
  }
}
