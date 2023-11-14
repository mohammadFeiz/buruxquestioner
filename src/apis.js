

// const base_url = `http://manage.paydarnoor.ir`;
// const base_url = "registerapi.davat.app";
// const base_url = "http://localhost:8000";
// const base_url = "http://192.168.118.1:8000";
// const base_url = "http://192.168.10.50:8054";
const base_url = "https://exhibition.bbeta.ir";
// const base_url = "https://exhibitiontest.bbeta.ir";
// const base_url = "http://91.107.159.118:8054";

// let form1_default_market = ["AG", "E", "A", "S", "T", "TS"]; // لامپ پایدار
// let form2_default_market = ["G", "PR", "CO", "Co"]; // لامپ پایدار سازمانی
// let form3_default_market = ["P"]; // آریا

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function getApiFunctions({ Axios }) {
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
    async mozakere_konandegan(parameter, { username }) {
      let negotiator_username = username;
      let url = `${base_url}/api/users/personnels`;
      let response = await Axios.get(url);
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
      result = result.filter((o) => {
        //فیلتر خود آن مذاکره کننده
        return o.username !== negotiator_username;
      });

      return { response, result };
    },

    // **********لیست مذاکره های من *****************
    async mozakere_haye_man(parameter, { username }) {
      let negotiator_username = username;
      let state, formType, formTitle, formModel, form, time, activityZone;
      let attendance, user;
      let current_date = getCurrentDate();

      let url = `${base_url}/api/attendance_tracker/negotiations?negotiator_username=${negotiator_username}&created_at=${current_date}&negotiation_status=1,2`;
      // let url = `${base_url}/api/attendance_tracker/negotiations?negotiator_username=${negotiator_username}&negotiation_status=1,2`;
      let response = await Axios.get(url);
      let result = response.data.data.map((o) => {
        attendance = o.attendance_info;
        user = attendance.user_info;
        if (o.form) {
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
        if (o.negotiation_status === "0") { state = "0"; } // o.state == 1 => ثبت اظلاعات
        else if (o.negotiation_status === "1") { state = "0"; } // o.state == 2 => در انتظار مذاکره
        else if (o.negotiation_status === "2") { state = "1"; } // o.state == 3 => در حال مذاکره
        else if (o.negotiation_status === "5") { state = "2"; } // o.state == 4 => پایان مذاکره
        else if (o.negotiation_status === "3") { state = "3"; } // o.state == 6 => ارجاع به دیگری
        else if (o.negotiation_status === "4") { state = "4"; } // o.state == 5 => انصراف از مذاکره
        return {
          name: name,
          status: state,
          company: user.company_name || "",
          related_company_name: attendance.company_name ||"",
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
      return { response, result };
    },
    async tarikhche(parameter, { username }) {
      let negotiator_username = username; //یوزر نیم شخصی که لاگین کرده
      let attendance, user, name, business_scope;
      let formType, formTitle, formModel, form, state, disable;

      let url = `${base_url}/api/attendance_tracker/negotiations?negotiator_username=${negotiator_username}&negotiation_status=3,4,5`;

      let response = await Axios.get(url)
      let status;
      let result = response.data.data.map((o) => {
        attendance = o.attendance_info;
        user = attendance.user_info;
        name = `${user.first_name} ${user.last_name}`
        business_scope = user.business_scope
        if (attendance.result_status !== null) {
          status = attendance.result_status;
          if (status === "1") { status = "0"; } //'موفق ها'
          if (status === "4") { status = "1"; } //'نا موفق ها'
          if (status === "2") { status = "2"; } //'نیاز به تماس ها'
          if (status === "3") { status = "3"; } //'نیاز به پیگیری ها'
        }

        if (Object.values(o.negotiation_status).length !== 0) {
          if (o.negotiation_status === "0") { state = "0"; } // o.state == 1 => ثبت اظلاعات
          else if (o.negotiation_status === "1") { state = "0"; } // o.state == 2 => در انتظار مذاکره
          else if (o.negotiation_status === "2") { state = "1"; } // o.state == 3 => در حال مذاکره
          else if (o.negotiation_status === "5") { state = "2"; } // o.state == 4 => پایان مذاکره
          else if (o.negotiation_status === "3") { state = "3"; } // o.state == 6 => ارجاع به دیگری
          else if (o.negotiation_status === "4") { state = "4"; } // o.state == 5 => انصراف از مذاکره
          else { state = "3"; }
        } else {
          state = "3"
        }

        form = {
          type: formType,
          title: formTitle,
          model: formModel,
          disable: disable,
        };

        if (o.form) {
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
          result: status || undefined,
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
      return { response, result: resMapping };
    },
    async notifications() {
      // return 'خطایی پیش آمده'
      return [
        { name: "حامد یوسف زاده", status: "0", city: "تهران", id: "0", date: "1401/4/4", time: "12:30", },
        { name: "حامد یوسف زاده", status: "1", city: "تهران", id: "1", date: "1401/4/4", time: "12:30", },
        { name: "حامد یوسف زاده", status: "2", city: "تهران", id: "2", date: "1401/4/4", time: "12:30", },
        { name: "حامد یوسف زاده", status: "3", city: "تهران", id: "3", date: "1401/4/4", time: "12:30", },
      ];
    },
    async removeNotification({ id }) {
      return "خطایی پیش آمده";
      return true;
    },

    // ***************** ارجا به شخص دیگر *****************
    async erja({ mozakere_konande, object, description }, { username }) {
      let negotiator_username = username; //یوزر نیم شخصی که لاگین کرده
      let url = `${base_url}/api/attendance_tracker/negotiations/refer/${object.id}`;
      let body = {
        negotiator_id: mozakere_konande.id,
        registrar_username: negotiator_username,
        referral_reason: description,
      };
      let response = await Axios.post(url, body);
      return {response,result:true};
    },

    // ********************* انصراف از مذاکره *************
    async enseraf({ description, object }, { username }) {
      let negotiator_username = username;
      let url, body;
      url = `${base_url}/api/attendance_tracker/negotiations/cancel/${object.id}`;
      body = {
        registrar_username: negotiator_username,
        cancelation_reason: description,
      };
      let response = await Axios.post(url, body);
      return {response,result:true};
    },

    async sabte_mozakere({ mode, type, model }, { username }) {
      let registrar_username = username;
      //mode: 'submit' | 'draft'
      //type: '1' | '2'
      //model: اطلاعات پر شده در فرم
      //return 'خطایی پیش آمده'
      let natije_mozakere;

      let url = `${base_url}/api/attendance_tracker/negotiations_form/register/${model.id}`
      if (model.natije_mozakere === "0") { natije_mozakere = "1"; } //موفقیت آمیز
      if (model.natije_mozakere === "1") { natije_mozakere = "4"; } // ناموفق
      if (model.natije_mozakere === "2") { natije_mozakere = "3"; } // نیاز به پیگیری
      if (model.natije_mozakere === "3") { natije_mozakere = "2"; } // نیاز به تماس
      let body = {
        form_data: model,
        saved_as: mode,
        result: natije_mozakere,
        form_type: type,
        registrar_username: registrar_username,
      }
      let response = await Axios.post(url, body)
      return {response,result:true}
    },

    // ************************************
    async shorooe_mozakere(obj, { username }) {
      let registrar_username = username;
      let url = `${base_url}/api/attendance_tracker/negotiations/start/${obj.id}`
      let body = {
        registrar_username: registrar_username
      }
      let response = await Axios.post(url, body)
      if (response.data.is_success === true) {
        let data = response.data.data
        obj.form.model = data.form.form_data;
        obj.negotiation_id = data.id;
        obj.form.model.negotiation_id = data.id;
        obj.form.model.guest = obj.guest_id;
        obj.form.model.person = obj.person_id;
        obj.form.model.id = obj.id;
        obj.form.model.market = obj.market;
        obj.form.model.process_instance_id = obj.process_instance_id;
      }
      return {result:true}
    },
  };
}
