package com.tokio.pa.cotizadorpaso4portlet73.portlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.liferay.portal.kernel.portlet.bridges.mvc.BaseMVCResourceCommand;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCResourceCommand;
import com.liferay.portal.kernel.util.ParamUtil;
import com.tokio.pa.cotizadorpaso4portlet73.constants.CotizadorPaso4Portlet73PortletKeys;
import com.tokio.pa.cotizadorModularServices.Bean.DomicilioResponse;
import com.tokio.pa.cotizadorModularServices.Exception.CotizadorModularException;
import com.tokio.pa.cotizadorModularServices.Interface.CotizadorPaso4;

import java.io.PrintWriter;

import javax.portlet.ResourceRequest;
import javax.portlet.ResourceResponse;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(immediate = true, property = { "javax.portlet.name=" + CotizadorPaso4Portlet73PortletKeys.CotizadorPaso4,
"mvc.command.name=/getDomicilioPersonasUrl" }, service = MVCResourceCommand.class)

public class GetCodigoPostalPerosnaResourceCommand extends BaseMVCResourceCommand{
	@Reference
	CotizadorPaso4 _ServicePaso4;
	
	@Override
    protected void doServeResource(ResourceRequest resourceRequest, ResourceResponse resourceResponse) throws Exception {
		/************************** Validación metodo post **************************/
		if ( !resourceRequest.getMethod().equals("POST")  ){
			JsonObject requestError = new JsonObject();
			requestError.addProperty("code", 500);
			requestError.addProperty("msg", "Error en tipo de consulta");
			PrintWriter writer = resourceResponse.getWriter();
			writer.write(requestError.toString());
			return;
		}
		/************************** Validación metodo post **************************/
		
		String cp = ParamUtil.getString(resourceRequest, "cp");
        if (cp != null && !cp.isEmpty()) {
            try {
                DomicilioResponse cpresp = _ServicePaso4.getDomicilioPersonas(cp);
                Gson gson = new Gson();
                String jsonString = gson.toJson(cpresp);
                PrintWriter writer = resourceResponse.getWriter();
                writer.write(jsonString);
            } catch (CotizadorModularException e) {
                // TODO Auto-generated catch block
                PrintWriter writer = resourceResponse.getWriter();
                String jsonString = "{\"code\" : \"5\", \"msg\" : \"Error al consultar la información\" }";
                writer.write(jsonString);
            }
        } else {
            PrintWriter writer = resourceResponse.getWriter();
            String jsonString = "{\"code\" : \"5\", \"msg\" : \"Error al consultar la información\" }";
            writer.write(jsonString);
        }
	}
}
