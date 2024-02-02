/*
*SPDX-License-Identifier: Apache-2.0
*/

var EventEmitter = require('events').EventEmitter;

var blockMetrics = require('../metrics/metrics').blockMetrics
var txMetrics = require('../metrics/metrics').txMetrics

class  BlockListener extends EventEmitter{

        constructor(blockScanner)
        {
            super();
            this.blockScanner = blockScanner;

            this.on('createBlock', function (block) {
                blockMetrics.push(1)
                txMetrics.push(block.data.data.length)

            });

            this.on('syncChaincodes', function () {
                    blockScanner.syncChaincodes()
            });

            this.on('syncPeerlist', function () {
                    blockScanner.syncPeerlist()
            });

            this.on('syncChannels', function () {
                    blockScanner.syncChannels()
            });

            this.on('syncBlock', async function () {
                    blockScanner.syncBlock();
                    //blockScanner.syncChannelEventHubBlock();
            });
        }
}

module.exports = BlockListener;