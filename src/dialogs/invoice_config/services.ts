import { BASE_URL, URL_COMPANIES, URL_SHIPMENT, URL_SHIPMENT_SUMMARY, URL_SHIPPER_EXTRA_COSTS, URL_SHIPPER_FREIGHT_CALCULATION_BASIS, URL_SHIPPER_PROJECTS, URL_SHIPPER_RATES, URL_TOLERANCE } from "@/constants/apis";
import { fetchApi } from "@/services/api";
import { setFreightBasisData } from "@/store/features/freight_basis/FreightBasisSlice";
import { setCarrierConfigs, setInvoiceData, setInvoiceDetailsData, setIsInvoiceDataApiCalled } from "@/store/features/invoice_data/invoiceDataSlice";
import { setSurchargesData } from "@/store/features/surcharges/SurchargesSlice";
import { setTariffsData } from "@/store/features/tariffs/TariffsSlice";
import { setShipmentData } from "@/store/features/shipment_data/shipmentDataSlice";
import { setToleranecData } from "@/store/features/tolerances/TolerancesSlice";
import { setIsApisCalledForSelectedCarier } from "@/store/features/all_apis_calling_status/AllApisCallingStatusSlice";
import { setShipmentSummary } from "@/store/features/shipment_summary/shipmentSummarySlice";
import { isEmpty, removeInvalidKeys } from "@/utils/helper";

export const sendCarrierDataToServer = async (params:any,dispatch?:any, onSuccess?:any)=>{
 
     const resp:any = await fetchApi(params,URL_SHIPPER_PROJECTS,params?.id?"put":"post");
     resp.success&&  onSuccess&&onSuccess(resp?.data)
  
  
}

export const getCarriersDataFromServer = async (params:any,dispatch?:any)=>{
    try {
       return getValidDataFromResp(await fetchApi(undefined,`${URL_SHIPPER_PROJECTS}?userId=${params.userId}`,"get"));
    } catch (error) {
       dispatch&& dispatch(setCarrierConfigs([]))
    } 
}



export const getCarrierConfFomServer = async (params:any,dispatch?:any)=>{
    try {
       
       const promisesRequests = [
       getCarriersDataFromServer(params)
       ]
       Promise.all(promisesRequests).then(([carriersData,freightCalc])=>{
        console.log("responses: ",carriersData,freightCalc  );
     dispatch(setCarrierConfigs(Array.isArray(carriersData) ? carriersData : []))
       })

    } catch (error) {
        dispatch(setCarrierConfigs([]))
    } 
}




export const deleteCarrierDataToServer = async (
  params: { projectId: string },
  dispatch: any,
  carriers?:[]
) => {
  try {
    const resp: any = await fetchApi(
      undefined,
      `${URL_SHIPPER_PROJECTS}?projectId=${params.projectId}`,
      "delete"
    );
    dispatch(setCarrierConfigs(resp.success?  carriers?.filter((carrier:any) => carrier?.id !== params.projectId) || []:[]));
  } catch (error) {
    console.error("Delete carrier failed:", error);
  }
};


export const getShipperFreightCalc = async (params: any) => {
  try {
    const resp: any = await fetchApi(
      undefined,
      `${URL_SHIPPER_FREIGHT_CALCULATION_BASIS}/projectid?projectId=${params.projectId}`,
      "get"
    );

    console.log("getShipperFreightCalc resp:", resp);

    return getValidDataFromResp(resp);

  } catch (error) {
    console.error("getShipperFreightCalc error:", error);
    throw error; // 🔥 do NOT return error
  }
};


export const sendShipperFreightCalc = async (params:any,dispatch?:any)=>{
    try {
      console.log("sendShipperFreightCalc: ",params);
      
      const resp:any =await fetchApi(params,`${URL_SHIPPER_FREIGHT_CALCULATION_BASIS}`,"post")
       console.log("sendShipperFreightCalc:  resp: ",resp);
      return getValidDataFromResp(resp);
      }catch (error) {
       return error;
    } 
}

