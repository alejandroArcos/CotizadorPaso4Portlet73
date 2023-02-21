package com.tokio.pa.cotizadorpaso4portlet73.portlet;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCPortlet;
import com.liferay.portal.kernel.servlet.SessionErrors;
import com.liferay.portal.kernel.servlet.SessionMessages;
import com.liferay.portal.kernel.util.HtmlUtil;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.kernel.util.WebKeys;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.WebResource;
import com.tokio.pa.cotizadorModularServices.Bean.DomicilioResponse;
import com.tokio.pa.cotizadorModularServices.Bean.EmisionDataResponse;
import com.tokio.pa.cotizadorModularServices.Bean.InfoAuxPaso1;
import com.tokio.pa.cotizadorModularServices.Bean.InfoCotizacion;
import com.tokio.pa.cotizadorModularServices.Bean.ListaRegistro;
import com.tokio.pa.cotizadorModularServices.Bean.Persona;
import com.tokio.pa.cotizadorModularServices.Bean.PersonasBloqueadasResponse;
import com.tokio.pa.cotizadorModularServices.Bean.Registro;
import com.tokio.pa.cotizadorModularServices.Bean.RetroactividadRequest;
import com.tokio.pa.cotizadorModularServices.Bean.UmbralVoBo;
import com.tokio.pa.cotizadorModularServices.Bean.ValidaResponse;
import com.tokio.pa.cotizadorModularServices.Constants.CotizadorModularServiceKey;
import com.tokio.pa.cotizadorModularServices.Enum.ModoCotizacion;
import com.tokio.pa.cotizadorModularServices.Enum.TipoPersona;
import com.tokio.pa.cotizadorModularServices.Interface.CotizadorGenerico;
import com.tokio.pa.cotizadorModularServices.Interface.CotizadorPaso4;
import com.tokio.pa.cotizadorModularServices.Util.CotizadorModularUtil;
import com.tokio.pa.cotizadorpaso4portlet73.bean.LogVoBo;
import com.tokio.pa.cotizadorpaso4portlet73.bean.ModoAuxiliar;
import com.tokio.pa.cotizadorpaso4portlet73.constants.CotizadorPaso4Portlet73PortletKeys;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Calendar;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import javax.portlet.Portlet;
import javax.portlet.PortletException;
import javax.portlet.PortletSession;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.NewCookie;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author urielfloresvaldovinos
 */
@Component(
		immediate = true,
		property = {
			"com.liferay.portlet.display-category=category.sample",
			"com.liferay.portlet.instanceable=true",
			"javax.portlet.display-name=CotizadorPaso4Portlet Portlet",
			"javax.portlet.init-param.template-path=/",
			"javax.portlet.init-param.view-template=/view.jsp",
			"javax.portlet.name=" + CotizadorPaso4Portlet73PortletKeys.CotizadorPaso4,
			"javax.portlet.resource-bundle=content.Language",
			"javax.portlet.security-role-ref=power-user,user",
			"com.liferay.portlet.private-session-attributes=false",
			"com.liferay.portlet.requires-namespaced-parameters=false",
			"com.liferay.portlet.private-request-attributes=false"
		},
		service = Portlet.class
	)

public class CotizadorPaso4Portlet73Portlet extends MVCPortlet {
	
	private static final Log _log = LogFactoryUtil.getLog(CotizadorPaso4Portlet73Portlet.class);
	
	@Reference
	CotizadorPaso4 _ServicePaso4;
	@Reference
	CotizadorGenerico _ServiceGenerico;
	
