<portlet:resourceURL id="/sendMailAgenteSuscriptor"
	var="sendMailAgenteSuscriptorUrl" />
<portlet:resourceURL id="/sendMailSuscriptorAgente"
	var="sendMailSuscriptorAgenteUrl" />
<portlet:resourceURL id="/getListadocumentosVoBo492"
	var="getListadocumentosVoBo492Url" />
<portlet:resourceURL id="/sendDocumentosArt492"
	var="sendDocumentosArt492Url" />
<portlet:resourceURL id="/habitacion/rechazoCotizacion"
	var="txtRechazaCotizacionURL" />

<style>
#conjuntoFile::-webkit-scrollbar {
	width: 20px;
	background-color: #F5F5F5;
}

#conjuntoFile::-webkit-scrollbar-track {
	-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	border-radius: 10px;
	background-color: #F5F5F5;
}

#conjuntoFile::-webkit-scrollbar-thumb {
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
	background-color: #555;
}
</style>


<!-- Modal monto excedido -->
<div class="modal" id="modalSuscripMontoExede" tabindex="-1"
	role="dialog" aria-labelledby="modalSuscripMontoExedeLabel"
	aria-hidden="true">
	<div class="modal-dialog modal-lg modal-dialog-centered"
		role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="modalSuscripMontoExedeLabel">Alerta
					de limites</h5>
			</div>
			<!--Body-->
			<div class="modal-body">

				<div class="row">
					<div class="col-12">
						<span id="suscripMontoExedeTxt"></span> <br>
					</div>
				</div>
			</div>

			<!--Footer-->
			<div class="modal-footer justify-content-center">
				<div class="row">
					<div class="col-md-6">
						<button class="btn btn-pink waves-effect waves-light"
							id="btnSuscripMontoSi" ${ isEndoso ? 'hidden' : '' }>Si</button>
						<button class="btn btn-pink waves-effect waves-light"
							id="btnSuscripMontoSiEnd" ${ isEndoso ? '' : 'hidden' }>Si</button>
					</div>
					<div class="col-md-6">
						<button class="btn btn-blue waves-effect waves-light"
							data-dismiss="modal" id="btnSuscripMontoNo">No</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- END Modal monto excedido -->

<!-- Modal subir archivos paso 2  -->
<div class="modal" id="fileModal" tabindex="-1" role="dialog"
	aria-labelledby="fileModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-lg" role="document">
		<div class="modal-content">
			<div class="fileErrorPopup"></div>
			<div class="modal-header">
				<h5 class="modal-title" id="fileModalLabel">¿Requiere incluir
					información adicional?</h5>
			</div>
			<div class="modal-body">

				<div class="row">
					<div class="col-12">
						<span>Archivos permitidos, PDF, Excel, Word</span>
						<div class="md-form">
							<div class="file-field">
								<div class="btn btn-blue btn-rounded btn-sm float-left">
									<span><i class="fas fa-upload mr-2" aria-hidden="true"></i>Seleccionar
										Archivo</span> <input id="docAgenSusc" type="file"
										multiple="multiple" data-file_types="pdf|doc|docx|xls|xlsx">
								</div>
								<input id="infDocSuc" class="form-control" type="text"
									placeholder="Archivos" disabled>
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-12">
						<div class="md-form">
							<textarea id="comentariosDosSuscrip" name="comentariosDosSuscrip"
								class="md-textarea form-control" rows="3" maxlength="1000"
								style="text-transform: uppercase;"></textarea>
							<label for="comentariosDosSuscrip"> Comentarios
								adicionales. </label>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<button class="btn btn-pink waves-effect waves-light"
					id="btnSuscripEnvSus">Enviar a suscriptor</button>
				<button class="btn btn-pink waves-effect waves-light"
					id="btnSuscripEnvSus2" hidden>Enviar a suscriptor</button>
			</div>
		</div>
	</div>
</div>
<!-- end Modal subir archivos paso 2  -->



