import { URL_SHIPPER_PROJECTS } from "@/constants/apis";
import { fetchApi } from "@/services/api";
import { setCarrierConfigs } from "@/store/features/invoice_data/invoiceDataSlice";

export const sendCarrierDataToServer = async (params:any,dispatch?:any, onSuccess?:any)=>{
    
       const resp= fetchApi(params,URL_SHIPPER_PROJECTS,"post");
       console.log("sendCarrierDataToServer resp: ",resp);
       onSuccess&&onSuccess()
}

export const getCarriersDataFromServer = async (params:any,dispatch?:any)=>{
    
    const url = `${URL_SHIPPER_PROJECTS}/${params.userId}`
       const resp:any = fetchApi(undefined,url,"get");
if(resp.success)
{
     dispatch(setCarrierConfigs(resp.data))
}


       
      
}


