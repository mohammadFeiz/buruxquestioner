import React,{Component} from "react";
import RSA from './npm/react-super-app/react-super-app';
import Mozakerat from "./components/mozakerat/index";
import AppContext from "./app-context";
import AIOService from 'aio-service';
import {Icon} from '@mdi/react';
import {mdiBell,mdiThumbUpOutline,mdiThumbDownOutline,mdiPhone,mdiStarOutline,mdiHistory,mdiCheckbook, mdiAccount} from '@mdi/js';
import RVD from 'react-virtual-dom';
import Notification from './components/notification/index';
import getApiFunctions from './apis';
import headerSrc from './images/header.png';
import titleSrc from './images/title.png';
import AIOInput from './npm/aio-input/aio-input';
import RKS from 'react-keycloak-spa';
import AIOLoading from 'aio-loading';
import "./index.css";
AIOInput.defaults.validate = true;
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
      rsa:new RSA({
        id:'buruxnegotiator',
        rtl:true,
        nav:{
          id:'mize_kar',
          items:[
            {text:'میز کار',id:'mize_kar',icon:()=><Icon path={mdiCheckbook } size={0.7}/>},
            {text:'تاریخچه',id:'tarikhche',icon:()=><Icon path={mdiHistory} size={0.7}/>}
          ],
          header:()=>{
            return (
              <RVD
                layout={{
                  column:[
                    {size:24},
                    {html:'BURUX',align:'h',className:'bold h-36',style:{color:'orange',fontSize:30}},
                    {html:'Negotiator',align:'h',style:{color:'#fff',fontSize:14,letterSpacing:3}},
                    {size:24}
                  ]
                }}
              />
            )
          }
        },
        headerContent:()=><Header/>,
        body:({navId})=><Mozakerat key={navId} mode={navId}/>
      }),
      access,
      client_id,
      roles: keycloak.tokenParsed.resource_access.exhibition.roles,
      name:keycloak.tokenParsed.name,
      username:keycloak.tokenParsed.username,
      token: keycloak.token,
      logout:keycloak.logout,
      apis:new AIOService({
        id:'buruxnegotiator',
        getApiFunctions,
        token:keycloak.token
      }),
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
    this.state.apis.setProperty('getState',()=>this.state)
  }
  async get_mozakere_konandegan(){
    let {apis} = this.state;
    apis.request({
      api:'mozakere_konandegan',description:'دریافت لیست مذاکره کنندگان',def:[],
      onSuccess:(mozakere_konandegan)=>this.setState({mozakere_konandegan})
    });
  }
  componentDidMount(){
    this.get_mozakere_konandegan();
  }
  getContext(){
    return {
      ...this.state
    }
  }
  render(){
    let {rsa} = this.state
    return (
      <AppContext.Provider value={this.getContext()}>
        {rsa.render()}
      </AppContext.Provider>   
    );
  }
}
class Header extends Component{
  static contextType = AppContext;
  render(){
    let {rsa, name, logout} = this.context;
    return (
      <RVD
        layout={{
          gap: 6,
          row:[
            {align: 'vh', html:<Icon  path={mdiBell} size={0.7}/>,attrs:{
              onClick:()=>rsa.addModal({header:{title:'اعلان ها'},body:{render:()=><Notification/>}})
            }},
            {
              html: (
                <AIOInput 
                  className='profile-button'  
                  popover={{fitHorizontal:false,attrs:{style:{width:160}}}}
                  before={<Icon path={mdiAccount} size={.8}/>}
                  type='select' text={name}
                  options={[{text:'خروج از حساب کاربری' ,value:'logout'}]}
                  onChange={(value)=>{if (value === 'logout'){logout()}}}
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


