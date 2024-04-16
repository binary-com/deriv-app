const REQ_TIMEOUT = 20000;

/**
 * responsible for sending request over given WS and thats it, 
 * no handling of reconnections, no state, nothing, just send
 * even request seq number is outside of its scope (reason being, that req_seq needs to be also used by the subscriptions)
 */
function send(ws: WebSocket, reqSeqNumber: number, name: string, payload: object) {
    let promise = new Promise((resolve, reject) => {
        let timeout: NodeJS.Timeout = setTimeout(() => {
            ws.removeEventListener('message', receive);
            reject(new Error('Request timeout'));
        }, REQ_TIMEOUT);

        function receive(messageEvent: MessageEvent) {
            const data = JSON.parse(messageEvent.data);
            if (data.req_id !== reqSeqNumber) {
                return;
            }

            ws.removeEventListener('message', receive);
            clearTimeout(timeout);
            resolve(data);
        }

        ws.addEventListener('message', receive);

        ws.send(JSON.stringify({ 
            [name]: 1, 
            ...payload,
            req_id: reqSeqNumber,
         }));
     });

     return promise;
}

export default send;