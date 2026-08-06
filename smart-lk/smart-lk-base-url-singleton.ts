import { getBaseUrl } from './utils/base-url-utils';

export class SmartLKBaseUrlSingleton {
  private static _instance: SmartLKBaseUrlSingleton;

  private url: string;

  private constructor() {
    this.url = getBaseUrl();
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public getUrl() {
    return this.url;
  }
}
