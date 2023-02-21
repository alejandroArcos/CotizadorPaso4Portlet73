package com.tokio.pa.cotizadorpaso4portlet73.util;

import com.liferay.mail.kernel.model.MailMessage;
import com.liferay.mail.kernel.service.MailServiceUtil;
import com.liferay.portal.kernel.util.StringUtil;

import javax.mail.internet.InternetAddress;

public class SendMailLegal492 {
	public void sendMail(String[] mails, String comentarios,  String folio, String link){
		try {
			String fromMail = "portal_agentes@tokiomarine.com.mx";
			MailMessage ms = new MailMessage();
			String body = "<!DOCTYPE html> <html>   <head>  <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />  <title>Aviso de folio asignado ${folio}</title>   </head>   <body>     <header><h3>Aviso de folio asignado</h3></header>     <section>       <p>         El folio ${folio} le ha sido asignado para su atención y se le agregaron los siguientes comentarios:       </p>        <p>             ${comentarios}       </p>       <p>         Link directo al folio: ${link}       </p>       <p>Le enviamos un cordial saludo</p>     </section>     <footer>       <img         src='https://preview.ibb.co/i3vFWp/Firma_Correo_Tokio_Marine.png'         alt='Firma Correo Tokio Marine'         width='35%'       />     </footer>   </body> </html> ";
			body = StringUtil.replace(body,
					new String[] { "${folio}", "${comentarios}", "${link}" },
					new String[] { folio, comentarios, link});
			
			InternetAddress fromAddress = new InternetAddress(fromMail);
			InternetAddress toAddress = null;
			InternetAddress[] bulkAddresses = new InternetAddress[mails.length];

			ms.setFrom(fromAddress);
			ms.setSubject("Aviso de folio asignado - " + folio );
			ms.setBody(body);
			ms.setHTMLFormat(true);

			for (int i = 0; i < mails.length; i++) {
				toAddress = new InternetAddress(mails[i]);
				bulkAddresses[i] = toAddress;
			}
			ms.setBulkAddresses(bulkAddresses);

			MailServiceUtil.sendEmail(ms);
			System.out.println("--------fin mail-------");
			
		} catch (Exception e) {
			e.printStackTrace();
			
		}
	}
}
