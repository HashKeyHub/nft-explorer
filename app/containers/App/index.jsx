/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { NetworkConnector } from '@web3-react/network-connector';

import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';

import GlobalStyle from '../../global-styles';

const AppWrapper = styled.div`
  max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

export default function App() {
  const { connector, activate } = useWeb3React();

  useEffect(() => {
    if (!connector)
      activate(
        new NetworkConnector({
          urls: {
            1: 'wss://ropsten.infura.io/ws/v3/fc22ad12aa9a44f2908a45552f338c95',
          },
          defaultChainId: 1,
        }),
      );
  }, [connector, activate]);

  return (
    <AppWrapper>
      <Helmet titleTemplate="%s - Present Show" defaultTitle="Present Show">
        <meta name="description" content="Present Show" />
      </Helmet>
      <Header />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="" component={NotFoundPage} />
      </Switch>
      <Footer />
      <GlobalStyle />
    </AppWrapper>
  );
}
