import { data } from "jquery";


// const base_url = `http://manage.paydarnoor.ir`;
// const base_url = "registerapi.davat.app";
// const base_url = "http://localhost:8000";
// const base_url = "http://192.168.118.1:8000";
// const base_url = "http://192.168.10.50:8054";
// const base_url = "https://exhibition.bbeta.ir";
const base_url = "https://exhibitiontest.bbeta.ir";
// const base_url = "http://91.107.159.118:8054";

const searchPersonUrl = `${base_url}/person/v1/person`; // ادرس جستجوی مذاکره کننده
const userTaskUrl = `${base_url}/camunda/v1/usertask`; // ادرس میز کار
const historyUrl = `${base_url}/camunda/v1/history`; // آدرس تاریخچه
const referralUrl = `${base_url}/camunda/v1/changeassignee`; // آدرس ارجا به دیگری
const discardRequeestUrl = `${base_url}/camunda/v1/cancel`;
// const startNegotiation = `${base_url}/main/forms/`
const endNegotiation = `${base_url}/negotiation/end`;
const startNegotiation = `${base_url}/negotiation/v1/negotiation/`;

// let form1_default_market = ["R", "E", "A", "D", "TS"]; // لامپ پایدار
// let form2_default_market = ["GO", "P", "Co"]; // لامپ پایدار سازمانی
// let form3_default_market = ["P"]; // آریا

