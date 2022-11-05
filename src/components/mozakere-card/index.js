import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import AIOButton from 'aio-button';
import AppContext from '../../app-context';
import VirayesheMozakere from '../virayeshe-mozakere';
import {Icon} from '@mdi/react';
import {mdiDotsVertical,mdiChevronLeft} from '@mdi/js';
import './index.css';
import Mozakere from '../mozakere/mozakere';
export default class MozakereCard extends Component{
    static contextType = AppContext;
    constructor(props){
        super(props);
        this.state = {time:this.getTime()}
        this.interval = setInterval(()=>{
            this.setState({time:this.getTime()})
        },60000)
    }
    name_layout(name){
        return {html:name,className:'size14 bold'}
    }
    status_layout(status){
        let {mozakereStatuses} = this.context;
        let {text,color} = mozakereStatuses.find((o)=>o.value === status);
        return {className:'mozakere-card-status',html:text,style:{color,background:color + '30'}}
    }
    options_layout(mode){
        let {object} = this.props;
        let {status} = object;
        return {
            html:(
                <AIOButton
                    type='select' caret={false}
                    style={{background:'none'}}
                    options={[
                        {text:'انصراف از مذاکره',value:'enseraf',show:mode === 'mize_kar'},
                        {text:'ارجاع به دیگری',value:'erja',show:mode === 'mize_kar'},
                        {text:'ویرایش',value:'virayesh',show:mode === 'tarikhche'},
                        {text:'مشاهده جزییات',value:'details',show:mode === 'tarikhche' && status === '2'},
                        {text:'مشاهده علت ارجاع',value:'ellate_erja',show:status === '3'},
                        {text:'مشاهده علت انصراف',value:'ellate_enseraf',show:status === '4'},
                    ]}
                    text={<Icon path={mdiDotsVertical} size={0.8}/>}
                    onChange={(value)=>{
                        let {addPopup,setConfirm} = this.context;
                        let {object,onRemove} = this.props;
                        if(value === 'ellate_erja'){
                            setConfirm({type:'info',text:'علت ارجاع',subtext:object.description})
                        }
                        else if(value === 'ellate_enseraf'){
                            setConfirm({type:'info',text:'علت انصراف',subtext:object.description})
                        }
                        else if(value === 'details'){
                            addPopup({
                                type:'fullscreen',
                                header:false,
                                content:()=><Mozakere {...object} disabled={true}/>
                            })
                        }
                        else{
                            addPopup({
                                type:'fullscreen',
                                header:false,
                                content:()=><VirayesheMozakere object={object} type={value} onRemove={onRemove}/>
                            })
                        }
                        
                    }}
                />
            )
        }
    }
    company_layout(company){return {html:company,className:'size12'}}
    city_layout(city){
        return {html:city,className:'mozakere-card-city'}
    }
    result_layout(result){
        if(!result){return false}
        let {results} = this.context;
        let html = results.find((o)=>o.value === result).presentation()
        return {html}
    }
    getTimeText(time){
        
    }
    getTime(){
        let {object} = this.props;
        let {status,time} = object;
        let title = {
            '0':'ارجاع به من :',
            '1':'شروع مذاکره :',
            '2':'اتمام مذاکره :',
            '3':'زمان ارجاع :',
            '4':'زمان انصراف :'
        }[status];
        let timeText;
        time = new Date(time).getTime();
        let now = new Date().getTime();
        let dif = now - time;
        let hours = Math.floor(dif / (60 * 60 * 1000));
        dif -= hours * (60 * 60 * 1000);
        let minutes = Math.floor(dif / (60 * 1000));
        if(hours === 0 && minutes === 0){timeText = 'اکنون'}
        else if(hours === 0){timeText = `${minutes} دقیقه قبل`}
        else {timeText = `${hours} ساعت و ${minutes} دقیقه قبل`}
        return `${title} ${timeText}`
    }
    time_layout(){
        let {time} = this.state;
        return {className:'colorA9A9A9 size10',html:time}
    }
    action_layout(status,mode){
        if(mode !== 'mize_kar'){return false}
        let {addPopup, services} = this.context;
        let text = {
            '0':'شروع مذاکره',
            '1':'ادامه مذاکره',
        }[status];

        return {
            align:'v',className:'color783C8C size12',
            attrs:{
                onClick:async ()=>{
                    let {object} = this.props;
                    await services({type: 'shorooe_mozakere', parameter: object})
                    addPopup({
                        type:'fullscreen',
                        header:false,
                        content:()=><Mozakere {...object}/>
                    })
                }
            },
            row:[
                {html:text},
                {html:<Icon path={mdiChevronLeft} size={0.6}/>}
            ]
        }
    }
    reference_layout(referencedTo){
        if(!referencedTo){return false}
        return {html:`ارجاع به : ${referencedTo}`,className:'size10'}
    }
    render(){
        let {object,mode} = this.props;
        let {name,status,company,city,result,time,referencedTo} = object;
        return (
            <RVD
                layout={{
                    className:'padding-12 bgFFF',
                    column:[
                        {
                            align:'v',
                            row:[
                                this.name_layout(name),
                                {size:6},
                                this.status_layout(status),
                                {flex:1},
                                this.options_layout(mode)
                            ]
                        },
                        {size:6},
                        {
                            align:'v',
                            row:[
                                this.company_layout(company),
                                {size:6},
                                this.city_layout(city),
                                {flex:1},
                                this.result_layout(result),
                                this.reference_layout(referencedTo)
                            ]
                        },
                        {size:6},
                        {
                            row:[
                                this.time_layout(time,status,mode),
                                {flex:1},
                                this.action_layout(status,mode)
                            ]
                        }
                    ]
                }}
            />
        )
    }
}