	InfoCotizacion infCotizacion = new InfoCotizacion();
	InfoAuxPaso1 infoPaso1 = new InfoAuxPaso1();
	EmisionDataResponse responseEmision = new EmisionDataResponse();
	DomicilioResponse responseCp = new DomicilioResponse();
	User user;
	LogVoBo vobo = new LogVoBo();


	
	@Override
	public void render(RenderRequest renderRequest, RenderResponse renderResponse)
			throws PortletException, IOException {
		
		SessionMessages.add(renderRequest, PortalUtil.getPortletId(renderRequest) + SessionMessages.KEY_SUFFIX_HIDE_DEFAULT_ERROR_MESSAGE);
		HttpServletRequest originalRequest = PortalUtil.getOriginalServletRequest(PortalUtil.getHttpServletRequest(renderRequest));
		int idPerfilUser = (int) originalRequest.getSession().getAttribute("idPerfil");
		
		user = (User) renderRequest.getAttribute(WebKeys.USER);
		
		llenaInfoCotizacion(renderRequest);
		recuperaInfoPaso1(renderRequest);
		validaModoCot(renderRequest);
		llenaInfoEmisionData(renderRequest);
		fValidarRetroactividad(idPerfilUser, renderRequest);
		validaColonia(renderRequest);		
		fSolicitaUmbralVoBo((int)infCotizacion.getCotizacion(), infCotizacion.getVersion(), renderRequest);		
		String infoCotJson = CotizadorModularUtil.objtoJson(infCotizacion);			
		llenaCatalogo(renderRequest);
		llenaLogVoBo(renderRequest);
		
		
		renderRequest.setAttribute("response", responseEmision);
		renderRequest.setAttribute("idPerfilUser", idPerfilUser);
		renderRequest.setAttribute("responseCp", responseCp);
//		_log.info("infoCotJson");
//		_log.info(infoCotJson);
		renderRequest.setAttribute("infoCotJson", infoCotJson);	
		renderRequest.setAttribute("infCotizacion", infCotizacion);		
//		renderRequest.setAttribute("userMail", user.getEmailAddress());	
		renderRequest.setAttribute("userMail", Base64.getEncoder().encodeToString(user.getEmailAddress().toString().getBytes()));
		super.render(renderRequest, renderResponse);
	}


