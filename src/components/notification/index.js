import React,{Component} from "react";
import RVD from 'react-virtual-dom';
import {Icon} from '@mdi/react';
import { mdiCloseCircleOutline } from "@mdi/js";
import AppContext from "../../app-context";
export default class extends Component{
    static contextType = AppContext;
    constructor(props){
        super(props);
        this.state = {items:[]}
    }
    async componentDidMount(){
        let {services,confirm} = this.context;
        let res = await services({type:'notifications'});
        if(typeof res === 'string'){
            confirm({type:'error',text:'دریافت اعلان ها با خطا مواجه شد',subtext:res})
        }
        else if(Array.isArray(res)){
            this.setState({items:res})
        }
        else {
            alert(
                'خطای دولوپمنت . لیست اعلان ها باید آرایه باشد'
            )
        }
        
    }
    render(){
        let {services,confirm} = this.context;
        let {items} = this.state;
        return (
            <RVD
                layout={{
                    scroll:'v',
                    style:{background:'#fff',width:'100%',height:'100%'},
                    column:items.map((o)=>{
                        return {
                            html:<NotificationCard key={o.id} object={o} onRemove={async ()=>{
                                let res = await services({type:'removeNotification',parameter:{id:o.id}});
                                if(res === true){
                                    this.setState({items:this.state.items.filter((item)=>item.id !== o.id)})
                                }
                                else if(typeof res === 'string'){
                                    confirm({type:'error',text:'حذف اعلان با خطا مواجه شد',subtext:res})
                                }
                            }}/>
                        }
                    })
                }}
            />
        )
    }
}

class NotificationCard extends Component{
    static contextType = AppContext;
    name_layout(name){
        return {flex:1,html:name,className:'size14 bold',align:'v'}
    }
    status_layout(status){
        let {mozakereStatuses} = this.context;
        let {text,color} = mozakereStatuses.find((o)=>o.value === status);
        return {className:'mozakere-card-status',html:text,style:{color,background:color + '20'}}
    }
    remove_layout(){
        let {onRemove} = this.props;
        return {
            html:<Icon path={mdiCloseCircleOutline} size={0.8}/>,align:'vh',attrs:{onClick:()=>onRemove()}
        }
    }
    company_layout(company){return {html:company,className:'size12'}}
    city_layout(city){
        return {html:city,className:'mozakere-card-city'}
    }
    time_layout(date,time){
        return {
            html:`زمان : ${date} ${time}`,className:'colorA9A9A9 size10'
        }
    }
    render(){
        let {object} = this.props;
        let {name,city,date,time,status} = object;
        return (
            <RVD
                layout={{
                    style:{background:'#fff',borderBottom:'1px solid #ddd',padding:12},
                    column:[
                        {
                            row:[
                                this.name_layout(name),
                                this.remove_layout()
                            ]
                        },
                        {size:6},
                        {
                            row:[
                                this.city_layout(city)
                            ]
                        },
                        {size:6},
                        {
                            row:[
                                this.time_layout(date,time),
                                {flex:1},
                                this.status_layout(status)
                            ]
                        }
                    ]
                }}
            />
        )
    }
}