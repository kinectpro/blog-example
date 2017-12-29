'use strict';

angular.module('blogApp')
    .factory('Main', ['$http', '$localStorage', '$window', function($http, $localStorage, $window){
        var user;
        var post;
        console.log('authService');
        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getUserFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }

        var currentUser = getUserFromToken();

        return {
            signUp: function(username, password, email, success, error) {
                $http.post('/api/user/signup', {username, password, email}).success(success).error(error)
            },
            login: function(username, password, success, error) {
                $http.post('/api/user/authenticate',{username, password}).success(success).error(error)
            },
            user: function(success, error) {
                $http.get('/api/user/get').success(success).error(error)
            },
            logout: function(success) {
                $window.localStorage.clear();
                success();
            },
            getAllPosts: function (success, error) {
                $http.get('/api/post/getall').success(success).error(error)
            },
            getAllUsersPosts: function (id, success, error) {
                $http.post('/api/user/getallposts',{ id }).success(success).error(error)
            },
            like: function (id, success, error) {
                $http.get('/api/post/like' + id).success(success).error(error)
            },
            dislike: function (id, success, error) {
                $http.get('/api/post/dislike' + id).success(success).error(error)
            },
            removePost: function (post_id, success, error) {
                $http.delete('/api/post/delete' + post_id ).success(success).error(error)
            },
            savePost: function (description, title, tags, success, error) {
                $http.post('/api/post/create', { description, title, tags } ).success(success).error(error)
            },
            updatePost: function (owner,_id, description, title, tags, success, error) {
                $http.put('/api/post/update', {owner, _id, description, title, tags } ).success(success).error(error)
            }

        };
    }
]);