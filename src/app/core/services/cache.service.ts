import { Injectable, WritableSignal, signal } from "@angular/core";

@Injectable()
export class CacheService {
  // pre set duration of caching in milliseconds (2 hours)
  private readonly _cacheDuration: WritableSignal<number> =
    signal<number>(7200000);

  getCacheDuration(): number {
    return this._cacheDuration();
  }

  setCacheDuration(duration: number) {
    this._cacheDuration.set(duration);
  }

  // get item from localStorage
  getData(key: string) {
    const item = JSON.parse(localStorage.getItem(key));

    const isExpired = Date.now() - item?.cachedAt > this._cacheDuration();

    if ((item && !isExpired) || !item?.cachedAt) {
      return item;
    }

    return null;
  }

  // save item with caching
  setCachedData<T>(key: string, data: T) {
    const item = JSON.stringify({ ...data, cachedAt: Date.now() });
    localStorage.setItem(key, item);
  }

  // caching time is not important -> locations
  setData<T>(key: string, data: T) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
