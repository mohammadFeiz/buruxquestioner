import React,{Component} from "react";
import RSA from './npm/react-super-app/index';
import Mozakerat from "./components/mozakerat/index";
import AppContext from "./app-context";
import AIOService from 'aio-service';
import {Icon} from '@mdi/react';
import {mdiClose,mdiCheckCircleOutline,mdiBell,mdiThumbUpOutline,mdiThumbDownOutline,mdiPhone,mdiStarOutline,mdiHistory,mdiCheckbook} from '@mdi/js';
import RVD from 'react-virtual-dom';
import Notification from './components/notification/index';
import apis from './apis';
import headerSrc from './images/header.png';
import titleSrc from './images/title.png';
import "./index.css";
export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      services:AIOService({getState:()=>this.state,apis}),
      navId:'mize_kar',
      mozakereStatuses:[
        {value:'0',text:'در انتظار مذاکره',color:'#108ABE'},
        {value:'1',text:'در حال مذاکره',color:'#CD9100'},
        {value:'2',text:'پایان مذاکره',color:'#107C10'},
        {value:'3',text:'ارجاع شده به دیگری',color:'#814696'},
        {value:'4',text:'انصراف از مذاکره',color:'#A4262C'}
      ],
      results:[
        {value:'all',text:'همه نتیجه ها'},
        {value:'0',text:'موفق ها',presentation:(o)=>{
          return (
            <RVD layout={{
              style:{color:'#107C10'},
              className:'size12',
              gap:3,
              row:[
                {html:'نتیجه:',align:'v'},
                {html:'موفق',align:'v'},
                {html:<Icon path={mdiThumbUpOutline} size={0.7}/>,align:'vh'}
              ]
            }}/>
          )
        }},
        {value:'1',text:'نا موفق ها',presentation:(o)=>{
          return (
            <RVD layout={{
              style:{color:'#BE0000'},
              className:'size12',
              gap:3,
              row:[
                {html:'نتیجه:',align:'v'},
                {html:'نا موفق',align:'v'},
                {html:<Icon path={mdiThumbDownOutline} size={0.7}/>,align:'vh'}
              ]
            }}/>
          )
        }},
        {value:'2',text:'نیاز به تماس ها',presentation:(o)=>{
          return (
            <RVD layout={{
              style:{color:'#2BA4D8'},
              className:'size12',
              gap:3,
              row:[
                {html:'نتیجه:',align:'v'},
                {html:'نیاز به تماس',align:'v'},
                {html:<Icon path={mdiPhone} size={0.7}/>,align:'vh'}
              ]
            }}/>
          )
        }},
        {value:'3',text:'نیاز به پیگیری ها',presentation:(o)=>{
          return (
            <RVD layout={{
              style:{color:'#FF7A00'},
              className:'size12',
              gap:3,
              row:[
                {html:'نتیجه:',align:'v'},
                {html:'نیاز به پیگیری',align:'v'},
                {html:<Icon path={mdiStarOutline} size={0.7}/>,align:'vh'}
              ]
            }}/>
          )
        }},
        
      ],
      mozakere_konandegan:[]
    }
  }
  async get_mozakere_konandegan(){
    let {services} = this.state;
    let res = await services({type:'mozakere_konandegan'});
    if(typeof res === 'string'){
      this.setConfirm({type:'error',text:'دریافت لیست مذاکره کنندگان با خطا مواجه شد',subtext:res})
    }
    else {
      this.setState({mozakere_konandegan:res})
    }
  }
  componentDidMount(){
    this.get_mozakere_konandegan()
  }
  errorConfirm(text,subtext){
    return (
      <RVD
        layout={{
          column:[
            {size:36},
            {html:<Icon path={mdiClose} size={3}/>,style:{color:'red'},align:'vh'},
            {size:12},
            {html:text,style:{color:'red'},align:'vh'},
            {size:12},
            {html:subtext,align:'vh',className:'size10'}
          ]
        }}
      />
    )
  }
  successConfirm(text,subtext){
    return (
      <RVD
        layout={{
          column:[
            {size:36},
            {html:<Icon path={mdiCheckCircleOutline} size={3}/>,style:{color:'green'},align:'vh'},
            {size:12},
            {html:text,style:{color:'green'},align:'vh'},
            {size:12},
            {html:subtext,align:'vh',className:'size10'}
          ]
        }}
      />
    )
  }
  setConfirm({type,text,subtext}){
    let body;
    if(type === 'success'){
      body = this.successConfirm(text,subtext);
    }
    else if(type === 'error'){
      body = this.errorConfirm(text,subtext);
    }
    this.state.setConfirm({
      text:body,style:{background:'#fff',height:'fit-content'},
      buttons:[
        {text:'بستن'}
      ]  
    })
  }
  getContext(){
    
    return {
      ...this.state,
      confirm:({type,text,subtext})=>{
        this.setConfirm({type,text,subtext})
      }
    }
  }
  render(){
    let {navId,addPopup} = this.state;
    return (
      <AppContext.Provider value={this.getContext()}>
        <RVD
          layout={{
            column:[
              {size:60,html:(
                <>
                  <img src={headerSrc} width='100%'/>
                  <img src={titleSrc} width='140' height='24' style={{position:'absolute',right:12,top:24}}/>
                </>
              )},
              {
                flex:1,
                html:(
                  <RSA
                    style={{height:'calc(100% - 60px)',top:60}}
                    rtl={true}
                    navId={navId}
                    navs={[
                      {text:'میز کار',id:'mize_kar',icon:()=><Icon path={mdiCheckbook } size={1.5}/>},
                      {text:'تاریخچه',id:'tarikhche',icon:()=><Icon path={mdiHistory} size={1.5}/>}
                    ]}
                    header={()=>{
                      return (
                        <RVD
                          layout={{
                            row:[
                              {html:<Icon path={mdiBell} size={0.7}/>,attrs:{
                                onClick:()=>{
                                  addPopup({
                                    style:{background:'#fff'},
                                    title:'اعلان ها',
                                    type:'fullscreen',
                                    content:()=>{
                                      return <Notification/>
                                    }
                                  })
                                }
                              }}
                            ]
                          }}
                        />
                      )
                    }}
                    changeNavId={(navId)=>this.setState({navId})}
                    body={()=>{
                      let {navId} = this.state;
                      if(navId === 'mize_kar'){return <Mozakerat key='mize_kar' mode='mize_kar'/>}
                      if(navId === 'tarikhche'){return <Mozakerat key='tarikhche' mode='tarikhche'/>}
                    }}
                    getActions={(obj)=>this.setState(obj)}
                  />
                )
              }
            ]
          }}
        />
      </AppContext.Provider>   
    );
  }
}