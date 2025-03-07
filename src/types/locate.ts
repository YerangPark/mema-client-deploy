export type Station = {
  stationName: string;
  lineName: string;
  lat: string;
  lot: string;
};

export type TotalLocation = {
  midStation: Station;
  startStationList: Station[];
};

export type Store = {
  name: string;
  tel: string;
  category: string;
  roadAddress: string;
  shortAddress: string;
  visitorReviewCount: number;
  blogReviewCount: number;
  businessStatus: string;
  businessHour: string;
  menuIntro: string;
  imageURL: string;
  latitude: string;
  longitude: string;
  lastOrderTime: string;
  menuInfo: string;
};

export type StationUser = {
  nickname: string;
  puzColor: string;
  puzId: number;
  role: string;
  stationName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stationPath: any;
  stationRoute: string;
  time: number;
  userId: number;
};
