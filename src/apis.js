export default function apis({Axios,getState}){
    //status:'0',text:'در انتظار مذاکره'
    //status:'1',text:'در حال مذاکره'
    //status:'2',text:'پایان مذاکره'
    //status:'3',text:'ارجاع به دیگری'
    //status:'4',text:'انصراف از مذاکره'

    //result:'0',text:'موفق'
    //result:'1',text:'نا موفق'
    //result:'2',text:'نیاز به تماس'
    //result:'3',text:'نیاز به پیگیری'
    const hostName = `http://localhost:8000`
    const searchPersonUrl = `${hostName}/person/v1/person` // ادرس جستجوی مذاکره کننده
    const userTaskUrl = `${hostName}/camunda/v1/usertask` // ادرس میز کار
    const historyUrl = `${hostName}/camunda/v1/history` // آدرس تاریخچه
    const referralUrl = `${hostName}/camunda/v1/changeassignee` // آدرس ارجا به دیگری
    const discardRequeestUrl = `${hostName}/camunda/v1/cancel`
    const startNegotiation = `${hostName}/main/forms/`
    const endNegotiation = `${hostName}/negotiation/end`
    // let username = 'a.taghavi'
    // let username = 'a.hejazi'
    let username = 'a.moghimi'
    // let username = 's.ehteshami'

    return {
        async mozakere_konandegan(){
            
            let negotiatorUsername = getState().username //یوزر نیم شخصی که لاگین کرده
            let client_id = getState().client_id
            //return 'خطایی پیش آمده'
            let apiBody = {
                "client": client_id, // با توجه به غرفه ای که درخواست میکند 
                "city": 'تهران',
                // "market": '',
                // "province": "فارس",
            }

            let result;
            try{
            result = await Axios.post(searchPersonUrl, apiBody)
            }
            catch(err) {
            debugger
            return 'خطا در دریافت لیست مذاکره کنندگان' 
            }

            let resMapping = result.data.map((o) => {

                if(o.profile_photo_url) {
                  o.profile_photo_url = `${hostName}${o.profile_photo_url}`
                }
                return {
                  id: o.id,
                  name: o.full_name,
                  city: o.city,
                  table:o.desk_number,
                  status: o.status,
                  src: o.profile_photo_url,
                  username: o.username
                }
            })
            resMapping = resMapping.filter((o) => { //فیلتر خود آن مذاکره کننده
                return o.username != negotiatorUsername
            })
            // debugger
            
            return resMapping

            return [
                {name:'علی قربانی',city:'تهران',table:'2',id:'0'},
                {name:'علی قربانی',city:'تهران',table:'2',id:'1'},
                {name:'علی قربانی',city:'تهران',table:'2',id:'2'},
                {name:'علی قربانی',city:'تهران',table:'2',id:'3'},
                {name:'علی قربانی',city:'تهران',table:'2',id:'4'}
            ]
        },
        async mozakere_haye_man(){
            let result;
            let client_id = getState().client_id
            let negotiatorUsername = getState().username
            let url = `${userTaskUrl}/${client_id}/${negotiatorUsername}`
            try{
                result = await Axios.get(url)
            }
            catch(err){
                debugger
                return []
            }

            let resMapping = result.data.map((o) => {
                let state;
                // {value:'0',text:'در انتظار مذاکره',color:'#108ABE'},
                // {value:'1',text:'در حال مذاکره',color:'#CD9100'},
                // {value:'2',text:'پایان مذاکره',color:'#107C10'},
                // {value:'3',text:'ارجاع به دیگری',color:'#814696'},
                // {value:'4',text:'انصراف از مذاکره',color:'#A4262C'}
                
                if(o.state == 1){state = '0'} // o.state == 1 => ثبت اظلاعات  
                else if(o.state == 2){state = '0'} // o.state == 2 => در انتظار مذاکره
                else if(o.state == 3){state = '1'} // o.state == 3 => در حال مذاکره
                else if(o.state == 4){state = '2'} // o.state == 4 => پایان مذاکره
                else if(o.state == 5){state = '4'} // o.state == 5 => انصراف از مذاکره
                else if(o.state == 6){state = '3'} // o.state == 6 => ارجاع به دیگری
                else{state = '0'}
                return {
                    name: `${o.first_name} ${o.last_name}` || '',
                    status: state,
                    company: o.company_name || '',
                    city: o.province || '',
                    id: o.id_ ,
                    process_instance_id: o.process_instance_id,
                    time: new Date(o.created).getTime(),
                    guest_id: o.guest_id,
                    person_id: o.person_id,
                    market: o.market,
                }
            })
            // return []
            return resMapping            
                
            return [
                //status : '0' {name,company,city,id,time}
                {
                    name:'حامد یوسف زاده',status:'0',company:'شرکت طلوع روشن نور',city:'تهران',id:'00',
                    time:new Date().getTime()
                },
                //status : '1' {name,company,city,id,time}
                {
                    name:'حامد یوسف زاده',status:'1',company:'شرکت طلوع روشن نور',city:'تهران',id:'10',
                    time:new Date().getTime()
                }
            ]
        },
        async tarikhche(){
            let result;
            let negotiatorUsername = getState().username //یوزر نیم شخصی که لاگین کرده
            let client_id = getState().client_id
            let url = `${historyUrl}/${client_id}/${negotiatorUsername}`
            
            try{
                result = await Axios.get(url)
            }
            catch(err){
                debugger
                return []
            }

            let resMapping = result.data.map((o) => {
                let state;
                let name;
                let city;
                let company_name;
                let full_name;
                let result;
                if (Object.values(o.state).length != 0){
                    if(o.state.id == 1){state = 0} // o.state == 1 => ثبت اظلاعات  
                    else if(o.state.id == 2){state = '0'} // o.state == 2 => در انتظار مذاکره
                    else if(o.state.id == 3){state = '1'} // o.state == 3 => در حال مذاکره
                    else if(o.state.id == 4){state = '2'} // o.state == 4 => پایان مذاکره
                    else if(o.state.id == 5){state = '4'} // o.state == 5 => انصراف از مذاکره
                    else if(o.state.id == 6){state = '3'} // o.state == 6 => ارجاع به دیگری
                    else{state = '3'}
                }
                else{
                    state = '3'
                }
                
                if(o.guest !== null){
                    if (Object.values(o.guest).length != 0){
                        name = `${o.guest.first_name} ${o.guest.last_name}`
                        company_name = o.guest.company_name
                        city = o.guest.province
                    }
                }

                if (o.referral !== null){
                    if (Object.values(o.referral).length != 0) {
                        full_name = o.referral.full_name
                    }
                }

                if(o.negotiaition !== null){ 
                    if (Object.values(o.negotiaition).length != 0) {
                        result = o.negotiaition.result
                        if(result == 'S'){result = '0'} //'موفق ها'
                        if(result == 'U'){result = '1'} //'نا موفق ها'
                        if(result == 'C'){result = '2'} //'نیاز به تماس ها'
                        if(result == 'N'){result = '3'} //'نیاز به پیگیری ها'
                    }
                }
                
                return {
                    name: name || 'نامی وجود ندارد',
                    status: state || '0',
                    company: company_name || 'نام شرکت',
                    city: city || 'نام شهر',
                    id: o.task_id || '0',
                    time: new Date(o.updated_at).getTime(),
                    result: result || undefined,
                    referencedTo: full_name
                }
            })
            return resMapping.sort()

            return [
                //status : '2' {name,company,city,id,time,result} //پایان یافته
                {
                    name:'حامد یوسف زاده',status:'2',company:'شرکت طلوع روشن نور',city:'تهران',id:'21',
                    time:new Date().getTime(),result:'0'
                },
                {
                    name:'مجید حسینی',status:'2',company:'شرکت طلوع روشن نور',city:'اصفهان',id:'21',
                    time:new Date().getTime(),result:'1'
                },
                {
                    name:'علی رضایی',status:'2',company:'شرکت طلوع روشن نور',city:'تبریز',id:'22',
                    time:new Date().getTime(),result:'2'
                },
                {
                    name:'رضا پورمحمدی',status:'2',company:'شرکت طلوع روشن نور',city:'مشهد',id:'23',
                    time:new Date().getTime(),result:'3'
                },
                //status : '3' {name,company,city,id,time,referencedTo} // ارجاع شده
                {
                    name:'سلمان طیبی',status:'3',company:'شرکت طلوع روشن نور',city:'ارومیه',id:'31',
                    time:new Date().getTime(),referencedTo:'جواد زمانی'
                },
                {
                    name:'محمد رضا پور عسکر',status:'3',company:'شرکت طلوع روشن نور',city:'اصفهان',id:'32',
                    time:new Date().getTime(),referencedTo:'مهدی شاد'
                },
                {
                    name:'محمد شریف فیض',status:'3',company:'شرکت طلوع روشن نور',city:'تهران',id:'33',
                    time:new Date().getTime(),referencedTo:'شاهین قلی'
                },
                {
                    name:'شیما رادمنش',status:'3',company:'شرکت طلوع روشن نور',city:'مشهد',id:'34',
                    time:new Date().getTime(),referencedTo:'کوروش شجاعی'
                },
                //status : '4' {name,company,city,id,time} //انصراف
                {
                    name:'احمد عزیزی',status:'4',company:'شرکت طلوع روشن نور',city:'اصفهان',id:'41',
                    time:new Date().getTime()
                },
                {
                    name:'مجتبی بهمنی',status:'4',company:'شرکت طلوع روشن نور',city:'تهران',id:'42',
                    time:new Date().getTime()
                },
                {
                    name:'همایون ارزنده',status:'4',company:'شرکت طلوع روشن نور',city:'تبریز',id:'43',
                    time:new Date().getTime()
                },
                {
                    name:'شایان پیر مرادی',status:'4',company:'شرکت طلوع روشن نور',city:'تهران',id:'44',
                    time:new Date().getTime()
                },
            ]
        },
        async notifications(){
            // return 'خطایی پیش آمده'
            return [
                {
                    name:'حامد یوسف زاده',status:'0',city:'تهران',id:'0',
                    date:'1401/4/4',time:'12:30'
                },
                {
                    name:'حامد یوسف زاده',status:'1',city:'تهران',id:'1',
                    date:'1401/4/4',time:'12:30'
                },
                {
                    name:'حامد یوسف زاده',status:'2',city:'تهران',id:'2',
                    date:'1401/4/4',time:'12:30'
                },
                {
                    name:'حامد یوسف زاده',status:'3',city:'تهران',id:'3',
                    date:'1401/4/4',time:'12:30'
                },
                // {
                //     name:'حامد یوسف زاده',status:'4',city:'تهران',id:'4',
                //     date:'1401/4/4',time:'12:30'
                // },
                // {
                //     name:'حامد یوسف زاده',status:'1',city:'تهران',id:'5',
                //     date:'1401/4/4',time:'12:30'
                // },
                // {
                //     name:'حامد یوسف زاده',status:'2',city:'تهران',id:'6',
                //     date:'1401/4/4',time:'12:30'
                // },
                // {
                //     name:'حامد یوسف زاده',status:'3',city:'تهران',id:'7',
                //     date:'1401/4/4',time:'12:30'
                // },
                // {
                //     name:'حامد یوسف زاده',status:'4',city:'تهران',id:'8',
                //     date:'1401/4/4',time:'12:30'
                // },
                // {
                //     name:'حامد یوسف زاده',status:'1',city:'تهران',id:'9',
                //     date:'1401/4/4',time:'12:30'
                // },
                // {
                //     name:'حامد یوسف زاده',status:'1',city:'تهران',id:'10',
                //     date:'1401/4/4',time:'12:30'
                // }
            ]
        },
        async removeNotification({id}){
            return 'خطایی پیش آمده'
            return true
        },

        async erja({mozakere_konande, object}){
            let negotiatorUsername = getState().username //یوزر نیم شخصی که لاگین کرده
            let client_id = getState().client_id

            // ***************** ارجا به شخص دیگر ***************** 
            let apiBody = {
                client: client_id, // با توجه به غرفه 
                instance_id: object.process_instance_id,
                task_id:object.id,
                new_assignee: mozakere_konande.username,
            }
            debugger
            let result;
            let url = `${referralUrl}`
            try{
                result = await Axios.post(url, apiBody)
                if (result.data.id){
                    return true
                }
                debugger
            }
            catch(err){
                debugger
                if(err.response){
                    if (err.response.data){
                        return err.response.data.error.errorMessage
                    }
                }
                return 'خطایی پیش آمده'
            }
            return 'پاسخ نامشخص'


            // **************** شروع مذاکره ************************
            // let result;
            // let apiBody = {
            //     person_id: object.person_id,
            //     guest_id: object.guest_id,
            //     client: client_id,
            //     task_id: object.id,
            //     market: object.market
            // }
            // let url = `${startNegotiation}`
            // try {
            //     result = await Axios.post(url, apiBody)
            //     debugger
            //     return true
            // }
            // catch(err){
            //     return 'خطایی پیش آمده'
            // }

        },

        // ********************* انصراف از مذاکره *************
        async enseraf({description, object}){
            let task_id = object.id
            let guest_id = object.guest_id
            let url = `${discardRequeestUrl}?task_id=${task_id}&description=${description}&guest_id=${guest_id}`
            debugger
            let result;
            try{
                result = await Axios.get(url)
                // debugger
                return true
            }
            catch(err){
                debugger
                return 'خطایی پیش آمده'
            }

            // ***********************پایان مذاکره *****************
            // let negotiation_id = 1
            // let apiBody = {
            //     negotiation_id: negotiation_id,
            //     guest_id: object.guest_id,
            //     data: '',
            //     result: 'S',
            //     description: description,
            // }
            
            // let url = `${endNegotiation}/`
            // let result;
            // debugger
            // try{
            //     result = await Axios.post(url, apiBody)
            //     debugger
            //     return true
            // }
            // catch(err){
            //     debugger
            //     return 'خطایی در ثبت اطلاعات پیش آمده است'
            // }

        }
    }
}