let form1_default_market = ["AG", "E", "A", "S", "T"]; // لامپ پایدار
let form2_default_market = ["G", "PR", "CO"]; // لامپ پایدار سازمانی
let form3_default_market = ["P"]; // آریا

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function getApiFunctions({ Axios, getState }) {
  //status:'0',text:'در انتظار مذاکره'
  //status:'1',text:'در حال مذاکره'
  //status:'2',text:'پایان مذاکره'
  //status:'3',text:'ارجاع به دیگری'
  //status:'4',text:'انصراف از مذاکره'

  //result:'0',text:'موفق'
  //result:'1',text:'نا موفق'
  //result:'2',text:'نیاز به تماس'
  //result:'3',text:'نیاز به پیگیری'

  let form1_default = {
    javaze_kasb_darad: "",
    malek_mibashad: "",
    pakhsh_darad: "",
    systeme_haml_va_naghl_darad: "",
    ameliate_foroosh_ba_brande_khasi_darad: "",
    brand_ha: "",
    sabeghe_faaliat: "",
    tedade_karkonan: "",
    hajme_forooshe_lamp: "",
    hajme_forooshe_cheragh: "",
    avamele_tain_konande_dar_foroosh: [
      "ارائه محصول با قیمت مناسب نسبت به سایر رقبا (بدون توجه به کیفیت کالا)",
      "ارائه محصول با کیفیت بالا (صرف نظر از قیمت)",
      "ارائه گارانتی و خدمات پس از فروش مناسب به مشتری",
      "اعطای حاشیه سود بالا از طرف شرکت به فروشگاه",
    ],
    darsade_forooshe_led_na_shenakhte: false,
    sahme_forooshe_lamp_ta_2_sale_ayande: false,
    tozihate_bishtar: "",
    natije_mozakere: false,
  };

  let form2_default = {
    noe_poroje: "",
    makane_ejraye_poroje: "",
    vaziate_ejraye_poroje: "",
    khadamate_morede_niaz: [""],
    mahsoolate_morede_niaz: [""],
    poroje_darid: "",
    tozihe_poroje: "",
    mizane_shenakht: "",
    az_mahsoolate_ma_estefade_karid: "",
    name_mahsoolati_ke_estefade_kardid: "",
    kalaye_pishnahadi: "",
    tozihe_bishtar: "",
    natije_mozakere: "",
  };
  let form3_default = {
    zamine_faalit: "",
    ameliate_foroosh_ba_brande_khasi_darad: "",
    brand_ha: "",
    noe_hamkari: "",
    natije_mozakere: "",
  };

  return {
    // **********لیست مذاکره کنندگان *****************
    async mozakere_konandegan(parameter,{client_id,username}) {
      let response = await Axios.get(`${base_url}/api/users/personnels`);
      let result = response.data.data.map((o) => {
        return {
          id: o.id,
          table: o.table,
          city: o.province_name,
          name: `${o.first_name} ${o.last_name}`,
          src: `${base_url}${o.profile_photo_url}`,
          status: o.personnel_status_desc,
          username: o.username,
        };
      });
      result = result.filter((o) => o.username !== username);
      return {response,result};
    },

    // **********لیست مذاکره های من *****************
    async mozakere_haye_man() {
      let client_id = getState().client_id;
      let roles = getState().roles;
      let negotiatorUsername = getState().username;
      let negotiator_username = getState().username;
      let result, state, formType, formTitle, formModel, form, time, activityZone;
      let attendance, user;
      let current_date = getCurrentDate();

      let url = `${base_url}/api/attendance_tracker/negotiations?negotiator_username=${negotiator_username}&created_at=${current_date}&negotiation_status=1,2`;
      // let url = `${base_url}/api/attendance_tracker/negotiations?negotiator_username=${negotiator_username}&negotiation_status=1,2`;
      let response_data = await Axios.get(url);
      result = response_data.data.data.map((o) => {
        attendance = o.attendance_info;
        user = attendance.user_info;

        if (form2_default_market.includes(user.business_scope)) {
          //"Organizational"
          formType = 2;
          formTitle = "لامپ پایدار سازمانی";
          formModel = form2_default;
        }
        if (form1_default_market.includes(user.business_scope)) {
          formType = 1;
          formTitle = "لامپ پایدار";
          formModel = form1_default;
        }
        if (form3_default_market.includes(user.business_scope)) {
          formType = 3;
          formTitle = "آریا";
          formModel = form3_default;
        }
        form = {
          type: formType,
          title: formTitle,
          model: formModel,
        };
        let name = `${user.first_name} ${user.last_name}` || "";
        if (o.negotiation_status === "0") {state = "0";} // o.state == 1 => ثبت اظلاعات
        else if (o.negotiation_status === "1") {state = "0";} // o.state == 2 => در انتظار مذاکره
        else if (o.negotiation_status === "2") {state = "1";} // o.state == 3 => در حال مذاکره
        else if (o.negotiation_status === "5") {state = "2";} // o.state == 4 => پایان مذاکره
        else if (o.negotiation_status === "3") {state = "3";} // o.state == 6 => ارجاع به دیگری
        else if (o.negotiation_status === "4") {state = "4";} // o.state == 5 => انصراف از مذاکره
        return {
          name: name,
          status: state,
          company: user.company_name || "",
          city: user.province_name || "",
          id: o.id,
          process_instance_id: o.attendance_info.id,
          time: new Date(o.created_at).getTime(),
          guest_id: user.id,
          person_id: o.negotiator,
          market: user.business_scope,
          cardCode: user.b1_code,
          mobile: user.phone_number,
          activityZone: user.business_scope_desc,
          phone: user.telephone,
          form: form,
          negotiation_id: o.id,
        };
      });
      return result;

      // return [
      //     //status : '0' {name,company,city,id,time}
      //     {
      //         name:'حامد یوسف زاده',status:'0',company:'شرکت طلوع روشن نور',city:'تهران',id:'00',mobile:'09123534314',activityZone:'الکتریکی',
      //         time:new Date().getTime(),phone:'02188050006',cardCode:'123456',form:{type:'1',title:'فرم غرفه پایدار',model:form1_default}
      //     },
      //     //status : '1' {name,company,city,id,time}
      //     {
      //         name:'حامد یوسف زاده',status:'1',company:'شرکت طلوع روشن نور',city:'تهران',id:'10',mobile:'09123534314',activityZone:'الکتریکی',
      //         time:new Date().getTime(),phone:'02188050006',cardCode:'123456',form:{type:'2',title:'فرم غرفه سازمانی',model:form2_default}
      //     }
      // ]

      // let url = `${userTaskUrl}/${client_id}/${negotiatorUsername}/`
      // let url = `${userTaskUrl}/`
      let urlBody = {
        assignee: negotiatorUsername,
        client: client_id,
      };

      try {
        result = await Axios.post(url, urlBody);
      } catch (err) {
        console.log("mozakere_haye_man", err);
        return [];
      }

      // if(client_id === 3 && roles.indexOf('Organizational') !== -1){ //"Organizational"
      //     formType = 2
      //     formTitle = 'لامپ پایدار سازمانی'
      //     formModel = form2_default
      // }
      // if(client_id === 3 && roles.indexOf('Sales') !== -1){
      //     formType = 1
      //     formTitle = 'لامپ پایدار'
      //     formModel = form1_default
      // }
      // if(client_id === 2){
      //     formType = 3
      //     formTitle = 'آریا'
      //     formModel = form3_default
      // }
      // form = {
      //     type: formType,
      //     title: formTitle,
      //     model: formModel,
      // }
      let resMapping = result.data.map((o) => {
        let state;
        let formType;
        let formTitle;
        let formModel;
        let form;
        let time;
        let activityZone;
        // {value:'0',text:'در انتظار مذاکره',color:'#108ABE'},
        // {value:'1',text:'در حال مذاکره',color:'#CD9100'},
        // {value:'2',text:'پایان مذاکره',color:'#107C10'},
        // {value:'3',text:'ارجاع به دیگری',color:'#814696'},
        // {value:'4',text:'انصراف از مذاکره',color:'#A4262C'}
        if (form2_default_market.includes(o.market)) {
          //"Organizational"
          formType = 2;
          formTitle = "لامپ پایدار سازمانی";
          formModel = form2_default;
        }
        if (form1_default_market.includes(o.market)) {
          formType = 1;
          formTitle = "لامپ پایدار";
          formModel = form1_default;
        }
        if (form3_default_market.includes(o.market)) {
          formType = 3;
          formTitle = "آریا";
          formModel = form3_default;
        }
        form = {
          type: formType,
          title: formTitle,
          model: formModel,
        };

        if (o.state === 1) {state = "0";} // o.state == 1 => ثبت اظلاعات
        else if (o.state === 2) {state = "0";} // o.state == 2 => در انتظار مذاکره
        else if (o.state === 3) {state = "1";} // o.state == 3 => در حال مذاکره
        else if (o.state === 4) {state = "2";} // o.state == 4 => پایان مذاکره
        else if (o.state === 5) {state = "4";} // o.state == 5 => انصراف از مذاکره
        else if (o.state === 6) {state = "3";} // o.state == 6 => ارجاع به دیگری
        else {state = "0";}
        if (o.market === "C") {activityZone = "بازرگانی";}
        if (o.market === "G") {activityZone = "سازمان دولتی";}
        if (o.market === "CO") {activityZone = "پیمانکار";}
        if (o.market === "P") {activityZone = "تولید کننده";}
        if (o.market === "S") {activityZone = "پخش کننده";}
        if (o.market === "E") {activityZone = "الکتریکی";}
        if (o.market === "T") {activityZone = "بازرگانی";}
        if (o.market === "AG") {activityZone = "نمایندگی";}
        if (o.market === "PR") {activityZone = "پروژه";}
        if (o.market === "A") {activityZone = "عامل";}
        if (o.negotiation_created_at) {time = o.negotiation_created_at;}
        if (!o.negotiation_created_at) {time = o.created;}
        return {
          name: `${o.first_name} ${o.last_name}` || "",
          status: state,
          company: o.company_name || "",
          city: o.province || "",
          id: o.id_,
          process_instance_id: o.process_instance_id,
          time: new Date(time).getTime(),
          guest_id: o.guest_id,
          person_id: o.person_id,
          market: o.market,
          cardCode: o.b1_code,
          mobile: o.mobile_number,
          activityZone: activityZone,
          phone: o.phone,
          form: form,
          negotiation_id: o.negotiation_id,
        };
      });
      // return []
      return resMapping;

      // return [
      //     //status : '0' {name,company,city,id,time}
      //     {
      //         name:'حامد یوسف زاده',status:'0',company:'شرکت طلوع روشن نور',city:'تهران',id:'00',
      //         time:new Date().getTime()
      //     },
      //     //status : '1' {name,company,city,id,time}
      //     {
      //         name:'حامد یوسف زاده',status:'1',company:'شرکت طلوع روشن نور',city:'تهران',id:'10',
      //         time:new Date().getTime()
      //     }
      // ]
    },
    async tarikhche() {
        let client_id = getState().client_id;
        let negotiator_username = getState().username; //یوزر نیم شخصی که لاگین کرده
        let url, result, attendance, user, name, response_data, business_scope;
        let formType, formTitle, formModel, form, state, disable;
        
        url = `${base_url}/api/attendance_tracker/negotiations?negotiator_username=${negotiator_username}&negotiation_status=3,4,5`;
        
        try {
            response_data = await Axios.get(url)
            result = response_data.data.data.map((o) => {
                attendance = o.attendance_info;
                user = attendance.user_info;
                name = `${user.first_name} ${user.last_name}`
                business_scope = user.business_scope
                if (attendance.result_status !== null) {
                  result = attendance.result_status;
                  if (result === "1") {result = "0";} //'موفق ها'
                  if (result === "4") {result = "1";} //'نا موفق ها'
                  if (result === "2") {result = "2";} //'نیاز به تماس ها'
                  if (result === "3") {result = "3";} //'نیاز به پیگیری ها'
                }
                
                if (Object.values(o.negotiation_status).length !== 0) {
                    if (o.negotiation_status === "0") {state = "0";} // o.state == 1 => ثبت اظلاعات
                    else if (o.negotiation_status === "1") {state = "0";} // o.state == 2 => در انتظار مذاکره
                    else if (o.negotiation_status === "2") {state = "1";} // o.state == 3 => در حال مذاکره
                    else if (o.negotiation_status === "5") {state = "2";} // o.state == 4 => پایان مذاکره
                    else if (o.negotiation_status === "3") {state = "3";} // o.state == 6 => ارجاع به دیگری
                    else if (o.negotiation_status === "4") {state = "4";} // o.state == 5 => انصراف از مذاکره
                    else {state = "3";}
                } else {
                    state = "3"
                }
                if (form2_default_market.includes(business_scope)) {
                    //"Organizational"
                    formType = 2;
                    formTitle = "لامپ پایدار سازمانی";
                    formModel = form2_default;
                  }
                  if (form1_default_market.includes(business_scope)) {
                    formType = 1;
                    formTitle = "لامپ پایدار";
                    formModel = form1_default;
                  }
                  if (form3_default_market.includes(business_scope)) {
                    formType = 3;
                    formTitle = "آریا";
                    formModel = form3_default;
                  }
                  if (o.form) {
                    formModel = o.form.form_data;
                  }
                  if (state !== "2") {
                    disable = true;
                  }
          
                  form = {
                    type: formType,
                    title: formTitle,
                    model: formModel,
                    disable: disable,
                  };
                return {
                    name: name || "",
                    status: state || "0",
                    company: user.company_name || "",
                    city: user.province_name || "",
                    id: o.id || "0",
                    time: new Date(o.updated_at).getTime(),
                    result: result || undefined,
                    referencedTo: o.referred_to,
                    guest_id: user.id,
                    person_id: o.negotiator_id,
                    market: business_scope,
                    cardCode: user.b1_code,
                    mobile: user.phone_number,
                    activityZone: user.business_scope_desc,
                    phone: user.tele_phone,
                    description: o.description,
                    form: form,
                    model: form.form_data
                };
            })

            let resMapping = result.sort(
                (objA, objB) => Number(objB.time) - Number(objA.time)
              );
            return resMapping;
        } catch (err) {
            debugger
            return []
        }
      
        // return [
      //     //status : '2' {name,company,city,id,time,result} //پایان یافته
      //     {
      //         name:'حامد یوسف زاده',status:'2',company:'شرکت طلوع روشن نور',city:'تهران',id:'21',
      //         time:new Date().getTime(),result:'0'
      //     },
      //     {
      //         name:'مجید حسینی',status:'2',company:'شرکت طلوع روشن نور',city:'اصفهان',id:'21',
      //         time:new Date().getTime(),result:'1'
      //     },
      //     {
      //         name:'علی رضایی',status:'2',company:'شرکت طلوع روشن نور',city:'تبریز',id:'22',
      //         time:new Date().getTime(),result:'2'
      //     },
      //     {
      //         name:'رضا پورمحمدی',status:'2',company:'شرکت طلوع روشن نور',city:'مشهد',id:'23',
      //         time:new Date().getTime(),result:'3'
      //     },
      //     //status : '3' {name,company,city,id,time,referencedTo} // ارجاع شده
      //     {
      //         name:'سلمان طیبی',status:'3',company:'شرکت طلوع روشن نور',city:'ارومیه',id:'31',
      //         time:new Date().getTime(),referencedTo:'جواد زمانی',description:'علت ارجاع اینست که این یک متن تستی برای نمایش در کانفرم باکس ری اکت سوپر اپ است'
      //     },
      //     {
      //         name:'محمد رضا پور عسکر',status:'3',company:'شرکت طلوع روشن نور',city:'اصفهان',id:'32',
      //         time:new Date().getTime(),referencedTo:'مهدی شاد',description:'علت ارجاع اینست که این یک متن تستی برای نمایش در کانفرم باکس ری اکت سوپر اپ است'
      //     },
      //     {
      //         name:'محمد شریف فیض',status:'3',company:'شرکت طلوع روشن نور',city:'تهران',id:'33',
      //         time:new Date().getTime(),referencedTo:'شاهین قلی',description:'علت ارجاع اینست که این یک متن تستی برای نمایش در کانفرم باکس ری اکت سوپر اپ است'
      //     },
      //     {
      //         name:'شیما رادمنش',status:'3',company:'شرکت طلوع روشن نور',city:'مشهد',id:'34',
      //         time:new Date().getTime(),referencedTo:'کوروش شجاعی',description:'علت ارجاع اینست که این یک متن تستی برای نمایش در کانفرم باکس ری اکت سوپر اپ است'
      //     },
      //     //status : '4' {name,company,city,id,time} //انصراف
      //     {
      //         name:'احمد عزیزی',status:'4',company:'شرکت طلوع روشن نور',city:'اصفهان',id:'41',
      //         time:new Date().getTime(),description:'علت انصراف اینست که این یک متن تستی برای نمایش در کانفرم باکس ری اکت سوپر اپ است'
      //     },
      //     {
      //         name:'مجتبی بهمنی',status:'4',company:'شرکت طلوع روشن نور',city:'تهران',id:'42',
      //         time:new Date().getTime(),description:'علت انصراف اینست که این یک متن تستی برای نمایش در کانفرم باکس ری اکت سوپر اپ است'
      //     },
      //     {
      //         name:'همایون ارزنده',status:'4',company:'شرکت طلوع روشن نور',city:'تبریز',id:'43',
      //         time:new Date().getTime(),description:'علت انصراف اینست که این یک متن تستی برای نمایش در کانفرم باکس ری اکت سوپر اپ است'
      //     },
      //     {
      //         name:'شایان پیر مرادی',status:'4',company:'شرکت طلوع روشن نور',city:'تهران',id:'44',
      //         time:new Date().getTime(),description:'علت انصراف اینست که این یک متن تستی برای نمایش در کانفرم باکس ری اکت سوپر اپ است'
      //     },
      // ]
      let res;

      let negotiatorUsername = getState().username; //یوزر نیم شخصی که لاگین کرده
      
      url = `${historyUrl}/`;
      let apiBody = {
        client_id: client_id,
        assignee: negotiatorUsername,
      };

      try {
        res = await Axios.post(url, apiBody);
      } catch (err) {
        console.log("tarikhche", err);
        return [];
      }

      let resMapping = res.data.map((o) => {
        let formType;
        let formTitle;
        let formModel;
        let form;
        let state;
        let name;
        let city;
        let company_name;
        let full_name;
        let result;
        let disable;
        let activityZone;
        if (Object.values(o.state).length !== 0) {
          if (o.state.id === 1) {state = 0;} // o.state == 1 => ثبت اظلاعات
          else if (o.state.id === 2) {state = "0";} // o.state == 2 => در انتظار مذاکره
          else if (o.state.id === 3) {state = "1";} // o.state == 3 => در حال مذاکره
          else if (o.state.id === 4) {state = "2";} // o.state == 4 => پایان مذاکره
          else if (o.state.id === 5) {state = "4";} // o.state == 5 => انصراف از مذاکره
          else if (o.state.id === 6) {state = "3";} // o.state == 6 => ارجاع به دیگری
          else {state = "3";}
        } else {
            state = "3"
        }
        if (form2_default_market.includes(o.guest.market)) {
          //"Organizational"
          formType = 2;
          formTitle = "لامپ پایدار سازمانی";
          formModel = form2_default;
        }
        if (form1_default_market.includes(o.guest.market)) {
          formType = 1;
          formTitle = "لامپ پایدار";
          formModel = form1_default;
        }
        if (form3_default_market.includes(o.guest.market)) {
          formType = 3;
          formTitle = "آریا";
          formModel = form3_default;
        }
        if (o.form) {
          formModel = o.form;
        }
        if (state !== "2") {
          disable = true;
        }

        form = {
          type: formType,
          title: formTitle,
          model: formModel,
          disable: disable,
        };

        if (o.guest !== null) {
          if (Object.values(o.guest).length !== 0) {
            name = `${o.guest.first_name} ${o.guest.last_name}`;
            company_name = o.guest.company_name;
            city = o.guest.province;
            if (o.guest.market === "C") {activityZone = "بازرگانی";}
            if (o.guest.market === "G") {activityZone = "سازمان دولتی";}
            if (o.guest.market === "CO") {activityZone = "پیمانکار";}
            if (o.guest.market === "P") {activityZone = "تولید کننده";}
            if (o.guest.market === "S") {activityZone = "پخش کننده";}
            if (o.guest.market === "E") {activityZone = "الکتریکی";}
            if (o.guest.market === "T") {activityZone = "بازرگانی";}
            if (o.guest.market === "AG") {activityZone = "نمایندگی";}
            if (o.guest.market === "PR") {activityZone = "پروژه";}
            if (o.guest.market === "A") {activityZone = "عامل";}
          }
        }

        if (o.referral !== null) {
          if (Object.values(o.referral).length !== 0) {
            full_name = o.referral.full_name;
          }
        }

        if (o.negotiaition !== null) {
          if (Object.values(o.negotiaition).length !== 0) {
            result = o.negotiaition.result;
            if (result === "S") {result = "0";} //'موفق ها'
            if (result === "U") {result = "1";} //'نا موفق ها'
            if (result === "C") {result = "2";} //'نیاز به تماس ها'
            if (result === "N") {result = "3";} //'نیاز به پیگیری ها'
          }
        }

        return {
          name: name || "",
          status: state || "0",
          company: company_name || "",
          city: city || "",
          id: o.task_id || "0",
          time: new Date(o.updated_at).getTime(),
          result: result || undefined,
          referencedTo: full_name,
          guest_id: o.guest_id,
          person_id: o.person_id,
          market: o.guest.market,
          cardCode: o.guest.b1_code,
          mobile: o.guest.mobile_number,
          activityZone: activityZone,
          phone: o.guest.phone,
          description: o.description,
          form: form,
        };
      });

      resMapping = resMapping.sort(
        (objA, objB) => Number(objB.time) - Number(objA.time)
      );
      return resMapping;

      return [
        //status : '2' {name,company,city,id,time,result} //پایان یافته
        {
          name: "حامد یوسف زاده",
          status: "2",
          company: "شرکت طلوع روشن نور",
          city: "تهران",
          id: "21",
          time: new Date().getTime(),
          result: "0",
        },
        {
          name: "مجید حسینی",
          status: "2",
          company: "شرکت طلوع روشن نور",
          city: "اصفهان",
          id: "21",
          time: new Date().getTime(),
          result: "1",
        },
        {
          name: "علی رضایی",
          status: "2",
          company: "شرکت طلوع روشن نور",
          city: "تبریز",
          id: "22",
          time: new Date().getTime(),
          result: "2",
        },
        {
          name: "رضا پورمحمدی",
          status: "2",
          company: "شرکت طلوع روشن نور",
          city: "مشهد",
          id: "23",
          time: new Date().getTime(),
          result: "3",
        },
        //status : '3' {name,company,city,id,time,referencedTo} // ارجاع شده
        {
          name: "سلمان طیبی",
          status: "3",
          company: "شرکت طلوع روشن نور",
          city: "ارومیه",
          id: "31",
          time: new Date().getTime(),
          referencedTo: "جواد زمانی",
        },
        {
          name: "محمد رضا پور عسکر",
          status: "3",
          company: "شرکت طلوع روشن نور",
          city: "اصفهان",
          id: "32",
          time: new Date().getTime(),
          referencedTo: "مهدی شاد",
        },
        {
          name: "محمد شریف فیض",
          status: "3",
          company: "شرکت طلوع روشن نور",
          city: "تهران",
          id: "33",
          time: new Date().getTime(),
          referencedTo: "شاهین قلی",
        },
        {
          name: "شیما رادمنش",
          status: "3",
          company: "شرکت طلوع روشن نور",
          city: "مشهد",
          id: "34",
          time: new Date().getTime(),
          referencedTo: "کوروش شجاعی",
        },
        //status : '4' {name,company,city,id,time} //انصراف
        {
          name: "احمد عزیزی",
          status: "4",
          company: "شرکت طلوع روشن نور",
          city: "اصفهان",
          id: "41",
          time: new Date().getTime(),
        },
        {
          name: "مجتبی بهمنی",
          status: "4",
          company: "شرکت طلوع روشن نور",
          city: "تهران",
          id: "42",
          time: new Date().getTime(),
        },
        {
          name: "همایون ارزنده",
          status: "4",
          company: "شرکت طلوع روشن نور",
          city: "تبریز",
          id: "43",
          time: new Date().getTime(),
        },
        {
          name: "شایان پیر مرادی",
          status: "4",
          company: "شرکت طلوع روشن نور",
          city: "تهران",
          id: "44",
          time: new Date().getTime(),
        },
      ];
    },
    async notifications() {
      // return 'خطایی پیش آمده'
      return [
        {
          name: "حامد یوسف زاده",
          status: "0",
          city: "تهران",
          id: "0",
          date: "1401/4/4",
          time: "12:30",
        },
        {
          name: "حامد یوسف زاده",
          status: "1",
          city: "تهران",
          id: "1",
          date: "1401/4/4",
          time: "12:30",
        },
        {
          name: "حامد یوسف زاده",
          status: "2",
          city: "تهران",
          id: "2",
          date: "1401/4/4",
          time: "12:30",
        },
        {
          name: "حامد یوسف زاده",
          status: "3",
          city: "تهران",
          id: "3",
          date: "1401/4/4",
          time: "12:30",
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
      ];
    },
    async removeNotification({ id }) {
      return "خطایی پیش آمده";
      return true;
    },

    // ***************** ارجا به شخص دیگر *****************
    async erja({ mozakere_konande, object, description }) {
      let negotiator_username = getState().username; //یوزر نیم شخصی که لاگین کرده
      let client_id = getState().client_id;
      let response_data;
      let url = `${base_url}/api/attendance_tracker/negotiations/refer/${object.id}`;
      let body = {
        negotiator_id: mozakere_konande.id,
        registrar_username: negotiator_username,
        referral_reason: description,
      };

      try {
        response_data = await Axios.post(url, body);
        return true;
      } catch (err) {
        debugger;
        return err.response.data.data.message;
      }

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
      //     return true
      // }
      // catch(err){
      //     return 'خطایی پیش آمده'
      // }
    },

    // ********************* انصراف از مذاکره *************
    async enseraf({ description, object }) {
      let negotiator_username = getState().username;
      let task_id = object.id;
      let guest_id = object.guest_id;
      let url, body, result;
      url = `${base_url}/api/attendance_tracker/negotiations/cancel/${object.id}`;
      body = {
        registrar_username: negotiator_username,
        cancelation_reason: description,
      };
      try {
        result = await Axios.post(url, body);
        return true;
      } catch (err) {
        debugger;
        return err.response.data.data.message;
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
      // try{
      //     result = await Axios.post(url, apiBody)
      //     return true
      // }
      // catch(err){
      //     return 'خطایی در ثبت اطلاعات پیش آمده است'
      // }
    },

    async sabte_mozakere({ mode, type, model }) {
      let registrar_username = getState().username;
      //mode: 'submit' | 'draft'
      //type: '1' | '2'
      //model: اطلاعات پر شده در فرم
      //return 'خطایی پیش آمده'
      let url, body, res, result, response_data;

      url = `${base_url}/api/attendance_tracker/negotiations_form/register/${model.id}`
      if (model.natije_mozakere === "0") {result = "1";} //موفقیت آمیز
      if (model.natije_mozakere === "1") {result = "4";} // ناموفق
      if (model.natije_mozakere === "2") {result = "3";} // نیاز به پیگیری
      if (model.natije_mozakere === "3") {result = "2";} // نیاز به تماس
      body = {
        form_data: model,
        saved_as: mode,
        result: result,
        registrar_username: registrar_username,
      }
      try {
        response_data = await Axios.post(url, body)
        return true
      }catch(err){
        debugger
        return "خطا در ثبت مذاکره"
      }
      // url = `${startNegotiation}`
      // ("S","succesfull"), # موفقیت آمیز
      // ("C","call needed"), #نیاز به تماس
      // ("N","need to follow up"), # نیاز به پیگیری
      // ("U","unsuccesfull"),


      // if (model.natije_mozakere === "0") {result = "S";} //موفقیت آمیز
      // if (model.natije_mozakere === "1") {result = "U";} // ناموفق
      // if (model.natije_mozakere === "2") {result = "N";} // نیاز به پیگیری
      // if (model.natije_mozakere === "3") {result = "C";} // نیاز به تماس
      // let apiBody = {
      //   person: model.person,
      //   guest: model.guest,
      //   id: model.id,
      //   market: model.market,
      //   negotiation_id: model.negotiation_id,
      //   process_instance_id: model.process_instance_id,
      //   form_data: model,
      //   type: mode, // برای اتمام مذاکره این مقدار باید ست شود
      //   result: result,
      // };

      // try {
      //   res = await Axios.post(url, apiBody);
      // } catch (err) {
      //   console.log("sabte_mozakere", err);
      //   return "خطا در ثبت مذاکره";
      // }
      // return true;
    },

    // ************************************
    async shorooe_mozakere(obj) {
      let registrar_username = getState().username;
      let url, response_data, data, body;
      url = `${base_url}/api/attendance_tracker/negotiations/start/${obj.id}` 
      
      body = {
        registrar_username: registrar_username
      }

      try {
        response_data = await Axios.post(url, body)

        if (response_data.data.is_success === true) {
          data = response_data.data.data
          obj.form.model = data.form.form_data;
          obj.negotiation_id = data.id;
          obj.form.model.negotiation_id = data.id;
          obj.form.model.guest = obj.guest_id;
          obj.form.model.person = obj.person_id;
          obj.form.model.id = obj.id;
          obj.form.model.market = obj.market;
          obj.form.model.process_instance_id = obj.process_instance_id;
        }

      } catch (err) {
        debugger;
        return 'err'
      }
    },
  };
}
