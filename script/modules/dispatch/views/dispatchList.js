/**
 * @file 调度-列表 Reflux View
 * @author Banji 2017.07.25
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import Urls from '../../../common/urls';
import BootstrapTable from '../../../common/bootstrapTable';

import DispatchStore from '../stores/dispatchStore';

var DispatchList = React.createClass({
    getInitialState: function() {
        return {

        }
    },
    componentDidMount: function () {
        BootstrapTable.initTable("dispatch_table",20,[10,20,30,40],Urls.dispatchPage,DispatchStore.data.columns,DispatchStore.data.queryParams,Urls.post);
        $("#dispatch_table").on("load-success.bs.table",function(e,data){
            if(data.rows.length > 0){
                $.each(data.rows,function(index,obj){
                    if(obj.apply_status == "1"){//待办数据设置字体加粗
                        $("#dispatch_table tr[data-index='"+index+"']").css('font-weight','bold');
                    }
                })
            }
        });
        $("#dispatch_table").on("click-row.bs.table",function(e, row, $element, field){
            if(field !== "operate"){
                $("#dd_reason,#li_dd_result,#li_dd_reason,#li_repeal_reason,.li_driver_info,#li_driver_feedback,#li_pq_status,#btn-green,#btn-edit").addClass("hide");
                DispatchStore.trigger('dispatchEvent',row);
                if(row.apply_status == "1"){//待办
                    $("#dispatch_agree_modal").modal('toggle');
                    $("#dispatch_car_table").bootstrapTable("destroy");
                    $("#dispatch_driver_table").bootstrapTable("destroy");
                    BootstrapTable.initTable("dispatch_car_table",10,[5,10],Urls.dispatchCarList,DispatchStore.data.car_columns,DispatchStore.data.car_queryParams,Urls.post);
                    BootstrapTable.initTable("dispatch_driver_table",10,[5,10],Urls.dispatchDriverList,DispatchStore.data.driver_columns,DispatchStore.data.driver_queryParams,Urls.post);
                }else if(row.apply_status == "1.5"){//驾驶员反馈
                    $("#li_dd_result").removeClass("hide");
                    $(".li_driver_info").removeClass("hide");
                    $("#li_driver_feedback").removeClass("hide");
                    $("#btn-edit").removeClass("hide");
                    $("#dispatch_reject_modal").modal('toggle');
                }else if(row.apply_status == "2"){//同意
                    $("#li_dd_result").removeClass("hide");
                    $(".li_driver_info").removeClass("hide");
                    $("#li_pq_status").removeClass("hide");
                    if(row.pq_status == "1"){//派遣状态 为待出车
                        $("#btn-edit").removeClass("hide");
                    }
                    $("#dispatch_reject_modal").modal('toggle');
                }else if(row.apply_status == "3"){//驳回
                    $("#li_dd_result").removeClass("hide");
                    $("#li_dd_reason").removeClass("hide");
                    $("#dispatch_reject_modal").modal('toggle');
                }else if(row.apply_status == "4"){//已撤销
                    $("#li_repeal_reason").removeClass("hide");
                    $("#dispatch_reject_modal").modal('toggle');
                }
            }
        });
    },
    render: function () {
        return (
            <table id="dispatch_table"  className="table-striped"></table>
        )
    }
});

export default DispatchList;