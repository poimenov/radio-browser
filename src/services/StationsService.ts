import {
  Station,
  ApiStation,
  GetStationParameters,
  SearchStationParameters,
  Result,
} from "../types/services.types";
import { AppSettings } from "../types/AppSettings";
import { HttpHandler } from "./HttpHandler";
import { FavoritesDataAccess } from "./FavoritesDataAccess";

export class StationsService {
  private handler: HttpHandler;
  private favoritesDataAccess: FavoritesDataAccess;
  private settings: AppSettings;

  constructor(
    handler: HttpHandler,
    favoritesDataAccess: FavoritesDataAccess,
    settings: AppSettings,
  ) {
    this.handler = handler;
    this.favoritesDataAccess = favoritesDataAccess;
    this.settings = settings;
  }

  private getQuery(parameters: GetStationParameters): [string, string][] {
    return [
      ["offset", parameters.offset.toString()],
      ["limit", parameters.limit.toString()],
      [
        "hidebroken",
        (parameters.hidebroken && this.settings.hideBroken).toString(),
      ],
    ];
  }

  private getSearchQuery(
    searchParameters: SearchStationParameters,
    parameters: GetStationParameters,
  ): [string, string][] {
    const query: [string, string][] = [];

    if (searchParameters.name) {
      query.push(["name", searchParameters.name]);
    }
    if (searchParameters.nameExact !== undefined) {
      query.push(["nameExact", searchParameters.nameExact.toString()]);
    }
    if (searchParameters.countryCode) {
      query.push(["countrycode", searchParameters.countryCode]);
    }
    if (searchParameters.tag) {
      query.push(["tag", searchParameters.tag]);
    }
    if (searchParameters.tagExact !== undefined) {
      query.push(["tagExact", searchParameters.tagExact.toString()]);
    }
    if (this.settings.codec && this.settings.codec.trim() !== "") {
      query.push(["codec", this.settings.codec]);
    }
    if (this.settings.language && this.settings.language.trim() !== "") {
      query.push(["language", this.settings.language]);
    }

    query.push(["offset", parameters.offset.toString()]);
    query.push(["limit", parameters.limit.toString()]);
    query.push(["order", this.settings.defaultOrder]);
    query.push(["reverse", this.settings.reverseOrder.toString()]);
    query.push([
      "hidebroken",
      (parameters.hidebroken && this.settings.hideBroken).toString(),
    ]);

    return query;
  }

  private async getStationsFromJson(
    result: Result<string, string>,
  ): Promise<Result<Station[], string>> {
    if (!result.ok) {
      return { ok: false, error: result.error };
    }

    try {
      const response = JSON.parse(result.value) as ApiStation[];
      const ids = response.map((s) => s.stationuuid);
      const favoritesMap = await this.favoritesDataAccess.isFavorites(ids);

      const stations: Station[] = response.map((station) => ({
        id: station.stationuuid,
        name: station.name,
        url: station.url,
        urlResolved: station.url_resolved,
        homepage: station.homepage,
        favicon: station.favicon,
        tags: station.tags,
        country: station.country,
        countryCode: station.countrycode,
        language: station.language,
        codec: station.codec,
        bitrate: station.bitrate,
        isFavorite: favoritesMap.get(station.stationuuid) || false,
      }));

      return { ok: true, value: stations };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Parse error",
      };
    }
  }

  async getStationsByClicks(
    parameters: GetStationParameters,
  ): Promise<Result<Station[], string>> {
    const jsonString = await this.handler.getJsonStringAsync(
      `stations/topclick`,
      this.getQuery(parameters),
    );
    return await this.getStationsFromJson(jsonString);
  }

  async getStationsByVotes(
    parameters: GetStationParameters,
  ): Promise<Result<Station[], string>> {
    const jsonString = await this.handler.getJsonStringAsync(
      `stations/topvote/${parameters.limit}`,
      this.getQuery(parameters),
    );
    return this.getStationsFromJson(jsonString);
  }

  async searchStations(
    searchParameters: SearchStationParameters,
    parameters: GetStationParameters,
  ): Promise<Result<Station[], string>> {
    const jsonString = await this.handler.getJsonStringAsync(
      "stations/search",
      this.getSearchQuery(searchParameters, parameters),
    );
    return this.getStationsFromJson(jsonString);
  }

  async getFavoriteStations(
    name: string | undefined,
    parameters: GetStationParameters,
  ): Promise<Result<Station[], string>> {
    return this.favoritesDataAccess.getFavorites(name, parameters);
  }

  async getStations(uuids: string[]): Promise<Result<Station[], string>> {
    const query: [string, string][] = [["uuids", uuids.join(",")]];
    const jsonString = await this.handler.getJsonStringAsync(
      "stations/byuuid",
      query,
    );
    return this.getStationsFromJson(jsonString);
  }

  clickStation(uuid: string): void {
    this.handler.getJsonStringAsync(`url/${uuid}`, []).catch(console.error);
  }

  voteStation(uuid: string): void {
    this.handler.getJsonStringAsync(`vote/${uuid}`, []).catch(console.error);
  }

  getSettings(): AppSettings {
    return this.settings;
  }

  getFavoritesDataAccess(): FavoritesDataAccess {
    return this.favoritesDataAccess;
  }
}
