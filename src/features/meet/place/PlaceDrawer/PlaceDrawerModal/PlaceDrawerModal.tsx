import { Store } from '@/types/locate';
import dayjs from 'dayjs';
import React from 'react';
import { Clock, Map, Phone, Star } from 'react-feather';
import styled from 'styled-components';

type Props = {
  store?: Store;
  onClose: () => void;
};

const PlaceDrawerModal = ({ store, onClose }: Props) => {
  if (!store) return;

  return (
    <Container>
      <div className="background" onClick={onClose}></div>
      <div className="contentWrapper">
        <div className="content">
          <div className="modalImg">
            <img src={store.imageURL} alt="이미지" />
          </div>
          <div className="modalContent">
            <div className="top">
              <p className="titleContainer">
                <b>{store.name}</b>
                {store.category}
              </p>
              <div className="scoreContainer">
                <Star />
                <p>{store.visitorReviewCount}</p>
              </div>
            </div>
            <div className="middle">
              <div className="infoContent">
                <Map />
                <div>{store.shortAddress}</div>
              </div>
              <div className="infoContent">
                <Phone />
                <div>{store.tel}</div>
              </div>
              <div className="infoContent">
                <Clock />
                <div>
                  {dayjs(store.businessHour.split('~')[0]).format('HH:mm')}~
                  {dayjs(store.businessHour.split('~')[1]).format('HH:mm')}
                </div>
              </div>
            </div>
            <p className="intro">{store.menuInfo}</p>
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 390px;
  height: 100%;
  @media (max-width: 390px) {
    width: 100%;
  }
  .background {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    z-index: 5;
  }
  .contentWrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    z-index: 6;
    width: 326px;
    border-radius: 15px;
    .content {
      display: flex;
      flex-direction: column;
      .modalImg {
        width: 100%;
        height: 180px;
        background-color: #eee;
        border-radius: 15px 15px 0 0;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .modalContent {
        padding: 20px 16px;
        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          .titleContainer {
            ${({ theme }) => theme.fonts.text['md']};
            color: ${({ theme }) => theme.colors.gray[4]};
            b {
              ${({ theme }) => theme.fonts.title['sm']};
              color: black;
              margin-right: 4px;
            }
          }
          .scoreContainer {
            display: flex;
            align-items: center;
            ${({ theme }) => theme.fonts.text['md']};
            color: ${({ theme }) => theme.colors.primary.default};
            svg {
              color: #ff3434;
              fill: #ff3434;
              width: 16px;
            }
          }
        }
        .middle {
          margin-bottom: 24px;
          .infoContent {
            display: flex;
            align-items: center;
            gap: 4px;
            svg {
              color: ${({ theme }) => theme.colors.gray[5]};
              width: 18px;
            }
            div {
              color: ${({ theme }) => theme.colors.gray[3]};
              ${({ theme }) => theme.fonts.text['lg']};
            }
          }
        }
        .intro {
          color: ${({ theme }) => theme.colors.gray[1]};
          ${({ theme }) => theme.fonts.text['lg']};
        }
      }
    }
  }
`;

export default PlaceDrawerModal;
