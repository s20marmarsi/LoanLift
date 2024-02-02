/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import TimeChart from './TimeChart';
import moment from 'moment-timezone';
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardHeader,
  CardBody
} from 'reactstrap';
import {
  blocksPerHour,
  blocksPerMin,
  txPerHour,
  txPerMin
} from '../../store/actions/charts/action-creators';
import {
  getBlockperHour,
  getBlockPerMin,
  getTxPerHour,
  getTxPerMin,
  getChannelSelector
} from '../../store/selectors/selectors';
import classnames from 'classnames';

export class ChartStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: '1',
      loading: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.channel.currentChannel !== this.props.channel.currentChannel) {
      this.props.getBlocksPerMin(nextProps.channel.currentChannel);
      this.props.getBlocksPerHour(nextProps.channel.currentChannel);
      this.props.getTxPerMin(nextProps.channel.currentChannel);
      this.props.getTxPerHour(nextProps.channel.currentChannel);
    }
  }

  componentDidMount() {
    setInterval(() => {
    this.props.getBlocksPerMin(this.props.channel.currentChannel);
    this.props.getBlocksPerHour(this.props.channel.currentChannel);
    this.props.getTxPerMin(this.props.channel.currentChannel);
    this.props.getTxPerHour(this.props.channel.currentChannel);
    }, 6000)
  }

   timeDataSetup = (chartData = []) => {
    let displayData
    let dataMax = 0;

      displayData = chartData.map( data => {
        if (parseInt(data.count, 10) > dataMax) {
          dataMax = parseInt(data.count, 10)
        }

        return {
          datetime: moment(data.datetime).tz(moment.tz.guess()).format("h:mm A"),
          count: data.count
        }
      })

    dataMax = dataMax + 5;

    return {
      displayData: displayData,
      dataMax: dataMax
    }
  }

  toggle = (tab) => {
    this.setState({
      activeTab: tab
    });
  }

  render() {
    return (
      <div className="chart-stats" >
        <Card>
          <CardHeader>
            <h5>Analytics</h5>
          </CardHeader>
          <CardBody>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '1' })}
                  onClick={() => { this.toggle('1'); }}>
                  BLOCKS / HOUR
                     </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '3' })}
                  onClick={() => { this.toggle('3'); }}>
                  TX / HOUR
                        </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <TimeChart chartData={this.timeDataSetup(this.props.blockPerHour.rows)} type="1" />
              </TabPane>
              <TabPane tabId="3">
                <TimeChart chartData={this.timeDataSetup(this.props.txPerHour.rows)} text="2" />
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default connect((state) => ({
  blockPerHour: getBlockperHour(state),
  blockPerMin: getBlockPerMin(state),
  txPerHour: getTxPerHour(state),
  txPerMin: getTxPerMin(state),
  channel: getChannelSelector(state)
}), {
    getBlocksPerHour: blocksPerHour,
    getBlocksPerMin: blocksPerMin,
    getTxPerHour: txPerHour,
    getTxPerMin: txPerMin
  })(ChartStats);
