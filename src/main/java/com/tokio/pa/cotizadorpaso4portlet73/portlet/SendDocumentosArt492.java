package com.tokio.pa.cotizadorpaso4portlet73.portlet;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.liferay.document.library.kernel.model.DLFolder;
import com.liferay.document.library.kernel.model.DLFolderConstants;
import com.liferay.document.library.kernel.service.DLAppService;
import com.liferay.document.library.kernel.service.DLFolderLocalServiceUtil;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.portlet.bridges.mvc.BaseMVCResourceCommand;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCResourceCommand;
import com.liferay.portal.kernel.repository.model.FileEntry;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.ServiceContextFactory;
import com.liferay.portal.kernel.upload.UploadPortletRequest;
import com.liferay.portal.kernel.util.Base64;
import com.liferay.portal.kernel.util.HtmlUtil;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.kernel.util.WebKeys;
import com.tokio.pa.cotizadorpaso4portlet73.constants.CotizadorPaso4Portlet73PortletKeys;
import com.tokio.pa.cotizadorpaso4portlet73.util.SendMailLegal492;
import com.tokio.pa.cotizadorModularServices.Bean.DocumentoResponse;
import com.tokio.pa.cotizadorModularServices.Bean.IdCarpetaResponse;
import com.tokio.pa.cotizadorModularServices.Bean.InformacionLegal;
import com.tokio.pa.cotizadorModularServices.Bean.SimpleResponse;
import com.tokio.pa.cotizadorModularServices.Constants.CotizadorModularServiceKey;
import com.tokio.pa.cotizadorModularServices.Exception.CotizadorModularException;
import com.tokio.pa.cotizadorModularServices.Interface.CotizadorGenerico;
import com.tokio.pa.cotizadorModularServices.Interface.CotizadorPaso4;

import java.io.File;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.portlet.ResourceRequest;
import javax.portlet.ResourceResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.FileUtils;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(immediate = true, property = { "javax.portlet.name=" + CotizadorPaso4Portlet73PortletKeys.CotizadorPaso4,
"mvc.command.name=/sendDocumentosArt492" }, service = MVCResourceCommand.class)

public class SendDocumentosArt492 extends BaseMVCResourceCommand{
	@Reference
	CotizadorPaso4 _ServicePaso4;
	@Reference
	CotizadorGenerico _ServiceGenerico;
	@Reference
	private DLAppService _dlAppService;
	
	private static final Log _log = LogFactoryUtil.getLog(SendDocumentosArt492.class);
	
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
		
