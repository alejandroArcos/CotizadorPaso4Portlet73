package com.tokio.pa.cotizadorpaso4portlet73.portlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.portlet.bridges.mvc.BaseMVCResourceCommand;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCResourceCommand;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.WebKeys;
import com.tokio.cotizador.jsonformservice.JsonFormService;
import com.tokio.pa.cotizadorpaso4portlet73.constants.CotizadorPaso4Portlet73PortletKeys;
import com.tokio.pa.cotizadorModularServices.Bean.EmisionDataResponse;
import com.tokio.pa.cotizadorModularServices.Interface.CotizadorPaso4;

import java.io.PrintWriter;

import javax.portlet.ResourceRequest;
import javax.portlet.ResourceResponse;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(
	    immediate = true,
	    property = {
		        "javax.portlet.name="+ CotizadorPaso4Portlet73PortletKeys.CotizadorPaso4,
		        "mvc.command.name=/getDireccion"
	    },
	    service = MVCResourceCommand.class
	)

public class DireccionResourceCommand extends BaseMVCResourceCommand{
	@Reference
	CotizadorPaso4 _ServicePaso4;
	@Reference
	JsonFormService _JsonFormService;
	
	@Override
	protected void doServeResource(ResourceRequest resourceRequest, ResourceResponse resourceResponse)
			throws Exception {
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
		
		String CotizadorPaso4 = CotizadorPaso4Portlet73PortletKeys.CotizadorPaso4;
		User user = (User) resourceRequest.getAttribute(WebKeys.USER);
		String usuario = user.getScreenName();
		int version = ParamUtil.getInteger(resourceRequest, "version");
		int cotizacion = ParamUtil.getInteger(resourceRequest, "cotizacion");
		int ubicacion = ParamUtil.getInteger(resourceRequest, "ubicacion");
		
		EmisionDataResponse ubicacionResp = fGetDireccion(cotizacion, version, ubicacion, usuario, CotizadorPaso4);
		
		PrintWriter writer = resourceResponse.getWriter();
		if (ubicacionResp.getCode() == 0){
			Gson gson = new Gson();
			String jsonString = gson.toJson(ubicacionResp);
			writer.write(jsonString);
		}else{
			String jsonString = "{\"code\" : \" " + ubicacionResp.getCode() + "\", \"msg\" : \"" + ubicacionResp.getMsg()  + "\" }";
			writer.write(jsonString);
		}
	}
	
	private EmisionDataResponse fGetDireccion (int cotizacion, int version, int ubicacion, String usuario,String CotizadorPaso4){
		try {
			return _ServicePaso4.getDireccion(cotizacion, version, ubicacion, usuario, CotizadorPaso4);
		} catch (Exception e) {
			return null;
		}
	}
}
