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
            
    return {
        async mozakere_konandegan(){
            //return 'خطایی پیش آمده'
            return [
                {name:'علی قربانی',city:'تهران',table:'2',id:'0'},
                {name:'علی قربانی',city:'تهران',table:'2',id:'1'},
                {name:'علی قربانی',city:'تهران',table:'2',id:'2'},
                {name:'علی قربانی',city:'تهران',table:'2',id:'3'},
                {name:'علی قربانی',city:'تهران',table:'2',id:'4'}
            ]
        },
        async mozakere_haye_man(){
            
                
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
            return [
                //status : '2' {name,company,city,id,time,result}
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
                //status : '3' {name,company,city,id,time,referencedTo}
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
                //status : '3' {name,company,city,id,time}
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
            return 'خطایی پیش آمده'
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
        async erja({mozakere_konanade,object}){
            //return 'خطایی پیش آمده'
            return true
        },
        async enseraf({description,object}){
            //return 'خطایی پیش آمده'
            return true
        }
    }
}