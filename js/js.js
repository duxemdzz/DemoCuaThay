'use strict'

angular.module('sanghub', ["ngRoute"])
    .controller('test', function($scope, $http) {

        $scope.arr = [];
        $http.get("../db/Quizs/ADAV.js").then(function(response) {
            $scope.arr = response.data;

            $scope.result = function() {
                $scope.mark = 0;
                console.log($scope.saveQA);
                for (var i = 0; i < $scope.arr.length; i++) {
                    if ($scope.arr[i].AnswerId == $scope.saveQA[i]) {
                        $scope.mark += $scope.arr[i].Marks;
                    }
                }
                console.log($scope.mark);
            };
        }, function(response) {
            alert('Lỗi');
        });
        $scope.index = 0;
        $scope.mark = 0;
        $scope.saveQA = [];


        $scope.addAnswer = (index, aId) => {
            $scope.saveQA[index] = aId;
        }

        $scope.begin = 0;
        $scope.Pre = function() {
            if ($scope.index > 0) {
                $scope.begin--;
                if ($scope.saveQA[$scope.index] != null) {
                    $scope.answer = $scope.saveQA[$scope.index];
                }
            }
        };
        $scope.Next = function() {
            if ($scope.index < 4) {
                $scope.begin++;
                if ($scope.saveQA[$scope.index] != null) {
                    $scope.answer = $scope.saveQA[$scope.index];

                }
            }
        };


    })
    .controller('ExampleController', ['$scope', '$interval',
        function($scope, $interval) {
            $scope.ss = 100;
            $scope.mm = 0;
            var count = 0;
            var stop;
            $scope.fight = function() {
                if (angular.isDefined(stop)) return;
                stop = $interval(function() {
                    if ($scope.mm == 0 && $scope.ss == 0) {
                        $scope.stopFight();
                        $scope.$parent.result();
                    }
                    if ($scope.ss > 0) {
                        $scope.ss--;
                        count++;
                    }
                    if (count == 30) {
                        $scope.mm--;
                        count = 0;
                        $scope.ss = 29;
                    }
                }, 1000);
            };
            $scope.stopFight = function() {
                if (angular.isDefined(stop)) {
                    $interval.cancel(stop);
                    stop = undefined;
                }
            };
            $scope.resetFight = function() {
                $scope.ss = 9;
                $scope.mm = 0;
            };
            $scope.$on('$destroy', function() {
                $scope.stopFight();
            });

        }
    ])
    .directive('myCurrentTime', ['$interval', 'dateFilter',
        function($interval, dateFilter) {
            return function(scope, element, attrs) {
                var format,
                    stopTime;

                function updateTime() {
                    element.text(dateFilter(new Date(), format));
                }
                scope.$watch(attrs.myCurrentTime, function(value) {
                    format = value;
                    updateTime();
                });

                stopTime = $interval(updateTime, 1000);
                element.on('$destroy', function() {
                    $interval.cancel(stopTime);
                });
            }
        }
    ])

.controller('Homecontroller', function($scope, $http) {
    $scope.subject = [];
    $http.get("db/Subjects.js").then(function(response) {
        $scope.subject = response.data;
    }, function(response) {
        alert('Lỗi dady');
    });

});