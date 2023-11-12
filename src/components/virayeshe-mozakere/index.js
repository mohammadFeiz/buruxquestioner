import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import AIOInput from 'aio-button';
import AppContext from '../../app-context';
import './index.css';
export default class VirayesheMozakere extends Component{
    static contextType = AppContext
    constructor(props){
        super(props);
        this.state = {description:'',mozakere_konande:false}
    }
    getSvg(type){
        if(type === 'user'){
            return (
                <svg width="53" height="53" viewBox="0 0 53 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="53" height="53" rx="26.5" fill="white"></rect>
                    <path d="M23.25 20.25C23.25 18.0132 24.7632 16.5 27 16.5C29.2368 16.5 30.75 18.0132 30.75 20.25C30.75 22.4868 29.2368 24 27 24C24.7632 24 23.25 22.4868 23.25 20.25ZM20.75 20.25C20.75 23.7149 23.5351 26.5 27 26.5C30.4649 26.5 33.25 23.7149 33.25 20.25C33.25 16.7851 30.4649 14 27 14C23.5351 14 20.75 16.7851 20.75 20.25ZM17 34C17 32.0482 21.057 30.25 27 30.25C32.943 30.25 37 32.0482 37 34V36.5H17V34ZM14.5 34V36.5C14.5 37.8816 15.6184 39 17 39H37C38.4035 39 39.5 37.9035 39.5 36.5V34C39.5 30.2061 33.6447 27.75 27 27.75C20.3553 27.75 14.5 30.2061 14.5 34Z" fill="#005478"></path>
                </svg>
            )
        }
        if(type === 'close'){
            return (
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.2982 15.7018L28.2982 29.7018C28.4737 29.8947 28.7193 30 29 30C29.5439 30 30 29.5439 30 29C30 28.7193 29.8947 28.4737 29.7018 28.2982L15.7018 14.2982C15.5263 14.1053 15.2807 14 15 14C14.4561 14 14 14.4561 14 15C14 15.2807 14.1053 15.5263 14.2982 15.7018ZM28.2982 14.2982L14.2982 28.2982C14.1053 28.4737 14 28.7193 14 29C14 29.5439 14.4561 30 15 30C15.2807 30 15.5263 29.8947 15.7018 29.7018L29.7018 15.7018C29.8947 15.5263 30 15.2807 30 15C30 14.4561 29.5439 14 29 14C28.7193 14 28.4737 14.1053 28.2982 14.2982Z" fill="white"></path>
                    <rect x="0.5" y="0.5" width="43" height="43" rx="21.5" stroke="white"></rect>
                </svg>
            )
        }
        if(type === 'submit'){
            return (
                <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.2982 21.7018L19.193 27.5965C19.6316 28.0526 20.3684 28.0526 20.807 27.5965L30.7018 17.7018C30.8947 17.5263 31 17.2807 31 17C31 16.4561 30.5439 16 30 16C29.7193 16 29.4737 16.1053 29.2982 16.2982L19.4035 26.193C19.1754 26.4211 20.8246 26.4211 20.5965 26.193L14.7018 20.2982C14.5263 20.1053 14.2807 20 14 20C13.4561 20 13 20.4561 13 21C13 21.2807 13.1053 21.5263 13.2982 21.7018Z" fill="white"></path>
                    <rect x="0.5" y="0.5" width="43" height="43" rx="21.5" stroke="white"></rect>
                </svg>
            )
        }
    }
    title_layout(){
        let {type} = this.props;
        let title = {
            'erja':'ارجاع به مذاکره کننده دیگر',
            'enseraf':'انصراف از مذاکره',
        }[type];
        return {html:title,}
    }
    user_layout(){
        let {object} = this.props;
        let {name,company} = object;
        return {
            row:[
                {html:this.getSvg('user')},
                {size:6},
                {
                    column:[
                        {flex:1},
                        {html:name,className:'size16'},
                        {html:company,className:'size12'},
                        {flex:1}
                    ]
                }
            ]
        }
    }
    description_layout(){
        let {description} = this.state;
        return {
            html:(
                <textarea className='enseraf-description' value={description} onChange={(e)=>this.setState({description:e.target.value})}/>
            )
        }   
    }
    mozakereKonande_layout(){
        function getText(o){
            return `${o.name} - ${o.city} - میز ${o.table}`
        }
        let {mozakere_konandegan} = this.context;
        let {mozakere_konande} = this.state;
        return {
            html:(
                <AIOInput
                    type='select'
                    popover={{fitHorizontal:true,attrs:{className:'mozakere-konande-popover'}}}
                    className='mozakere-konande-select'
                    options={mozakere_konandegan}
                    optionText={(o)=>getText(o)}
                    optionValue='option.id'
                    optionStyle='{color:"#fff"}'
                    text={mozakere_konande === false?'جستجوی مذاکره کننده':getText(mozakere_konandegan.find((o)=>o.id === mozakere_konande))}
                    onChange={(mozakere_konande)=>this.setState({mozakere_konande})}
                />
            )
        }
    }
    input_layout(){
        let {type} = this.props;
        let input,title;
        if(type === 'erja'){
            return {
                column:[
                    {
                        column:[
                            {html:'علت ارجاع را وارد کنید (حداقل 10 کاراکتر) :',className:'size16'},
                            {size:8},
                            this.description_layout()        

                        ]
                    },
                    
                    {size:24},
                    {
                        column:[
                            {html:'مذاکره کننده مورد نظر را انتخاب کنید :',className:'size16'},
                            {size:8},
                            this.mozakereKonande_layout()        
        
                        ]
                    },
                ]
            }
        }
        else if(type === 'enseraf'){
            return {
                column:[
                    {html:'علت انصراف را وارد کنید (حداقل 10 کاراکتر) :',className:'size16'},
                    {size:8},
                    this.description_layout()        
                ]
            }
        }
        
    }
    action_layout(){
        let {apis,rsa,mozakere_konandegan} = this.context;
        let {type,object,onRemove} = this.props;
        let {mozakere_konande,description} = this.state;
        let canSubmit = false,onClick = ()=>{};
        if(type === 'erja'){
            canSubmit = mozakere_konande !== false;
            onClick = ()=>{
                let obj = mozakere_konandegan.find((o)=>o.id === mozakere_konande)
                apis.request({
                    api:'erja',description:'ارجاع',parameter:{object,mozakere_konande: obj,description},
                    onSuccess:()=>{rsa.removeModal(); onRemove();},
                    message:{success:`ارجاع به ${obj.name} انجام شد`}
                });
            }    
        }
        else if(type === 'enseraf'){
            canSubmit = description.length >= 10    
            onClick = ()=>{
                apis.request({
                    api:'enseraf',description:'انصراف',parameter:{object,description},
                    onSuccess:()=>{
                        rsa.removeModal(); 
                        onRemove(); 
                    },
                    message:{success:true}
                });
            }
        } 
        return {
            row:[
                {flex:1},
                {show:canSubmit,html:()=>this.getSvg('submit'),style:{margin:'0 24px'},onClick},
                {html:this.getSvg('close'),style:{margin:'0 24px'},onClick:()=>rsa.removeModal()},
                {flex:1}
            ]
        }
    }
    render(){
        return (
            <RVD
                layout={{
                    style:{color:'#fff',background:'rgba(11, 79, 73, 0.376)',height:'100%',padding:24},
                    className:'size18',
                    column:[
                        {size:60},
                        this.title_layout(),
                        {size:16},
                        this.user_layout(),
                        {size:24},
                        this.input_layout(),
                        {flex:1},
                        this.action_layout(),
                        {size:72}
                    ]
                }}
            />
        )
    }
}