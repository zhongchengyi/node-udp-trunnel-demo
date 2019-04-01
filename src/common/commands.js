module.exports = {
    TCP_LOGIN: 'TCP_LOGIN:',

    TCP_CONNECT_RESP: 'TCP_CONNECT_RESP:',
    TCP_CONNECT_RESP_REG: new RegExp('TCP_CONNECT_RESP:(\\d+)'),

    TCP_CONNECT_PEER: 'TCP_CONNECT_PEER:',
    TCP_CONNECT_PEER_REG: new RegExp('TCP_CONNECT_PEER:(\\d+)'),

    TCP_CONNECT_PEER_RESP: 'TCP_CONNECT_PEER_RESP:',
    TCP_CONNECT_PEER_RESP_REG: new RegExp('TCP_CONNECT_PEER_RESP:(\\S+):(\\d+)'),

    TCP_REVERSE_CONNECTION_REQ: 'TCP_REVERSE_CONNECTION_REQ',
    TCP_REVERSE_CONNECTION_REQ_REG: new RegExp('TCP_REVERSE_CONNECTION_REQ:(\\S+):(\\d+)'),

    UDP_LOGIN: 'UDP_LOGIN:',
    UDP_LOGIN_REG: new RegExp('UDP_LOGIN:(\\d+)'),

    UDP_PEER_MSG: 'UDP_PEER_MSG:',
}