<!-- Modal codigo postal riesgo -->
<div class="modal" id="modalSuscripCPRiesgo" tabindex="-1" role="dialog"
	aria-labelledby="modalSuscripCPRiesgoLabel" aria-hidden="true">
	<div class="modal-dialog modal-lg modal-dialog-centered"
		role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="modalSuscripCPRiesgoLabel">Restricción
					para Códigos Postales</h5>
				<button type="button" class="close" data-dismiss="modal"
					aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<!--Body-->
			<div class="modal-body">

				<div class="row">
					<div class="col-12">
						<span id="suscripCpRiesgo"></span>

					</div>
				</div>
			</div>

			<!--Footer-->
			<div class="modal-footer justify-content-center">
				<div class="row">
					<div class="col-md-6">
						<button class="btn btn-pink waves-effect waves-light"
							data-dismiss="modal" id="btncpsusc">Entendido</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- END  Modal codigo postal riesgo -->



<!-- Modal cotizacion expirada -->
<div class="modal" id="modalCotizacionExpirada" tabindex="-1"
	role="dialog" aria-labelledby="modalCotizacionExpiradaLabel"
	aria-hidden="true">
	<div class="modal-dialog modal-lg modal-dialog-centered"
		role="document">
		<div class="modal-content">
			<div class="modal-header orange darken-1 white-text">
				<h5 class="modal-title" id="modalCotizacionExpiradaLabel">
					<i class="fas fa-exclamation-triangle mr-2"></i>
					Cotización expirada
				</h5>
			</div>
			<!--Body-->
			<div class="modal-body">

				<div class="row">
					<div class="col-12">
						<span id="cotizacionExpiradaFechTxt">
							${infocotizacionExpiro}</span> <br>
					</div>
				</div>
			</div>

			<!--Footer-->
			<div class="modal-footer justify-content-center">
				<div class="row">
					<div class="col-md-6">
						<button class="btn btn-pink waves-effect waves-light"
							id="btncotExpiroSi">Entendido</button>
					</div>

				</div>
			</div>
		</div>
	</div>
</div>
<!-- END Modal cotizacion expirada -->


<!-- Modal Rechazar propuesta -->
<div class="modal" id="modalRechazarProp" tabindex="-1" role="dialog"
	aria-labelledby="modalRechazarPropLabel" aria-hidden="true">
	<div class="modal-dialog modal-lg modal-dialog-centered"
		role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="modalRechazarPropLabel">Rechazar
					propuesta de negocios con folio</h5>
				<button type="button" class="close" data-dismiss="modal"
					aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<!--Body-->
			<div class="modal-body">

				<div class="row">
					<div class="col-md-12" style="text-align: center;">
						<span id="textRechazo"> Lamentamos que nuestra propuesta de
							negocio no haya cumplido con las expectativas del asegurado,
							agradecemos su retroalimentación para mejorar. </span>
					</div>

					<div class="col-md-12">
						<div class="md-form form-group">
							<select name="selectMotRechazo" id="selectMotRechazo "
								class="mdb-select form-control-sel">
								<option value="-1" selected><liferay-ui:message
										key="HabitacionPortlet.selectOpDefoult" /></option>
								<c:forEach items="${motivoRechazo}" var="option">
									<option value="${option.idCatalogoDetalle}">${option.valor}</option>
								</c:forEach>
							</select> <label for="selectMotRechazo"> Motivo de rechazo </label>
						</div>
					</div>
					<div class="col-12">
						<div class="md-form">
							<textarea id="comentariosRechazarProp"
								name="comentariosRechazarProp" class="md-textarea form-control"
								rows="3" maxlength="1000" style="text-transform: uppercase;"></textarea>
							<label for="comentariosDosSuscrip"> Comentarios
								adicionales. </label>
						</div>
					</div>
				</div>
			</div>

			<!--Footer-->
			<div class="modal-footer justify-content-center">
				<div class="row">
					<div class="col-md-6">
						<button class="btn btn-blue waves-effect waves-light"
							data-dismiss="modal">Cancelar</button>
					</div>
					<div class="col-md-6">
						<button class="btn btn-pink waves-effect waves-light"
							id="btnEnvRecha">Enviar</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- END  Modal Rechazar propuesta -->



