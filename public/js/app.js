/**
 * Created by harveydf on 20/12/14.
 */

(function () {
    var app = angular.module('chatApp', []);
    
    app.factory('socket', function () {
        var socket = io();
        return socket
    })

    app.controller('chatController', function ($scope, socket) {
        $scope.messages = [];

        $scope.sendMessage = function() {
            var message = {
                'userName': $scope.userName,
                'messageText': $scope.messageText
            };
            socket.emit('send message', message);
            $scope.messageText = null;
        };

        socket.on('get message', function (data) {
            $scope.messages.push(data);
            $scope.$digest();
        });
    });
})();