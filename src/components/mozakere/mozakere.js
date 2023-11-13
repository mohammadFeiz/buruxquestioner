import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import Form from 'aio-form-react';
import AIOInput from '../../npm/aio-input/aio-input';
import {Icon} from '@mdi/react';
import {mdiChevronRight,mdiPlusCircle,mdiDelete,mdiPrinter} from '@mdi/js';
import AppContext from '../../app-context';
import titleSrc from './../../images/title2.png';
import './index.css';
import $ from 'jquery';
export default class Mozakere extends Component{
    static contextType = AppContext;
    constructor(props){
        super(props);
        this.state = {
            initModel:JSON.stringify(props.form.model),
            model:{...props.form.model}
        }
    }
    print(){
        let myWindow=window.open('','',"width="+window.screen.availWidth+",height="+window.screen.availHeight);
        myWindow.document.write(document.getElementsByTagName('head')[0].innerHTML);
        myWindow.document.write($('.mozakere-form').html());




        myWindow.focus();
        myWindow.print(); 
        myWindow.close();
    }
    resetForm(){
        this.setState({model:JSON.parse(this.state.initModel)})
    }
    header_layout(){
        let {rsa} = this.context;
        let {form,disabled} = this.props;
        return {
            size:48,
            className:'padding-0-12',
            style:{borderBottom:'1px solid #ccc'},
            row:[
                {
                    align:'v',flex:1,onClick:()=>rsa.removeModal(),
                    row:[
                        {size:24,html:<Icon path={mdiChevronRight} size={0.8}/>,align:'vh'},
                        {html:'بستن',className:'bold'}
                    ]
                },
                {align:'v',html:form.title,className:'size16 bold'},
                {
                    align:'v',flex:1,
                    row:[
                        {flex:1},
                        {html:<Icon path={mdiPrinter} size={1}/>,attrs:{onClick:()=>this.print()}},
                        {size:6},
                        {show:!!!disabled,html:<button className='reset-form-button' onClick={()=>this.resetForm()}>پاک کردن فرم</button>}
                    ]
                }
            ]
        }
    }
    details_layout(){
        let {name,city,mobile,activityZone,company,phone,cardCode} = this.props;
        return {
            className:'padding-12',
            style:{
                borderTop:'1px solid #ccc',
                borderBottom:'1px solid #ccc',
            },
            column:[
                {size:30,align:'v',row:[{html:'نام و نام خانوادگی :'},{html:name}]},
                {size:30,align:'v',row:[{html:'شهر :'},{html:city}]},
                {size:30,align:'v',row:[{html:'شماره همراه :'},{html:mobile}]},
                {size:30,align:'v',row:[{html:'حوزه فعالیت :'},{html:activityZone}]},
                {size:30,align:'v',row:[{html:'شرکت/فروشگاه :'},{html:company}]},
                {size:30,align:'v',row:[{html:'شماره ثابت :'},{html:phone}]},
                {size:30,align:'v',row:[{html:'کارت کد :'},{html:cardCode}]}
            ]
        }
    }
    form_layout1(){
        let {model} = this.state;
        let {disabled} = this.props;
        return {
            html:(
                <Form1
                    onChange={(model)=>this.setState({model})}
                    model={model}
                    disabled={disabled}
                />
            )
        }
    }
    form_layout2(){
        let {model} = this.state;
        let {disabled} = this.props;
        return {
            html:(
                <Form2
                    onChange={(model)=>this.setState({model})}
                    model={model}
                    disabled={disabled}
                />
            )
        }
    }
    form_layout3(){
        let {model} = this.state;
        let {disabled} = this.props;
        return {
            html:(
                <Form3
                    onChange={(model)=>this.setState({model})}
                    model={model}
                    disabled={disabled}
                />
            )
        }
    }
    form_layout4(){
        let {model} = this.state;
        let {disabled} = this.props;
        return {
            html:(
                <Form4
                    onChange={(model)=>this.setState({model})}
                    model={model}
                    disabled={disabled}
                />
            )
        }
    }
    form_layout5(){
        let {model} = this.state;
        let {disabled} = this.props;
        return {
            html:(
                <Form5
                    onChange={(model)=>this.setState({model})}
                    model={model}
                    disabled={disabled}
                />
            )
        }
    }
    form_layout(){
        let {form} = this.props;
        return this['form_layout' + form.type]()
    }
    async submit(mode){
        let {apis,rsa} = this.context;
        let {form} = this.props;
        let {model} = this.state;
        apis.request({
            api:'sabte_mozakere',description:mode === 'submit'?'ثبت مذاکره':'پیشنویس مذاکره',parameter:{mode,type:form.type,model},
            onSuccess:()=>rsa.removeModal(),message:{success:true}
        })
    }
    footer_layout(){
        let {model} = this.state;
        let {disabled,mode} = this.props;
        return {
            gap:12,
            column:[
                {size:36},
                {show:!!!disabled,html:<button disabled={!!!model.natije_mozakere} onClick={()=>this.submit('submit')} className='form-submit'>{mode === 'virayeshe_payan_yafte'?'بروزرسانی':'ثبت و اتمام مذاکره'}</button>},
                {show:mode !== 'virayeshe_payan_yafte' && !!!disabled,html:<button disabled={!!!model.natije_mozakere} onClick={()=>this.submit('draft')} className='form-draft'>ثبت به عنوان پیشنویس</button>},
                {size:168,align:'vh',html:<img src={titleSrc} alt=''/>}
            ]
        }
    }
    render(){
        return (
            <RVD
                layout={{
                    style:{background:'#fff',height:'90%',maxWidth:560,borderRadius:16},
                    className:'size12 mozakere-form ofy-auto',
                    column:[
                        this.header_layout(),
                        {
                            flex:1,className:'ofy-auto',
                            column:[
                                this.details_layout(),
                                this.form_layout(),
                                this.footer_layout()
                            ]
                        }
                        
                    ]
                }}
            />
        )
    }
}