<!-- Modal subir archivos paso 2  -->
<div class="modal" id="fileModalP4" tabindex="-1" role="dialog"
	aria-labelledby="fileModalP4Label" aria-hidden="true">
	<div class="modal-dialog modal-lg" role="document">
		<div class="modal-content">
			<div class="fileErrorPopup"></div>
			<div class="modal-header green">
				<h5 class="modal-title text-white" id="ffileModalP4Label">Información
					adicional</h5>
			</div>
			<div class="modal-body">

				<div class="row">
					<div class="col-12">
						<span>Archivos permitidos, PDF, Excel, Word.</span>
						<div class="col-md-12 text-center text-danger">
							<span id="totDocART492"></span>
						</div>

						<div id="conjuntoFile" class="md-form row" style="overflow-y: auto; height: 365px;">
							<div id="divFile" class="col-md-6 file-field" hidden>
								<p id="titArchivo" class="text-sm-center mt-5 mb-0"
									style="min-height: 45px"></p>
								<div id="divBtnCargar"
									class="btn btn-blue btn-rounded btn-sm float-left col-md-12">
									<span id="txtbtn"> <i class="fas fa-upload mr-2"
										aria-hidden="true"></i>Subir archivo <i id="iconRequerido"
										class="fas fa-file-medical ml-2" aria-hidden="true" hidden></i></span>
									<input class="docAgenSusc" id="docAgenSusc" type="file"
										data-file_types="pdf|doc|docx|xls|xlsx" iddoc="" prefijo=""
										obligatorio="" idCatalogoDetalle="">
								</div>
								<button id="btnVerExis" onclick="getDocEmiExis(this)" iddoc=""
									idCatalogoDetalle=""
									class="btn btn-pink btn-rounded btn-sm col-md-5" hidden>Ver
									existente</button>
								<input id="infDocSuc" class="form-control infDocSuc" type="text"
									placeholder="Archivos" disabled>
							</div>
							<div id="existeArch"></div>
						</div>

					</div>
				</div>
				<div class="row">
					<div class="col-12">
						<div class="md-form">
							<textarea id="comentariosDocArt349" name="comentariosDocArt349"
								class="md-textarea form-control" rows="3" maxlength="1000"
								style="text-transform: uppercase;"></textarea>
							<label for="comentariosDosSuscrip"> Comentarios
								adicionales. </label>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<div class="col-md-12">
					<div class="row">
						<div class="col-md-6">
							<button class="btn btn-blue waves-effect waves-light"
								id="btnVerificarCotiza">Verificar Cotización</button>
						</div>
						<div class="col-md-6">
							<button class="btn btn-pink waves-effect waves-light float-right"
								id="btnDocArt492">Enviar documentos</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- end Modal subir archivos paso 2  -->


