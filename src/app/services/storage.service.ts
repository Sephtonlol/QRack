import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Card } from '../interfaces/card';
import { ItemReorderEventDetail } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;
  private isInitialized = false;
  private readonly autoIncrementKey = '__nextId';

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    if (!this.isInitialized) {
      this._storage = await this.storage.create();
      this.isInitialized = true;

      const nextId = await this._storage.get(this.autoIncrementKey);
      if (nextId === null) {
        await this._storage.set(this.autoIncrementKey, 1);
      }
    }
  }

  private async ensureInitialized() {
    if (!this.isInitialized) {
      await this.init();
    }
  }

  public async getCard(key: number): Promise<Card | null> {
    await this.ensureInitialized();
    if (!this._storage) {
      throw new Error('Storage is not initialized');
    }
    return await this._storage.get(key.toString());
  }

  public async getCards(): Promise<Card[]> {
    await this.ensureInitialized();
    if (!this._storage) {
      throw new Error('Storage is not initialized');
    }
    const keys = await this._storage.keys();
    keys.sort((a, b) => Number(a) - Number(b));
    const cards: Card[] = [];

    if (keys) {
      for (const key of keys) {
        const value = await this._storage.get(key);
        if (value) {
          cards.push(value);
        }
      }
    }
    const formattedCards = cards.slice(0, -1);
    return formattedCards;
  }

  public async setCard(card: Card, cardId?: number): Promise<void> {
    await this.ensureInitialized();
    if (!this._storage) {
      throw new Error('Storage is not initialized');
    }
    if (!cardId) {
      const nextId = await this._storage.get(this.autoIncrementKey);
      cardId = nextId as number;
      card.key = cardId;
      await this._storage.set(this.autoIncrementKey, cardId + 1);
    }
    await this._storage.set(String(cardId), card);
  }
  public async delete(key?: number): Promise<void> {
    await this.ensureInitialized();
    if (!this._storage) {
      throw new Error('Storage is not initialized');
    }
    if (!key) {
      await this._storage.clear();
      await this._storage.set(this.autoIncrementKey, 1);
      return;
    }
    await this._storage.remove(key.toString());
  }
  public async reorder(cards: Card[]): Promise<Card[]> {
    await this.delete();
    let id = 1;
    cards.reverse();
    for (const card of cards) {
      id++;
      card.key = id;
      await this.setCard(card);
    }
    return cards.reverse();
  }
}