class Form1 extends Component{
    constructor(props){
        super(props);
        this.state = {
            darsade_forooshe_led_na_shenakhte_options:[
                {value:'0',text:'5 تا 10 درصد'},
                {value:'1',text:'10 تا 20 درصد'},
                {value:'2',text:'20 تا 60 درصد'},
                {value:'3',text:'بیشتر از 60 درصد'}
            ],
            sahme_forooshe_lamp_ta_2_sale_ayande_options:[
                {value:'0',text:'کمتر از 20 درصد'},
                {value:'1',text:'بین 20 تا 40 درصد'},
                {value:'2',text:'بین 40 تا 60 درصد'},
                {value:'3',text:'بیشتر از 60 درصد'}
            ],
            natije_mozakere_options:[
                {value:'0',text:'موفق'},
                {value:'1',text:'ناموفق'},
                {value:'2',text:'نیاز به پیگیری'},
                {value:'3',text:'نیاز به تماس'}
            ]
        }
    }
    getLabel(text,num){
        return (
            <div style={{display:'flex',alignItems:'center',minHeight:36}}>
                <div 
                    style={{
                        width:20,height:20,background:'#4ECCC1',borderRadius:4,flexShrink:0,
                        color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'
                    }}
                >{num}</div>
                <div style={{width:4,flexShrink:0}}></div>
                <div className='bold'>{text}</div>
            </div>
        )
    }
    body_layout(){
        let {
            darsade_forooshe_led_na_shenakhte_options,
            sahme_forooshe_lamp_ta_2_sale_ayande_options,
            natije_mozakere_options
        } = this.state;
        let {model,onChange,disabled} = this.props;
        let booleanProps = {
            inlineLabel:true,
            type:'radio',
            inputStyle:{background:'none',border:'none'},
            optionStyle:{width:'50%'},
            labelStyle:{width:136},
            options:[
                {text:'خیر',value:'0'},
                {text:'بله',value:'1'}
            ]
        }
        let style1 = {border:'1px solid #f3f2f1',background:'#f9f9f9'}
        let style2 = {border:'none'}
        return {
            html:(
                <Form
                    model={model}
                    labelStyle={{height:'fit-content'}}
                    theme={{checkIconColor:['#4ECCC1']}}
                    style={{background:'#fff'}}
                    data={{
                        darsade_forooshe_led_na_shenakhte_options,
                        sahme_forooshe_lamp_ta_2_sale_ayande_options,
                        natije_mozakere_options
                    }}
                    onChange={(model)=>onChange(model)}
                    inputs={[
                        {...booleanProps,field:'model.javaze_kasb_darad',label:this.getLabel('جواز کسب دارد؟',1),disabled},
                        {...booleanProps,field:'model.malek_mibashad',label:this.getLabel('مالک می‌باشد؟',2),disabled},
                        {...booleanProps,field:'model.pakhsh_darad',label:this.getLabel('پخش دارد؟',3),disabled},
                        {...booleanProps,field:'model.systeme_haml_va_naghl_darad',label:this.getLabel('سیستم حمل و نقل دارد؟',4),disabled},
                        {type:'number',placeholder:'تعداد سال فعالیت را وارد کنید',field:'model.sabeghe_faaliat',label:this.getLabel('سابقه فعالیت؟',5),inputStyle:style1,disabled},
                        {type:'number',placeholder:'تعداد نفرات را وارد کنید',field:'model.tedade_karkonan',label:this.getLabel('تعداد کارکنان؟',6),inputStyle:style1,disabled},
                        {
                            ...booleanProps,inlineLabel:false,disabled,
                            field:'model.ameliate_foroosh_ba_brande_khasi_darad',
                            label:this.getLabel('در حال حاضر عاملیت فروش با برند خاصی را در اختیار دارید؟',7)
                        },
                        {type:'textarea',autoHeight:true,placeholder:'نام برند ها را وارد کنید',field:'model.brand_ha',inputStyle:style1,show:model.ameliate_foroosh_ba_brande_khasi_darad === '1',disabled},
                        {type:'html',html:()=>this.getLabel('عمده ترین محصولات ارائه شده در شرکت/فروشگاه به همراه برند؟',8),disabled},
                        {type:'textarea',autoHeight:true,placeholder:'نام محصولات و برند ها را وارد کنید',field:'model.brands',inputStyle:style1,disabled},
                        {type:'html',html:()=>this.getLabel('حجم فروش متوسط ماهیانه برای محصولات زیر به چه میزان است؟',9),disabled},
                        {type:'text',inlineLabel:true,field:'model.hajme_forooshe_lamp',label:'لامپ LED :',placeholder:'حجم فروش را وارد کنید...',inputStyle:style1,disabled},
                        {type:'text',inlineLabel:true,field:'model.hajme_forooshe_cheragh',label:'چراغ LED :',placeholder:'حجم فروش را وارد کنید...',inputStyle:style1,disabled},
                        {type:'html',html:()=>this.getLabel('مهم ترین عامل تعیین کننده در فروش محصولات روشنایی LED به ترتیب  اولویت  کدام است؟ (با زدن روی هر مورد آن را به یک مرحله بالاتر هدایت کنید)',10),disabled},
                        {
                            type:'html',disabled,
                            html:()=>(
                                <Priority 
                                    items={model.avamele_tain_konande_dar_foroosh}
                                    disabled={disabled}
                                    onChange={(items)=>{
                                        let {model} = this.props;
                                        model.avamele_tain_konande_dar_foroosh = items;
                                        onChange(model)
                                    }}
                                />
                            )
                        },
                        {type:'html',html:()=>this.getLabel('به صورت تقریبی چند درصد از فروش ماهیانه لامپ در فروشگاه شما به محصولات LED ای که کمتر شناخته شده اند اختصاص دارد؟',11),disabled},
                        {type:'radio',options:'props.data.darsade_forooshe_led_na_shenakhte_options',field:'model.darsade_forooshe_led_na_shenakhte',inputStyle:style2,disabled},
                        {type:'html',html:()=>this.getLabel('به صورت تقریبی چند درصد از فروش ماهیانه لامپ در فروشگاه شما به محصولات LED ای که کمتر شناخته شده اند اختصاص دارد؟',12),disabled},
                        {type:'radio',options:'props.data.sahme_forooshe_lamp_ta_2_sale_ayande_options',field:'model.sahme_forooshe_lamp_ta_2_sale_ayande',inputStyle:style2,disabled},
                        {type:'textarea',autoHeight:true,field:'model.tozihate_bihstar',label:this.getLabel('توضیحات بیشتر',13),inputStyle:style1,disabled},
                        {type:'html',html:()=>this.getLabel('نتیجه مذاکره را چگونه ارزیابی میکنید؟',14),disabled},
                        {type:'radio',options:'props.data.natije_mozakere_options',field:'model.natije_mozakere',inputStyle:style2,disabled},
                        
                        
                    ]}
                />
            )
        }
    }
    render(){
        return (
            <RVD
                layout={{
                    column:[
                        this.body_layout()
                    ]
                }}
            />    
        )
    }
}

