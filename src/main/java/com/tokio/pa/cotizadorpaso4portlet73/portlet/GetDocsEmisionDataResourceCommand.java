package com.tokio.pa.cotizadorpaso4portlet73.portlet;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.liferay.mail.kernel.model.MailMessage;
import com.liferay.mail.kernel.service.MailServiceUtil;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.portlet.bridges.mvc.BaseMVCResourceCommand;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCResourceCommand;
import com.liferay.portal.kernel.util.HtmlUtil;
import com.liferay.portal.kernel.util.MimeTypesUtil;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.kernel.util.WebKeys;
import com.tokio.pa.cotizadorpaso4portlet73.constants.CotizadorPaso4Portlet73PortletKeys;
import com.tokio.pa.cotizadorModularServices.Bean.Documento;
import com.tokio.pa.cotizadorModularServices.Bean.DocumentoResponse;
import com.tokio.pa.cotizadorModularServices.Interface.CotizadorGenerico;
import com.tokio.pa.cotizadorModularServices.Interface.CotizadorPaso4;

import java.io.File;
import java.io.PrintWriter;
import java.util.Base64;
import java.util.List;

import javax.mail.internet.InternetAddress;
import javax.portlet.ResourceRequest;
import javax.portlet.ResourceResponse;

import org.apache.commons.io.FileUtils;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(immediate = true, property = { "javax.portlet.name=" + CotizadorPaso4Portlet73PortletKeys.CotizadorPaso4, "mvc.command.name=/getDocsEmision" }, service = MVCResourceCommand.class)

public class GetDocsEmisionDataResourceCommand extends BaseMVCResourceCommand{
	@Reference
	CotizadorPaso4 _ServicePaso4;
	@Reference
	CotizadorGenerico _ServiceGenerico;
	
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
			System.out.println("ENTRE SERVICIO /getDocsEmision");
			User user = (User) resourceRequest.getAttribute(WebKeys.USER);

			String listaEmails = HtmlUtil.unescape(ParamUtil.getString(resourceRequest, "listaEmails"));
			System.out.println("listaEmails: " + listaEmails);
			int rowNum = 0;
			String tipTransaccion = "B";
			
			Gson g = new Gson(); 

			
			String jsonDocumentosStr ="[" + HtmlUtil.unescape(ParamUtil.getString(resourceRequest, "infoDocs") + "]" );

			JsonArray jsonDocumentos = g.fromJson(jsonDocumentosStr, JsonArray.class);

			String tipo = "";
			int idAsigna = 0;
			String parametros = "";
			String usuario = user.getScreenName();
			String CotizadorPaso4 = CotizadorPaso4Portlet73PortletKeys.CotizadorPaso4;

			int activo = 1;
			DocumentoResponse response = _ServiceGenerico.wsDocumentos(rowNum, tipTransaccion, jsonDocumentos, activo,
					tipo, idAsigna, parametros, usuario, CotizadorPaso4);

