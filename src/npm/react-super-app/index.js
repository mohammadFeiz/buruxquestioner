import React,{Component,createRef} from 'react';
import AIOButton from 'aio-button';
import {Icon} from '@mdi/react';
import {mdiMenu,mdiClose,mdiChevronRight,mdiChevronLeft} from '@mdi/js';
import RVD from 'react-virtual-dom';
import $ from 'jquery';
import './index.css';

export default class SuperApp extends Component {
    constructor(props){
      super(props);
      let {touch = 'ontouchstart' in document.documentElement} = this.props;
      this.state = {
        confirm:false,
        touch,
        popups:[],
        sideOpen:false,
        addPopup:(o)=>this.setState({popups:this.state.popups.concat(o)}),
        removePopup:()=>{
          let {popups} = this.state;
          popups.pop();
          this.setState({popups})
        },
        setConfirm:(confirm)=>this.setState({confirm}),
      }
      props.getActions({...this.state})
    }
    navigation_layout() {
      let {navs = [],logo,title,subtitle,changeNavId,navId} = this.props;
      if(!navs.length){return false}
      let {touch} = this.state;
      let props = {navs,navId,onChange:(navId)=>changeNavId(navId),logo,title,subtitle,touch}
      return {html: (<Navigation {...props}/>)};
    }
    page_layout(nav){
      let {body} = this.props;
      return {flex:1,column:[this.header_layout(nav),{flex:1,html:<div className='rsa-body'>{body()}</div>}]} 
    }
    header_layout(nav){
        let {touch} = this.state;
        let {header,sides = []} = this.props;
        return {
          style:{flex:'none'},align:'v',className:'rsa-header' + (touch?' touch-mode':''),
          row:[
            {show:!!sides.length,html:<Icon path={mdiMenu} size={1}/>,align:'vh',attrs:{onClick:()=>this.setState({sideOpen:!this.state.sideOpen})}},
            {show:!!sides.length,size:12},
            {flex:1,html:nav.text,className:'rsa-header-title'},
            {show:!!header,html:()=>header(this.state)} 
          ]
        }
    }
    render() {
      let {confirm,popups,removePopup,touch,sideOpen} = this.state;
      let {navs,navId,sides = [],sideId,rtl,sideHeader,style} = this.props;
      let nav = navs.find((o)=>o.id === navId);
      return (
        <>
          {touch && <RVD layout={{style,className: 'rsa' + (rtl?' rtl':' ltr') + (popups.length?' has-opened-popup':''),column: [this.page_layout(nav),this.navigation_layout()]}}/>}
          {!touch && <RVD layout={{style,className: 'rsa' + (rtl?' rtl':' ltr') + (popups.length?' has-opened-popup':''),row: [this.navigation_layout(),this.page_layout(nav)]}}/>}
          {popups.length && popups.map((o,i)=><Popup key={i} {...o} index={i} removePopup={()=>removePopup()} rtl={rtl}/>)}
          {confirm && <Confirm {...confirm} onClose={()=>this.setState({confirm:false})}/>}
          {sides.length && sideOpen && <SideMenu sideHeader={sideHeader} sides={sides} sideId={sideId} sideOpen={sideOpen} rtl={rtl} onClose={()=>this.setState({sideOpen:false})}/>}
          <Loading />
        </>
      );
    }
  }
  class Navigation extends Component {
    header_layout() {
      let {logo,title,subtitle} = this.props;
      return {
        align: 'vh',gap:12,
        row: [
          { html: logo,show:!!logo },
          {
            column: [
              { flex: 1 },
              { html: title, className: 'rsa-navigation-title' },
              { html: subtitle,show:!!subtitle, className: 'rsa-navigation-subtitle' },
              { flex: 1 },
            ],
          },
        ],
      };
    }
    items_layout(){
      let {navs,onChange,navId} = this.props;
      return {
        gap:12,
        column:navs.map(({icon,text,id},i)=>{
          let active = id === navId;
          return {
            size:36,className:'rsa-navigation-item' + (active?' active':''),attrs:{onClick:()=>onChange(id)},
            row:[
              {show:!!icon,size:48,html:icon(active),align:'vh'},
              {html:text,align:'v'}
            ]
          }
        })
      }
    }
    bottomMenu_layout({icon,text,id}){
      let {navId,onChange} = this.props;
      let active = id === navId;
      return {
          flex:1,className:'rsa-bottom-menu-item' + (active?' active':''),attrs:{onClick:()=>onChange(id)},
          html:icon(active),align:'vh'
      }
    }
    render() {
      let {touch,navs} = this.props;
      if(touch){
        return (<RVD layout={{className: 'rsa-bottom-menu',row: navs.map((o)=>this.bottomMenu_layout(o))}}/>)
      }
      return (<RVD layout={{className: 'rsa-navigation',column: [{size:24},this.header_layout(),{size:24},this.items_layout()]}}/>);
    }
  }
  class SideMenu extends Component {
    state = {open:false}
    header_layout() {
      let {sideHeader} = this.props;
      if(!sideHeader){return false}
      return {align: 'vh',gap:12,html: sideHeader()};
    }
    items_layout(){
      let {sides,onChange,sideId} = this.props;
      return {
        gap:12,
        column:sides.map(({icon,text,id},i)=>{
          let active = id === sideId;
          return {
            size:36,className:'rsa-sidemenu-item' + (active?' active':''),attrs:{onClick:()=>onChange(id)},
            row:[
              {show:!!icon,size:48,html:icon(active),align:'vh'},
              {html:text,align:'v'}
            ]
          }
        })
      }
    }
    
    componentDidMount(){
      setTimeout(()=>this.setState({open:true}),0)  
    }
    render() {
      let {onClose,rtl} = this.props;
      let {open} = this.state;
      return (
          <RVD 
            layout={{
              className: 'rsa-sidemenu-container' + (open?' open':'') + (rtl?' rtl':' ltr'),
              row:[
                {className: 'rsa-sidemenu',column: [{size:24},this.header_layout(),{size:24},this.items_layout()]},
                {flex:1,attrs:{onClick:()=>onClose()}}
              ]
            }} 
          />
      );
    }
  }

  class Loading extends Component{
    cubes2(obj = {}){
      var {count = 5,thickness = [5,16],delay = 0.1,borderRadius = 0,colors = ['dodgerblue'],duration = 1,gap = 3} = obj;
      let Thickness = Array.isArray(thickness)?thickness:[thickness,thickness];
      let getStyle1 = (i)=>{
        return {
          width:Thickness[0],height:Thickness[1],background:colors[i % colors.length],margin:`0 ${gap/2}px`,
          animation: `${duration}s loadingScaleY infinite ease-in-out ${i * delay + 1}s`,
          borderRadius:borderRadius + 'px'
        }
      }
      let chars = ['B','U','R','U','X']
      let items = [];
      for(var i = 0; i < count; i++){
        items.push(<div key={i} className='cube' style={getStyle1(i)}>{chars[i]}</div>)
      }
      return (
        <div className="rect" style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'transparent'}}>
          {items}
        </div>
      )
    }
    
    render(){
      return (
        <div className='loading'>
          {this.cubes2({thickness:[12,90],colors:['transparent']})}
        </div>
      );
    }
  }
  export function splitNumber(price,count = 3,splitter = ','){
    if(!price){return price}
    let str = price.toString()
    let dotIndex = str.indexOf('.');
    if(dotIndex !== -1){
        str = str.slice(0,dotIndex)
    }
    let res = ''
    let index = 0;
    for(let i = str.length - 1; i >= 0; i--){
        res = str[i] + res;
        if(index === count - 1){
            index = 0;
            if(i > 0){res = splitter + res;}
        }
        else{index++}
    }
    return res
  }
