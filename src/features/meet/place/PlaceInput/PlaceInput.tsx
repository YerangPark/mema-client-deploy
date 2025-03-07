/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Station } from '@/types/locate';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { ChevronLeft, Search } from 'react-feather';
import styled from 'styled-components';

type Props = {
  stations: any;
  searchKeyword: string;
  isFocus: boolean;
  setSearchKeyword: any;
  onFocus: () => void;
  onClick: (station: Station) => void;
};

const PlaceInput = ({
  stations,
  searchKeyword,
  isFocus,
  setSearchKeyword,
  onFocus,
  onClick,
}: Props) => {
  const router = useRouter();

  // 검색 필터링된 결과 생성
  const filteredStations = useMemo(() => {
    return stations?.data.stationList?.filter((station: Station) =>
      station.stationName?.includes(searchKeyword),
    );
  }, [stations?.data.stationList, searchKeyword]);

  if (!stations) return;

  return (
    <Container isFocus={isFocus}>
      {/* 상단부분 */}
      <div className="searchTabContainer">
        <ChevronLeft onClick={() => router.back()} />
        <div className="searchTab">
          <input
            placeholder="모임날 출발하는 지하철 역을 알려주세요!"
            onFocus={onFocus}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="searchInput"
          />
          <Search />
        </div>
      </div>
      {/* 데이터부분 */}
      {isFocus && (
        <div className="background">
          <div className="placeContainer">
            {filteredStations?.length > 0 ? (
              filteredStations.map((station: Station, index: number) => (
                <div key={index} className="place" onClick={() => onClick(station)}>
                  <p className="title">{`${station.stationName} ${station.lineName}`}</p>
                  <p className="location">{station.lineName}</p>
                </div>
              ))
            ) : (
              <div className="place">
                <p className="title">검색결과가 없습니다.</p>
                <p className="location"></p>
              </div>
            )}
          </div>
        </div>
      )}
    </Container>
  );
};

const Container = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isFocus',
})<{ isFocus: boolean }>`
  width: 390px;
  position: relative;
  @media (max-width: 390px) {
    width: 100%;
  }
  .searchTabContainer {
    position: absolute;
    width: 100%;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    box-sizing: border-box;
    z-index: 3;
    svg {
      cursor: pointer;
    }
    .searchTab {
      flex: 1;
      height: fit-content;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border-radius: ${({ theme }) => theme.borderRadius.medium};
      background-color: ${({ isFocus, theme }) =>
        isFocus ? theme.colors.gray[6] : theme.colors.white};
      box-shadow: ${({ isFocus }) => !isFocus && '0px 4px 10px 0px rgba(0, 0, 0, 0.15)'};

      .searchInput {
        flex: 1;
        border: none;
        outline: none;
        background-color: transparent;
        ${({ theme }) => theme.fonts.text.xl};
        color: ${({ theme }) => theme.colors.black};
        &::placeholder {
          color: ${({ theme }) => theme.colors.gray[4]};
        }
      }
    }
  }
  .background {
    position: absolute;
    width: 100%;
    background-color: white;
    height: 100vh;
    z-index: 2;
    .placeContainer {
      margin-top: 82px;
      border-top: 10px solid ${({ theme }) => theme.colors.gray[6]};
      z-index: 3;
      .place {
        padding: 12px 16px;
        border-bottom: 1px solid ${({ theme }) => theme.colors.gray[6]};
        cursor: pointer;
        .title {
          ${({ theme }) => theme.fonts.text.xl};
          margin-bottom: 4px;
        }
        .location {
          ${({ theme }) => theme.fonts.text.lg};
          color: ${({ theme }) => theme.colors.gray[3]};
        }
      }
    }
  }
`;

export default PlaceInput;
