const WebSocket = require('ws');
require('dotenv').config()

const ws = new WebSocket(process.env.WS_PROVIDER);

let subId;

ws.on('open', () => {
  const sub = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_subscribe',
    params: ['newHeads'],
  });
  ws.send(sub);
});

setTimeout(() => {
  const unsub = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_unsubscribe',
    params: [subId],
  });
  ws.send(unsub);
}, 10000);

ws.on('message', (msg) => {
  const data = JSON.parse(msg);
  console.log(data);

  if (data.result === true) {
    ws.close();
  } else if (data.result !== undefined) {
    subId = data.result;
  }
});
