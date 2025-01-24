import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Card } from '../interfaces/card';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;
  private isInitialized = false;
  private readonly autoIncrementKey = '__nextId'; // Key to track auto-increment ID

  constructor(private storage: Storage) {
    this.init();
  }

  private async init() {
    if (!this.isInitialized) {
      this._storage = await this.storage.create();
      this.isInitialized = true;

      const nextId = await this._storage.get(this.autoIncrementKey);
      if (nextId === null) {
        await this._storage.set(this.autoIncrementKey, 0);
      }
    }
  }

  private async ensureInitialized() {
    if (!this.isInitialized) {
      await this.init();
    }
  }

  public async getCard(key: string): Promise<Card | null> {
    await this.ensureInitialized();
    if (!this._storage) {
      throw new Error('Storage is not initialized');
    }
    return await this._storage.get(key);
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

  public async setCard(card: Card): Promise<void> {
    await this.ensureInitialized();
    if (!this._storage) {
      throw new Error('Storage is not initialized');
    }

    const nextId = await this._storage.get(this.autoIncrementKey);
    const cardId = nextId as number;
    card.key = String(cardId);

    await this._storage.set(String(cardId), card);

    await this._storage.set(this.autoIncrementKey, cardId + 1);
  }

  public async deleteCard(key: string): Promise<void> {
    await this.ensureInitialized();
    if (!this._storage) {
      throw new Error('Storage is not initialized');
    }

    await this._storage.remove(key);
  }
}