class Form2 extends Component{
    constructor(props){
        super(props);
        this.state = {
            noe_poroje_options:[
                {value:'0',text:'مسکونی'},
                {value:'1',text:'تجاری'},
                {value:'2',text:'اداری'},
                {value:'3',text:'صنعتی'},
                {value:'sayer',text:'سایر'}
            ],
            makane_ejraye_poroje_options:[
                {value:'0',text:'تهران'},
                {value:'1',text:'البرز'},
                {value:'sayer',text:'سایر'},
            ],
            vaziate_ejraye_poroje_options:[
                {value:'0',text:'پیش طراحی روشنایی'},
                {value:'1',text:'طراحی روشنایی'},
                {value:'2',text:'انتخاب محصول'},
                {value:'sayer',text:'سایر'},
            ],
            mizane_shenakht_options:[
                {value:'0',text:'شناختی ندارم'},
                {value:'1',text:'کم'},
                {value:'2',text:'متوسط'},
                {value:'3',text:'عالی'},
            ],
            natije_mozakere_options:[
                {value:'0',text:'موفق'},
                {value:'1',text:'ناموفق'},
                {value:'2',text:'نیاز به پیگیری'},
                {value:'3',text:'نیاز به تماس'}
            ],
            khadamate_morede_niaz_options:[
                {value:'0',text:'خدمات 1'},
                {value:'1',text:'خدمات 2'},
                {value:'2',text:'خدمات 3'},
                {value:'3',text:'خدمات 4'}
            ],
            mahsoolate_morede_niaz_options:[
                {value:'0',text:'محصول 1'},
                {value:'1',text:'محصول 2'},
                {value:'2',text:'محصول 3'},
                {value:'3',text:'محصول 4'}
            ]
            
        }
    }
    getLabel(text,num,fn){
        return (
            <div style={{display:'flex',alignItems:'center',minHeight:36,borderBottom:'1px solid #ccc',width:'100%'}}>
                <div 
                    style={{
                        width:20,height:20,background:'#4ECCC1',borderRadius:4,flexShrink:0,
                        color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'
                    }}
                >{num}</div>
                <div style={{width:4,flexShrink:0}}></div>
                <div className='bold' style={{flex:1}}>{text}</div>
                {
                    fn &&
                    <Icon path={mdiPlusCircle} size={0.8} style={{color:'#4ECCC1'}} onClick={()=>fn()}/>
                }
            </div>
        )
    }
    body_layout(){
        let {
            noe_poroje_options,
            makane_ejraye_poroje_options,
            vaziate_ejraye_poroje_options,
            mizane_shenakht_options,
            natije_mozakere_options,
            khadamate_morede_niaz_options,
            mahsoolate_morede_niaz_options
        } = this.state;
        let {model,onChange,disabled} = this.props;
        let booleanProps = {
            inlineLabel:true,
            type:'radio',
            inputStyle:{background:'none',border:'none'},
            optionStyle:{width:'50%'},
            labelStyle:{width:136},
            options:[
                {text:'خیر',value:'0'},
                {text:'بله',value:'1'}
            ]
        }
        let style1 = {border:'1px solid #f3f2f1',background:'#f9f9f9'}
        let style2 = {border:'none'}
        return {
            html:(
                <Form
                    model={model}
                    labelStyle={{height:'fit-content'}}
                    theme={{checkIconColor:['#4ECCC1']}}
                    style={{background:'#fff'}}
                    data={{
                        noe_poroje_options,
                        makane_ejraye_poroje_options,
                        vaziate_ejraye_poroje_options,
                        mizane_shenakht_options,
                        natije_mozakere_options,
                        khadamate_morede_niaz_options,
                        mahsoolate_morede_niaz_options
                    }}
                    onChange={(model)=>onChange(model)}
                    inputs={[
                        {type:'html',html:()=>this.getLabel('نوع پروژه را مشخص نمائید:',1),disabled},
                        {type:'radio',options:'props.data.noe_poroje_options',field:'model.noe_poroje',inputStyle:style2,disabled},
                        
                        {type:'textarea',autoHeight:true,placeholder:'نوع پروژه ...',field:'model.tozihe_noe_poroje',inputStyle:style1,show:model.noe_poroje === 'sayer',disabled},

                        {type:'html',html:()=>this.getLabel('مکان اجرای پروژه را مشخص نمائید:',2),disabled},
                        {type:'radio',options:'props.data.makane_ejraye_poroje_options',field:'model.makane_ejraye_poroje',inputStyle:style2,disabled},
                        
                        {type:'textarea',autoHeight:true,placeholder:'مکان پروژه ...',field:'model.tozihe_makane_ejraye_poroje',inputStyle:style1,show:model.makane_ejraye_poroje === 'sayer',disabled},

                        {type:'html',html:()=>this.getLabel('وضعیت اجرای پروژه را مشخص نمائید:',3),disabled},
                        {type:'radio',options:'props.data.vaziate_ejraye_poroje_options',field:'model.vaziate_ejraye_poroje',inputStyle:style2,disabled},
                        
                        {type:'textarea',autoHeight:true,placeholder:'وضعیت پروژه ...',field:'model.vaziate_ejraye_poroje',inputStyle:style1,show:model.vaziate_ejraye_poroje === 'sayer',disabled},

                        {type:'html',html:()=>this.getLabel('خدمات مورد نیاز مشتری چیست؟',4,disabled?undefined:()=>{
                            model.khadamate_morede_niaz.push('');
                            onChange(model)
                        }),disabled},
                        {
                            type:'group',id:'khadamat',text:'khadamat',show:false,
                            inputs:model.khadamate_morede_niaz.map((o,i)=>{
                                return {
                                    type:'group',id:'dgdfg' + i,show:false,
                                    inputs:[
                                        {
                                            disabled,type:'text',groupId:'khedmat',
                                            options:'props.data.khadamate_morede_niaz_options',
                                            field:`model.khadamate_morede_niaz[${i}]`,
                                            placeholder:'خدمات مورد نیاز را انتخاب یا وارد نمائید',
                                            inputStyle:style1
                                        },
                                        {type:'html',html:()=><Icon path={mdiPlusCircle} size={0.8} style={{color:'#4ECCC1'}} onClick={()=>{
                                            model.khadamate_morede_niaz.splice(i,1);
                                            onChange(model)
                                        }}/>}                                    ]
                                }
                        
                            })
                        },

                        {type:'html',html:()=>this.getLabel('محصولات مورد نیاز مشتریان چیست؟',5,disabled?undefined:()=>{
                            model.mahsoolate_morede_niaz.push('');
                            onChange(model)
                        })},
                        {
                            type:'group',id:'khadamat',text:'mahsool',show:false,
                            inputs:model.mahsoolate_morede_niaz.map((o,i)=>{
                                return {
                                    disabled,type:'text',groupId:'mahsool',
                                    options:'props.data.mahsoolate_morede_niaz_options',
                                    field:`model.mahsoolate_morede_niaz[${i}]`,
                                    placeholder:'محصولات مورد نیاز را انتخاب یا وارد نمائید',
                                    inputStyle:style1
                                }
                        
                            })
                        },

                        {type:'html',html:()=>this.getLabel('در حال حاضر پروژه ای دارید؟',6),disabled},
                        {...booleanProps,field:'model.poroje_darid',inlineLabel:false,disabled},
                        {type:'textarea',autoHeight:true,placeholder:'توضیح دهید...',field:'model.tozihe_poroje',inputStyle:style1,show:model.poroje_darid === '1',disabled},
                        
                        {type:'html',html:()=>this.getLabel('شناخت شما از مجموعه ما به چه میزان است؟',7),disabled},
                        {type:'radio',options:'props.data.mizane_shenakht_options',field:'model.mizane_shenakht',inputStyle:style2,disabled},
                        
                        {type:'html',html:()=>this.getLabel('آیا قبلا از محصولات مجموعه ما استفاده کرده اید؟',8),disabled},
                        {...booleanProps,field:'model.az_mahsoolate_ma_estefade_karid',inlineLabel:false,disabled},
                        {type:'textarea',autoHeight:true,placeholder:'نام محصول را وارد نمایید',field:'model.name_mahsoolati_ke_estefade_kardid',inputStyle:style1,show:model.az_mahsoolate_ma_estefade_karid === '1',disabled},
                        
                        {type:'html',html:()=>this.getLabel('کالای پیشنهادی برای اضافه شدن به سبد محصولات دارید؟',9),disabled},
                        {type:'textarea',autoHeight:true,placeholder:'کالا های پیشنهادی را وارد کنید',field:'model.kalaye_pishnahadi',inputStyle:style1,disabled},
                        
                        {type:'html',html:()=>this.getLabel('توضیحات بیشتر:',10),disabled},
                        {type:'textarea',autoHeight:true,field:'model.tozihate_bihstar',inputStyle:style1,disabled},
                        
                        {type:'html',html:()=>this.getLabel('نتیجه مذاکره را چگونه ارزیابی میکنید؟',11),disabled},
                        {type:'radio',options:'props.data.natije_mozakere_options',field:'model.natije_mozakere',inputStyle:style2,disabled},
                    ]}
                />
            )
        }
    }
    render(){
        return (
            <RVD
                layout={{
                    column:[
                        this.body_layout()
                    ]
                }}
            />    
        )
    }
}

