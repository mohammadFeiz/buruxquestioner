import React,{Component} from "react";
import RSA from 'react-super-app';
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
import RKS from 'react-keycloak-spa';
import "./index.css";

export default class App extends Component{
  render(){
    return (
      <RKS
        config={{
          url: "https://iam.burux.com/auth",
          realm: "master",
          clientId: "exhibition"
        }}
        component={Main}
      />
    )
  }
}
class Main extends Component {
  constructor(props){
    super(props);
    this.state = {
      services:AIOService({getState:()=>this.state,apis}),
      mozakereStatuses:[
        {value:'0',text:'در انتظار مذاکره',color:'#108ABE'},
        {value:'1',text:'در حال مذاکره',color:'#CD9100'},
        {value:'2',text:'پایان مذاکره',color:'#107C10'},
        {value:'3',text:'ارجاع شده به دیگری',color:'#814696'},
        {value:'4',text:'انصراف از مذاکره',color:'#A4262C'},
      ],
      results:[
        {value:'all',text:'همه نتیجه ها'},
        {value:'0',text:'موفق ها',presentation:(o)=><Result color='#107C10' path={mdiThumbUpOutline} text='موفق'/>},
        {value:'1',text:'نا موفق ها',presentation:(o)=><Result color='#BE0000' path={mdiThumbDownOutline} text='نا موفق'/>},
        {value:'2',text:'نیاز به تماس ها',presentation:(o)=><Result color='#2BA4D8' path={mdiPhone} text='نیاز به تماس'/>},
        {value:'3',text:'نیاز به پیگیری ها',presentation:(o)=><Result color='#FF7A00' path={mdiStarOutline} text='نیاز به پیگیری'/>}
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
  setConfirm({type,text,subtext}){
    let path,color;
    if(type === 'success'){
      path = mdiCheckCircleOutline;
      color = 'green';
    }
    else if(type === 'error'){
      path = mdiClose;
      color = 'red';
    }
    let body = (
      <RVD
        layout={{
          column:[
            {size:36},
            {html:<Icon path={path} size={3}/>,style:{color},align:'vh'},
            {size:12},
            {html:text,style:{color},align:'vh'},
            {size:12},
            {html:subtext,align:'vh',className:'size10'}
          ]
        }}
      />
    )
    this.state.setConfirm({text:body,style:{background:'#fff',height:'fit-content'},buttons:[{text:'بستن'}]})
  }
  getContext(){
    return {
      ...this.state,
      confirm:({type,text,subtext})=>{
        this.setConfirm({type,text,subtext})
      }
    }
  }
  header_layout(){
    return {
      size:60,
      html:(
        <>
          <img src={headerSrc} width='100%'/>
          <img src={titleSrc} width='140' height='24' style={{position:'absolute',right:12,top:24}}/>
        </>
      )
    }
  }
  body_layout(){
    let navs = [
      {text:'میز کار',id:'mize_kar',icon:()=><Icon path={mdiCheckbook } size={1.5}/>},
      {text:'تاریخچه',id:'tarikhche',icon:()=><Icon path={mdiHistory} size={1.5}/>}
    ]
    return {
      flex:1,
      html:(
        <RSA
          style={{height:'calc(100% - 60px)',top:60}}
          rtl={true}
          navs={navs}
          header={({addPopup})=><Header addPopup={addPopup}/>}
          body={({navId})=><Mozakerat key={navId} mode={navId}/>}
          getActions={(obj)=>this.setState(obj)}
        />
      )
    }
  }
  render(){
    return (
      <AppContext.Provider value={this.getContext()}>
        <RVD layout={{column:[this.header_layout(),this.body_layout()]}}/>
      </AppContext.Provider>   
    );
  }
}
class Header extends Component{
  render(){
    let {addPopup} = this.props;
    return (
      <RVD
        layout={{
          row:[
            {html:<Icon path={mdiBell} size={0.7}/>,attrs:{
              onClick:()=>{
                addPopup({
                  style:{background:'#fff'},title:'اعلان ها',type:'fullscreen',
                  content:()=><Notification/>
                })
              }
            }}
          ]
        }}
      />
    )
  }
}

class Result extends Component{
  render(){
    let {color,path,text} = this.props;
    return (
      <RVD layout={{
        style:{color},
        className:'size12',
        gap:3,
        row:[
          {html:'نتیجه:',align:'v'},
          {html:text,align:'v'},
          {html:<Icon path={path} size={0.7}/>,align:'vh'}
        ]
      }}/>
    )
  }
}