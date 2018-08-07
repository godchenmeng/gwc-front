(function(angular) {
    'use strict';

    //// JavaScript Code ////
    function treeCtrl($log,$timeout,toaster) {
        var vm = this;

        var newId = 1;
        vm.ignoreChanges = false;
        vm.newNode = {};
        vm.originalData = [
            { id : 'ajson1', parent : '#', text : '贵州优行车联', state: { opened: true} },
            { id : 'ajson2', parent : '#', text : '毕节市场监督管', state: { opened: true} },
            { id : 'ajson3', parent : 'ajson2', text : '贵F03393', state: { opened: true} },
			 { id : 'ajson4', parent : 'ajson2', text : '贵F03393', state: { opened: true} },
			 { id : 'ajson5', parent : 'ajson2', text : '贵F03393', state: { opened: true} },
			 { id : 'ajson6', parent : 'ajson2', text : '贵F03393', state: { opened: true} },
			 { id : 'ajson7', parent : 'ajson2', text : '贵F03393', state: { opened: true} },
			 { id : 'ajson8', parent : 'ajson2', text : '贵F03393', state: { opened: true} },
			{ id : 'ajson9', parent : 'ajson2', text : '贵FJZ010' , state: { opened: true}}, 
			 { id : 'ajson11', parent : 'ajson2', text : '贵F03393', state: { opened: true} },
			{ id : 'ajson12', parent : '#', text : '国元农业保险分公司', state: { opened: false} },
				 { id : 'ajson14', parent : 'ajson12', text : '贵F03393', state: { opened: true} },
				 { id : 'ajson15', parent : 'ajson12', text : '贵F03393', state: { opened: true} },
				 { id : 'ajson16', parent : 'ajson12', text : '贵F03393', state: { opened: true} },
				 { id : 'ajson17', parent : 'ajson12', text : '贵F03393', state: { opened: true} },
				 { id : 'ajson18', parent : 'ajson12', text : '贵F03393', state: { opened: true} },
				 { id : 'ajson19', parent : 'ajson12', text : '贵F03393', state: { opened: true} },
				 {id : 'ajson20', parent : 'ajson12', text : '贵FJZ010' , state: { opened: true}}, 
				 { id : 'ajson21', parent : 'ajson12', text : '贵F03393', state: { opened: true} },
            { id : 'ajson13', parent : '#', text : '优行科技', state: { opened: true} },
			
        ];
        vm.treeData = [];
        angular.copy(vm.originalData,vm.treeData);
        vm.treeConfig = {
            core : {
                multiple : false,
                animation: true,
                error : function(error) {
                    $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                },
                check_callback : true,
                worker : true
            },
            types : {
                default : {
                    icon : 'glyphicon glyphicon-flash'
                },
                star : {
                    icon : 'glyphicon glyphicon-star'
                },
                cloud : {
                    icon : 'glyphicon glyphicon-cloud'
                }
            },
            version : 1,
            plugins : ['types','checkbox']
        };


        vm.reCreateTree = function() {
            vm.ignoreChanges = true;
            angular.copy(this.originalData,this.treeData);
            vm.treeConfig.version++;
        };

        vm.simulateAsyncData = function() {
            vm.promise = $timeout(function(){
                vm.treeData.push({ id : (newId++).toString(), parent : vm.treeData[0].id, text : 'Async Loaded' })
            },3000);
        };

        vm.addNewNode = function() {
            vm.treeData.push({ id : (newId++).toString(), parent : vm.newNode.parent, text : vm.newNode.text });
        };

        this.setNodeType = function() {
            var item = _.findWhere(this.treeData, { id : this.selectedNode } );
            item.type = this.newType;
            toaster.pop('success', 'Node Type Changed', 'Changed the type of node ' + this.selectedNode);
        };

        this.readyCB = function() {
            $timeout(function() {
                vm.ignoreChanges = false;
                toaster.pop('success', 'JS Tree Ready', 'Js Tree issued the ready event')
            });
        };

        this.createCB  = function(e,item) {
            $timeout(function() {toaster.pop('success', 'Node Added', 'Added new node with the text ' + item.node.text)});
        };

        this.applyModelChanges = function() {
            return !vm.ignoreChanges;
        };
    }

    //// Angular Code ////

    angular.module('ngJsTreeDemo').controller('treeCtrl', treeCtrl);

})(angular);