class Form3 extends Component{
    constructor(props){
        super(props);
        this.state = {
            natije_mozakere_options:[
                {value:'0',text:'موفق'},
                {value:'1',text:'ناموفق'},
                {value:'2',text:'نیاز به پیگیری'},
                {value:'3',text:'نیاز به تماس'}
            ],
            zamine_faaliat_options:[
                {value:'0',text:'تولید کننده لامپ'},
                {value:'1',text:'صنایع مرتبط با روشنائی'},
                {value:'2',text:'صنایع غیر روشنائی'},
                {value:'3',text:'تولید کننده و فروشنده مواد پلیمری'},
                {value:'4',text:'صنایع چاپ و بسته بندی'},
                {value:'5',text:'شرکت حمل و نقل'},
                {value:'6',text:'شرکت های بازرگانی و صادرات'},
                {value:'sayer',text:'سایر'},
            ],
            noe_hamkari_options:[
                {value:'0',text:'خرید قطعات لامپ'},
                {value:'1',text:'خرید خدمات'}
            ]
        }
    }
    getLabel(text,num){
        return (
            <div style={{display:'flex',alignItems:'center',minHeight:36}}>
                <div 
                    style={{
                        width:20,height:20,background:'#4ECCC1',borderRadius:4,flexShrink:0,
                        color:'#fff',display:'flex',alignItems:'center',justifyContent:'center'
                    }}
                >{num}</div>
                <div style={{width:4,flexShrink:0}}></div>
                <div className='bold'>{text}</div>
            </div>
        )
    }
    body_layout(){
        let {
            zamine_faaliat_options,
            natije_mozakere_options,
            noe_hamkari_options
        } = this.state;
        let {model,onChange,disabled} = this.props;
        let booleanProps = {
            inlineLabel:true,
            type:'radio',
            inputStyle:{background:'none',border:'none'},
            optionStyle:{width:'50%'},
            labelStyle:{width:136},
            options:[
                {text:'خیر',value:'0'},
                {text:'بله',value:'1'}
            ]
        }
        let style1 = {border:'1px solid #f3f2f1',background:'#f9f9f9'}
        let style2 = {border:'none'}
        return {
            html:(
                <Form
                    lang='fa'
                    model={model}
                    labelStyle={{height:'fit-content'}}
                    theme={{checkIconColor:['#4ECCC1']}}
                    style={{background:'#fff'}}
                    data={{
                        natije_mozakere_options,
                        zamine_faaliat_options,
                        noe_hamkari_options
                    }}
                    onChange={(model)=>onChange(model)}
                    inputs={[
                        {type:'html',html:()=>this.getLabel('زمینه فعالیت شرکت چیست؟',1),disabled},
                        {type:'radio',options:'props.data.zamine_faaliat_options',field:'model.zamine_faaliat',inputStyle:style2,disabled},
                        
                        {type:'textarea',autoHeight:true,placeholder:'زمینه فعالیت ...',field:'model.tozihe_zamine_faaliat',inputStyle:style1,show:model.zamine_faaliat === 'sayer',disabled},

                        {...booleanProps,field:'model.ameliate_foroosh_ba_brande_khasi_darad',label:this.getLabel('آیا در حال حاضر مالک برند خاصی هستید ؟',2),disabled},
                        
                        {type:'html',html:()=>this.getLabel('نوع و زمینه همکاری مورد تقاضا چیست؟ ',1),disabled},
                        {type:'radio',options:'props.data.noe_hamkari_options',field:'model.zamine_faaliat',inputStyle:style2,disabled},
                        
                        {
                            type:'radio',options:'props.data.natije_mozakere_options',disabled,
                            label:'نتیجه مذاکره را چگونه ارزیابی میکنید؟',
                            field:'model.natije_mozakere',inputStyle:style2,
                            validations:[['required']]
                        },
                    ]}
                />
            )
        }
    }
    render(){
        return (
            <RVD
                layout={{
                    column:[
                        this.body_layout()
                    ]
                }}
            />    
        )
    }
}


