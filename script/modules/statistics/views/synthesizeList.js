/**
 * @file 综合统计列表 Reflux View
 * @author Banji 2017.09.08
 */
import React, { Component } from 'react'
import { render } from 'react-dom'


import Urls from '../../../common/urls';
import BootstrapTable from '../../../common/bootstrapTable';

import SynthesizeStore from '../stores/synthesizeStore';

var SynthesizeList = React.createClass({
    getInitialState: function() {
        return {

        }
    },
    componentDidMount: function () {
        let that = this;
        that.unsubscribe = SynthesizeStore.listen(that.listenEvent);
        that.showTableByTime();
    },
    componentWillUnmount: function () {
        this.unsubscribe(); //解除监听
    },
    listenEvent: function(type,result){
        switch (type){
            case 'showTableByTime':
                this.showTableByTime(result);
                break;
            case 'showTableByOrg':
                this.showTableByOrg(result);
                break;
            case 'showTableByCar':
                this.showTableByCar(result);
                break;
        }
    },
    showTableByTime:function(value){
        $("#synthesize_table").bootstrapTable("destroy");
        BootstrapTable.initTable("synthesize_table",5,[5],Urls.synthesizePage,SynthesizeStore.data.time_columns,SynthesizeStore.data.time_queryParams,Urls.post);
        SynthesizeStore.trigger("showSynthesizeChart");
    },
    showTableByOrg:function(value){
        $("#synthesize_table").bootstrapTable("destroy");
        BootstrapTable.initTable("synthesize_table",5,[5],Urls.synthesizePage,SynthesizeStore.data.org_columns,SynthesizeStore.data.org_queryParams,Urls.post);
        SynthesizeStore.trigger("showSynthesizeChart");
    },
    showTableByCar:function(value){
        $("#synthesize_table").bootstrapTable("destroy");
        BootstrapTable.initTable("synthesize_table",5,[5],Urls.synthesizePage,SynthesizeStore.data.car_columns,SynthesizeStore.data.car_queryParams,Urls.post);
        SynthesizeStore.trigger("showSynthesizeChart");
    },
    render: function () {
        return (
            <table id="synthesize_table"  className="table-striped"></table>
        )
    }
});

export default SynthesizeList;