<!-- Modal Poliza Generada -->
<div class="modal" id="modalGenerarPoliza" tabindex="-1" role="dialog" aria-labelledby="cerrarPolizaLabel"
	aria-hidden="true">
	<div class="modal-dialog modal-lg modal-dialog-centered anchoModal" role="document">
		<div class="modal-content">
			<div class="modal-header green">
				<h5 class="modal-title text-white" id="cerrarPolizaLabel">
					<c:choose>
						<c:when test = "${ModoCot == 1}">						
							<liferay-ui:message key="Paso4Portlet.modalPolizaTitulo" />
						</c:when>
						<c:when test = "${ModoCot == 2}">						
							El endoso se ha emitido con éxito
						</c:when>
						<c:when test = "${ModoCot == 3}">						
							Póliza renovada exitosamente
						</c:when>
					</c:choose>
				</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<!--Body -->
			<div class="modal-body">

				<div class="row">
					<div class="col-12">
						<table class="table altoTbPoliza tablaPoliza">
							<tbody>
								<tr>
									<td>
										<b><liferay-ui:message key="Paso4Portlet.modalPolizaNumeroPoliza" /></b> <span
											id="txtModalPolizaNumeroPoliza"> </span>
									</td>
									<td>
										<b><liferay-ui:message key="Paso4Portlet.modalPolizaCertificado" /></b> <span
											id="txtModalPolizaCertificado"> </span>
									</td>
								</tr>
								<tr>
									<td colspan="2">
										<b><liferay-ui:message key="Paso4Portlet.modalPolizaAsegurado" /></b> <span id="txtModalPolizaAsegurado">
										</span>
									</td>
								</tr>
								<tr>
									<td>
										<b><liferay-ui:message key="Paso4Portlet.modalPolizaVigencia" /></b> <span id="txtModalPolizaVigenciaDe">
										</span> <b> al </b> <span id="txtModalPolizaVigenciaAl"> </span>
									</td>
									<td>
										<b><liferay-ui:message key="Paso4Portlet.modalPolizaTotalUbicaciones" /></b> <span
											id="txtModalPolizaTotalUbicaciones"> </span>
									</td>
								</tr>
								<tr>
									<td>
										<b><liferay-ui:message key="Paso4Portlet.modalPolizaMoneda" /></b> <span id="txtModalPolizaMoneda">
										</span>
									</td>
									<td>
										<b><liferay-ui:message key="Paso4Portlet.modalPolizaFormaPago" /></b> <span id="txtModalPolizaFormaPago">
										</span>
									</td>
								</tr>
							</tbody>
						</table>
						<table class="table altoTbPoliza table-borderless colPoliza20 tablaPoliza">
							<tbody>
								<tr>
									<td>
										<b><liferay-ui:message key="Paso4Portlet.modalPolizaPrimaNeta" /></b>
									</td>
									<td class="moneda celdaPoliza">$</td>
									<td class="colPoliza10">
										<span id="txtModalPolizaPrimaNeta"> </span>
									</td>
									<td></td>
									<td></td>
								</tr>
								<tr>
									<td>
										<b><liferay-ui:message key="Paso4Portlet.modalPolizaRecargoPago" /></b>
									</td>
									<td class="moneda celdaPoliza">$</td>
									<td class="colPoliza10">
										<span id="txtModalPolizaRecargoPago"> </span>
									</td>
									<td></td>
									<td></td>
								</tr>
								<tr>
									<td>
										<b><liferay-ui:message key="Paso4Portlet.modalPolizaGastosExpedicion" /></b>
									</td>
									<td class="moneda celdaPoliza">$</td>
									<td class="colPoliza10">
										<span id="txtModalPolizaGastosExpedicion"> </span>
									</td>
									<td></td>
									<td></td>
								</tr>
								<tr>
									<td>
										<b><liferay-ui:message key="Paso4Portlet.modalPolizaIva" /></b>
									</td>
									<td class="moneda celdaPoliza">$</td>
									<td class="colPoliza10">
										<span id="txtModalPolizaIva"> </span>
									</td>
									<td></td>
									<td></td>
								</tr>
								<tr>
									<td>
										<b><liferay-ui:message key="Paso4Portlet.modalPolizaTotal" /></b>
									</td>
									<td class="moneda celdaPoliza">$</td>
									<td class="colPoliza10">
										<span id="txtModalPolizaTotal"> </span>
									</td>
									<td></td>
									<td></td>
								</tr>
							</tbody>
						</table>
					</div>

				</div>
				<div class="row">
					<div class="col-7">
						<div class="row">
							<div class="col-12">
								<div class="md-form">
									<input type="email" name="modalPolizaEnviarCorreo" id="modalPolizaEnviarCorreo" class="form-control">
									<label for="modalPolizaEnviarCorreo">
										<liferay-ui:message key="Paso4Portlet.modalPolizaEnviarCorreo" />
									</label>
								</div>
							</div>
							<div class="col-12">
								<button class="btn btn-pink waves-effect waves-light float-right" id="btnAgregaCorreoPoliza" disabled>
									<liferay-ui:message key="Paso4Portlet.modalPolizaBtnAgregarCorreo" />
								</button>
							</div>
							<div class="col-12 table-wrapper-scroll-y">
								<table class="altoTbArchivos table table-striped" id="tablaArchivosPoliza" style="width: 100%;">
									<thead>
										<tr>
											<th scope="col" class="th-sm">
												<div class="form-check">
													<input type="checkbox" class="form-check-input selectCheckImput" id="seleccionarTodosArchivos" checked>
													<label class="form-check-label" for="seleccionarTodosArchivos">
														<liferay-ui:message key="Paso4Portlet.modalPolizaChekTodos" />
													</label>
												</div>
											</th>
											<th scope="col" class="th-sm">
												<liferay-ui:message key="Paso4Portlet.modalPolizaArchivoTit" />
											</th>
											<th scope="col" class="th-sm">
												<liferay-ui:message key="Paso4Portlet.modalPolizaTipoTit" />
											</th>
										</tr>
									</thead>
									<tbody class="bodyArchivos">

									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div class="col-5">
						<div class="alert alert-warning msjActivarBtnEnviar" role="alert" hidden="true">
							<liferay-ui:message key="Paso4Portlet.modalPolizaMsjEnviar" />
						</div>
						<ul id="listaCorreos" class="listaCorreos scrollbarLiMod scrollbarLiMod-primary">
						</ul>
					</div>
				</div>
				<div class="row">
				<input type="hidden" id="txtModalPolizaAgente">
					<div class="col-6">
						<button class="btn btn-pink waves-effect waves-light " id="btnDescargarArchivos">
							<liferay-ui:message key="Paso4Portlet.modalPolizaBtnDescargarArchivos" />
						</button>
						<button class="btn btn-pink waves-effect waves-light" id="polizaBtnEnviar">
							<liferay-ui:message key="Paso4Portlet.modalPolizaBtnEnviar" />
						</button>
					</div>
					<div class="col-6">
						<button class="btn btn-blue waves-effect waves-light float-right" id="polizaBtnAceptar" data-dismiss="modal">
							<liferay-ui:message key="Paso4Portlet.modalPolizaBtnAceptar" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- END Modal Poliza Generada -->