class Form4 extends Component{
    constructor(props){
        super(props);
        this.state = {
            ahle_kharide_online_hastid_options:['بله','خیر'],
            che_kalahayi_ra_online_mikharid:['برقی و ابزار','دیجیتال','لباس','غذا','لوازم خانگی برقی'],
            az_che_site_hayi_bishtar_kharid_mikonid_options:['دیجی کالا','با سلام','اسنپ'],
            chetori_be_yek_site_etemad_mikonid_options:['ای نماد','درگاه پرداخت بانکی معتبر','تبلیغات','معرفی دوستان','سرشناس بودن سایت'],
            nahve_pardakhte_morede_nazare_shoma_options:['درب منزل','آنلاین'],
            avalin_chizi_ke_dar_yek_site_nazare_shoma_ra_jalb_mikonad_options:['تنوع محصولات','زیبایی بصری سایت','تخفیفات','کاربری آسان'],
            moghe_kharide_yek_mahsool_avalin_site_hayi_ke_check_mikonid_che_site_hayi_hastand_options:['دیجی کالا','ایمالز','ترب'],
            bar_hasbe_niaz_kharid_mikonid_ya_tabligh_options:['نیاز','تبلیغ'],
            natije_mozakere_options:[
                {value:'0',text:'موفق'},
                {value:'1',text:'ناموفق'},
                {value:'2',text:'نیاز به پیگیری'},
                {value:'3',text:'نیاز به تماس'}
            ],
        }
    }
    getModel(){
        return {
            'ahle_kharide_online_hastid':'',
            'che_kalahayi_ra_online_mikharid':'',
            'che_kalahayi_ra_online_mikharid_description':'',
            'dar_mah_chand_bar_online_kharid_mikonid':'',
            'akharin_bar_key_kharide_online_anjam_dadid':'',
            'az_che_site_hayi_bishtar_kharid_mikonid':'',
            'az_che_site_hayi_bishtar_kharid_mikonid_description':'',
            'chetori_be_yek_site_etemad_mikonid':'',
            'chetori_be_yek_site_etemad_mikonid_description':'',
            'hazine_ersal_ta_che_haddi_maghool_ast':'',
            'ersale_rayegan_ta_che_had_dar_kharide_shoma_tasir_gozar_ast':'',
            'nahve_pardakhte_morede_nazare_shoma':'',
            'avalin_chizi_ke_dar_yek_site_nazare_shoma_ra_jalb_mikonad':'',
            'avalin_chizi_ke_dar_yek_site_nazare_shoma_ra_jalb_mikonad_description':'',
            'moghe_kharide_yek_mahsool_avalin_site_hayi_ke_check_mikonid_che_site_hayi_hastand':'',
            'moghe_kharide_yek_mahsool_avalin_site_hayi_ke_check_mikonid_che_site_hayi_hastand_description':'',
            'bar_hasbe_niaz_kharid_mikonid_ya_tabligh':'',
            'natije_mozakere': '',
        }
    }
    body_layout(){
        let {
            ahle_kharide_online_hastid_options,
            che_kalahayi_ra_online_mikharid_options,
            az_che_site_hayi_bishtar_kharid_mikonid_options,
            chetori_be_yek_site_etemad_mikonid_options,
            nahve_pardakhte_morede_nazare_shoma_options,
            avalin_chizi_ke_dar_yek_site_nazare_shoma_ra_jalb_mikonad_options,
            moghe_kharide_yek_mahsool_avalin_site_hayi_ke_check_mikonid_che_site_hayi_hastand_options,
            bar_hasbe_niaz_kharid_mikonid_ya_tabligh_options,
            natije_mozakere_options
        } = this.state;
        let {model,onChange} = this.props;
        return {
            html:(
                <AIOInput
                    type='form' lang='fa'
                    value={model}
                    onChange={(model)=>onChange(model)}
                    inputs={{
                        column:[
                            {input:{type:'radio',optionText:'option',optionValue:'option',options:ahle_kharide_online_hastid_options},label:'اهل خرید آنلاین هستید ؟',field:'value.ahle_kharide_online_hastid'},
                            {input:{type:'radio',optionText:'option',optionValue:'option',options:che_kalahayi_ra_online_mikharid_options,multiple:true},label:'معمولا چه کالا هایی را آنلاین می خرید ؟',field:'value.che_kalahayi_ra_online_mikharid'},
                            {input:{type:'textarea'},label:'توضیح بیشتر ؟',field:'value.che_kalahayi_ra_online_mikharid_description'},
                            {input:{type:'number'},label:'در ماه چند بار آنلاین خرید می کنید ؟',field:'value.dar_mah_chand_bar_online_kharid_mikonid'},
                            {input:{type:'text'},label:'آخرین بار کی خرید آنلاین انجام دادید ؟',field:'value.akharin_bar_key_kharide_online_anjam_dadid'},
                            {input:{type:'radio',optionText:'option',optionValue:'option',options:az_che_site_hayi_bishtar_kharid_mikonid_options,multiple:true},label:'از چه سایت هایی بیشتر خرید می کنید ؟',field:'value.az_che_site_hayi_bishtar_kharid_mikonid'},
                            {input:{type:'textarea'},label:'توضیح بیشتر ؟',field:'value.az_che_site_hayi_bishtar_kharid_mikonid_description'},
                            {input:{type:'radio',optionText:'option',optionValue:'option',options:chetori_be_yek_site_etemad_mikonid_options,multiple:true},label:'چطوری به یک سایت اعتماد میکنید ؟',field:'value.chetori_be_yek_site_etemad_mikonid'},
                            {input:{type:'textarea'},label:'توضیح بیشتر ؟',field:'value.chetori_be_yek_site_etemad_mikonid_description'},
                            {input:{type:'text'},label:'هزینه ارسال تا چه حدی معقول است ؟',field:'value.hazine_ersal_ta_che_haddi_maghool_ast'},
                            {input:{type:'text'},label:'ارسال رایگان تا چه حد در خرید شما تاثیر گذار است ؟',field:'value.ersale_rayegan_ta_che_had_dar_kharide_shoma_tasir_gozar_ast'},
                            {input:{type:'radio',optionText:'option',optionValue:'option',options:nahve_pardakhte_morede_nazare_shoma_options},label:'نحوه پرداخت مورد نظر شما ؟',field:'value.nahve_pardakhte_morede_nazare_shoma'},
                            {input:{type:'radio',optionText:'option',optionValue:'option',options:avalin_chizi_ke_dar_yek_site_nazare_shoma_ra_jalb_mikonad_options},label:'اولین چیزی که در یک سایت نظر شما را جلب می کند چیست ؟',field:'value.avalin_chizi_ke_dar_yek_site_nazare_shoma_ra_jalb_mikonad'},
                            {input:{type:'textarea'},label:'توضیح بیشتر ؟',field:'value.avalin_chizi_ke_dar_yek_site_nazare_shoma_ra_jalb_mikonad_description'},
                            {input:{type:'radio',optionText:'option',optionValue:'option',options:moghe_kharide_yek_mahsool_avalin_site_hayi_ke_check_mikonid_che_site_hayi_hastand_options,multiple:true},label:'موقع خرید یک محصول اولین سایت هایی که چک میکنید چه سایت هایی هستند ؟',field:'value.moghe_kharide_yek_mahsool_avalin_site_hayi_ke_check_mikonid_che_site_hayi_hastand'},
                            {input:{type:'textarea'},label:'توضیح بیشتر ؟',field:'value.moghe_kharide_yek_mahsool_avalin_site_hayi_ke_check_mikonid_che_site_hayi_hastand_description'},
                            {input:{type:'radio',optionText:'option',optionValue:'option',options:bar_hasbe_niaz_kharid_mikonid_ya_tabligh_options},label:'بر حسب نیاز خرید میکنید یا تبلیغ ؟',field:'value.bar_hasbe_niaz_kharid_mikonid_ya_tabligh'},
                            {
                                input:{type:'radio',options:natije_mozakere_options},
                                label:'نتیجه مذاکره را چگونه ارزیابی میکنید؟',
                                field:'value.natije_mozakere',
                                validations:[['required']]
                            },
                        ]
                    }}
                />
            )
        }
    }
    render(){
        return (
            <RVD
                layout={{
                    column:[
                        this.body_layout()
                    ]
                }}
            />    
        )
    }
}


