'use client';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { DisabledText, Emphasize, Text } from '@/components/Modal/modalTypography';
import PlaceDrawer from '@/features/meet/place/PlaceDrawer';
import PlaceInput from '@/features/meet/place/PlaceInput';
import PlaceUserLocation from '@/features/meet/place/PlaceUserLocation';
import { createVoteLocation, getMyLocation, getStations, getTotalLocation } from '@/lib/api/locate';
import useToggle from '@/lib/hooks/useToggle';
import { Station } from '@/types/locate';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface LatLng {
  lat: number;
  lon: number;
}

const PlacePage = () => {
  const params = useParams();
  const meetId = (params?.id && Number(params.id)) || null;
  const [searchKeyword, setSearchKeyword] = useState('');
  const [station, setStation] = useState<Station>();
  const mapRef = useRef<naver.maps.Map | null>(null);
  const [isFocusSearch, toggleFocusSearch] = useToggle();
  const [isOpenModal, toggleOpenModal] = useToggle();
  const [isOpenConfirmModal, toggleOpenConfirmModal] = useToggle();

  // 만남 조회
  // const { data: meet } = useQuery<AxiosResponse<MeetResponse>>({
  //   queryKey: ['meet', meetId],
  //   queryFn: () => getMeet(meetId as number),
  //   enabled: meetId !== null,
  // });
  // console.log(meet);

  const { data: stations } = useQuery<AxiosResponse>({
    queryKey: ['meet', meetId],
    queryFn: () => getStations(),
  });

  const { data: myLocation, refetch: refetchMyLocation } = useQuery<AxiosResponse>({
    queryKey: ['myLocation', meetId],
    queryFn: () => getMyLocation(meetId as number),
    enabled: meetId !== null,
  });

  const { data: totalLocation } = useQuery<AxiosResponse>({
    queryKey: ['totalLocation', meetId],
    queryFn: () => getTotalLocation(meetId as number),
    enabled: meetId !== null,
  });

  const createVoteMutation = useMutation({
    mutationFn: createVoteLocation,
    onSuccess: () => {
      toggleOpenModal();
      toggleOpenConfirmModal();
      refetchMyLocation();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    const initMap = () => {
      const mapOptions = {
        center: new naver.maps.LatLng(37.3595704, 127.105399),
        zoom: 15,
      };

      const map = new naver.maps.Map('map', mapOptions);
      mapRef.current = map;

      // 사용자의 현재 위치 표시
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const currentLocation = new naver.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude,
          );
          //   현위치마커표시
          // new naver.maps.Marker({
          //   position: currentLocation,
          //   map: map,
          //   title: 'Your Location',
          //   icon: {
          //     url: '/svgs/place/marker.svg',
          //     size: new naver.maps.Size(36, 39),
          //     origin: new naver.maps.Point(0, 0),
          //     anchor: new naver.maps.Point(16, 16),
          //   },
          // });

          map.setCenter(currentLocation); // 지도 첫 접속 시 사용자의 현 위치로 중심
        });
      }
    };

    if (window.naver && window.naver.maps) {
      initMap();
    } else {
      const mapScript = document.createElement('script');
      mapScript.onload = () => initMap();
      mapScript.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_MAP_KEY}`;
      document.head.appendChild(mapScript);
    }
  }, []);

  const onClickUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const currentLocation = new naver.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude,
        );
        if (mapRef.current) {
          mapRef.current.setCenter(currentLocation);
        }
      });
    }
  };

  const onFocusSearch = () => {
    toggleFocusSearch();
  };

  const onClickSearch = (station: Station) => {
    setSearchKeyword(`${station.stationName} ${station.routeName}`);
    setStation(station);

    if (mapRef.current) {
      const position = new naver.maps.LatLng(Number(station.lat), Number(station.lot));
      mapRef.current.setCenter(position);

      new naver.maps.Marker({
        position,
        map: mapRef.current,
        title: station.stationName,
        icon: {
          url: '/svgs/place/marker.svg',
          size: new naver.maps.Size(36, 39),
          origin: new naver.maps.Point(0, 0),
          anchor: new naver.maps.Point(16, 16),
        },
      });
    }

    toggleFocusSearch();
  };

  const onClickModal = () => {
    if (searchKeyword === '') {
      return alert('위치를 검색해주세요');
    }
    toggleOpenModal();
  };

  const onClickConfirmModal = () => {
    createVoteMutation.mutate({ meetId: meetId as number, station: station as Station });
  };

  //전체목록나오면
  useEffect(() => {
    if (totalLocation && mapRef.current) {
      console.log(totalLocation.data);
      const midPoint = new naver.maps.LatLng(
        Number(totalLocation.data.midStation.lat),
        Number(totalLocation.data.midStation.lot),
      );
      new naver.maps.Marker({
        position: midPoint,
        map: mapRef.current,
        title: totalLocation.data.midStation.stationName,
        icon: {
          url: '/svgs/place/marker-mid.svg',
          size: new naver.maps.Size(36, 39),
          origin: new naver.maps.Point(0, 0),
          anchor: new naver.maps.Point(16, 16),
        },
      });
      mapRef.current.setCenter(midPoint);

      // 출발 지점 리스트 순회
      totalLocation.data.startStationList.forEach((startStation: Station, index: number) => {
        const startPoint = new naver.maps.LatLng(
          parseFloat(startStation.lat),
          parseFloat(startStation.lot),
        );

        // 출발 지점을 지도에 마커로 표시
        new naver.maps.Marker({
          position: startPoint,
          map: mapRef.current as naver.maps.Map,
          title: startStation.stationName,
          icon: {
            url: `/svgs/place/marker-${index + 1}.svg`,
            size: new naver.maps.Size(36, 39),
            origin: new naver.maps.Point(0, 0),
            anchor: new naver.maps.Point(16, 16),
          },
        });

        // 출발 지점에서 중간 지점까지의 경로 그리기
        new naver.maps.Polyline({
          map: mapRef.current as naver.maps.Map,
          path: [startPoint, midPoint],
          strokeColor: '#4CAF50',
          strokeWeight: 4,
        });
      });
    }
  }, [totalLocation]);

  return (
    <>
      <Container>
        {!myLocation && (
          <PlaceInput
            stations={stations}
            searchKeyword={searchKeyword}
            isFocus={isFocusSearch}
            setSearchKeyword={setSearchKeyword}
            onFocus={onFocusSearch}
            onClick={onClickSearch}
          />
        )}
        <div id="map" style={{ width: '100%', height: '100vh' }}>
          <PlaceUserLocation onClick={onClickUserLocation} />
        </div>
        {!myLocation && <StyledButton name="위치 확정하기" onClick={onClickModal} />}
      </Container>
      {myLocation && (
        <PlaceDrawer
          myLocation={myLocation.data.startStation}
          totalLocation={totalLocation?.data}
        />
      )}

      {isOpenModal && (
        <Modal type="OkCancel" onOk={onClickConfirmModal} onClose={toggleOpenModal} width={294}>
          <Text>
            <Emphasize>{searchKeyword}</Emphasize>에서 출발하시나요?
          </Text>
          <DisabledText>위치를 확정하면 수정할 수 없어요!</DisabledText>
        </Modal>
      )}
      {isOpenConfirmModal && (
        <Modal type="Ok" onOk={toggleOpenConfirmModal} width={294}>
          <Text>출발 위치를 정했어요!</Text>
        </Modal>
      )}
    </>
  );
};

const Container = styled.div`
  height: 100vh;
`;
const StyledButton = styled(Button)`
  position: fixed;
  width: 358px;
  left: 50%;
  transform: translateX(-50%);
  bottom: 34px;
  @media (max-width: 390px) {
    width: calc(100% - 32px);
  }
`;

export default PlacePage;