			if (Validator.isNull(listaEmails)) {// caso de descargar documentos
				int code = 0;
				if (!response.getMsg().equalsIgnoreCase("ok")) {
					code = 1;
				}

				StringBuilder stringJson = new StringBuilder();
				stringJson.append("{");
				stringJson.append("\"code\":" + code);
				stringJson.append(", \"msg\":\"" + response.getMsg());
				stringJson.append("\", \"archivos\" : [");

				int i = 0;

				for (Documento doc : response.getLista()) {
					if (i > 0) {
						stringJson.append(",");
					}
					stringJson.append("{");
					stringJson.append("\"documento\" : \"" + doc.getDocumento() + "\"");
					stringJson.append(",\"nombre\" : \"" + doc.getNombre() + "\"");
					stringJson.append(",\"extension\" : \"" + doc.getExtension() + "\"");
					stringJson.append(
							",\"mimeType\":\"" + MimeTypesUtil.getExtensionContentType(doc.getExtension()) + "\"");
					stringJson.append("}");
					i++;
				}

				stringJson.append("]}");

				resourceResponse.getWriter().write(stringJson.toString());
			} else {// caso de enviar por email

				sendMail(listaEmails.split(","), response.getLista(), resourceRequest);
				String jsonString = "{\"code\" : \"0\", \"msg\" : \"Email enviado\" }";
				writer.write(jsonString);
			}
		} catch (Exception e) {
			System.out.println(e);
			String jsonString = "{\"code\" : \"5\", \"msg\" : \"Error al consultar la información\" }";
			writer.write(jsonString);
		}
	}
	
	private void sendMail(String[] mails, List<Documento> documentos, ResourceRequest resourceRequest) {
		try {
			String cliente = ParamUtil.getString(resourceRequest, "cliente");
			String poliza = ParamUtil.getString(resourceRequest, "poliza");
			String totUbica = ParamUtil.getString(resourceRequest, "totUbica");
			String moneda = ParamUtil.getString(resourceRequest, "moneda");
			String certificado = ParamUtil.getString(resourceRequest, "certificado");
			String vigencia = ParamUtil.getString(resourceRequest, "vigencia");
			String formaPago = ParamUtil.getString(resourceRequest, "formaPago");
			String primaNeta = ParamUtil.getString(resourceRequest, "primaNeta");
			String recargo = ParamUtil.getString(resourceRequest, "recargo");
			String gasto = ParamUtil.getString(resourceRequest, "gasto");
			String iva = ParamUtil.getString(resourceRequest, "iva");
			String prima = ParamUtil.getString(resourceRequest, "prima");
			String folio = ParamUtil.getString(resourceRequest, "folio");
			int renovacion = ParamUtil.getInteger(resourceRequest, "renovacion");
//			User user = (User) resourceRequest.getAttribute(WebKeys.USER);
			String usuario = ParamUtil.getString(resourceRequest, "agente");
						
			
			String fromMail = "portal_agentes@tokiomarine.com.mx";
			MailMessage ms = new MailMessage();
			String body = "";
			String subj = "";
			if(renovacion == 1){
				body = "<!DOCTYPE html><html><head>    <meta http-equiv='Content-Type ' content='text/html; charset=UTF-8 ' />  <title>Renovaci&oacute;n ${poliza}</title>   </head>   <body>  <header><h3>Estimado Socio de Negocio:</h3></header>  <section>    <p>   Por este conducto hacemos constar que a partir de la vigencia solicitada, se ha renovado el programa de Seguro contratado con Tokio Marine Compañía de Seguros, S.A. de C.V. con base en las condiciones anexas    </p>    <p>Cliente: <b>${cliente}</b></p>    <p>P&oacute;liza: <b>${poliza}</b></p>    <p>Total de Ubicaciones: <b>${totUbica}</b></p>    <p>Moneda: <b>${moneda}</b></p>    <p>Certificado: <b>${certificado}</b></p>    <p>Vigencia: <b>${vigencia}</b></p>    <p>Forma de Pago: <b>${fomaPago}</b></p>    <p>Agente: <b>${agente}</b></p>    <br />    <p>Prima Neta: <b>${primaNeta}</b></p>    <p>Recargo por Pago Fraccionado: <b>${recargo}</b></p>    <p>Gastos de Expedici&oacute;n: <b>${gastos}</b></p>    <p>I.V.A: <b>${iva}</b></p>    <p>Prima Total: <b>${primaTot}</b></p>    <p>   Agradecemos la confianza depositada en nuestra Compañ&iacute;a y la   oportunidad que nos brindan para ofrecerles nuestros servicios de   seguros.    </p>    <p>Le enviamos un cordial saludo</p>  </section>  <footer>    <img   src='https://preview.ibb.co/i3vFWp/Firma_Correo_Tokio_Marine.png '   alt='Firma Correo Tokio Marine '   border='0 '   width='50% '    />  </footer>   </body> </html> ";
				subj = "Emisión: Renovación de Póliza : " + poliza + ", Tokio Marine";
			}else{
				body = "<!DOCTYPE HTML><html><head>    <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />    <title>Emisi&oacute;n ${poliza}</title></head><body>    <header>        <h3> Estimado Socio de Negocio: </h3>    </header>    <section>        <p> Por este conducto hacemos constar que a partir de la vigencia solicitada, el programa de Seguro contratado se encuentra amparado por Tokio Marine Compañ&iacute;a de Seguros, S.A. de C.V. con base en las condiciones anexas. </p>        <p>Cliente: <b>${cliente}</b></p>        <p>P&oacute;liza: <b>${poliza}</b></p>        <p>Total de Ubicaciones: <b>${totUbica}</b></p>        <p>Moneda: <b>${moneda}</b></p>        <p>Certificado: <b>${certificado}</b></p>        <p>Vigencia: <b>${vigencia}</b></p>        <p>Forma de Pago: <b>${fomaPago}</b></p>        <p>Agente: <b>${agente}</b></p> <br />        <p>Prima Neta: <b>${primaNeta}</b></p>        <p>Recargo por Pago Fraccionado: <b>${recargo}</b></p>        <p>Gastos de Expedici&oacute;n: <b>${gastos}</b></p>        <p>I.V.A: <b>${iva}</b></p>        <p>Prima Total: <b>${primaTot}</b></p>        <p>Agradecemos la confianza depositada en nuestra Compañ&iacute;a y la oportunidad que nos brindan para ofrecerles nuestros servicios de seguros.</p>        <p>Le enviamos un cordial saludo</p>    </section>    <footer> <img src='https://preview.ibb.co/i3vFWp/Firma_Correo_Tokio_Marine.png' alt='Firma Correo Tokio Marine' border='0' width='50%' /> </footer></body></html>";
				subj = "Emisión: Folio: " + folio + " , Póliza: " + poliza + ", Tokio Marine";
			}
			 
			body = StringUtil.replace(body,
					new String[] { "${poliza}", "${cliente}", "${totUbica}", "${moneda}", "${certificado}", "${vigencia}", "${fomaPago}", "${agente}", "${primaNeta}", "${recargo}", "${gastos}", "${iva}", "${primaTot}", "${pathImg}" },
					new String[] { poliza, cliente, totUbica, moneda, certificado, vigencia, formaPago, usuario, primaNeta, recargo, gasto, iva, prima, "https://ibb.co/j5eyj9" });
			
			InternetAddress fromAddress = new InternetAddress(fromMail);
			InternetAddress toAddress = null;
			InternetAddress[] bulkAddresses = new InternetAddress[mails.length];
			
			

			ms.setFrom(fromAddress);
			ms.setSubject(subj);
			ms.setBody(body);
			ms.setHTMLFormat(true);

			for (int i = 0; i < mails.length; i++) {
				toAddress = new InternetAddress(mails[i]);
				bulkAddresses[i] = toAddress;
			}
			ms.setBulkAddresses(bulkAddresses);

			for (Documento documento : documentos) {
				System.out.println("-----------------------------documentos---------------------");
				System.out.println(documento.getNombre() + "." + documento.getExtension());
				
				File temp = File.createTempFile(documento.getNombre(), "." + documento.getExtension());
				//FileUtils.writeByteArrayToFile(temp, Codifica.decode(documento.getDocumento()));
				FileUtils.writeByteArrayToFile(temp, Base64.getDecoder().decode(documento.getDocumento()));
				System.out.println("---------------------------------genere-----------------------");
				ms.addFileAttachment(temp);
			}
			MailServiceUtil.sendEmail(ms);
			System.out.println("--------fin mail-------");
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
}
