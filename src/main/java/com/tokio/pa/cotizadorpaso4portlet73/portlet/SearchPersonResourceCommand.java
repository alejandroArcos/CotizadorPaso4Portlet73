package com.tokio.pa.cotizadorpaso4portlet73.portlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.portlet.bridges.mvc.BaseMVCResourceCommand;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCResourceCommand;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.WebKeys;
import com.tokio.pa.cotizadorpaso4portlet73.constants.CotizadorPaso4Portlet73PortletKeys;
import com.tokio.pa.cotizadorModularServices.Bean.PersonaResponse;
import com.tokio.pa.cotizadorModularServices.Interface.CotizadorPaso4;

import java.io.PrintWriter;

import javax.portlet.ResourceRequest;
import javax.portlet.ResourceResponse;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(
		immediate = true, property = { 
				"javax.portlet.name=" + CotizadorPaso4Portlet73PortletKeys.CotizadorPaso4, 
				"mvc.command.name=/searchPerson" }, service = MVCResourceCommand.class
)

public class SearchPersonResourceCommand extends BaseMVCResourceCommand{
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
		
		User user = (User) resourceRequest.getAttribute(WebKeys.USER);

		String usuario = user.getScreenName();
		String CotizadorPaso4 = CotizadorPaso4Portlet73PortletKeys.CotizadorPaso4;
		String nombreCliente = ParamUtil.getString(resourceRequest, "term");
		int tipo = ParamUtil.getInteger(resourceRequest, "tipo");

		Gson gson = new Gson();
		PrintWriter writer = resourceResponse.getWriter();
		try {
			PersonaResponse respuesta = _ServicePaso4.getListaPersonas(nombreCliente, tipo, usuario, CotizadorPaso4);

			if (respuesta.getCode() == 0) {

				String jsonString = gson.toJson(respuesta.getPersonas());
				writer.write(jsonString);
			} else {
				writer.write("{\"codigo\" : \"0\", \"error\" : \"sin informacion\" }");
			}

		} catch (Exception e) {
			writer.write("{\"codigo\" : \"0\", \"error\" : \"sin informacion\" }");
		}
	}
	
}