export const editShipperFreightCalc = async (params:any,dispatch?:any)=>{
    try {
      console.log("editShipperFreightCalc: ",params);
      const {message,extra,firebaseId,updatedAt,createdAt,...restParamas}=params;
      
      const resp:any =await fetchApi(restParamas,`${URL_SHIPPER_FREIGHT_CALCULATION_BASIS}/${params.id}`,"put")
       console.log("editShipperFreightCalc:  resp: ",resp);
      return getValidDataFromResp(resp);
      }catch (error) {
       return error;
    } 
}


export const getShipperRates = async (params:any,dispatch?:any)=>{
    try {
      const resp:any =await fetchApi(undefined,`${URL_SHIPPER_RATES}/projectid?projectId=${params.projectId}`,"get")
       console.log("getShipperRates:  resp: ",resp);
      return getValidDataFromResp(resp);
    
      }catch (error) {
       return error;
    } 
}

export const sendShipperRates = async (params:any,dispatch?:any)=>{
    try {
      const resp:any =await fetchApi(params,`${URL_SHIPPER_RATES}`,"post")
       console.log("sendShipperRates:  resp: ",resp);
      const rates= getValidDataFromResp(resp);
      console.log("rates data : ",rates);
      
     dispatch&&dispatch(setTariffsData(rates));
     return rates;
      }catch (error) {
       return error;
    } 
}

export const editShipperRates = async (params:any,dispatch?:any)=>{
    try {
      const respObj= getValidDataFromResp(await fetchApi(params,`${URL_SHIPPER_RATES}/${params.id}`,"put"));
      return respObj;
      
      }catch (error) {
       return error;
    } 
}

export const getShipperExtraCost = async (params:any,dispatch?:any)=>{
    try {
      const resp:any =await fetchApi(undefined,`${URL_SHIPPER_EXTRA_COSTS}/projectid?projectId=${params.projectId}`,"get")
       console.log("getShipperFreightCalc:  resp: ",resp);
     return getValidDataFromResp(resp);
     
      }catch (error) {
       return error;
    } 
}

export const sendShipperExtraCost = async (params:any,dispatch?:any)=>{
    try {
      const resp:any =await fetchApi(params,`${URL_SHIPPER_EXTRA_COSTS}`,"post")
       console.log("sendShipperExtraCost:  resp: ",resp);
       
     const dataValue= getValidDataFromResp(resp);
     console.log("dataValue: ",dataValue);
     
      dispatch(setSurchargesData(dataValue));
     
      }catch (error) {
       return error;
    } 
}

const getValidDataFromResp = (resp:any,errorData?:any  )=>
  {
console.log("getValidDataFromResp: ",resp);

    return  resp.code==200&&resp.success?resp?.data||[]:errorData||resp
  };


export const getConfigDataAccoToSelCarrier = async (
  params: { projectId: string },
  dispatch?: any
) => {
  try {
    dispatch?.(setIsApisCalledForSelectedCarier(true));

    const [freightCalc, rates, extraCost] = await Promise.all([
      getShipperFreightCalc(params),
      getShipperRates(params),
      getShipperExtraCost(params)
    ]);

    dispatch?.(setFreightBasisData(freightCalc));
    dispatch?.(setTariffsData(rates));
    dispatch?.(setSurchargesData(extraCost));

    console.log("rates:", rates);
    console.log("extraCost:", extraCost);

  } catch (error) {
    console.error("API error:", error);
  } finally {
    dispatch?.(setIsApisCalledForSelectedCarier(false));
  }
};

export const getShipmentData = async (params:any,dispatch?:any)=>{
    try {
      const resp:any =await fetchApi(undefined,`${URL_SHIPMENT}?projectId=${params.projectId}`,"get")
       console.log("getShipmentData:  resp: ",resp);
     const respData= getValidDataFromResp(resp);
      console.log("respData:",respData);
     dispatch&&dispatch(setShipmentData(respData))
      }catch (error) {
       return error;
    } 
}

