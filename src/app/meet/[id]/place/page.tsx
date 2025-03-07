/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { DisabledText, Emphasize, Text } from '@/components/Modal/modalTypography';
import PlaceDrawer from '@/features/meet/place/PlaceDrawer';
import PlaceInput from '@/features/meet/place/PlaceInput';
import PlaceUserLocation from '@/features/meet/place/PlaceUserLocation';
import { createVoteLocation, getMyLocation, getStations, getTotalLocation } from '@/lib/api/locate';
import useToggle from '@/lib/hooks/useToggle';
import { Station, StationUser } from '@/types/locate';
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

  const { data: totalLocation, refetch: refetchTotalLocation } = useQuery<AxiosResponse>({
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
      refetchTotalLocation();
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
    setSearchKeyword(`${station.stationName} ${station.lineName}`);
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
          origin: new naver.maps.Point(-5, -10),
          anchor: new naver.maps.Point(16, 16),
        },
      });
      mapRef.current.setCenter(midPoint);

      // 출발 지점 리스트 순회
      totalLocation.data.users?.forEach((user: StationUser) => {
        if (!user.stationPath || user.stationPath.length < 2) return; // 최소 두 개 이상 좌표가 있어야 선이 그려짐

        const path = user.stationPath.map(
          (station: Station) =>
            new naver.maps.LatLng(parseFloat(station.lat), parseFloat(station.lot)),
        );

        // 유저의 이동 경로를 따라 선을 그림
        new naver.maps.Polyline({
          map: mapRef.current as naver.maps.Map,
          path,
          strokeColor: '#4CAF50', // 유저별 색상 다르게 하려면 변경
          strokeWeight: 4,
        });

        // 경로상 주요 지점(역)마다 마커 추가
        user.stationPath.forEach((station: Station, index: number) => {
          new naver.maps.Marker({
            position: new naver.maps.LatLng(parseFloat(station.lat), parseFloat(station.lot)),
            map: mapRef.current as naver.maps.Map,
            title: station.stationName,
            icon: {
              // url: `/svgs/place/marker-${userId + 1}-${index}.svg`, // 유저별, 역별 아이콘 다르게 설정 가능
              url: '',
              size: new naver.maps.Size(24, 28),
              origin: new naver.maps.Point(0, 0),
              anchor: new naver.maps.Point(12, 14),
            },
          });
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
