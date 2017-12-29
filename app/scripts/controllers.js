'use strict';

/* Controllers */

angular.module('blogApp').constant('jQuery', window.jQuery)
    .controller('HomeCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main' ,'jQuery', function ($rootScope, $scope, $location, $localStorage, Main, jQuery) {

        $scope.signin = function () {

            Main.login($scope.email, $scope.password, function (res) {
                if (res.type == false) {
                    alert(res)
                } else {
                    $localStorage.token = res.token;
                    window.location = "/";
                }
            }, function () {
                $rootScope.error = 'Failed to signin';
            })
        };

        $scope.signup = function () {
            Main.signUp($scope.username, $scope.password, $scope.email, function (res) {
                if (res.type == false) {
                    alert(res)
                } else {
                    console.log(res);
                    $localStorage.token = res.token;
                    jQuery('#modal-success').modal();

                    setTimeout(function () {
                        window.location = "/";
                    },2000);
                }
            }, function () {
                $rootScope.error = 'Failed to signup';
            })
        };

        $scope.me = function () {
            Main.me(function (res) {
                $scope.myDetails = res;
            }, function () {
                $rootScope.error = 'Failed to fetch details';
            })
        };

        $scope.logout = function () {
            Main.logout(function () {
                window.location = "/"
            }, function () {
                alert("Failed to logout!");
            });
        };
        $scope.token = $localStorage.token;
    }])

    .controller('UserCtrl', ['$rootScope', '$scope', '$location', 'Main', function ($rootScope, $scope, $location, Main) {
        $scope.option = 0;
        $scope.usersPosts;
        $scope.myDetails;
        $scope.description;
        $scope.title;
        $scope.tags;

        $scope.switch = function (i) {
            $scope.option = i;
        };

        $scope.editPost = function () {
            if ($scope.tags && typeof $scope.tags === 'string') {
                $scope.tags = $scope.tags.split(',');
            }
            Main.updatePost($scope.myDetails._id, $scope.id, $scope.description, $scope.title, $scope.tags, function (res) {
                getAllUsersPosts();
                $scope.option = 0;
            });
        };

        $scope.savePost = function () {
            if ($scope.tags) {
                $scope.tags = $scope.tags.split(',');
            }
            Main.savePost($scope.description, $scope.title, $scope.tags, function (res) {
                getAllUsersPosts();
                $scope.switch(0);
            })
        };

        $scope.delete = function (id) {
            Main.removePost(id, function (res) {
                getAllUsersPosts();
            });
        };

        $scope.edit = function (post) {
            $scope.option = 2;
            $scope.id = post._id;
            $scope.description = post.description;
            $scope.title = post.title;
            $scope.tags = post.tags;
        };

        $scope.currentPost = function (post) {
            console.log(post);
            Main.post = post;
        };

        Main.user(function (res) {
            $scope.myDetails = res;
            getAllUsersPosts();
        }, function () {
            $rootScope.error = 'Failed to fetch details';
        });

        function getAllUsersPosts() {
            Main.getAllUsersPosts($scope.myDetails._id, function (res) {
                $scope.usersPosts = res
            });
        }


    }])

    .controller('PostCtrl', ['$rootScope', '$scope', '$location', 'Main', 'orderByFilter', function ($rootScope, $scope, $location, Main, orderBy) {

        getAllPosts();

        $scope.post = Main.post;
        $scope.propertyName = 'date';
        $scope.reverse = true;
        $scope.posts = orderBy($scope.posts, $scope.propertyName, $scope.reverse);

        $scope.currentPost = function (post) {
            console.log(post);
            Main.post = post;
            Main.ge
        };

        $scope.like = function (id) {
            Main.like(id, function (res) {
                if (res) {
                    getAllPosts();
                }
            });
        };

        $scope.dislike = function (id) {
            Main.dislike(id, function (res) {
                if (res) {
                    getAllPosts();
                }
            });
        };

        $scope.sortBy = function (propertyName) {
            $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
                ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
            $scope.posts = orderBy($scope.posts, $scope.propertyName, $scope.reverse);
        };

        $scope.sortByTag = function () {
            Main.getAllPosts(function (res) {
                if($scope.tagsFilter !== '') {
                    var filteredPosts = res;
                    $scope.posts = [];
                    filteredPosts.map(function (post) {
                        post.tags.map(function (tag) {
                            if (tag.indexOf($scope.tagsFilter) != -1) {
                                if (!$scope.posts.includes(post)) {
                                    $scope.posts.push(post);
                                }
                                return;
                            }
                        })
                    })
                } else {
                    $scope.posts = res;
                }
            });
        };
        function getAllPosts() {
            Main.getAllPosts(function (res) {
                $scope.posts = res;
            });
        }

    }]);
