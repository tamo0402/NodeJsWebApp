$(function() {

    // Socket.io
    var socket = io.connect();

    socket.on("connect", function() {
        var conect = '';
        conect = "connect via " + socket.socket.transport.name;
        $("#transportName").text(conect);// 接続時に接続方式表示
    });
    socket.on("message", function(msg) {
        $("#div_msg").text(msg);// 接続時に接続方式表示
    });
});
