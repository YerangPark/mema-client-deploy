'use client';
import Button from '@/components/Button';
import useToggle from '@/lib/hooks/useToggle';
import { Station, Store, TotalLocation } from '@/types/locate';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import styled from 'styled-components';
import PlaceDrawerModal from './PlaceDrawerModal';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { getRecommends } from '@/lib/api/locate';
import Image from 'next/image';

type Props = {
  myLocation: string;
  totalLocation: TotalLocation;
};

const PlaceDrawer = ({ myLocation, totalLocation }: Props) => {
  const router = useRouter();
  const params = useParams();
  const meetId = (params?.id && Number(params.id)) || null;
  const [selectStore, setSelectStore] = useState<Store>();
  const [isOpenAIDrawer, toggleOpenAIDrawer] = useToggle();
  const [isOpenAIModal, toggleOpenAIModal] = useToggle();

  const { data: recommends } = useQuery<AxiosResponse>({
    queryKey: ['recommends', meetId],
    queryFn: () => getRecommends(meetId as number),
    enabled: meetId !== null,
  });

  const onClickStore = (index: number) => {
    if (recommends?.data.storeList) {
      const selectedStore = recommends.data.storeList[index];
      setSelectStore(selectedStore);
    }
    toggleOpenAIModal();
  };

  return (
    <Container>
      <div className="grayBox">line</div>
      <>
        {/* 1명일때 */}
        {myLocation && !totalLocation && (
          <>
            <div className="drawer">
              <div className="drawerTitle">다른 미팅원들이 투표중이에요.</div>
              <p className="description">
                출발 위치를 <b>{myLocation}</b>으로 설정했어요.
              </p>
            </div>
            <StyledButton name="홈으로" onClick={() => router.push(`/meet/${meetId}`)} />
          </>
        )}
        {/* 2명이상일떄 */}
        {totalLocation && (
          <>
            {isOpenAIDrawer ? (
              <>
                <div className="drawer">
                  <div className="drawerTitle">
                    <b>{totalLocation.midStation.stationName}</b>근처의
                    <br />
                    먹거리, 놀거리 알려드릴게요!
                  </div>
                  <div className="storeContainer">
                    {recommends?.data.storeList.map((store: Store, index: number) => (
                      <div key={index} className="store" onClick={() => onClickStore(index)}>
                        <div className="storeImg">
                          <img src={store.imageURL} alt="이미지" />
                        </div>
                        <div className="storeContent">
                          <p className="storeTitle">{store.name}</p>
                          <p className="storeAddress">{store.roadAddress}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <StyledButton name="이동 시간 보기" onClick={toggleOpenAIDrawer} />
              </>
            ) : (
              <>
                <div className="drawer">
                  <div className="drawerTitle">
                    <b>{totalLocation.midStation.stationName}</b>까지
                    <br />
                    평균 이동 시간은 <b>15분</b>입니다!
                  </div>
                  <div className="descriptionContainer">
                    {totalLocation.startStationList?.map((station: Station, index: number) => (
                      <p key={index} className="description">
                        <div className="number">{index + 1}</div> <b>{station.stationName}</b>
                        에서부터 <b>18분</b>
                      </p>
                    ))}
                  </div>
                </div>
                <StyledButton name="추천지 보기" onClick={toggleOpenAIDrawer} />
              </>
            )}
          </>
        )}
        {isOpenAIModal && <PlaceDrawerModal store={selectStore} onClose={toggleOpenAIModal} />}
      </>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  bottom: 0;
  z-index: 100;
  background-color: white;
  width: 390px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}
    ${({ theme }) => theme.borderRadius.medium} 0 0;
  padding: 0 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.15);
  @media (max-width: 390px) {
    width: 100%;
  }
  .grayBox {
    background-color: ${({ theme }) => theme.colors.gray[4]};
    width: 40px;
    height: 4px;
    text-indent: -9999px;
    border-radius: 2px;
    margin: 8px 0 20px;
  }
  .drawer {
    width: 100%;
    .drawerTitle {
      margin-bottom: 20px;
      ${({ theme }) => theme.fonts.title['sm']};
      b {
        color: ${({ theme }) => theme.colors.primary.default};
      }
    }
    .drawerDescription {
      ${({ theme }) => theme.fonts.text['xl']};
      b {
        font-weight: normal;
        color: ${({ theme }) => theme.colors.primary.default};
      }
    }
    .descriptionContainer {
      display: flex;
      flex-direction: column;
      gap: 12px;
      .description {
        width: 100%;
        display: flex;
        align-items: center;
        .number {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: ${({ theme }) => theme.colors.green};
          color: white;
          margin-right: 8px;
        }
        b {
          font-weight: normal;
          color: ${({ theme }) => theme.colors.green};
        }
      }
    }
    .storeContainer {
      display: flex;
      flex-direction: column;
      gap: 12px;
      .store {
        background-color: ${({ theme }) => theme.colors.gray[6]};
        border-radius: 15px;
        padding: 16px 18px;
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        .storeImg {
          border-radius: 15px;
          background-color: ${({ theme }) => theme.colors.gray[4]};
          width: 74px;
          height: 74px;
          flex-shrink: 0;
          text-indent: -9999px;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .storeContent {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: calc(100% - 90px);
          .storeTitle {
            ${({ theme }) => theme.fonts.title['xs']};
          }
          .storeAddress {
            ${({ theme }) => theme.fonts.text['lg']};
            color: ${({ theme }) => theme.colors.gray[3]};
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
`;
const StyledButton = styled(Button)`
  margin: 28px 0 16px;
`;

export default PlaceDrawer;
