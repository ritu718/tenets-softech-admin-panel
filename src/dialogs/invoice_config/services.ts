import { URL_SHIPPER_PROJECTS } from "@/constants/apis";
import { fetchApi } from "@/services/api";
import { setCarrierConfigs } from "@/store/features/invoice_data/invoiceDataSlice";

export const sendCarrierDataToServer = async (params:any,dispatch?:any, onSuccess?:any)=>{
       const resp:any = await fetchApi(params,URL_SHIPPER_PROJECTS,"post");
      if(resp.success)
{
       onSuccess&&onSuccess(resp?.data)
}
}

export const getCarriersDataFromServer = async (params:any,dispatch?:any)=>{
    try {
       
        const resp:any = await fetchApi(undefined,`${URL_SHIPPER_PROJECTS}?userId=${params.userId}`,"get");
       if(resp.success)
{
              
     dispatch(setCarrierConfigs(resp?.data||[]))
}
else
{
        dispatch(setCarrierConfigs([]))
}

    } catch (error) {
        dispatch(setCarrierConfigs([]))
    } 
}


export const deleteCarrierDataToServer = async (
  params: { projectId: string },
  dispatch: any,
  onSuccess?: () => void
) => {
    console.log("deleteCarrierDataToServer: ",params);
    
  try {
    const resp: any = await fetchApi(
      undefined,
      `${URL_SHIPPER_PROJECTS}?projectId=${params.projectId}`,
      "delete"
    );

    if (resp?.success) {
     
      onSuccess && onSuccess();
    }
  } catch (error) {
    console.error("Delete carrier failed:", error);
  }
};





