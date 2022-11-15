import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import Form from 'aio-form-react';
import {Icon} from '@mdi/react';
import {mdiChevronRight,mdiPlusCircle,mdiDelete} from '@mdi/js';
import AppContext from '../../app-context';
import titleSrc from './../../images/title2.png';
import './index.css';
export default class Mozakere extends Component{
    static contextType = AppContext;
    constructor(props){
        super(props);
        this.state = {
            initModel:JSON.stringify(props.form.model),
            model:{...props.form.model}
        }
    }
    resetForm(){
        this.setState({model:JSON.parse(this.state.initModel)})
    }
    header_layout(){
        let {removePopup} = this.context;
        let {form,disabled} = this.props;
        return {
            size:48,childsProps:{align:'v'},
            className:'padding-0-12',
            style:{borderBottom:'1px solid #ccc'},
            row:[
                {
                    flex:1,
                    attrs:{
                        onClick:()=>removePopup()
                    },
                    row:[
                        {size:24,html:<Icon path={mdiChevronRight} size={0.8}/>,align:'vh'},
                        {html:'بستن',className:'bold'}
                    ]
                },
                {html:form.title,className:'size16 bold'},
                {
                    flex:1,
                    row:[
                        {flex:1},
                        {show:!!!disabled,html:<button className='reset-form-button' onClick={()=>this.resetForm()}>پاک کردن فرم</button>}
                    ]
                }
            ]
        }
    }
    details_layout(){
        let {name,city,mobile,activityZone,company,phone,cardCode} = this.props;
        return {
            childsProps:{size:30,align:'v'},
            className:'padding-12',
            style:{
                borderTop:'1px solid #ccc',
                borderBottom:'1px solid #ccc',
            },
            column:[
                {row:[{html:'نام و نام خانوادگی :'},{html:name}]},
                {row:[{html:'شهر :'},{html:city}]},
                {row:[{html:'شماره همراه :'},{html:mobile}]},
                {row:[{html:'حوزه فعالیت :'},{html:activityZone}]},
                {row:[{html:'شرکت/فروشگاه :'},{html:company}]},
                {row:[{html:'شماره ثابت :'},{html:phone}]},
                {row:[{html:'کارت کد :'},{html:cardCode}]}
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
    form_layout(){
        let {form} = this.props;
        return this['form_layout' + form.type]()
    }
    async submit(mode){
        let {services,setConfirm,removePopup} = this.context;
        let {form} = this.props;
        let {model} = this.state;
        let res = await services({type:'sabte_mozakere',parameter:{mode,type:form.type,model}})
        if(typeof res === 'string'){
            setConfirm({type:'error',text:mode === 'submit'?'ثبت فرم با خطا روبرو شد':'پیشنویس فرم با خطا روبرو شد',subtext:res})
        }
        else if(res === true){
            setConfirm({type:'success',text:mode === 'submit'?'فرم با موفقیت ثبت شد':'فرم با موفقیت پیشنویس شد'})
            removePopup()
        }
    }
    footer_layout(){
        let {model} = this.state;
        let {disabled} = this.props;
        return {
            gap:12,
            column:[
                {size:36},
                {html:<button disabled={!!!model.natije_mozakere || disabled} onClick={()=>this.submit('submit')} className='form-submit'>ثبت و اتمام مذاکره</button>},
                {html:<button onClick={()=>this.submit('draft')} className='form-draft'>ثبت به عنوان پیشنویس</button>},
                {size:168,align:'vh',html:<img src={titleSrc} alt=''/>}
            ]
        }
    }
    render(){
        return (
            <RVD
                layout={{
                    style:{background:'#fff',height:'100%',maxWidth:600},
                    scroll:'v',
                    className:'size12',
                    column:[
                        this.header_layout(),
                        {
                            flex:1,scroll:'v',
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
                {value:'4',text:'سایر'}
            ],
            makane_ejraye_poroje_options:[
                {value:'0',text:'تهران'},
                {value:'1',text:'البرز'},
                {value:'2',text:'سایر'},
            ],
            vaziate_ejraye_poroje_options:[
                {value:'0',text:'پیش طراحی روشنایی'},
                {value:'1',text:'طراحی روشنایی'},
                {value:'2',text:'انتخاب محصول'},
                {value:'3',text:'سایر'},
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
                        
                        {type:'html',html:()=>this.getLabel('مکان اجرای پروژه را مشخص نمائید:',2),disabled},
                        {type:'radio',options:'props.data.makane_ejraye_poroje_options',field:'model.makane_ejraye_poroje',inputStyle:style2,disabled},
                        
                        {type:'html',html:()=>this.getLabel('مکان اجرای پروژه را مشخص نمائید:',3),disabled},
                        {type:'radio',options:'props.data.vaziate_ejraye_poroje_options',field:'model.vaziate_ejraye_poroje',inputStyle:style2,disabled},
                        
                        {type:'html',html:()=>this.getLabel('خدمات مورد نیاز مشتری چیست؟',4,disabled?undefined:()=>{
                            model.khadamate_morede_niaz.push('');
                            onChange(model)
                        }),disabled},
                        {
                            type:'group',id:'khadamat',text:'khadamat',show:false,
                            inputs:model.khadamate_morede_niaz.map((o,i)=>{
                                return {
                                    disabled,type:'text',groupId:'khedmat',
                                    options:'props.data.khadamate_morede_niaz_options',
                                    field:`model.khadamate_morede_niaz[${i}]`,
                                    placeholder:'خدمات مورد نیاز را انتخاب یا وارد نمائید',
                                    inputStyle:style1
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
            zamine_faalit_options:[
                {value:'0',text:'تولید کننده لامپ'},
                {value:'1',text:'صنایع مرتبط با روشنائی'},
                {value:'2',text:'صنایع غیر روشنائی'},
                {value:'3',text:'تولید کننده و فروشنده مواد پلیمری'},
                {value:'4',text:'صنایع چاپ و بسته بندی'},
                {value:'5',text:'شرکت حمل و نقل'},
                {value:'6',text:'شرکت های بازرگانی و صادرات'},
                {value:'7',text:'سایر'},
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
            zamine_faalit_options,
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
                        zamine_faalit_options,
                        noe_hamkari_options
                    }}
                    onChange={(model)=>onChange(model)}
                    inputs={[
                        {type:'html',html:()=>this.getLabel('زمینه فعالیت شرکت چیست؟',1),disabled},
                        {type:'radio',options:'props.data.zamine_faalit_options',field:'model.zamine_faaliat',inputStyle:style2,disabled},
                        
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
        return (
            <RVD
                layout={{
                    column:items.map((o,i)=>this.box_layout(o,i))
                }}
            />
        )
    }
}