class Form5 extends Component{
    constructor(props){
        super(props);
        this.state = {
            ta_hala_forosh_online_dashtin_option:['بله','خیر'],
            dar_che_sitehaee_faaliat_dashtin_option:['ترب','ایمالز','دیجی کالا','اینستاگرام','با سلام'],
            aya_hamchenan_dar_in_siteha_faaliat_darid_option:['بله','خیر'],
            ta_hala_chalesh_dashtid_option:['بله','خیر'],
            che_chaleshhaee_dashtin_option:['کمیسیون', 'ارسال' , 'بسته بندی', 'مرجوعی' , 'تسویه' , 'هزینه حمل', 'سایر'],
            aya_tamayol_darid_kalahatoon_ro_dakhel_vitrin_sabt_konin_option:['بله','خیر'],
            natije_mozakere_options:[
                {value:'0',text:'موفق'},
                {value:'1',text:'ناموفق'},
                {value:'2',text:'نیاز به پیگیری'},
                {value:'3',text:'نیاز به تماس'}
            ],
        }
    }
    getModel(){
        return {
            'ta_hala_forosh_online_dashtin':'',
            'dar_che_sitehaee_faaliat_dashtin':'',
            'aya_hamchenan_dar_in_siteha_faaliat_darid':'',
            'ta_hala_chalesh_dashtid':'',
            'che_chaleshhaee_dashtin':'',
            'natije_mozakere':'',
        }
    }
    body_layout(){
        let {
            ta_hala_forosh_online_dashtin_option,
            dar_che_sitehaee_faaliat_dashtin_option,
            aya_hamchenan_dar_in_siteha_faaliat_darid_option,
            ta_hala_chalesh_dashtid_option,
            che_chaleshhaee_dashtin_option,
            aya_tamayol_darid_kalahatoon_ro_dakhel_vitrin_sabt_konin_option,
            natije_mozakere_options,
        } = this.state;
        let {model,onChange} = this.props;
        return {
            html:(
                <AIOInput
                    type='form' lang='fa'
                    value={model}
                    onChange={(model)=>onChange(model)}
                    inputs={{
                        column:[
                            {input:{type:'radio',optionText:'option',optionValue:'option',options:ta_hala_forosh_online_dashtin_option},label:'تا حالا فروش آنلاین داشتید ؟',field:'value.ta_hala_forosh_online_dashtin'},
                            {input:{type:'radio',optionText:'option',optionValue:'option',options:dar_che_sitehaee_faaliat_dashtin_option,multiple:true},label:'درچه سایت هایی فعالیت داشتید ؟',field:'value.dar_che_sitehaee_faaliat_dashtin'},
                            {input:{type:'radio',optionText:'option',optionValue:'option',options:aya_hamchenan_dar_in_siteha_faaliat_darid_option},label:'آیا همچنان در این سایت ها فعالیت دارید ؟',field:'value.aya_hamchenan_dar_in_siteha_faaliat_darid'},
                            {input:{type:'radio',optionText:'option',optionValue:'option',options:ta_hala_chalesh_dashtid_option,multiple:true},label:'تا حالا چالش داشتید ؟',field:'value.ta_hala_chalesh_dashtid'},
                            {input:{type:'radio',optionText:'option',optionValue:'option',options:che_chaleshhaee_dashtin_option},label:'چه چالش هایی داشتید ؟',field:'value.che_chaleshhaee_dashtin'},
                            {input:{type:'radio',optionText:'option',optionValue:'option',options:aya_tamayol_darid_kalahatoon_ro_dakhel_vitrin_sabt_konin_option},label:'آیا تمایل دارید کالاهاتون رو داخل ویترین ثبت کنید ؟',field:'value.aya_tamayol_darid_kalahatoon_ro_dakhel_vitrin_sabt_konin'},
                            {
                                input:{type:'radio',options:natije_mozakere_options},
                                label:'نتیجه مذاکره را چگونه ارزیابی میکنید؟',
                                field:'value.natije_mozakere',
                                validations:[['required']]
                            },
                        ]
                    }}
                />
            )
        }
    }
    render(){
        return (
            <RVD
                layout={{
                    column:[
                        this.body_layout()
                    ]
                }}
            />    
        )
    }
}



class Priority extends Component{
    box_layout(text,index){
        let {items,onChange,disabled} = this.props;
        return {
            className:'priority-item',
            row:[
                {size:30,html:index + 1,align:'vh',style:{background:'#4ECCC1',color:'#fff',height:'100%',fontSize:16}},
                {size:6},
                {html:text}
            ],
            attrs:{
                onClick:()=>{
                    if(index === 0 || disabled){return}
                    onChange(items.map((o,i)=>{
                        let from = index;
                        let to = index - 1;
                        if(i === to){return items[from]}
                        else if(i === from){return items[to]}
                        else{return o}
                    }))
                }
            }
        }
    }
    render(){
        let {items} = this.props;
        if (items) {
            return (
                <RVD
                    layout={{
                        column:items.map((o,i)=>this.box_layout(o,i))
                    }}
                />
            )
        }
        
    }
}