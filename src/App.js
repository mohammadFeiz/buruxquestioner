import React,{Component} from "react";
import RSA from 'react-super-app';
import Mozakerat from "./components/mozakerat/index";
import AppContext from "./app-context";
import AIOService from 'aio-service';
import {Icon} from '@mdi/react';
import {mdiBell,mdiThumbUpOutline,mdiThumbDownOutline,mdiPhone,mdiStarOutline,mdiHistory,mdiCheckbook} from '@mdi/js';
import RVD from 'react-virtual-dom';
import Notification from './components/notification/index';
import apis from './apis';
import headerSrc from './images/header.png';
import titleSrc from './images/title.png';
import AIOButton from 'aio-button';
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
    let {keycloak} = this.props;
    let access = false
    let roles = keycloak.tokenParsed.roles
    access = roles.indexOf('negotiator') !== -1 || roles.indexOf('admin') !== -1
    let client_id;
    if(roles.indexOf('burux') !== -1){
      client_id = 1
    } 
    else if(roles.indexOf('aria') !== -1){
      client_id = 2
    } 
    else if(roles.indexOf('paydar') !== -1){
      client_id = 3
    }
    
    this.state = {
      access,
      client_id,
      roles: keycloak.tokenParsed.resource_access.exhibition.roles,
      name:keycloak.tokenParsed.name,
      username:keycloak.tokenParsed.username,
      token: keycloak.token,
      logout:keycloak.logout,
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
    let {services,setConfirm} = this.state;
    let res = await services({type:'mozakere_konandegan'});
    if(typeof res === 'string'){
      setConfirm({type:'error',text:'دریافت لیست مذاکره کنندگان با خطا مواجه شد',subtext:res})
    }
    else {
      this.setState({mozakere_konandegan:res})
    }
  }
  componentDidMount(){
    this.get_mozakere_konandegan();
  }
  getContext(){
    return {
      ...this.state
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
    let {name, logout} = this.state
    return {
      flex:1,
      html:(
        <RSA
          style={{height:'calc(100% - 60px)',top:60}}
          rtl={true}
          navs={navs}
          header={({addPopup})=><Header addPopup={addPopup} name = {name} logout = {logout} />}
          body={({navId})=><Mozakerat key={navId} mode={navId}/>}
          getActions={(obj)=>this.setState(obj)}
        />
      )
    }
  }
  render(){
    let {name, access} = this.state;
    // if(access === false){
    //   return (
    //     <div 
    //       style={{
    //         position:'fixed',width:'100%',height:'100%',left:0,top:0,fontWeight:'bold',fontSize:18,
    //         display:'flex',alignItems:'center',justifyContent:'center'
    //       }}
    //     >'شما دسترسی به این اپلیکیشن ندارید'</div>        
    //   )
    // }
    return (
      <AppContext.Provider value={this.getContext()}>
        <RVD layout={{column:[this.header_layout(),this.body_layout()]}}/>
      </AppContext.Provider>   
    );
  }
}
class Header extends Component{
  render(){
    let {addPopup, name, logout} = this.props;
    return (
      <RVD
        layout={{
          gap: 6,
          row:[
            {align: 'vh', html:<Icon  path={mdiBell} size={0.7}/>,attrs:{
              onClick:()=>{
                addPopup({
                  style:{background:'#fff'},title:'اعلان ها',type:'fullscreen',
                  content:()=><Notification/>
                })
              }
            }},
            {
              html: (
                <AIOButton 
                  type='select'
                  text={name}
                  options={[
                    {text:'خروج از حساب کاربری' ,value:'logout'}
                  ]}
                  onChange={
                    (value)=>{
                      if (value === 'logout'){
                        logout()
                      }
                    }
                  }
                />
              ), align: 'v'
            }
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