import Axios from 'axios';
import { mdiEmailFast, mdiFaceWoman, mdiFlaskEmpty } from "@mdi/js";
import { useReducer, version } from "react";
//client_id = 1 -> بروکس  
//client_id = 2 -> آریا
//client_id = 3 -> پایدار
// const davatbase_url = process.env.DAVATbase_url || `https://u.davat.app`
const davatbase_url = `https://u.davat.app`
// const davatbase_url = `http://172.16.7.34:8002`

// const base_url = process.env.base_url || `https://manage.belex1.ir`
// const base_url = `https://manage.belex1.ir`
// const base_url = `http://registerapi.davat.app`
// const base_url = `https://manage.belex1.ir`
// const base_url = `http://localhost:8000`
// const base_url = `https://exhibition.bbeta.ir`
// const base_url = `https://exhibitiontest.bbeta.ir`
// const base_url = `http://192.168.118.1:8000`
// const base_url = "http://192.168.10.50:8054";
// const base_url = "https://exhibition.bbeta.ir";
// const base_url = "http://91.107.159.118:8054";
const base_url = "https://exhibitiontest.bbeta.ir";


const startInstanceUrl = `${base_url}/camunda/v1/startInstance` // ادرس ثبت مذاکره کننده و شروع فرآیند کموندا
// این آدرس نیاز به client_id دارد


const customerSearch= `${base_url}/customer/v1/customer?` // آدرس جستجوی مشتری 
const searchGuest = `${base_url}/customer/v1/searchGuest` // جستجوی مراجعه کننده

const searchCustomer = `${base_url}/customer/v1/searchCustomer` // جستجوی مشتری

const guestManageUrl = `${base_url}/guest/v1/guest` //آدرس لیست بازدیدکنندگان

const cityUrl  = `${base_url}/api/shared/provinces` //آدرس  لیست استان ها
const QRCode_url = `${base_url}/guest/qrcode/`
const photographerUrl = `${base_url}/photographer/` // 
const all_photosUrl = `${base_url}/photographer/all_photos` //لیست عکس ها 
const ready_photoUrl = `${base_url}/photographer/ready/` // آماده بودن عکس

const InviteInfoApi = `${davatbase_url}/Api/V1/Invitation/InviteInfo/`

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fixVisitCardsUrl(list){
  if(list){
    for(let i = 0; i < list.length; i++){
      list[i].url= `${base_url}${list[i].url}`
    }
  }
}

function bazdid_konandegan_state(value){
  if(value === "1"){return 0} // ثبت اطلاعات
  if(value === "2"){return 1} //در انتظار مذاکره
  if(value === "3"){return 2} // در حال مذاکره
  if(value === "4"){return 3} // پایان مذاکره'
  if(value === "5"){return 4} // انصراف از مذاکره
}

