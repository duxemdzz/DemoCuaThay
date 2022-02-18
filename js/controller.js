"use strict"

angular.module('sangHub.quizApp', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/index', {
            templateUrl: 'views/index.html',
            controller: 'IndexCtrl'
        })
        .when('/introduce', {
            templateUrl: 'views/introduce.html'
        })
        .when('/contact', {
            templateUrl: 'views/contact.html'
        })
        .when('/feedback', {
            templateUrl: 'views/feedback.html'
        })
        .when('/qa', {
            templateUrl: 'views/qa.html'
        })
        .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .when('/myinfo', {
            templateUrl: 'views/myinfo.html',
            controller: 'MyinfoController'
        })
        .when('/profile', {
            templateUrl: 'views/profile.html',
            controller: 'ProfileController'
        })
        .when('/account', {
            templateUrl: 'views/account.html',
            controller: 'AccountController'
        })
        .when('/quiz/:subjectId', {
            templateUrl: 'views/quiz.html',
            controller: 'QuizCtrl'
        })
}])

.config(['$qProvider', function($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }])
    .controller('IndexCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
        $scope.subjects = [];
        $http.get('db/Subjects.js').then(function(response) {
            $scope.subjects = response.data;
        });
        $rootScope.clickLogin = false;
        $rootScope.showSlide = true;
    }])

.controller('QuizCtrl', ['$scope', '$routeParams', '$http', '$timeout', '$rootScope', function($scope, $routeParams, $http, $timeout, $rootScope) {
        $scope.subjectInfo = {};
        $scope.listQuestions = [];
        var subjectId = $routeParams.subjectId;
        $scope.inProgress = 0;
        $scope.listAnswers = [];
        $scope.listAnswers.length = 11;
        $http.get('db/Subjects.js').then(function(response) {
            var listSubjects = [];
            listSubjects = response.data;

            for (var i = 0; i < listSubjects.length; i++) {
                if (listSubjects[i].Id == subjectId) {
                    $scope.subjectInfo = listSubjects[i];
                }
            }
        });

        $rootScope.ss = 59;
        $rootScope.mm = 5;
        var top;
        $scope.batdau = function() {
            $rootScope.stop = $timeout(function() {
                $scope.batdau();
                if ($rootScope.ss == 0) {
                    $rootScope.ss = 60;
                    $rootScope.mm--;
                }
                $rootScope.ss--;
            }, 1000);

            if ($rootScope.ss == 0 && $rootScope.mm == 0) {
                $rootScope.stop();
                $scope.submit();
            }
            $rootScope.stop = function() {
                $timeout.cancel(stop);
            }
            $rootScope.reset = function() {
                $rootScope.ss = 59;
                $rootScope.mm = 5;
            }
        }

        $http.get('db/quizs/' + subjectId + '.js').then(function(response) {
            $scope.listQuestions = shuffleArray(response.data, 10);
            $scope.showmark = 0;
            // $scope.showresult = [];
            $scope.submit = function() {
                $scope.mark = 0;
                for (var i = 0; i < $scope.listQuestions.length; i++) {
                    if ($scope.listAnswers[i] != null) {
                        if ($scope.listAnswers[i] == $scope.listQuestions[i].AnswerId) {
                            $scope.mark += $scope.listQuestions[i].Marks;
                        }
                    }
                }
                // console.log($scope.listAnswers);
                console.log($scope.checkUndefined);
                $scope.inProgress = 2;
                // $scope.inProgress = false;
                // $scope.showmark = mark;
            }

            console.log(showAnswers());

            function showAnswers() {
                var listAns = [];
                for (var i = 0; i < $scope.listQuestions.length; i++) {
                    for (var j = 0; j < $scope.listQuestions[i].Answers.length; j++) {
                        if ($scope.listQuestions[i].AnswerId == $scope.listQuestions[i].Answers[j].Id) {
                            listAns[i + 1] = j + 1;
                        }
                    }
                }
                return listAns;
            };


        })
        $scope.checkUndefined = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        $scope.addAnswer = function(index, answerId) {
            $scope.listAnswers[index] = answerId;
            $scope.checkUndefined[index] = 1;
        }

        $scope.start = function() {
            $scope.inProgress = 1;
        }

        $scope.begin = 0;
        $scope.prev = function() {
            if ($scope.begin > 0) {
                $scope.begin--;
                if ($scope.listAnswers[$scope.begin] != null) {
                    $scope.answerId = $scope.listAnswers[$scope.begin];
                }
            }
        }

        $scope.next = function() {
            if ($scope.begin < $scope.listQuestions.length - 1) {
                $scope.begin++;
                if ($scope.listAnswers[$scope.begin] != null) {
                    $scope.answerId = $scope.listAnswers[$scope.begin];
                }
            }
        }


        function shuffleArray(array, number) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            array = array.slice(0, number);
            return array;
        };

    }])
    .controller("LoginController", function($scope, $http, $window, $rootScope) {
        $scope.mydata;
        $rootScope.clickLogin = true;
        $rootScope.UserLogin = "Đăng Nhập";
        $rootScope.chk = false;
        $http.get("db/Students.js")
            .then(function(response) {
                $scope.mydata = response.data;
                angular.forEach($scope.mydata, function(item) {
                    // alert(item.email);  
                })

            });
        $scope.submit = function() {
            // alert("SUBMIT "+$scope.regObj.username);
            var stat = "false";
            angular.forEach($scope.mydata, function(item) {
                // alert(item.email);  
                if ((item.username == $scope.student.username) && (item.password == $scope.student.password)) {
                    stat = "true";
                    $rootScope.students = item;
                    $rootScope.UserLogin = item.username;
                    $rootScope.chk = true;
                    // alert($scope.students.email)
                }
            });
            $scope.student.username = "";
            $scope.student.password = "";
            if (stat == "true") {

                $window.location.href = '#!index'
                $rootScope.clickLogin = false;

            } else {
                $scope.failLogin = true;
            }

        };

        $scope.student = {
            "username": "",
            "password": ""

        };
        $scope.students = {};

    })
    .controller('MyinfoController', function($scope, $rootScope) {
        $rootScope.showSlide = false;
        $scope.edits = function() {
            $scope.$parent.edit = true;
        }
        $scope.save = function() {
            $scope.$parent.edit = false;
        }
    })
    .controller('ProfileController', function($scope, $rootScope) {
        $rootScope.showSlide = false;
    })
    .controller('AccountController', function($scope, $rootScope) {
        $rootScope.showSlide = false;
    })