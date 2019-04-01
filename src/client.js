const readline = require('readline');
const dgram = require('dgram');
const net = require('net');
const userInputs = require('./common/userInputs');
const commands = require('./common/commands');
const config = require('./common/config');


let udpPeerTo = {host: null, port: null};
let udpPeerFrom = {host: null, port: null};

const udp = dgram.createSocket('udp4');
udp.bind();

udp.on('message', function (msg, remote) {
    console.log(`======== udp recv message: ${msg}, \n\t from ${remote.address} : ${remote.port}`);
});

const tcpClient = new net.Socket();

tcpClient.on('data', function (data) {
    console.log(`======== tcp: recv: ${data}`);

    // 连接服务器回复
    let id = commands.TCP_CONNECT_RESP_REG.exec(data);
    if (id && id[1]) {
        udp.send(`${commands.UDP_LOGIN}${id[1]}`, config.serverUdpPort, config.serverIp);
    }

    // 连接 peer 回复
    let connectPresp = commands.TCP_CONNECT_PEER_RESP_REG.exec(data);
    if (connectPresp && connectPresp[1] && connectPresp[2]) {
        udpPeerTo = {host: connectPresp[1], port: connectPresp[2]};
        console.log('++++++ send udp to peer: hello , to: ' + udpPeerTo.host + ':' + udpPeerTo.port)
        udp.send(`hello`, udpPeerTo.port, udpPeerTo.host)
    }

    // 反向连接请求响应
    let reverseConnectReq = commands.TCP_REVERSE_CONNECTION_REQ_REG.exec(data);
    if (reverseConnectReq && reverseConnectReq[1] && reverseConnectReq[2]) {
        udpPeerFrom = {host: reverseConnectReq[1], port: reverseConnectReq[2]};
        console.log(`++++++ send udp:to:${udpPeerFrom.host}:${udpPeerFrom.port}: hollo-resp`);
        udp.send(`hello-resp`, udpPeerFrom.port, udpPeerFrom.host);
    }

});

tcpClient.connect(config.serverTcpPort, config.serverIp, function () {
    console.log('tcp: connect to ' + config.serverIp + ":" + config.serverTcpPort);
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


rl.on('line', function (line) {
    console.log('您输入了：' + line);

    let mc = userInputs.PEER_CONNECT_REG.exec(line);
    if (mc && mc[1]) {
        tcpClient.write(`${commands.TCP_CONNECT_PEER}${mc[1]}`);
    }

    let pt = userInputs.PEER_MSG_REG.exec(line);
    if (pt && pt[1] && udpPeerTo.host && udpPeerTo.port) {
        console.log(`++++++++ udp.send('peer msg: ${pt[1]}  -- ${udpPeerTo.host}:${udpPeerTo.port}'`);
        udp.send(commands.UDP_PEER_MSG + pt[1], udpPeerTo.port, udpPeerTo.host);
    }
});

rl.on('close', function () {
    process.exit();
});

console.log('client has started');