export function getResponse({getState,helper}) {

    //let token = getState().token;
    //Axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    let apiFunction = {
      async getQrModel(code){
        code =code.replace(':', '=')
        let url = `${InviteInfoApi}?${code}`
        let response
        try{
          response = await Axios.get(url);
        }catch(err){
          return {result:{firstname:'',lastname:'',mobile:''}}
        }
        if (response.data){
          let we = response.data['first_name']
          return {result:{
            firstname: response.data['first_name'],
            lastname:response.data['last_name'],
            mobile:response.data['phone_number']}
          }
        }
      },

      // ***************** لیست مذاکره کنندگان ******************
      async mozakere_konandegan(parameter){
        let client_id = getState().client_id
        let response
        //به هر دلیل اگر مشکلی وجود داشت ریترن آرایه خالی
        let {city} = parameter;
        if(!city) {city = ''}
        if(city === 'تهران'){city=1}
        let url = `${base_url}/api/users/personnels`
        let qparams = [
          ['company_custom_sort',client_id]
        ]
        if(city){
          qparams.push(['province_custom_sort',city])
        }
        for(let i = 0; i < qparams.length; i++){
          let [key,value] = qparams[i];
          if(i === 0){url += '?'} url += `${key}=${value}`; if(i !== qparams.length - 1){url += '&'}
        }
        response = await Axios.get(url);
        let result = response.data.data.map((o) => {
          let name;
          if(o.desk_number !== ''){name = `${o.first_name + ' ' + o.last_name} - میز(${o.table})(${o.personnel_status_desc})`}
          if(o.profile_photo_url) {
            o.profile_photo_url = `${base_url}${o.profile_photo_url}`
          }
          return {
            id: o.id,
            name: name,
            city: o.city_name,
            status: o.personnel_status_desc,
            username: o.username,
            src: o.image_url,
          }
        })
        return {result};
      },

      
      async morajee_konandegan(valuesWithClient){
        let url = `${searchGuest}?search=${valuesWithClient}`
        let response = await Axios.get(url);
        let result = response.data.results.map((o) => {
          return {
            guest_id: o.id,
            firstname: o.first_name,
            lastname: o.last_name,
            mobile: o.mobile_number || o.mobile_number1,
            address: o.address || o.address1,
            city: o.province || o.city,
            phone: o.phone,
            gender: o.gender,
            cardCode: o.b1_code,
            activityZone: o.market,
            company: o.company_name,
            position: o.post_in_company,
          }
        })
        return {response,result}
      },
      

      async moshtarian(values){
        let response = await Axios.get(`${searchCustomer}?search=${values}`);
        let result = response.data.results.map((o) => {
          return {
            guest_id: o.id,
            firstname: o.first_name,
            lastname: o.last_name,
            mobile: o.mobile_number || o.mobile_number1,
            address: o.address || o.address1,
            city: o.province || o.city,
            phone: o.phone,
            gender: o.gender,
            cardCode: o.b1_code,
            activityZone: o.market,
            company: o.company_name,
            position: o.post_in_company,
          }
        })
        return {response,result}
      },

      // ***************** استعلام ******************
      async estelam({mobile,nationalCode,cardCode,pageSize,pageNumber}){
        
        let url = `${base_url}/api/users/users`;
        let qparams = [];
        if(mobile){qparams.push(['phone_number',mobile])}
        if(nationalCode){qparams.push(['national_code',nationalCode])}    
        if(cardCode){qparams.push(['b1_code',cardCode])}    
        if(pageSize){qparams.push(['limit',pageSize])}    
        if(pageNumber){qparams.push(['offset',pageNumber])}    
        for(let i = 0; i < qparams.length; i++){
          if(i === 0){url += '?'}
          let [key,value] = qparams[i];
          url += `${key}=${value}`;
          if(i < qparams.length - 1){url += '&'}
        }
        let response = await Axios.get(url)
        
        let result = response.data.data.map((o)=>{
          return {
            guest_id: o.id || "",
            firstname: o.first_name || "",
            lastname: o.last_name || "",
            nationalCode: o.national_code || "",
            mobile: o.phone_number || "",
            address: o.address || "",
            description: o.description || "",
            city: o.province || "",
            city_name: o.province_name || "",
            phone: o.telephone || "",
            email: o.email || "",
            gender: o.gender || "",
            cardCode: o.b1_code || "",
            activityZone: o.business_scope,
            company: o.company_name || "",
            position: o.job_position || "",
          }
        })     
        return {result}
      },
      
      // ***************لیست استان ها****************
      async cities(){
        let result;
        let url = `${base_url}/api/shared/provinces`
        try{
          let response = await Axios.get(url);
          result = response.data.data.map((o) => {return {name:o.fa_name,id:o.id}})
        } catch(err) {
          debugger
          result = []
        }
        return {result}
      },


      // ***************** ثبت بازدید کننده ******************
      async sabte_bazdid_konande({model,type, mozakere_konandegan}){
        let operatarUserName = getState().username
        let client_id = getState().client_id
        let mozakere_konande_obj;
        let negotiator;
        try{
          mozakere_konande_obj = mozakere_konandegan.find((x)=>{
            return x.id === model.mozakere_konande
          })
        }
        catch(err){mozakere_konande_obj = {}}
        if(mozakere_konande_obj !== undefined){negotiator = mozakere_konande_obj.id}
        else{negotiator = undefined}
        
        let formdata = new FormData();
        formdata.append("first_name",model.firstname || '');
        formdata.append("last_name",model.lastname || '');
        formdata.append("phone_number",model.mobile || '');
        formdata.append("business_scope",model.activityZone);
        formdata.append("company_name",model.company || '');
        formdata.append("job_position",model.position || '');
        formdata.append("province_id",model.city || '');
        formdata.append("telephone",model.phone || '');
        formdata.append("national_code",model.nationalCode || '');
        formdata.append("gender",model.gender || '');
        formdata.append("address",model.address || '');
        formdata.append("description",model.description || '');
        formdata.append("email",model.email || '');
        formdata.append("send_catalog_flag",model.catalog || "False");
        formdata.append("registrar_username",operatarUserName || '');
        formdata.append("negotiator_id",negotiator || '');
        formdata.append("event_id",model.event_id || '');
        formdata.append("client_id",client_id || '');
        for (let i = 0; i < (model.visitCard || []).length; i++){
          formdata.append('visit_cards', model.visitCard[i])
        }
        let response, result;
        try{
          response = await Axios[type === 'add'?'post':'put'](`${base_url}/api/attendance_tracker/attendances${type === 'edit'?`/${model.instance}`:''}`,formdata,{headers: {"Content-Type": "multipart/form-data"}})
          result = true
        }
        catch(err){
          debugger
          result = err.response.data.data.message
        }
        return {result}
        // return {response,result}
      },

      // ***************** لیست بازدید کنندگان  ******************
      async bazdid_konandegan(){
        let response_data, result, user;
        let operatar_username = getState().username
        let client_id = getState().client_id
        let url = `${base_url}/api/attendance_tracker/attendances?registrar_username${operatar_username}`
        try{
          response_data = await Axios.get(url)
          result = response_data.data.data.map((o) => {
            let qq = fixVisitCardsUrl(o.visit_cards);
            user = o.user_info
            return {
              guest_id: user.id || undefined,
              firstname: user.first_name ,
              lastname: user.last_name,
              gender: user.gender || undefined,
              nationalCode: user.national_code,
              mobile:user.phone_number,
              city: user.province,
              city_name: user.province_name,
              address: user.address || undefined,
              email: user.email || undefined,
              description: user.description || undefined,
              phone: user.telephone || undefined,
              cardCode: user.b1_code || undefined,
              activityZone: user.business_scope || undefined,
              status: bazdid_konandegan_state(o.attendance_status),
              position: user.job_position || undefined,
              company: user.company_name || undefined,
              name_mozakere_konande: o.current_negotiator_name || undefined,
              mozakere_konande: o.current_negotiator|| undefined,
              catalog: o.send_catalog_flag || undefined,
              date: helper.getDateAndTime(o.created_at).dateAndTime,
              instance: o.id || undefined,
              event_id: o.event,
              visitCard: o.visit_cards,
            }
          })
        }catch(err){
          debugger
          result = []
        }
        return {result}
      },

      async afrad_baraye_ersale_aks(){
        let operatarUserName = getState().username
        let client_id = getState().client_id
        let url, result, response_data, user;
        let current_date = getCurrentDate();

        url = `${base_url}/api/attendance_tracker/attendances?created_at=${current_date}`
        // url = `${base_url}/api/attendance_tracker/attendances`
        
        try{
          response_data = await Axios.get(url)
          result = response_data.data.data.map((o) => {
            fixVisitCardsUrl(o.visit_cards);
            user = o.user_info

            return {
              guest_id: user.id || undefined,
              id: o.id,
              // afrade_montakhab: o.id,
              firstname: user.first_name,
              lastname: user.last_name,
              national_code: user.national_code,
              name: `${user.first_name} ${user.last_name}`,
              gender: user.gender || undefined,
              mobile:user.phone_number,
              city: user.province_name,
              address: user.address || undefined,
              phone: user.telephone || undefined,
              cardCode: user.b1_code || undefined,
              activityZone: user.business_scope || undefined,
              mozakere_konande : user.current_negotiator || undefined,
              status: bazdid_konandegan_state(o.attendance_status),
              position: o.job_position || undefined,
              company: o.company_name || undefined,
              name_mozakere_konande: o.current_negotiator_name || undefined,
              catalog: o.send_catalog_flag || undefined,
              date: helper.getDateAndTime(o.created_at).dateAndTime,
              instance: o.id || undefined,
              visitCard: o.visit_cards,
              photo_code: o.photo_code,
              qrcode: o.qr_code,
            }
          })
          
          return {result}
        } catch(err) {
          debugger
          result = []
          return {result}
        }
      },

      //****************ثبت عکس *****************************
      async sabte_aks({afrade_montakhab,code}){
        let operatar_username = getState().username
        let url, body, result, response_data;

        let {roles} = getState();
        if (roles.indexOf('photographer') === -1){
          result = 'شما مجاز به ثبت عکس نیستید' 
          // return {result}
        }
        url = `${base_url}/api/attendance_tracker/assign_photo/${afrade_montakhab}`
        body = {
          photo_code: code,
          registrar_username: operatar_username
        }
        try{
          response_data = await Axios.post(url, body)
          return true
          
        } catch(err) {
          debugger
          result = err.response.data.data.message
          return {result}
        }

      },
      async aks_ha(){
        let result, response_data, url, user, photo;
        let current_date = getCurrentDate();
        url = `${base_url}/api/attendance_tracker/attendances?created_at=${current_date}`
        // url = `${base_url}/api/attendance_tracker/attendances`
        
        try{
          response_data = await Axios.get(url)
          result = response_data.data.data.map((o) => {
            user = o.user_info
            photo = o.photo_info
            return {
              id: o.id,
              first_name: user.first_name,
              last_name: user.last_name,
              name: `${user.first_name} ${user.last_name}`,
              phone_number: user.phone_number,
              national_code: user.national_code,
              photo_code: o.photo_code,
              is_delivered_photo: o.is_delivered_photo,
              is_delivered_photo_desc: o.is_delivered_photo_desc,
            }
          })
          result = result.filter((o) => {
            return o.photo_code !== null;
          })

        } catch(err){
          debugger
          result = []
        }

        return {result}

      },

      // ********************ارسال عکس ها ***********************
      async ersale_aks({aks_haye_montakhab}){
        let operatar_username = getState().username
        let url, result, body, response_data;
        let {roles} = getState();
        
        if (roles.indexOf('photographer') == -1){
          result = 'شما مجاز به ثبت عکس نیستید'
          // return {result}
        }
        url = `${base_url}/api/attendance_tracker/deliver_photo/${aks_haye_montakhab}`
        body = {
          registrar_username: operatar_username
        }
        try{
          response_data = await Axios.post(url, body)
          return true
        } catch(err) {
          debugger
          result = err.response.data.data.message
          return {result}
        }
        // return {result} 
        
      }
    }
    return apiFunction;
  }