<!-- Modal rfc existente -->
<div class="modal" id="modalRFCExistente" tabindex="-1" role="dialog" aria-labelledby="RFCExistenteLabel"
	aria-hidden="true">
	<div class="modal-dialog modal-lg modal-dialog-centered" role="document">
		<div class="modal-content">
			<div class="modal-header orange">
				<h5 class="modal-title" >
					<liferay-ui:message key="Paso4Portlet.modalRFCRegistrado" />
				</h5>
				
			</div>
			<!--Body-->
			<div class="modal-body">

				<div class="row">
					<div class="col-12">
						<h4 >
							<liferay-ui:message key="Paso4Portlet.modalRFCExiste" />
						</h4>
						<br>
							<br>
						<h3 class="font-weight-bold">
							<span id="mdlRfcP4Inf"></span>
						</h3>
						<br>
							<br>
						<h4>
							<liferay-ui:message key="Paso4Portlet.modalRFCDeseaContinuar" />
							<br>
							<liferay-ui:message key="Paso4Portlet.modalRFCPresione" />
						</h4>
					</div>
				</div>
			</div>

			<!--Footer-->
			<div class="modal-footer justify-content-center">
				<div class="row">
					<div class="col-md-6">
						<button class="btn btn-pink waves-effect waves-light" id="mdlRfcBtnSi" codigo=""> <liferay-ui:message key="Paso4Portlet.modalRFCSi"/> </button>
					</div>
					<div class="col-md-6">
						<button class="btn btn-blue waves-effect waves-light" id="mdlRfcBtnNo"> <liferay-ui:message key="Paso4Portlet.modalRFCNo"/> </button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- END Modal rfc existente -->

