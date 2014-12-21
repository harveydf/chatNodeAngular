/**
 * Created by harveydf on 20/12/14.
 */

(function () {
    var app = angular.module('chatApp', []);
    
    app.factory('socket', function () {
        var socket = io();
        return socket
    })

    app.controller('chatController', function ($scope, $http, socket) {
        $scope.messages = [];

        $http.get('/api/messages').success(function (data) {
           $scope.messages = data;
        });

        $scope.sendMessage = function() {
            var message = {
                'userName': $scope.userName,
                'messageText': $scope.messageText
            };

            $http.post('/api/messages', message).success(function () {
                socket.emit('send message', message);
                $scope.messageText = null;
            });
        };

        socket.on('get message', function (data) {
            $scope.messages.push(data);
            $scope.$digest();
        });
    });
})();