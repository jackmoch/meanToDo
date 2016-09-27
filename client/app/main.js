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
			.when('/item/:id', {
				controller: 'ItemCtrl',
				templateUrl: 'partials/item.html'
			})
	})
	.controller('MainCtrl', function ($scope, $http) {

		$http.get('/api/title')
			.then(({data : {title}}) => $scope.title = title)

	})
	.controller('ToDoCtrl', function($scope, $http, $location) {

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

		$scope.editItem = function() {
			const id = this.item._id

			$location.path(`/item/${id}`)
		}

		$scope.deleteItem = function() {
			const id = this.item._id

			$http
				.delete(`/api/items/${id}`)
				.then(() => pageLoad())
				.catch(console.error)
		}

	})
	.controller('ItemCtrl', function($scope, $http, $location, $routeParams) {

	  $scope.currentItemId = $routeParams.id

		$http
			.get(`/api/item/${$scope.currentItemId}`)
			.then((data) => {
				const item = data.data.item[0]
				$scope.content = item.content
				$scope.date = item.date
			})

			$scope.updateItem = function() {

				const item = {
					content: $scope.content,
					date: $scope.date
				}

				$http
					.put(`/api/items/${$scope.currentItemId}`, item)
					.then(() => $location.path('/list'))
					.catch(console.error)
			}

	})