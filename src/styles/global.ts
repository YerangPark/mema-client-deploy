'use client';

import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: 'Pretendard Variable';
        font-weight: 45 920;
        font-style: normal;
        font-display: swap;
        src: url('/fonts/PretendardVariable.woff2') format('woff2-variations');
    }

    body {
        margin: 0;
        padding: 0;
        font-family: 'Pretendard Variable', sans-serif;
    }
    p{
        margin:0;
    }
    /* 테스트 키바꿈. */
`;

export default GlobalStyle;