	private DomicilioResponse getDomicilioPersonas(String cp){
		try{
			return _ServicePaso4.getDomicilioPersonas(cp);
		}
		catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return null;
		}
	}
	
	private void fSolicitaUmbralVoBo(int cotizacion, int version, RenderRequest renderRequest){
		String infReqCom = "";
		String infReqComS = "";
		try{
			UmbralVoBo respVoBo = _ServicePaso4.SolicitaUmbralVoBo(cotizacion, version);
			if (respVoBo.getCode()==0){
//				respVoBo.setCodigoVoBo("VPVOBO1");
//				System.err.println("respVoBo.getCodigoVoBo(): " + respVoBo.getCodigoVoBo());
				switch (respVoBo.getCodigoVoBo()) {
				case "VPVOBO1":
					//BAJO
					fQuienEsQuien(renderRequest);
					break;
				case "VPVOBO2":
					//MEDIO
					infReqCom="infReq";
					infReqComS="infReqS";
					vobo.setP_tipoVOBO(vobo.getP_tipoVOBO() + "Prima media,");
					fQuienEsQuien(renderRequest);
					break;
				default:
					//ALTO
					infReqCom="infReq";
					infReqComS="infReqS";
					vobo.setP_tipoVOBO(vobo.getP_tipoVOBO() + "Prima alta,");
					fQuienEsQuien(renderRequest);
					break;
				}
				fPersonasBloqueadasCNSF(renderRequest);
				System.err.println("respVoBo");
				System.err.println(respVoBo);			
			}
			else{
				SessionErrors.add(renderRequest, "errorServicios");
			}
		}
		catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		renderRequest.setAttribute("infReqCom", infReqCom);
		renderRequest.setAttribute("infReqComS", infReqComS);
	}
	
	private EmisionDataResponse fGetEmisionData(int cotizacion, int version, String usuario, String CotizadorPaso4){
		try{
			return _ServicePaso4.getEmisionData(cotizacion, version, usuario, CotizadorPaso4);
		}
		catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return null;
		}
	}
	
	private ListaRegistro fGetCatalogos(int p_rownum, String p_tiptransaccion, String p_codigo, int p_activo,
			String p_usuario, String p_pantalla) {
		try {
			ListaRegistro list = _ServiceGenerico.getCatalogo(p_rownum, p_tiptransaccion, p_codigo, p_activo, p_usuario, p_pantalla);
			list.getLista().sort(Comparator.comparing(Registro::getDescripcion));
			return list;
			/* return null; */
		} catch (Exception e) {
			return null;
		}
	}
	
	private void llenaInfoCotizacion(RenderRequest renderRequest){
		
		try {
			HttpServletRequest originalRequest = PortalUtil
					.getOriginalServletRequest(PortalUtil.getHttpServletRequest(renderRequest));

			String inf = originalRequest.getParameter("infoCotizacion");
			
			String nombreCotizador = "";
			if(Validator.isNotNull(inf)){
				infCotizacion = CotizadorModularUtil.decodeURL(inf);
			}else{
				infCotizacion = new InfoCotizacion();
			}
			
			switch (infCotizacion.getTipoCotizacion()) {
				case FAMILIAR:
					infCotizacion.setPantalla("paqueteFamiliar");
					nombreCotizador = CotizadorPaso4Portlet73PortletKeys.TITULO_FAMILIAR;
					break;
				case EMPRESARIAL:
					infCotizacion.setPantalla("moduloEmpresarial");
					nombreCotizador = CotizadorPaso4Portlet73PortletKeys.TITULO_EMPRESARIAL;
					break;
				default:
					infCotizacion.setPantalla("");
					break;
			}
			renderRequest.setAttribute("tituloCotizador", nombreCotizador);
		} catch (Exception e) {
			// TODO: handle exception
			System.err.println("------------------ llenaInfoCotizacion:");
			SessionErrors.add(renderRequest, "errorServicios");
			e.printStackTrace();
		}

	}
	
	private void llenaInfoEmisionData(RenderRequest renderRequest){
		String disableDenom = "";
		if((infCotizacion.getCotizacion()!=0)&&(infCotizacion.getVersion()!=0)){

			responseEmision = fGetEmisionData((int)infCotizacion.getCotizacion(), infCotizacion.getVersion(), user.getScreenName(), infCotizacion.getPantalla()); //Prueba Persona Fisica
			if(responseEmision.getCode()==0){
				
				responseCp = getDomicilioPersonas(responseEmision.getCpData().getCp());				
				responseEmision.getDatosFisica().setFechaNacimineto(fDateToString(responseEmision.getDatosFisica().getFechaNacimineto()));
				responseEmision.getDatosMoral().setFechaConstitucion(fDateToString(responseEmision.getDatosMoral().getFechaConstitucion()));
				if(responseEmision.getDatosCliente().getIdDenominacion() != 0){
					disableDenom = "disabled";
				}
				
			}
			else{
				SessionErrors.add(renderRequest, "errorServicios");				
			}
		}
		else{
			responseEmision = new EmisionDataResponse();
			SessionErrors.add(renderRequest, "errorInfo");
		}
		renderRequest.setAttribute("disableDenom", disableDenom);
	}
	
	private void validaColonia(RenderRequest renderRequest){
		String disableColonia = "";
		if((infCotizacion.getCotizacion()!=0)&&(infCotizacion.getVersion()!=0)&&(responseEmision.getCode()==0)){
			if(responseEmision.getCpData().getIdCp() == 0){
				Registro e = new Registro();
				e.setId(0);
				e.setCodigo("0");
				e.setDescripcion(responseEmision.getCpData().getColonia());
				responseCp.getListaColonia().add(e);
				disableColonia="disabled";
			}
			else {
				disableColonia = "disabled";
			}
		}
		renderRequest.setAttribute("disableColonia", disableColonia);
	}
	
	private String fDateToString(String valorFecha) {
		String res = "";
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		Calendar cal = Calendar.getInstance();
		if (valorFecha != null) {
			String aux = "";
			for (char c : valorFecha.toCharArray()) {
				aux += Character.isDigit(c) ? c : "";
			}
			try {
				cal.setTime(new Date(Long.parseLong(aux)));
				res = dateFormat.format(cal.getTime());
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return res;
	}
	
	private void fPersonasBloqueadasCNSF(RenderRequest renderRequest) {
		
		Persona persona = responseEmision.getDatosCliente();
		String personasBloqueadasJsonStr;
		Gson gson = new Gson();
		
		try {
			PersonasBloqueadasResponse response = _ServicePaso4.getListaPersonasBloqueadasCNSF(persona.getNombre(),
					persona.getAppPaterno(), persona.getAppMaterno(), persona.getRfc(),
					(persona.getTipoPer() == TipoPersona.MORAL.getTipoPersona()) ? 2 : 1 , persona.getAppPaterno().replace(".", ""));
			
			System.out.println(response);
			
			personasBloqueadasJsonStr = gson.toJson(response);
			
			renderRequest.setAttribute("responsePersonasBloqueadasCNSF", personasBloqueadasJsonStr);
		}
		catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	private void fQuienEsQuien(RenderRequest renderRequest){
		boolean isMoral = (responseEmision.getDatosCliente().getTipoPer() == TipoPersona.MORAL.getTipoPersona()) ? true : false;
		
		JsonObject respuesta = new JsonObject();
		JsonArray responseXML = new JsonArray();
		int codigo = 0;
		
		try {
			Client client = Client.create();
			WebResource webResource = client.resource("https://qeq.com.mx/datos/qws/access")
					.queryParam("var1", CotizadorPaso4Portlet73PortletKeys.QQ_USUARIO)
					.queryParam("var2", CotizadorPaso4Portlet73PortletKeys.QQ_CONTRASEÑA);
			
			String response = webResource.accept(MediaType.APPLICATION_XML).header("user-agent", "").get(String.class);
			
			_log.info("Resourse: " + webResource);
			_log.info("Request : " + response);
			
			String cookiesServ = ""; 
			
			for ( NewCookie cookie : webResource.head().getCookies()) {
				cookiesServ += Validator.isNull( cookiesServ) ?
						cookie.getName() + " : " + cookie.getValue() :
							", " + cookie.getName() + " : " + cookie.getValue();
			}
			
			_log.info("Cookies : " + cookiesServ);
			
			NewCookie cookieId = webResource.head().getCookies().stream().filter(NewCookie -> "qnid".equals(NewCookie.getName())).findAny().orElse(null);
			
			if (Validator.isNull(cookieId)) {
				codigo = 1;
				respuesta.addProperty("code", codigo);
				respuesta.addProperty("msg", "Error de login Quien es Quien");
				_log.info("quien es quien, sin cookie id: " + respuesta.toString());
			} else {
				
				List<NewCookie> cookies = webResource.head().getCookies();
				
				if (isMoral){
					JsonObject xmlRazon = new JsonObject();
					JsonObject xmlRfc = new JsonObject();
					JsonObject xmlCompleto = new JsonObject();
					
					
					WebResource	razMor = client.resource(CotizadorPaso4Portlet73PortletKeys.QQ_URL_MORAL)
							.queryParam("razonsoc",
									HtmlUtil.escape( responseEmision.getDatosCliente().getNombre().toLowerCase()));					
					
					WebResource	rfcMor = client.resource(CotizadorPaso4Portlet73PortletKeys.QQ_URL_MORAL)
							.queryParam("rfc", responseEmision.getDatosCliente().getRfc());

					WebResource	nom_den_rfc = client.resource(CotizadorPaso4Portlet73PortletKeys.QQ_URL_MORAL)
							.queryParam("razonsoc",
									HtmlUtil.escape( 
											responseEmision.getDatosCliente().getNombre().toLowerCase() + " " +
											responseEmision.getDatosCliente().getAppPaterno().toLowerCase()))
							.queryParam("rfc", responseEmision.getDatosCliente().getRfc());
					
					
					String respRazMor = razMor
							.accept(MediaType.APPLICATION_XML)
							.header("user-agent", "")
							.cookie(cookies.get(0))
							.cookie(cookies.get(1))
							.cookie(cookies.get(2))
							.get(String.class);
					
					String respRfcMor = rfcMor
							.accept(MediaType.APPLICATION_XML)
							.header("user-agent", "")
							.cookie(cookies.get(0))
							.cookie(cookies.get(1))
							.cookie(cookies.get(2))
							.get(String.class);

					String respNom_den_rfc = nom_den_rfc
							.accept(MediaType.APPLICATION_XML)
							.header("user-agent", "")
							.cookie(cookies.get(0))
							.cookie(cookies.get(1))
							.cookie(cookies.get(2))
							.get(String.class);
					
					xmlRazon.addProperty("tipo", "Razón Social");
					xmlRazon.addProperty("XML", respRazMor);
					
					xmlRfc.addProperty("tipo", "RFC");
					xmlRfc.addProperty("XML", respRfcMor);

					xmlCompleto.addProperty("tipo", "Razón Social + RFC");
					xmlCompleto.addProperty("XML", respNom_den_rfc);
					
					responseXML.add(xmlRazon);
					responseXML.add(xmlRfc);
					responseXML.add(xmlCompleto);
					
					_log.info("Resourse Moral-RazonSocial: " + razMor);
					_log.info("Request Moral-RazonSocial: " + respRazMor);
					_log.info("Resourse Moral-RFC: " + rfcMor);
					_log.info("Request Moral-RFC: " + respRfcMor);
					_log.info("Resourse RazónSocial+RFC: " + nom_den_rfc);
					_log.info("Request RazónSocial+RFC: " + respNom_den_rfc);
					
					String unionQQ = "Persona Moral - Razon Social: " + respRazMor +
							", RFC:" + respRfcMor + ", RazónSocial+RFC:" + respNom_den_rfc;
					
					vobo.setP_resultadoQeQ(HtmlUtil.escape( unionQQ));
					
				}else{
					
					JsonObject xmlNombreCompleto = new JsonObject();
					JsonObject xmlNombreRfc = new JsonObject();
					JsonObject xmlApPRfc = new JsonObject();
					JsonObject xmlApMRfc = new JsonObject();
					
					
					
					WebResource nomCom = client.resource(CotizadorPaso4Portlet73PortletKeys.QQ_URL_FISICA)
							.queryParam("nombre", HtmlUtil.escape(responseEmision.getDatosCliente().getNombre().toLowerCase()))
							.queryParam("paterno", HtmlUtil.escape(responseEmision.getDatosCliente().getAppPaterno().toLowerCase()))
							.queryParam("materno",HtmlUtil.escape( responseEmision.getDatosCliente().getAppMaterno().toLowerCase()));					

					WebResource nomRFC = client.resource(CotizadorPaso4Portlet73PortletKeys.QQ_URL_FISICA)
							.queryParam("nombre", HtmlUtil.escape(responseEmision.getDatosCliente().getNombre().toLowerCase()))
							.queryParam("rfc", responseEmision.getDatosCliente().getRfc());					

					WebResource apPRFC = client.resource(CotizadorPaso4Portlet73PortletKeys.QQ_URL_FISICA)
							.queryParam("paterno", HtmlUtil.escape(responseEmision.getDatosCliente().getAppPaterno().toLowerCase()))
							.queryParam("rfc", responseEmision.getDatosCliente().getRfc());					

					WebResource apMRFC = client.resource(CotizadorPaso4Portlet73PortletKeys.QQ_URL_FISICA)
							.queryParam("materno", HtmlUtil.escape(responseEmision.getDatosCliente().getAppMaterno().toLowerCase()))
							.queryParam("rfc", responseEmision.getDatosCliente().getRfc());
					
					String rnomCom = nomCom
							.accept(MediaType.APPLICATION_XML)
							.header("user-agent", "")
							.cookie(cookies.get(0))
							.cookie(cookies.get(1))
							.cookie(cookies.get(2))
							.get(String.class);
					
					String rnomRFC = nomRFC
							.accept(MediaType.APPLICATION_XML)
							.header("user-agent", "")
							.cookie(cookies.get(0))
							.cookie(cookies.get(1))
							.cookie(cookies.get(2))
							.get(String.class);
					
					String rapPRFC = apPRFC
							.accept(MediaType.APPLICATION_XML)
							.header("user-agent", "")
							.cookie(cookies.get(0))
							.cookie(cookies.get(1))
							.cookie(cookies.get(2))
							.get(String.class);
					
					String rapMRFC = apMRFC
							.accept(MediaType.APPLICATION_XML)
							.header("user-agent", "")
							.cookie(cookies.get(0))
							.cookie(cookies.get(1))
							.cookie(cookies.get(2))
							.get(String.class);
					
					xmlNombreCompleto.addProperty("tipo", "Nombre Completo");
					xmlNombreCompleto.addProperty("XML", rnomCom);
					
					xmlNombreRfc.addProperty("tipo", "Nombre-RFC");
					xmlNombreRfc.addProperty("XML", rnomRFC);
					
					xmlApPRfc.addProperty("tipo", "ApP-RFC");
					xmlApPRfc.addProperty("XML", rapPRFC);
					
					xmlApMRfc.addProperty("tipo", "ApM-RFC");
					xmlApMRfc.addProperty("XML", rapMRFC);
					
					responseXML.add(xmlNombreCompleto);
					responseXML.add(xmlNombreRfc);
					responseXML.add(xmlApPRfc);
					responseXML.add(xmlApMRfc);
					
					_log.info("Resourse Nombre Completo: " + nomCom);
					_log.info("Request Nombre Completo: " + rnomCom);
					_log.info("Resourse Nombre-RFC: " + nomRFC);
					_log.info("Request Nombre-RFC: " + rnomRFC);
					_log.info("Resourse ApP-RFC: " + apPRFC);
					_log.info("Request ApP-RFC: " + rapPRFC);
					_log.info("Resourse ApM-RFC: " + apMRFC);
					_log.info("Request ApM-RFC: " + rapMRFC);
					
					String unionQQ = "Persona Fisica - Nombre complero: " + rnomCom +
							", Nombre+RFC:" + rnomRFC + ", ApP+RFC:" + rapPRFC + "ApM+RFC" + rapMRFC; 
					
					vobo.setP_resultadoQeQ(HtmlUtil.escape(unionQQ));
									
				}
				
				codigo = 0;
				respuesta.addProperty("code", codigo);
				respuesta.addProperty("msg", "ok");
				respuesta.add("listaXML", responseXML);
				System.out.println("respuestaQQ: " + respuesta.toString());

			}
			
		} catch (Exception e) {
			// TODO: handle exception
			codigo = 5;
			respuesta.addProperty("code", codigo);
			respuesta.addProperty("msg", "Error de conexión");
			e.printStackTrace();
			_log.error(e.toString());
		}
		
		renderRequest.setAttribute("responseQuienQuien", respuesta);
	}
	
	private void fValidarRetroactividad(int idPerfilUser, RenderRequest renderRequest){
		ValidaResponse respuesta = new ValidaResponse();
		RetroactividadRequest rr = new RetroactividadRequest();
		rr.setIdPerfil(idPerfilUser);
		rr.setP_cotizacion((int)infCotizacion.getCotizacion());
		rr.setP_version(infCotizacion.getVersion());
		try {
			respuesta = _ServicePaso4.wsValidarRetroactividad(rr, infCotizacion.getPantalla(), user.getScreenName());
			
		} catch (Exception e) {
			// TODO: handle exception
			_log.error("Error en ws Valida retroactividad");
		}
		
		renderRequest.setAttribute("infocotizacionExpiro", respuesta.getMsg());
		renderRequest.setAttribute("cotizacionExpiro", respuesta.getCode());
		
	}
	
	private void recuperaInfoPaso1(RenderRequest renderRequest) {
		try {
			final PortletSession psession = renderRequest.getPortletSession();
			Gson gson = new Gson();
			String auxNombre = "LIFERAY_SHARED_F=" + infCotizacion.getFolio() + "_C="
					+ infCotizacion.getCotizacion() + "_V=" + infCotizacion.getVersion()
					+ "_DATOSP1";
			System.err.println("SESION REQUEST: " + auxNombre);
			
			String datosP1 = (String) psession.getAttribute(auxNombre, PortletSession.APPLICATION_SCOPE);
			
			if (Validator.isNotNull(datosP1)) {				
				System.err.println("SESION RESPONSE: " + datosP1);
				
				infoPaso1 = gson.fromJson(datosP1, InfoAuxPaso1.class);
				System.err.println("infoPaso1: " + infoPaso1);
				renderRequest.setAttribute("datosP1", datosP1);
			}
			else{
				System.err.println("CAMBIAR VALOR COTIZACION");
				infCotizacion.setModo(ModoCotizacion.ERROR);
			}
		} catch (Exception e) {
			// TODO: handle exception
			infoPaso1 = new InfoAuxPaso1();
			e.printStackTrace();
			SessionErrors.add(renderRequest, "errorConocido");
			renderRequest.setAttribute("errorMsg", "Error al cargar las ubicaciones");
			SessionMessages.add(renderRequest, PortalUtil.getPortletId(renderRequest)
					+ SessionMessages.KEY_SUFFIX_HIDE_DEFAULT_ERROR_MESSAGE);
		}
	}
	
	
	void validaModoCot(RenderRequest renderRequest){
	int respuesta = 0;
		switch (infCotizacion.getModo()) {
			case ALTA_ENDOSO:
				respuesta = ModoAuxiliar.esEndoso.getModoCotizacion();
				break;
			case BAJA_ENDOSO:
				respuesta = ModoAuxiliar.esEndoso.getModoCotizacion();
				break;
			case EDITAR_ALTA_ENDOSO:
				respuesta = ModoAuxiliar.esEndoso.getModoCotizacion();
				break;
			case EDITAR_BAJA_ENDOSO:
				respuesta = ModoAuxiliar.esEndoso.getModoCotizacion();
				break;

			case RENOVACION_AUTOMATICA:
				respuesta = ModoAuxiliar.esRenovacion.getModoCotizacion();
			default:
				respuesta = ModoAuxiliar.esCotizacion.getModoCotizacion();
				break;
		}
		renderRequest.setAttribute("ModoCot", respuesta);
	}
	
	
	private void llenaCatalogo(RenderRequest renderRequest) {
		// TODO Auto-generated method stub
		ListaRegistro denomList = fGetCatalogos(CotizadorModularServiceKey.TMX_CTE_ROW_TODOS,
				CotizadorModularServiceKey.TMX_CTE_TRANSACCION_GET,
				CotizadorModularServiceKey.LIST_CAT_DENOMINACION,
				CotizadorModularServiceKey.TMX_CTE_CAT_ACTIVOS, user.getScreenName(), infCotizacion.getPantalla());
		ListaRegistro listCargo = fGetCatalogos(CotizadorModularServiceKey.TMX_CTE_ROW_TODOS,
				CotizadorModularServiceKey.TMX_CTE_TRANSACCION_GET,
				CotizadorModularServiceKey.LIST_CAT_CARGO_PUESTO,
				CotizadorModularServiceKey.TMX_CTE_CAT_ACTIVOS, user.getScreenName(), infCotizacion.getPantalla());
		ListaRegistro listaGiroVulne = fGetCatalogos(CotizadorModularServiceKey.TMX_CTE_ROW_TODOS,
				CotizadorModularServiceKey.TMX_CTE_TRANSACCION_GET,
				CotizadorModularServiceKey.LIST_CAT_GIRO_VULNERABLE,
				CotizadorModularServiceKey.TMX_CTE_CAT_ACTIVOS, user.getScreenName(), infCotizacion.getPantalla());
		ListaRegistro listaNacionalidad = fGetCatalogos(CotizadorModularServiceKey.TMX_CTE_ROW_TODOS,
				CotizadorModularServiceKey.TMX_CTE_TRANSACCION_GET,
				CotizadorModularServiceKey.LIST_CAT_NACIONALIDAD,
				CotizadorModularServiceKey.TMX_CTE_CAT_ACTIVOS, user.getScreenName(), infCotizacion.getPantalla());
		ListaRegistro listaRegimen = fGetCatalogos(CotizadorModularServiceKey.TMX_CTE_ROW_TODOS,
				CotizadorModularServiceKey.TMX_CTE_TRANSACCION_GET,
				CotizadorModularServiceKey.LIST_CAT_REGIMEN,
				CotizadorModularServiceKey.TMX_CTE_CAT_ACTIVOS, user.getScreenName(), infCotizacion.getPantalla());
		
		renderRequest.setAttribute("denomList", denomList.getLista());
		renderRequest.setAttribute("regimenList", listaRegimen.getLista());
		renderRequest.setAttribute("listCargo", listCargo.getLista());
		renderRequest.setAttribute("listaGiroVulne", listaGiroVulne.getLista());
		renderRequest.setAttribute("listaNacionalidad", listaNacionalidad.getLista());
		
	}
	
	private void llenaLogVoBo(RenderRequest renderRequest) {
		// TODO Auto-generated method stub
		vobo.setP_cotizacion((int) infCotizacion.getCotizacion());
		vobo.setP_version(infCotizacion.getVersion());
		vobo.setP_usuario(user.getScreenName());
		vobo.setP_idpersona(responseEmision.getDatosCliente().getIdPersona());
		vobo.setP_tipoVOBO(vobo.getP_tipoVOBO() + " ");
		vobo.setP_estatus("SUCCES");
		String lgVoBo =CotizadorModularUtil.objtoJson(vobo);
		
		
		
		System.out.println(vobo.toString());
		System.out.println(lgVoBo);
		renderRequest.setAttribute("lgVoBo", lgVoBo);
	}
}