import { data } from "jquery";


// const base_url = `http://manage.paydarnoor.ir`;
// const base_url = "registerapi.davat.app";
// const base_url = "http://localhost:8000";
// const base_url = "http://192.168.118.1:8000";
// const base_url = "http://192.168.10.50:8054";
const base_url = "https://exhibition.bbeta.ir";
// const base_url = "https://exhibitiontest.bbeta.ir";
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

let form1_default_market = ["AG", "E", "A", "S", "T", "TS"]; // لامپ پایدار
let form2_default_market = ["G", "PR", "CO", "Co"]; // لامپ پایدار سازمانی
let form3_default_market = ["P"]; // آریا

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function apis({ Axios, getState }) {
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
    async mozakere_konandegan() {
      let client_id = getState().client_id;
      let negotiator_username = getState().username;
      let result;
      let url = `${base_url}/api/users/personnels`;
      try {
        let response_data = await Axios.get(url);
        result = response_data.data.data.map((o) => {
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
        result = result.filter((o) => {
          //فیلتر خود آن مذاکره کننده
          return o.username !== negotiator_username;
        });

        return result;
      } catch (err) {
        debugger;
        return "خطا در دریافت لیست مذاکره کنندگان";
      }
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
        if (o.form){
          form = {
            type: o.form.type,
            title: o.form.title,
            model: o.form.form_data,
          };
        } else {
          console.log("not find form");
          form = {
            type: 1,
            title: "بروکس",
            model: form1_default,
          };
        }

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
          related_company_name: attendance.company_name,
          negotiation_id: o.id,
        };
      });
      return result;
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
        
                form = {
                  type: formType,
                  title: formTitle,
                  model: formModel,
                  disable: disable,
                };

                if (o.form){
                  form = {
                    type: o.form.type,
                    title: o.form.title,
                    model: o.form.form_data,
                    disable: disable,
                  };
                } else {
                  console.log("not find form");
                  form = {
                    type: 1,
                    title: "بروکس",
                    model: form1_default,
                    disable: disable
                  };
                }
                  
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
                    related_company_name: attendance.company_name,
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
      
    },
    async notifications() {
      // return 'خطایی پیش آمده'
      return [
        {name: "حامد یوسف زاده",status: "0",city: "تهران",id: "0",date: "1401/4/4", time: "12:30",},
        {name: "حامد یوسف زاده",status: "1",city: "تهران",id: "1",date: "1401/4/4",time: "12:30",},
        {name: "حامد یوسف زاده",status: "2",city: "تهران",id: "2",date: "1401/4/4",time: "12:30",},
        {name: "حامد یوسف زاده",status: "3",city: "تهران",id: "3",date: "1401/4/4",time: "12:30",},
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
        form_type: type,
        registrar_username: registrar_username,
      }
      try {
        response_data = await Axios.post(url, body)
        return true
      }catch(err){
        debugger
        return "خطا در ثبت مذاکره"
      }
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
