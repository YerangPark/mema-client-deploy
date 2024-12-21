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
