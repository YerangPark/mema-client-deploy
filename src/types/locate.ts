export type Station = {
  stationName: string;
  routeName: string;
  lat: string;
  lot: string;
};

export type TotalLocation = {
  midStation: Station;
  startStationList: Station[];
};

export type Store = {
  address: string;
  category: string;
  description: string;
  name: string;
  phone: string;
  score: string;
  time: string;
};
