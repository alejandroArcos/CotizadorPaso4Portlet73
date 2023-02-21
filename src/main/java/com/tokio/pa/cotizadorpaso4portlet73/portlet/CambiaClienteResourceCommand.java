package com.tokio.pa.cotizadorpaso4portlet73.portlet;

import com.google.gson.JsonObject;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.portlet.bridges.mvc.BaseMVCResourceCommand;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCResourceCommand;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.WebKeys;
import com.tokio.pa.cotizadorpaso4portlet73.constants.CotizadorPaso4Portlet73PortletKeys;
import com.tokio.pa.cotizadorModularServices.Bean.SimpleResponse;
import com.tokio.pa.cotizadorModularServices.Interface.CotizadorPaso4;

import java.io.PrintWriter;

import javax.portlet.ResourceRequest;
import javax.portlet.ResourceResponse;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(immediate = true, property = {
		"javax.portlet.name=" + CotizadorPaso4Portlet73PortletKeys.CotizadorPaso4,
		"mvc.command.name=/paso4/CambiarCliente" }, service = MVCResourceCommand.class)

public class CambiaClienteResourceCommand extends BaseMVCResourceCommand{
	@Reference
	CotizadorPaso4 _ServicePaso4;
	
	@Override
	protected void doServeResource(ResourceRequest resourceRequest,
			ResourceResponse resourceResponse) throws Exception {
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
		JsonObject r = new JsonObject();
		
		try {
			int p_cotizacion = ParamUtil.getInteger(resourceRequest, "cotizacion");
			int p_version = ParamUtil.getInteger(resourceRequest, "version");
			String p_clienteCod = ParamUtil.getString(resourceRequest, "codCliente");

			User user = (User) resourceRequest.getAttribute(WebKeys.USER);
			String p_usuario = user.getScreenName();

			SimpleResponse respuesta = _ServicePaso4.CambiarCliente(p_cotizacion, p_version,
					p_clienteCod, p_usuario, CotizadorPaso4Portlet73PortletKeys.CotizadorPaso4);
			
			r.addProperty("code", respuesta.getCode());
			r.addProperty("msg", respuesta.getMsg());
			
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			r.addProperty("code", 3);
			r.addProperty("msg", "Error al actualizar el registro");
		}
		
		writer.write( r.toString() );
	}
}
