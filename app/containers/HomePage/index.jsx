/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useWeb3React } from '@web3-react/core';
import { range } from 'lodash';

import ERC721 from 'contracts/ERC721.json';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import {
  makeSelectRepos,
  makeSelectLoading,
  makeSelectError,
} from 'containers/App/selectors';
import ReposList from 'components/ReposList';
import PresentsList from 'components/PresentsList';

import AtPrefix from './AtPrefix';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';

const key = 'home';
const contractAddress = '0xdf507B2bc49c0Ef8eEB43c7f9DE6c093ED674561';

export function HomePage({
  address,
  loading,
  error,
  repos,
  // presents,
  onSubmitForm,
  onChangeAddress,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });
  const { library } = useWeb3React();
  const [blockNumber, setBlockNumber] = React.useState(0);
  const [balance, setBalance] = React.useState(0);
  const [tokenInfo, setTokenInfo] = React.useState({});
  const [tokens, setTokens] = React.useState([]);

  useEffect(() => {
    // When initial state username is not null, submit the form to load repos
    if (address && address.trim().length > 0) onSubmitForm();
    if (library) {
      library.eth
        .getBlockNumber()
        .then(b => {
          setBlockNumber(b);
        })
        .catch(() => {
          setBlockNumber(null);
        });
      const contract = new library.eth.Contract(ERC721.abi, contractAddress);

      const totalSupplyP = contract.methods.totalSupply().call();
      Promise.all([totalSupplyP]).then(([supply]) => {
        setTokenInfo({
          totalSupply: supply,
        });
      });
      contract.methods
        .balanceOf('0x9509772d88446636769009cade9b5b28daa3d249')
        .call()
        .then(b => {
          setBalance(b);

          Promise.all(
            range(b).map(i =>
              contract.methods
                .tokenOfOwnerByIndex(
                  '0x9509772d88446636769009cade9b5b28daa3d249',
                  i,
                )
                .call(),
            ),
          )
            .then(results =>
              results.map(() => ({
                uri:
                  'https://gateway.pinata.cloud/ipfs/QmSYaRuKU7hj7DFcrg8vT3Jq5bTT1RWFFrpXr7f2mrKFJq/MegaFlowtron-303.png',
                title: 'MegaFlowtron',
              })),
            )
            .then(results => setTokens(results));
        });
    }
  }, [library]);

  const reposListProps = {
    loading,
    error,
    repos,
  };

  const presentsListProps = {
    loading,
    presents: tokens,
  };

  return (
    <article>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="NFT Present Show" />
      </Helmet>
      <div>
        <Section>
          <Form onSubmit={onSubmitForm}>
            <label htmlFor="address">
              <FormattedMessage {...messages.trymeMessage} />
              <AtPrefix>
                <FormattedMessage {...messages.trymeAtPrefix} />
              </AtPrefix>
              <Input
                id="hash"
                type="text"
                placeholder="mxstbr"
                value={address}
                onChange={onChangeAddress}
              />
            </label>
          </Form>
          <ReposList {...reposListProps} />
          <PresentsList {...presentsListProps} />
        </Section>
      </div>
    </article>
  );
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  presents: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  onSubmitForm: PropTypes.func,
  address: PropTypes.string,
  onChangeAddress: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: evt => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(HomePage);
