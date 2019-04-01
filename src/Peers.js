function Peers() {
    this.collection = {};
}

/**
 *
 * @type {{has: Peers.has, add: Peers.add, remove: Peers.remove}}
 */
Peers.prototype = {
    has: function (id) {
        return this.collection[id];
    },

    find: function (id) {
        return this.collection[id];
    },

    add: function (id, remote = {tcp: {socket}, udp: {host, port}}) {
        this.collection[id] = remote;
    },

    remove: function (id) {
        delete this.collection[id];
    },

    updateUdp: function (id, udp = {host, port}) {
        this.collection[id].udp = udp;
    },

};


module.exports = {
    Peers: Peers,
}
