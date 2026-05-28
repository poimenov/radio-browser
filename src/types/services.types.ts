export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export interface Station {
  id: string;
  name: string;
  url: string;
  urlResolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countryCode: string;
  language: string;
  codec: string;
  bitrate: number;
  isFavorite: boolean;
}

export interface GetStationParameters {
  offset: number;
  limit: number;
  hidebroken: boolean;
}

export interface SearchStationParameters {
  name?: string;
  nameExact?: boolean;
  countryCode?: string;
  tag?: string;
  tagExact?: boolean;
}

export type SearchMode =
  | { type: "search"; params: SearchStationParameters }
  | { type: "favorites"; name?: string }
  | { type: "byVotes" }
  | { type: "byClicks" };

export interface HistoryRecord {
  startTime: Date;
  title: string;
  stationName: string;
}  

export type FilterMode =
  | { type: "country" }
  | { type: "tag" }

// API Response types
export interface ApiStation {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  language: string;
  codec: string;
  bitrate: number;
}

export interface Country {
  name: string;
  iso_3166_1: string;
  stationcount: number;
}

export interface Language {
  name: string;
  stationcount: number;
}

export interface NameAndCount {
  name: string;
  stationcount: number;
}