//tabs,content,onClose,title
class Popup extends Component{
    constructor(props){
      super(props);
      this.dom = createRef();
      this.state = {activeTabIndex:0};
      this.dui = 'a' + Math.random()

    }
    header_layout(){
      let {removePopup,onClose = ()=>removePopup(),title,header,onBack,rtl} = this.props;
      if(header === false){return false}
      return {
        size:48,className:'rsa-popup-header',
        row:[
          {show:!!onBack,size:36,html:<Icon path={rtl?mdiChevronRight:mdiChevronLeft} size={1}/>,align:'vh',attrs:{onClick:()=>onBack()}},
          {flex:1,html:title,align:'v',className:'rsa-popup-title'},
          {show:!!header,html:()=><div style={{display:'flex',alignItems:'center'}}>{header()}</div>},
          {show:onClose !== false,size:36,html:<Icon path={mdiClose} size={0.8}/>,align:'vh',attrs:{onClick:()=>onClose()}}
        ]
      }
    }
    body_layout(){return {flex:1,column:[this.tabs_layout(),this.content_layout()]}}
    tabs_layout(){
      let {tabs} = this.props;
      if(!tabs){return false}
      let {activeTabIndex} = this.state;
      return {html:(<AIOButton type='tabs' options={tabs.map((o,i)=>{return {text:o,value:i}})} value={activeTabIndex} onChange={(activeTabIndex)=>this.setState({activeTabIndex})}/>)}
    }
    content_layout(){
      let {tabs,content} = this.props;
      let Content;
      if(tabs){
        let {activeTabIndex} = this.state;
        Content = content(activeTabIndex)
      }
      else {Content = content()}
      if(Content === 'loading'){return {flex:1,html:'در حال بارگزاری',align:'vh'}}
      if(Content === 'empty'){return {flex:1,html:'موردی موجود نیست',align:'vh'}}
      return {flex:1,html:<div className='rsa-popup-body'>{Content}</div>}
    }
    getClassName(){
      let {type} = this.props;
      let className = 'rsa-popup-container';
      if(type === 'fullscreen'){className += ' fullscreen'}
      if(type === 'bottom'){className += ' bottom-popup'}
      return className
    }
    backClick(e){
      let target = $(e.target);
      if(target.hasClass(this.dui)){return}
      let parents = target.parents('.rsa-popup');
      if(parents.hasClass(this.dui)){return}
      let {removePopup,onClose = ()=>removePopup(),backClose} = this.props;
      if(onClose === false){return}
      if(!backClose){return}
      onClose();
    }
    render(){
      let {rtl} = this.props;
      return (  
        <div className={this.getClassName()} onClick={(e)=>this.backClick(e)}>
          <RVD layout={{className:'rsa-popup' + (rtl?' rtl':' ltr') + (' ' + this.dui),style:{flex:'none'},column:[this.header_layout(),this.body_layout()]}}/>  
        </div>
      )
    }
  }


  export class Confirm extends Component{
    constructor(props){
      super(props);
    }
    header_layout(){
      let {onClose,title} = this.props;
      if(!title){return false}
      return {
        size:48,className:'rsa-popup-header',
        row:[
          {flex:1,html:title,align:'v',className:'rsa-popup-title'},
          {size:48,html:<Icon path={mdiClose} size={0.8}/>,align:'vh',attrs:{onClick:()=>onClose()}}
        ]
      }
    }
    body_layout(){
      let {text} = this.props;
      return {flex:1,html:text,scroll:'v',className:'rsa-popup-body'}
    }
    onSubmit(){
      let {onClose,onSubmit} = this.props;
      onSubmit();
      onClose();
    }
    footer_layout(){
      let {buttons,onClose=()=>{}} = this.props;
      return {
        gap:12,
        size:48,
        align:'v',
        style:{padding:'0 12px'},
        row:buttons.map(({text,onClick = ()=>{}})=>{
          return {html:(
            <button 
              className='rsa-popup-footer-button' 
              onClick={()=>{onClick(); onClose()}}
            >{text}</button>
          )}
        }) 
      }
    }
    render(){
      let {style = {width:400,height:300}} = this.props;
      return (  
        <div className='rsa-popup-container'>
          <RVD layout={{className:'rsa-popup rsa-confirm',style:{flex:'none',...style},column:[this.header_layout(),this.body_layout(),this.footer_layout()]}}/>  
        </div>
      )
    }
  }