/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Peers from '../Lists/Peers';
import Blocks from '../Lists/Blocks';
import Transactions from '../Lists/Transactions';
import DashboardView from '../View/DashboardView';
import Chaincodes from '../Lists/Chaincodes';
import { blockList } from '../../store/actions/block/action-creators';
import { chaincodes } from '../../store/actions/chaincodes/action-creators';
import { headerCount } from '../../store/actions/header/action-creators';
import { latestBlock } from '../../store/actions/latestBlock/action-creators';
import { transactionInfo } from '../../store/actions/transaction/action-creators';
import { transactionList } from '../../store/actions/transactions/action-creators';
import {
	getBlock,
	getBlockList,
	getChaincodes,
	getChannelList,
	getChannelSelector,
	getCountHeader,
	getNotification,
	getPeerList,
	getTransaction,
	getTransactionList
} from '../../store/selectors/selectors'
import {
	Navbar,
	Nav,
	NavItem
} from 'reactstrap';

const styles = theme => ({
	card: { minWidth: 250, height: 100, },
	media: { height: 30, },
	title: {
		marginBottom: 16, fontSize: 16, color: theme.palette.text.secondary,
		position: 'absolute', right: 10, top: 10
	},
	pos: {
		marginBottom: 5,
		color: theme.palette.text.secondary,
		position: 'absolute',
		right: 10,
		top: 60,
		fontSize: 18,
	},
});

export class MenuBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeView: 'DashboardView',
      activeTab: { dashboardTab: true, networkTab: false, blocksTab: false, chaincodesTab: false },
      countHeader: { countHeader: this.props.getHeaderCount() }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.countHeader) !== JSON.stringify(this.props.countHeader)) {
      this.setState({ countHeader: nextProps.countHeader });
    }
    if (nextProps.channel.currentChannel !== this.props.channel.currentChannel) {
      this.props.getCountHeader(nextProps.channel.currentChannel);
      this.props.getLatestBlock(nextProps.channel.currentChannel, 0);
      this.props.getBlockList(nextProps.channel.currentChannel, 0);
      this.props.getChaincodes(nextProps.channel.currentChannel);
      this.props.getTransactionList(nextProps.channel.currentChannel, 0);

    }
  }

  componentDidMount() {
    setInterval(() => {
      this.props.getHeaderCount(this.props.channel.currentChannel);
      this.props.getLatestBlock(this.props.channel.currentChannel, 0);
    }, 3000)
  }

  handleClickTransactionView = () => {
    this.setState({ activeView: 'TransactionView' });
    this.setState({
      activeTab: {
        dashboardTab: false,
        networkTab: false,
        blocksTab: false,
        txTab: true,
        chaincodesTab: false
      }
    });
  }

  handleClickBlockView = () => {
    this.setState({ activeView: 'BlockView' });
    this.setState({
      activeTab: {
        dashboardTab: false,
        networkTab: false,
        blocksTab: true,
        txTab: false,
        chaincodesTab: false
      }
    });
  }

  handleClickNetworkView = () => {
    this.setState({ activeView: 'PeerView' });
    this.setState({
      activeTab: {
        dashboardTab: false,
        networkTab: true,
        blocksTab: false,
        txTab: false,
        chaincodesTab: false
      }
    });
  }

  handleClickDashboardView = () => {
    this.setState({ activeView: 'DashboardView' });
    this.setState({
      activeTab: {
        dashboardTab: true,
        networkTab: false,
        blocksTab: false,
        txTab: false,
        chaincodesTab: false
      }
    });
  }

  handleClickChaincodeView = () => {
    this.setState({ activeView: 'ChaincodeView' });
    this.setState({
      activeTab: {
        dashboardTab: false,
        networkTab: false,
        blocksTab: false,
        txTab: false,
        chaincodesTab: true
      }
    });
  }

  render() {
    let currentView = null;
    switch (this.state.activeView) {
      case 'TransactionView':
        currentView = <Transactions 
                        channel={this.props.channel} 
                        countHeader={this.props.countHeader} 
                        transactionList={this.props.transactionList.rows} 
                        getTransactionList={this.props.getTransactionList} 
                        transaction={this.props.transaction} 
                        getTransactionInfo={this.props.getTransactionInfo} 
                      />;
        break;
      case 'BlockView':
        currentView = <Blocks blockList={this.props.blockList} channel={this.props.channel} countHeader={this.props.countHeader} getBlockList={this.props.getBlockList} transaction={this.props.transaction} getTransactionInfo={this.props.getTransactionInfo} />;
        break;
      case 'PeerView':
        currentView = <Peers peerList={this.props.peerList} />;
        break;
      case 'DashboardView':
        currentView = <DashboardView 
                        channel={this.props.channel} 
                        transaction={this.props.transaction}
                        txId = {this.props.txId} 
                        getTransactionInfo={this.props.getTransactionInfo} 
                        blockList={this.props.blockList} 
                      />;
        break;
      case 'ChaincodeView':
        currentView = <Chaincodes channel={this.props.channel} countHeader={this.props.countHeader} chaincodes={this.props.chaincodes} getChaincodes={this.props.getChaincodes} />
        break;
      default:
        currentView = <DashboardView 
                        channel={this.props.channel} 
                        transaction={this.props.transaction}
                        txId = {this.props.txId} 
                        getTransactionInfo={this.props.getTransactionInfo} 
                        blockList={this.props.blockList} 
                      />;
        break;
    }

    return (
      <div>
        <div>
          {currentView}
        </div>
      </div>
    );
  }
}

export default connect((state) => ({
    block: getBlock(state),
    blockList: getBlockList(state),
    chaincodes: getChaincodes(state),
    channel: getChannelSelector(state),
    channelList: getChannelList(state),
    countHeader: getCountHeader(state),
    notification: getNotification(state),
    peerList: getPeerList(state),
    transaction: getTransaction(state),
    transactionList: getTransactionList(state)
}), {
      getBlockList: blockList,
      getChaincodes: chaincodes,
      getHeaderCount: headerCount,
      getLatestBlock: latestBlock,
      getTransactionInfo: transactionInfo,
      getTransactionList: transactionList
})(MenuBar);
