'use strict';

angular
	.module('toDoApp', ['ngRoute'])
	.config($routeProvider => {
		$routeProvider
			.when('/', {
				controller: 'MainCtrl',
				templateUrl: 'partials/main.html'
			})
			.when('/list', {
				controller: 'ToDoCtrl',
				templateUrl: 'partials/list.html'
			})
	})
	.controller('MainCtrl', function ($scope, $http) {

		$http.get('/api/title')
			.then(({data : {title}}) => $scope.title = title)

	})
	.controller('ToDoCtrl', function($scope, $http) {

		let pageLoad = function() {
			$http.get('/api/items')
				.then(({data : {messages}}) => {
					$scope.list = messages
				})
		}

		pageLoad()

		$scope.sendItem = function() {

			const item = {
				content: $scope.content,
				date: $scope.date
			}

			$http
				.post('/api/items', item)
				.then(() => pageLoad())
				.catch(console.error)
		}

		$scope.deleteItem = function() {
			const id = this.item._id

			$http
				.delete(`/api/items/${id}`)
				.then(() => pageLoad())
				.catch(console.error)
		}

	})