		enviaArchivos(resourceRequest);
		enviaComentarios(resourceRequest);
		actualizaEstatusCotizacion(resourceRequest);		
		enviaMail(resourceRequest);
		
	}
	
	private void actualizaEstatusCotizacion(ResourceRequest resourceRequest) throws CotizadorModularException{
		User user = (User) resourceRequest.getAttribute(WebKeys.USER);
		HttpServletRequest originalRequest = PortalUtil.getOriginalServletRequest(PortalUtil.getHttpServletRequest(resourceRequest));
		int idPerfil = (int) originalRequest.getSession().getAttribute("idPerfil");
		
		int cotizacion = ParamUtil.getInteger(resourceRequest, "cotizacion");
		int version = ParamUtil.getInteger(resourceRequest, "version");
		int idFolio = ParamUtil.getInteger(resourceRequest, "folio");
		int idEstado =  1410; /*valor fijo (En espera de VoBo)*/
		String p_usuario = user.getScreenName();
		String p_pantalla = CotizadorPaso4Portlet73PortletKeys.CotizadorPaso4;
		
		_log.info("cotizacion : " + cotizacion);
		_log.info("version : " + version);
		_log.info("idPerfil : " + idPerfil);
		_log.info("idFolio : " + idFolio);
		_log.info("idEstado : " + idEstado);
		_log.info("p_usuario : " + p_usuario);
		_log.info("p_pantalla : " + p_pantalla);
		
		
		SimpleResponse r = _ServicePaso4.actualizaEstatusCotizacion(cotizacion, version, idPerfil, idFolio, idEstado, p_usuario, p_pantalla);
		
	}
	
	private void enviaMail(ResourceRequest resourceRequest) throws CotizadorModularException {
		// TODO Auto-generated method stub
		int cotizacion = ParamUtil.getInteger(resourceRequest, "cotizacion");
		String folio = ParamUtil.getString(resourceRequest, "folio");
		int version = ParamUtil.getInteger(resourceRequest, "version");
		User user = (User) resourceRequest.getAttribute(WebKeys.USER);
		String usuario = user.getScreenName();
		int idPerfil = ParamUtil.getInteger(resourceRequest, "idPerfil");
		InformacionLegal infLegal = _ServicePaso4.informacionLegal(cotizacion, version, idPerfil, CotizadorPaso4Portlet73PortletKeys.CotizadorPaso4, usuario);
		
		String mails[] = infLegal.getEmails().split(",");
//		String mails[] = {"ricardo_sanchez@tokiomarine.com.mx"};
//		String mails[] = {"alejandro.arcos@globalquark.com.mx"};
		
		String comentario = ParamUtil.getString(resourceRequest, "comentarios");
		comentario = Validator.isNull(comentario) ? "-- Sin comentarios --" : "\"" + comentario.toUpperCase() +  "\"";
		new SendMailLegal492().sendMail(mails, comentario, folio, infLegal.getUrlDocto());
		System.out.println(infLegal.toString());
		System.out.println("comentario 2 : " + comentario);
		System.out.println(folio);
	}
	
	void enviaArchivos(ResourceRequest resourceRequest) {

		int cotizacion = ParamUtil.getInteger(resourceRequest, "cotizacion");
		int folio = ParamUtil.getInteger(resourceRequest, "folio");
		int version = ParamUtil.getInteger(resourceRequest, "version");
		String auxiliarDoc = HtmlUtil.unescape(ParamUtil.getString(resourceRequest, "auxiliarDoc"));
		int totArchivos = ParamUtil.getInteger(resourceRequest, "totArchivos");

		User user = (User) resourceRequest.getAttribute(WebKeys.USER);
		String p_usuario = user.getScreenName();
		System.out.println("-------> totArchivos : " + totArchivos);
		try {
			if (totArchivos > 0) {
				
				JSONObject jsonObj;
				jsonObj = JSONFactoryUtil.createJSONObject(auxiliarDoc);
				UploadPortletRequest uploadRequest = PortalUtil.getUploadPortletRequest(resourceRequest);

				System.out.println(jsonObj.toString());

				IdCarpetaResponse carpeta = _ServiceGenerico.SeleccionaIdCarpeta(folio, cotizacion, version);
				

				for (int i = 0; i < totArchivos; i++) {
					JsonArray jsonDocumentos = new JsonArray();
					
					String nombre = "file-" + i;
					File file = uploadRequest.getFile(nombre);
					String mimeType = uploadRequest.getContentType(nombre);

					float n = file.length() / 1024 / 1024;
					float n64 = 4 * (n / 3) + (n % 3 != 0 ? 4 : 0);

					JsonObject enviaDocumentos = new JsonObject();

					JSONObject jsonObj2;
					jsonObj2 = JSONFactoryUtil.createJSONObject(jsonObj.getString(nombre));
					
					String nom = jsonObj2.getString("nom").replace(" ", "_");

					enviaDocumentos.addProperty("nombre", nom);
					enviaDocumentos.addProperty("extension", jsonObj2.getString("ext"));
					enviaDocumentos.addProperty("idCarpeta", carpeta.getIdCarpeta());
					enviaDocumentos.addProperty("idDocumento", "0");
					enviaDocumentos.addProperty("idCatalogoDetalle",
							jsonObj2.getString("idcatdet"));

					Map<String, Object> info = null;
					if (n64 > 1.49) {
						info = guardaDocumentos(resourceRequest, file, nom, mimeType,
								jsonObj2.getString("ext"));
						enviaDocumentos.addProperty("documento", "");
						enviaDocumentos.addProperty("url", (String) info.get("url"));
						enviaDocumentos.addProperty("leer", 1);
					} else {
						enviaDocumentos.addProperty("documento",
								Base64.encode(FileUtils.readFileToByteArray(file)));
						enviaDocumentos.addProperty("url", "");
						enviaDocumentos.addProperty("leer", 0);
					}
					
					jsonDocumentos.add(enviaDocumentos);
					System.out.println("json :" + enviaDocumentos.toString());
					try {
						DocumentoResponse respuesta = _ServiceGenerico.wsDocumentos(CotizadorModularServiceKey.TMX_CTE_ROW_TODOS,
								CotizadorModularServiceKey.TMX_CTE_TRANSACCION_POST,
								jsonDocumentos, 1, "VOBO492", cotizacion, "", p_usuario,
								CotizadorPaso4Portlet73PortletKeys.CotizadorPaso4);
						if (n64 > 1.49) {
							if (respuesta.getMsg().toLowerCase().trim().equals("ok")) {
								elimianArchivo((long) info.get("idDoc"));
							}
						}
					} catch (Exception e) {
						// TODO: handle exception
						e.getStackTrace();
					}
				}

			}
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("error en el archivo");
		}
	}
	
	void enviaComentarios(ResourceRequest resourceRequest) throws CotizadorModularException {
		String comentario = ParamUtil.getString(resourceRequest, "comentarios");
		comentario = Validator.isNull(comentario) ? "-- Sin comentarios --" : comentario;
		String cotizacion = ParamUtil.getString(resourceRequest, "cotizacion");
		int version = ParamUtil.getInteger(resourceRequest, "version");
		User user = (User) resourceRequest.getAttribute(WebKeys.USER);
		String usuario = user.getScreenName();

		_ServiceGenerico.guardarComentario(cotizacion, version, 1, 0, comentario, usuario,
				CotizadorPaso4Portlet73PortletKeys.CotizadorPaso4);

		String folio = ParamUtil.getString(resourceRequest, "folio");
		String url = ParamUtil.getString(resourceRequest, "url");
		String link = url + "?folioFamiliar=" + folio + "&cotizacionFamiliar=" + cotizacion
				+ "&versionFamiliar=" + version + "&modoFamiliar=" + 1 + "&leg492=factura";

		System.out.println("url articulo 492 : " + link);

		_log.info("Url para articulo 492 : " + link);

	}
	
	Map<String, Object> guardaDocumentos(ResourceRequest resourceRequest, File file, String nombre, String mimeType, String ext){
		try {
			
			Map<String, Object> respuesta = new HashMap<String, Object>();

			long idGroup = PortalUtil.getScopeGroupId(resourceRequest);
			ServiceContext serviceContext = ServiceContextFactory.getInstance(DLFolder.class.getName(), resourceRequest);
			
			serviceContext.setAddGroupPermissions(true);
			serviceContext.setAddGuestPermissions(true);
			
			
			User user = (User) resourceRequest.getAttribute(WebKeys.USER);
			
			String cotizacion = ParamUtil.getString(resourceRequest, "cotizacion");
			String version = ParamUtil.getString(resourceRequest, "version");
			String folio = ParamUtil.getString(resourceRequest, "folio");
			String url = ParamUtil.getString(resourceRequest, "url2");


			System.out.println("------------------------url2 : " + url );
			String aux2 = user.getScreenName() + "-" + nombre + "-F_" + folio + "-C_" + cotizacion + "-V_" + version;
			
			DLFolder fCotizadores = DLFolderLocalServiceUtil.getFolder(idGroup, DLFolderConstants.DEFAULT_PARENT_FOLDER_ID,
					"Documentos_Cotizadores");
			
			
			FileEntry fileEntry = _dlAppService.addFileEntry(idGroup, fCotizadores.getFolderId(), nombre + "." + ext,
					mimeType, nombre + "." + ext, aux2, "hi", file, serviceContext);
			
			
			String urlDoc = url + "/documents/" + idGroup + "/" + fileEntry.getFolderId() + "/" + fileEntry.getFileName()
			+ "/" + fileEntry.getUuid();
			
			System.out.println(urlDoc);
			
			_log.debug("--------------------------> documento:" + urlDoc);
			
			respuesta.put("url", urlDoc); 
			respuesta.put("idDoc", fileEntry.getFileEntryId()); 
			return respuesta;
		} catch (PortalException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
		
	}
	
	void elimianArchivo(long idDoc){
		try {
			_dlAppService.deleteFileEntry(idDoc);
		} catch (PortalException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
}
