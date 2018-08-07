/**
 * @file 用车申请列表 Reflux View
 * @author Banji 2017.08.03
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import BootstrapTable from '../../../common/bootstrapTable'
import Urls from '../../../common/urls'

import ApplyStore from '../stores/applyStore'

var ApplyListTable = React.createClass({
    componentDidMount: function(){
        let that = this;
        BootstrapTable.initTable("apply_table", 20, [10, 20, 30, 40], Urls.applyPage, ApplyStore.data.columns, ApplyStore.data.queryParams, Urls.post);
        $("#apply_table").on("load-success.bs.table",function(e,data){
            if(data.rows.length > 0){
                $.each(data.rows,function(index,obj){
                    if(obj.isread == "1"){//未读数据设置字体加粗
                        $("#apply_table tr[data-index='"+index+"']").css('font-weight','bold');
                    }
                })
            }
        });
        $("#apply_table").on("click-row.bs.table",function(e, row, $element, field){
            if(field !== "operate"){
                $("textarea[name='repeal_reason']").parent().addClass("hide");
                $("button#btn-green").addClass("hide");
                $("button#btn-revoke,button#btn-c-add,button#btn-edit").addClass("hide");
                $("button#btn-c-add").removeClass("hide");
                if(row.apply_status == "1" || row.apply_status == "2" || row.apply_status == "3" || row.apply_status == "5"){
                    $("textarea[name='repeal_reason']").parent().removeClass("hide");
                    $("button#btn-revoke").removeClass("hide");
                }
                if(row.apply_status == "1" || row.apply_status == "6"){
                    $("button#btn-edit").removeClass("hide");
                }
                $("#apply_list_modal").modal('toggle');
                ApplyStore.trigger('repealListApply',row);
            }
        });
    },
    render: function () {
        return (
            <table id="apply_table"  className="table-striped"></table>
        )
    }
});

export default ApplyListTable;