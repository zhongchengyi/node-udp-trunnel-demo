const readline = require('readline');
const dgram = require('dgram');
const net = require('net');
const {Peers} = require('./Peers');
const config = require('./common/config')
const commands = require('./common/commands')
const userInputs = require('./common/userInputs')

const peers = new Peers();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


rl.on('line', function (line) {
});

rl.on('close', function () {
    process.exit();
});


const udp = dgram.createSocket('udp4');
udp.on('error', function (err) {
    console.log('server error ' + err.stack);
    udp.close();
});

udp.on('message', function (msg, remote) {
    console.log(`udp recv message: ${msg} \n\t from ${remote.address} : ${remote.port}`);

    let mc = commands.UDP_LOGIN_REG.exec(msg);
    if (mc && mc[1]) {
        peers.updateUdp(mc[1], {host: remote.address, port: remote.port});
    }
});

udp.on('listening', function () {
    const addr = udp.address();
    console.log(`udp listening -  ${addr.address} : ${addr.port}`);
});

udp.bind(config.serverUdpPort);

const tcp = net.createServer();
const tcpPort = config.serverTcpPort;
let g_id = 0;
tcp.on('listening', function () {
    console.log('tcp listening port : ' + tcpPort);
});

tcp.on('connection', function (socket) {
    console.log('tcp connect');

    let id = (++g_id);
    socket.on('error', function (err) {
        console.log(`tcp socket error : ${err}`)
    });
    socket.on('data', function (data) {
        let mc = commands.TCP_CONNECT_PEER_REG.exec(data);
        if (mc && mc[1]) {
            let peer = peers.find(mc[1]);
            let from = peers.find(id);
            socket.write(`${commands.TCP_CONNECT_PEER_RESP}${peer.udp.host}:${peer.udp.port}`);
            if (peer && peer.tcp && peer.tcp.socket && from && from.udp) {
                peer.tcp.socket.write(`${commands.TCP_REVERSE_CONNECTION_REQ}:${from.udp.host}:${from.udp.port}`);
            }
        }
    });

    socket.on('close', function () {
        peers.remove(id);
        console.log(`tcp socket closed , id = ${id}`);
    });

    console.log('++++++ tcp send:' + commands.TCP_CONNECT_RESP + id);
    socket.write(commands.TCP_CONNECT_RESP + id);

    peers.add(id, {tcp: {socket: socket}});

});

tcp.on('data', function (data) {
    console.log('tcp data ' + data);
});

tcp.on('end', function (data) {
    console.log('tcp end ' + data);
    tcp.close();
});

tcp.listen(tcpPort);

console.info('server has started');