export const sendShipmentData = async (params:any,dispatch?:any, onSuccess?:any)=>{
       const resp:any = await fetchApi(params,URL_SHIPMENT,"post");
      if(resp.success)
{
       onSuccess&&onSuccess(resp?.data)
}
}


export const getToleranceData = async (params:any,dispatch?:any)=>{
    try {
      const respObj=getValidDataFromResp(await fetchApi(undefined,`${URL_TOLERANCE}/${params.userId}`,"get"));
      console.log("getToleranceData: respObj: ",respObj);
      
     dispatch&&dispatch(setToleranecData( respObj.status?{
   
    "freightCostsPercent": "",
    "standardAdditionalCostsPercent":"",
    "onlyPositiveDeviation": false,
    
  }:respObj))
      }catch (error) {
       return error;
    }
}

export const addEditToleranceData = async (params:any,dispatch?:any, userId?:any)=>{
  const isCompanyIdEmpty=isEmpty(params.companyId)
const url=!isCompanyIdEmpty?`${URL_TOLERANCE}/${params.companyId}`:`${URL_TOLERANCE}`;
console.log("editToleranceData: url: ",url);
console.log("editToleranceData: params: ",params);
if(isCompanyIdEmpty)
{
  params={...params,companyId:userId}
}
       const resp:any = await fetchApi(params,url,!isCompanyIdEmpty?"put":"post");
const respData= getValidDataFromResp(resp);
       console.log("editToleranceData: resp: ",respData);
        dispatch&&dispatch(setToleranecData(respData ))
}

export const getShipmentSummary = async (params:any,dispatch?:any)=>{
    try {
      const resp:any =await fetchApi(undefined,`${URL_SHIPMENT_SUMMARY}/${params.projectId}`,"get");
        console.log("getShipmentSummary:  resp: ",resp);  
     const respData= getValidDataFromResp(resp);
         console.log("respDatasu:",respData);
     dispatch&&dispatch(setShipmentSummary(respData))
      }catch (error) {
        return error;
      }
    }
export const getCompaniesData = async (params:any,dispatch?:any)=>{
    try {
      dispatch(setIsInvoiceDataApiCalled(true))
      let {userId,...filteredData}=params;
      filteredData = removeInvalidKeys(filteredData);
      let url =`${URL_COMPANIES}/${userId}/invoices`;
if(Object.keys(filteredData).length>0){
  const queryString = new URLSearchParams(filteredData).toString();
url=`${url}?${queryString}`
}
       const resp= getValidDataFromResp(await fetchApi(undefined,url,"get"));
 const respData = Array.isArray(resp)?resp:[resp];
  dispatch&& dispatch(setInvoiceData(respData))
    dispatch(setIsInvoiceDataApiCalled(false))
      return resp;
    } catch (error) {
        dispatch(setIsInvoiceDataApiCalled(false))
       dispatch&& dispatch(setInvoiceData(null))
    } 
}


export const getCompaniesDetailsData = async (params:any,dispatch?:any)=>{
    try {
      console.log("getCompaniesDetailsData : ",params);
      
      dispatch(setIsInvoiceDataApiCalled(true))
      const {company_id,invoice_number}=params;
      
      let url =`${URL_COMPANIES}/${company_id}/invoices/${invoice_number}`;
       const resp= getValidDataFromResp(await fetchApi(undefined,url,"get"));
  dispatch&& dispatch(setInvoiceDetailsData(resp))
    dispatch(setIsInvoiceDataApiCalled(false))
      return resp;
    } catch (error) {
        dispatch(setIsInvoiceDataApiCalled(false))
       dispatch&& dispatch(setInvoiceDetailsData(null))
    } 
}
 


