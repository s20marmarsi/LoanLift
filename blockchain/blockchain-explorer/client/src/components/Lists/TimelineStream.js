/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { Timeline, TimelineEvent } from 'react-event-timeline';
import FontAwesome from 'react-fontawesome';
import Typography from 'material-ui/Typography';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { Badge } from 'reactstrap';
import Timeago from 'react-timeago';

class TimelineStream extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            notifications: []
        }
    }
    componentWillReceiveProps() {

    }
    componentDidMount() {

    }
    render() {
        return (
            <div className="activity-stream">
                <Card >
                    <CardHeader >
                        <h5>Activity</h5>
                    </CardHeader>
                    <CardBody >
                        <div className='scrollable-card'>
                            <Timeline >
                                {this.props.notifications.map(item =>
                                    <TimelineEvent key={item.title} title={item.title}
                                        icon={<FontAwesome name="cube" style={{ color: "#06BEB6" }} />}
                                        iconColor="#0D3799"
                                        container="card"
                                        titleStyle={{ fontWeight: "bold" }}
                                        style={{ width: '400px ' }}
                                        cardHeaderStyle={{ backgroundColor: "#5F6164", fontSize: "13pt" }}
                                        >
                                        <Typography variant="body1">
                                            <b> Datahash:</b> {item.datahash} <br />
                                            <b> Number of Tx:</b> {item.txcount}
                                        </Typography>
                                        <h5>
                                            <Badge >
                                                <Timeago date={item.time} live={false} minPeriod={60} />
                                            </Badge>
                                        </h5>
                                    </TimelineEvent>
                                )}
                            </Timeline>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }
};
export default TimelineStream;