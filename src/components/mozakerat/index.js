import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import AppContext from './../../app-context';
import SearchBox from './../../components/search-box/index';
import AIOInput from './../../npm/aio-input/aio-input';
import {Icon} from '@mdi/react';
import MozakereCard from '../mozakere-card';
import {mdiFilterVariant} from '@mdi/js';
import './index.css';


/*********************************
Mozakerat
کامپوننت بخش میز کار و بخش تاریخچه

--------------------------------------
استفاده در  |  App (App.js)
--------------------------------------

--------------------------------------
استفاده از  | MozakereCard (./components/mozakere-card/index.js)
--------------------------------------

-----------------------------------------------------
 props | type                      | description
-----------------------------------------------------
 mode  | "mize_kar" or "tarikhche" | آی دی بخش اصلی
-----------------------------------------------------

-------------------------------------------------------------------------------
 context    | type             | description
-------------------------------------------------------------------------------
 apis   | function         | تابع ارتباط با سرور
 results    | array of objects | دیکشنری انواع نتیجه
 getPopups  | function         | برای تشخیص اینکه آیا پاپاپی باز است یا خیر که اگر باز بود این کامپوننت محو شود
-------------------------------------------------------------------------------

-------------------------------------------------------------------------------
 state         | type             | description
-------------------------------------------------------------------------------
 searchValue   | string           | متن سرچ
 tab           | string           | فیلتر استتوس
 filterResult  | string           | فیلتر نتیجه
 items         | array of objects | لیست مذاکرات
 -------------------------------------------------------------------------------


**********************************/

export default class Mozakerat extends Component{
    static contextType = AppContext
    constructor(props){
        super(props);
        this.state = {searchValue:'',items:[],tab:'all',filterResult:'all'}
    }
    fetchData(){
        let {apis} = this.context;
        let {mode} = this.props;
        let api = {
            'mize_kar':'mozakere_haye_man',
            'tarikhche':'tarikhche'
        }[mode]
        let description = {
            'mize_kar':'دریافت لیست مذاکره های من',
            'tarikhche':'دریافت تاریخچه'
        }[mode]
        apis.request({api,description,onSuccess:(items)=>this.setState({items}),def:[]});
    }
    componentDidMount(){
        this.fetchData();
        this.startSocket()
    }
    componentWillUnmount(){
        this.socket.close();
    }
    async startSocket(){
        let {username, rsa} = this.context;
        let socket = await new WebSocket("wss://" + `exhibition.bbeta.ir` + `/ws/personnel/${username}`);
        // let socket = await new WebSocket("ws://" + `127.0.0.1:8000` + `/ws/personnel/${username}`);
        this.socket = socket
        socket.onmessage = async (event)=>{
            const parsedObject = JSON.parse(event.data);
            console.log(parsedObject.en_notif_title);
            if (parsedObject.en_notif_title === 'cancel_negotiation') {
                rsa.addAlert({type:'error', text: 'پیام جدید دارید', subtext: `${parsedObject.info.message}`})
            }else {
                rsa.addAlert({type:'info', text: 'پیام جدید دارید', subtext: `${parsedObject.info.message}`})
            }
            await this.fetchData()
        }
    }
    search_layout(){
        let {results} = this.context;
        let {searchValue,filterResult,tab} = this.state;
        let {mode} = this.props;
        return {
            style:{overflow:'visible'},size:36,gap:12,
            row:[
                {style:{overflow:'visible'},flex:1,html:(<SearchBox value={searchValue} onChange={(searchValue)=>this.setState({searchValue})}/>)},
                {
                    show:mode === 'tarikhche' && tab === 'end',
                    html:()=>(
                        <AIOInput
                            type='select' caret={false}
                            style={{color:'#00B5A5',fontSize:14,height:30}}
                            options={results}
                            after={<Icon path={mdiFilterVariant} size={0.7}/>}
                            value={filterResult}
                            onChange={(filterResult)=>this.setState({filterResult})}
                        />
                    )
                }
            ]
        }
    }
    getFilteredItems(){
        let {items,tab,filterResult,searchValue} = this.state;
        let {mode} = this.props;
        let filteredItems = [...items];
        if(searchValue){
            filteredItems = filteredItems.filter(({name,city,company})=>{
                if(name.indexOf(searchValue) !== -1){return true}
                if(city.indexOf(searchValue) !== -1){return true}
                if(company.indexOf(searchValue) !== -1){return true}
                return false
            })
        }
        if(tab === 'end'){filteredItems = filteredItems.filter(({status})=>status === '2')}
        else if(tab === 'referenced'){filteredItems = filteredItems.filter(({status})=>status === '3')}
        else if(tab === 'rejected'){filteredItems = filteredItems.filter(({status})=>status === '4')}
        if(mode === 'tarikhche' && filterResult !== 'all' && tab === 'end'){
            filteredItems = filteredItems.filter(({result})=>{
                if(result === undefined){return false}
                return result === filterResult
            })
        }
        return filteredItems;
    }
    items_layout(){
        let {items} = this.state;
        let {mode} = this.props;
        let filteredItems = this.getFilteredItems();
        return {
            flex:1,
            column:[
                {
                    show:mode === 'mize_kar',size:48,align:'v',className:'color323130 bold size14',
                    row:[
                        {flex:1,html:'مذاکره های من',align:'v'},
                        {html:items.length + ' مورد'}
                    ]
                },
                this.tabs_layout(),
                {
                    flex:1,className:'ofy-auto',gap:12,
                    column:filteredItems.map((o)=>{
                        return {
                            html:(
                                <MozakereCard 
                                    fetchData={this.fetchData.bind(this)}
                                    key={o.id}
                                    onRemove={()=>{
                                        let {items} = this.state;
                                        this.setState({items:items.filter((item)=>o.id !== item.id)})
                                    }}
                                    mode={mode}
                                    object={o}
                                    onReference={()=>this.setState({items:items.filter(({id})=>id !== o.id)})}
                                    onReject={()=>this.setState({items:items.filter(({id})=>id !== o.id)})}
                                />
                            )
                        }
                    })
                }
            ]
        }
    }
    tabs_layout(){
        let {items,tab} = this.state;
        let {mode} = this.props;
        if(mode !== 'tarikhche'){return false}
        return {
            size:48,align:'v',className:'color323130 bold size14',
            row:[
                {
                    flex:1,align:'v',
                    html:()=>{
                        let all = 0,end = 0,referenced = 0, rejected = 0;
                        for(let i = 0; i < items.length; i++){
                            let status = items[i].status;
                            all++;
                            if(status === '2'){end++}
                            else if(status === '3'){referenced++}
                            else if(status === '4'){rejected++}
                        }
                        return (
                            <AIOInput
                                type='tabs'
                                className='mozakere-tabs'
                                options={[
                                    {text:'همه',value:'all',after:all,style:{flex:1}},
                                    {text:'پایان یافته',value:'end',after:end?end:undefined,style:{flex:1}},
                                    {text:'ارجاع شده',value:'referenced',after:referenced?referenced:undefined,style:{flex:1}},
                                    {text:'انصراف',value:'rejected',after:rejected?rejected:undefined,style:{flex:1}},
                                ]}
                                onChange={(value)=>this.setState({tab:value})}
                                value={tab}
                            />
                        )
                    }
                }
            ]
        }
    }
    render(){
        let {getPopups = ()=>[]} = this.context;
        return (
            <RVD
                layout={{
                    className:'page',
                    style:{overflow:'visible',filter:getPopups().length?'blur(4px)':undefined},
                    column:[
                        this.search_layout(),
                        this.items_layout()
                    ]
                }}
            />
        )
    }
}
