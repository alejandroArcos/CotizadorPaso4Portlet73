package com.tokio.pa.cotizadorpaso4portlet73.portlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.portlet.bridges.mvc.BaseMVCResourceCommand;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCResourceCommand;
import com.liferay.portal.kernel.util.HtmlUtil;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.WebKeys;
import com.tokio.cotizador.jsonformservice.JsonFormService;
import com.tokio.pa.cotizadorpaso4portlet73.constants.CotizadorPaso4Portlet73PortletKeys;
import com.tokio.pa.cotizadorModularServices.Bean.EmisionDataRequest;
import com.tokio.pa.cotizadorModularServices.Bean.SimpleResponse;
import com.tokio.pa.cotizadorModularServices.Bean.SolicitarEmisionResponse;
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
		        "mvc.command.name=/solicitarEmision"
	    },
	    service = MVCResourceCommand.class
	)

public class SolicitarEmisionResourceCommand extends BaseMVCResourceCommand{
	
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
		
		PrintWriter writer = resourceResponse.getWriter();
		try {
			int art492emi = ParamUtil.getInteger(resourceRequest, "art492emi");
			
			User user = (User) resourceRequest.getAttribute(WebKeys.USER);
			String p_usuario = user.getScreenName();
			String p_pantalla = CotizadorPaso4Portlet73PortletKeys.CotizadorPaso4;
			
			String jsonString = "";
			Gson gson = new Gson();

			System.out.println("\n-------------------normal-------------------------");
			String infEmi = ParamUtil.getString(resourceRequest, "infEmi");
			System.out.println("infEmi : " +  infEmi);
			infEmi = HtmlUtil.unescape(infEmi);
			System.out.println("\n---------------------unescape-----------------------");
			System.out.println("infEmi : " +  infEmi);
			System.out.println("\n--------------------------------------------");
			
			
			EmisionDataRequest emisionDataRequest = gson.fromJson(infEmi, EmisionDataRequest.class);
			emisionDataRequest.setP_usuario(p_usuario);
			emisionDataRequest.setP_pantalla(p_pantalla);
			emisionDataRequest.setP_deseaFacturar(1);
			System.out.println("emisionDataRequest : " + emisionDataRequest);
			

			if (art492emi == 1) {
				SimpleResponse simple = _ServicePaso4.emisionart492(emisionDataRequest);
				jsonString = gson.toJson(simple);
			} else {
				SolicitarEmisionResponse soliEmi = _ServicePaso4.solicitarEmision(emisionDataRequest);
				jsonString = gson.toJson(soliEmi);
			}
			
			writer.write(jsonString);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			String jsonString = "{\"code\" : \"5\", \"msg\" : \"Error al consultar la información\" }";
			writer.write(jsonString);
		}	
		
	}
}
