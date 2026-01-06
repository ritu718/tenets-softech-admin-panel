import { URL_SHIPMENT, URL_SHIPPER_EXTRA_COSTS, URL_SHIPPER_FREIGHT_CALCULATION_BASIS, URL_SHIPPER_PROJECTS, URL_SHIPPER_RATES } from "@/constants/apis";
import { fetchApi } from "@/services/api";
import { setFreightBasisData } from "@/store/features/freight_basis/FreightBasisSlice";
import { setCarrierConfigs } from "@/store/features/invoice_data/invoiceDataSlice";
import { setSurchargesData } from "@/store/features/surcharges/SurchargesSlice";
import { setTariffsData } from "@/store/features/tariffs/TariffsSlice";

export const sendCarrierDataToServer = async (params:any,dispatch?:any, onSuccess?:any)=>{
       const resp:any = await fetchApi(params,URL_SHIPPER_PROJECTS,"post");
      if(resp.success)
{
       onSuccess&&onSuccess(resp?.data)
}
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


export const getShipperFreightCalc = async (params:any,dispatch?:any)=>{
    try {
      const resp:any =await fetchApi(undefined,`${URL_SHIPPER_FREIGHT_CALCULATION_BASIS}/projectid?projectId=${params.projectId}`,"get")
       console.log("getShipperFreightCalc:  resp: ",resp);
      return getValidDataFromResp(resp);
      }catch (error) {
       return error;
    } 
}



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
      return getValidDataFromResp(resp);
    
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
       
     return getValidDataFromResp(resp);
     
      }catch (error) {
       return error;
    } 
}

const getValidDataFromResp = (resp:any,errorData?:any  )=>
  {
console.log("getValidDataFromResp: ",resp);

    return  resp.code==200&&resp.success?resp?.data||[]:errorData||resp
  };


export const getConfigDataAccoToSelCarrier = async (params: { projectId: string },dispatch?:any)=>{
    try {
       
       const promisesRequests = [
       getShipperFreightCalc(params),
       getShipperRates(params),
       getShipperExtraCost(params)
         ]

       Promise.all(promisesRequests).then(([freightCalc, rates, extraCost])=>{
        dispatch&&dispatch(setFreightBasisData(freightCalc));
         dispatch&&dispatch(setTariffsData(rates));
          dispatch&&dispatch(setSurchargesData(extraCost));
          
          console.log("getConfigDataAccoToSelCarrier: rates: ",rates  );
          console.log("getConfigDataAccoToSelCarrier: extraCost: ",extraCost  );

       })

    } catch (error) {
       
    } 
}

export const getShipmentData = async (params:any,dispatch?:any)=>{
    try {
      const resp:any =await fetchApi(undefined,`${URL_SHIPMENT}?projectId=${params.projectId}`,"get")
       console.log("getShipmentData:  resp: ",resp);
     return getValidDataFromResp(resp);
     
      }catch (error) {
       return error;
    } 
}

