const WebSocket = require('ws');
require('dotenv').config()

const ws = new WebSocket(process.env.WS_PROVIDER);

let subId;

ws.on('open', () => {
  /**
   * Subscription
   */
  const payload = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_subscribe',
    params: ['newHeads'],
  });
  ws.send(payload);

  /**
   * Unsubscription after 10s
   */
  setTimeout(() => {
    const payload = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_unsubscribe',
      params: [subId],
    });
    ws.send(payload);
  }, 10000);
  
  /**
   * Listener
   */
  ws.on('message', (msg) => {
    const data = JSON.parse(msg);
    console.log(data);
    
    /**
     * result field is populated with subscription id on subscription
     * result field is true on unsubscription
     */
    if (data.result === true) {
      ws.close();
    } else if (data.result !== undefined) {
      subId = data.result;
    }
  });
});