<!-- Modal RFC error -->
<div class="modal" id="modalRFCEXisttClientt" tabindex="-1" role="dialog" aria-labelledby="modalRFCEXisttClienttLabel"
	aria-hidden="true">
	<div class="modal-dialog modal-lg modal-dialog-centered" role="document">
		<div class="modal-content">
			<div class="modal-header orange">
				<h5 class="modal-title" id="modalRFCEXisttClienttLabel"> <liferay-ui:message key="Paso4Portlet.modalRFCErrorTitulo"/> </h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<!--Body-->
			<div class="modal-body">

				<div class="row">
					<div class="col-md-12" style="text-align: center;">
						<span id="textRechazo"> <liferay-ui:message key="Paso4Portlet.modalRFCErrorDescripcion"/> </span>
					</div>
				</div>
			</div>

			<!--Footer-->
			<div class="modal-footer justify-content-center">
				<div class="row">
					<div class="col-md-6">
						<button class="btn btn-blue waves-effect waves-light" data-dismiss="modal"> <liferay-ui:message key="Paso4Portlet.modalRFCErrorBtnAcptar"/> </button>
					</div>
					
				</div>
			</div>
		</div>
	</div>
</div>
<!-- END   Modal RFC error -->

<!-- Modal quien es quien -->
<div class="modal" id="modalQesQ" tabindex="-1" role="dialog" aria-labelledby="modalmodalQesQLabel"
	aria-hidden="true">
	<div class="modal-dialog modal-lg modal-dialog-centered" role="document">
		<div class="modal-content">
			<div class="modal-header orange">
				<h5 class="modal-title" id="modalmodalQesQLabel"> 
				Información sobre el cliente</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<!--Body-->
			<div class="modal-body">

				<div class="row">
					<div class="col-md-12" style="text-align: center;">
						<span id="textRechazo"> 
							Se debe completar la información del cliente. Por favor integrar los datos y documentos faltantes.
						 </span>
					</div>
				</div>
			</div>

			<!--Footer-->
			<div class="modal-footer justify-content-center">
				<div class="row">
					<div class="col-md-6">
						<button class="btn btn-blue waves-effect waves-light" data-dismiss="modal"> Entendido </button>
					</div>
					
				</div>
			</div>
		</div>
	</div>
</div>
<!-- END  quien es quien -->



<!-- post -->
<input type="hidden" id="txtSendMailAgenteSuscriptor"
	value="${sendMailAgenteSuscriptorUrl}">
<input type="hidden" id="txtCotizacionExpiro" name="txtCotizacionExpiro"
	class="form-control" value="${cotizacionExpiro}">
<input type="hidden" id="txtbloqueaCamposSuscripcion"
	name="txtbloqueaCamposSuscripcion" class="form-control"
	value="${bloqueaCamposSuscripcion}">
<input type="hidden" id="txtbotonesCaratula" name="txtbotonesCaratula"
	class="form-control" value="${botonesCaratula}">

<input type="hidden" id="txtErrorAntesGP2" name="txtErrorAntesGP2"
	class="form-control" value="0">
<input type="hidden" id="txtEmailAgente" name="txtEmailAgente"
	class="form-control">

<input type="hidden" id="txtAuxEnvDoc" name="txtAuxEnvDoc"
	class="form-control">
<input type="hidden" id="txtYaAcepto" name="txtYaAcepto"
	class="form-control">

<input type="hidden" id="txtLeg492" name="txtLeg492"
	class="form-control" value="${Leg492}">


<input type="hidden" id="txtgetListadocumentosVoBo492"
	name="txtgetListadocumentosVoBo492" class="form-control"
	value="${getListadocumentosVoBo492Url}">
<input type="hidden" id="txtSendDocumentosArt492Url"
	name="txtSendDocumentosArt492Url" class="form-control"
	value="${sendDocumentosArt492Url}">
<input type="hidden" id="txtRechazaCotizacionURL"
	name="txtRechazaCotizacionURL" class="form-control"
	value="${txtRechazaCotizacionURL}">

<input type="hidden" id="txtBtnEmiteFactu" name="txtBtnEmiteFactu"
	class="form-control" value="null">

<!-- post -->
<input type="hidden" id="txtSendMailAgenteSuscriptor"
	value="${sendMailAgenteSuscriptorUrl}">
<input type="hidden" id="txtSendMailSuscriptorAgente"
	value="${sendMailSuscriptorAgenteUrl}">