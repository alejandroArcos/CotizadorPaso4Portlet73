<%@ include file="./init.jsp"%>
<%@ include file="./suscripcion.jsp"%>


<portlet:resourceURL id="/searchPerson" var="searchPersonURL" />
<portlet:resourceURL id="/paso4/getListaDocumentosVoBo492" var="getListaDocumentosVoBo492Url" />
<portlet:resourceURL id="/solicitarEmision" var="getEmisionTot" />
<portlet:resourceURL id="/getDireccion" var="getDireccionEmision" />
<portlet:resourceURL id="/getDomicilioPersonasUrl" var="getDomicilioPersonasUrl" />
<portlet:resourceURL id="/getDocsEmision" var="getDocsEmision" />
<portlet:resourceURL id="/cotizadores/paso4/redirigePasoX" var="redirigeURL" />
<portlet:resourceURL id="/paso4/CambiarCliente" var="CambiarClienteURL" />
<portlet:resourceURL id="/getDocumentosExistentes" var="getDocumentosExistentesUrl" />

<link rel="stylesheet" href="<%=request.getContextPath()%>/css/main.css?v=${versionC}">

<section class="site-wrapper">

	<section id="landing-agentes" class="upper-case-all">
	
		<div class="section-heading">
			<div class="container-fluid">
				<h4 class="title text-left">
<%-- 					<liferay-ui:message key="Paso4Portlet.cotPaqFamiliar" /> --%>
					${tituloCotizador}
				</h4>
			</div>
		</div>
		
		<div class="container-fluid">
			<div class="row">
				<div class="col-md-12">
					<ul class="stepper stepper-horizontal container-fluid">
						<li id="step1">
							<a href="javascript:void(0)">
								<span class="circle">1</span> <span class="label"><liferay-ui:message
										key="Paso4Portlet.datCotizacion" /></span>
							</a>
						</li>
						<li id="step2">
							<a href="javascript:void(0)">
								<span class="circle">2</span> <span class="label"><liferay-ui:message
										key="Paso4Portlet.datRiesgoModalidad" /></span>
							</a>
						</li>
						<li id="step3">
							<a href="javascript:void(0)">
								<span class="circle">3</span> <span class="label"><liferay-ui:message
										key="Paso4Portlet.genSlipSolEmision" /></span>
							</a>
						</li>
						<li id="step4" class="active">
							<a href="javascript:void(0)">
								<span class="circle active_2">4</span> <span class="label active_2"><liferay-ui:message key="Paso4Portlet.emision" /></span>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		
		<div style="position: relative;">
			<liferay-ui:error key="errorServicios" message="Paso4Portlet.errorServicios" />
			<liferay-ui:error key="errorInfo" message="Paso4Portlet.errorInfo" />
			<liferay-ui:error key="errorDocumentos" message="Paso4Portlet.errorDocumentos" />
		</div>

		<div class="container-fluid padding70 " id="paso4">
			<div class="row divFolioP4">
				<div class="col-md-10">
					<span id="titPoliza" class="ml-5 font-weight-bold"></span>
				</div>
				<div class="col-md-2" style="text-align: right;">
					<div class="md-form form-group">
						<input id="idFolio4" type="text" name="idFolio3" class="form-control" value="${infCotizacion.folio} - ${infCotizacion.version}" disabled>
						<label for="idFolio4"> Folio: </label>
					</div>
				</div>
			</div>
			<form id="frmPaso4" name="frmPaso4" class="frmPaso4">

				<!-- JSP PASO 4 -->
				<div class="card">
					<div class="card-body">
				
						<!-- Title -->
						<h4 class="card-title">Informaci&oacute;n B&aacute;sica</h4>
						<hr>
						<c:set var="hideViculoPersona" value="${response.viculoPersona == 117 ? 'hidden' : ''}"/>
						<div class="row" ${hideViculoPersona}>
							<div class="col-md-6">
								<div class="md-form form-group">
									<select name="mpldmImportarDomicilioUbicacion" id="mpldmImportarDomicilioUbicacion" class="mdb-select form-control-sel">
										<option value="-1" selected><liferay-ui:message key="Paso4Portlet.selectOpDefoult" /></option>
										<c:forEach items="${response.listaUbicaciones}" var="option">
											<option value="${option.idUbicacion}">${option.direccion}</option>
										</c:forEach>
									</select>
									<label for="mpldmImportarDomicilioUbicacion">
										<liferay-ui:message key="Paso4Portlet.mpldmImportarDomicilioUbicacion" />
									</label>
								</div>
							</div>
						</div>
						<div class="infoMinRequerida">
							<div class="row">
								<div class="col-md-3">
									<div class="md-form">
										<c:set var="bqOriRfc" value="${response.datosCliente.rfc == '' ? '' : 'bqOri'}"/>
										<input type="text" name="mpldmRFC" id="mpldmRFC" class="form-control infReq ${bqOriRfc}" maxlength="13" value="${response.datosCliente.rfc}">
										<label for="mpldmRFC">
											<liferay-ui:message key="Paso4Portlet.mpldmRFC" />
										</label>
									</div>
								</div>
								<div id="divNombre">
									<div class="md-form">
										<c:set var="bqOriNombre" value="${response.datosCliente.nombre == '' ? '' : 'bqOri'}"/>
										<input type="text" name="mpldmNombre" id="mpldmNombre" class="form-control infReq ${bqOriNombre}" value="${response.datosCliente.nombre}">
										<label for="mpldmNombre">
											<liferay-ui:message key="Paso4Portlet.mpldmNombre" />
										</label>
									</div>
								</div>
								<div class="divFisica col-md-6">
									<div class="col-md-6">
										<div class="md-form">
											<c:set var="bqOriApPater" value="${response.datosCliente.appPaterno == '' ? '' : 'bqOri'}"/>
											<input type="text" name="mpldmApPater" id="mpldmApPater" class="form-control infReq ${bqOriApPater}" value="${response.datosCliente.appPaterno}">
											<label for="mpldmApPater">
												<liferay-ui:message key="Paso4Portlet.mpldmApPater" />
											</label>
										</div>
									</div>
									<div class="col-md-6">
										<div class="md-form">
											<c:set var="infReq" value="${response.datosFisica.extranjero == 1 ? '' : 'infReq'}"/>
											<c:set var="bqOriApMat" value="${response.datosCliente.appMaterno == '' ? '' : 'bqOri'}"/>
											<input type="text" name="mpldmApMat" id="mpldmApMat" class="form-control ${infReq} ${bqOriApMat}" value="${response.datosCliente.appMaterno}">
											<label for="mpldmApMat">
												<liferay-ui:message key="Paso4Portlet.mpldmApMat" />
											</label>
										</div>
									</div>
								</div>
								<div class="divMoral col-md-3">
									<div class="col-md-12">
										<div class="md-form form-group">
											<select name="mpldmDenominacion" id="mpldmDenominacion" class="mdb-select form-control-sel colorful-select dropdown-primary infReqS"
												searchable='<liferay-ui:message key="Paso4Portlet.buscar" />' ${disableDenom}>
												<option value="-1" selected><liferay-ui:message key="Paso4Portlet.selectOpDefoult" /></option>
												<c:forEach items="${denomList}" var="option">
													<c:set var="valid" value="${response.datosCliente.idDenominacion == option.idCatalogoDetalle ? 'selected' : ''}"/>
													<option value="${option.idCatalogoDetalle}" ${valid}>${option.valor}</option>
												</c:forEach>
											</select>
											<label for="mpldmDenominacion">
												<liferay-ui:message key="Paso4Portlet.tipoSociedadPaso4" />
											</label>
										</div>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-3">
									<div class="md-form">
										<select name="mpldmRegimen" id="mpldmRegimen" class="mdb-select form-control-sel colorful-select dropdown-primary infReqS"
											searchable='<liferay-ui:message key="Paso4Portlet.buscar" />'>
											<option value="-1" selected><liferay-ui:message key="Paso4Portlet.selectOpDefoult" /></option>
											<c:forEach items="${regimenList}" var="option">
												<c:set var="valid" value="${response.datosCliente.regimen == option.idCatalogoDetalle ? 'selected' : ''}"/>
												<option otro="${option.otro}" value="${option.idCatalogoDetalle}" ${valid}>${option.valor}</option>
											</c:forEach>
										</select>
										<label for="mpldmRegimen">
											<liferay-ui:message key="Paso4Portlet.regimenPaso4" />
										</label>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-3">
									<div class="md-form">
										<input placeholder="Fecha" type="date" id="mpldFecha" name="mpldFecha" class="form-control datepicker2 infReq" value="${response.datosFisica.fechaNacimineto}">
										<label class="divFisica" for="mpldFecha">
											<liferay-ui:message key="Paso4Portlet.mpldmFechaNacimiento" />
										</label>
										<label class="divMoral" for="mpldFecha">
											<liferay-ui:message key="Paso4Portlet.mpldmFechaConstitucion" />
										</label>
									</div>
								</div>
								<div class="col-md-3">
									<div class="md-form">
										<c:set var="bqOriCP" value="${response.cpData.cp == '' ? '' : 'bqOri'}"/>
										<input type="text" name="mpldmCodigoPostal" id="mpldmCodigoPostal" class="form-control cpValid2 infReq ${bqOriCP}" maxlength="5" value="${response.cpData.cp}">
										<label for="mpldmCodigoPostal">
											<liferay-ui:message key="Paso4Portlet.lblCodPosP2" />
										</label>
									</div>
								</div>
								<div class="col-md-3">
									<div class="md-form">
										<c:set var="bqOriCalle" value="${response.calle == '' ? '' : 'bqOri'}"/>
										<input type="text" name="mpldmCalle" id="mpldmCalle" class="form-control infReq ${bqOriCalle}" value="${response.calle}">
										<label for="mpldmCalle">
											<liferay-ui:message key="Paso4Portlet.lblCalleP2" />
										</label>
									</div>
								</div>
								<div class="col-md-3">
									<div class="md-form">
										<c:set var="bqOriNumInt" value="${response.numero == '' ? '' : 'bqOri'}"/>
										<input type="text" name="mpldmNumeroInterior" id="mpldmNumeroInterior" class="form-control infReq ${bqOriNumInt}" value="${response.numero}">
										<label for="mpldmNumeroInterior">
											<liferay-ui:message key="Paso4Portlet.mpldmNumeroInterior" />
										</label>
									</div>
								</div>
							</div>
				
							<div class="row">
								<div class="col-md-3">
									<div class="md-form form-group grupSelectColonia">
										<select name="mpldmColonia" id="mpldmColonia" class="mdb-select form-control-sel  colorful-select dropdown-primary infReqS" searchable='<liferay-ui:message key="Paso4Portlet.buscar" />' ${disableColonia}>
											<option value="-1" selected><liferay-ui:message key="Paso4Portlet.selectOpDefoult" /></option>
											<c:forEach items="${responseCp.listaColonia}" var="option">
												<c:set var="valid" value="${(0 == option.id) || (option.id == response.cpData.idCp) ? 'selected' : ''}" />
												<option codigo="${option.codigo}" value="${option.id}" ${valid}>${option.descripcion}</option>
											</c:forEach>
										</select>
										<label for="mpldmColonia">
											<liferay-ui:message key="Paso4Portlet.lblColoniaP2" />
										</label>
									</div>
								</div>
								<div class="col-md-3">
									<div class="md-form">
										<c:set var="bqOriMuni" value="${responseCp.listaMunicipio[0].descripcion == '' ? '' : 'bqOri'}"/>
										<input type="text" name="mpldmDelegacionMunicipio" id="mpldmDelegacionMunicipio" class="form-control infReq ${bqOriMuni}" value="${responseCp.listaMunicipio[0].descripcion}">
										<label for="mpldmDelegacionMunicipio">
											<liferay-ui:message key="Paso4Portlet.lblDelMuniP2"/>
										</label>
									</div>
								</div>
				
								<div class="col-md-3">
									<div class="md-form">
										<c:set var="bqOriEdo" value="${responseCp.listaEstado[0].descripcion == '' ? '' : 'bqOri'}"/>
										<input type="text" name="mpldmEstado" id="mpldmEstado" class="form-control infReq ${bqOriEdo}" value="${responseCp.listaEstado[0].descripcion}">
										<label for="mpldmEstado">
											<liferay-ui:message key="Paso4Portlet.lblEdoP2"/>
										</label>
									</div>
								</div>
				
								<div class="col-md-3">
									<div class="md-form">
										<c:set var="bqOriPais" value="${responseCp.listaPais[0].descripcion == '' ? '' : 'bqOri'}"/>
										<input type="text" name="mpldmPais" id="mpldmPais" class="form-control infReq ${bqOriPais}" value="${responseCp.listaPais[0].descripcion}">
										<label for="mpldmPais">
											<liferay-ui:message key="Paso4Portlet.mpldmPais"/>
										</label>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				
				<div class="card">
					<div class="card-body">
				
						<!-- Title -->
						<h4 class="card-title">Informaci&oacute;n Complementaria</h4>
						<hr>
						<div class="row">
							<div class="col">
								<div class="md-form form-group">
									<select name="mpldmPaisDeNacimiento" id="mpldmPaisDeNacimiento" class="mdb-select form-control-sel ${infReqComS}">
										<option value="-1" selected><liferay-ui:message key="Paso4Portlet.selectOpDefoult" /></option>
										
										<c:set var="auxExtra" value="${response.datosFisica.extranjero == 0 ? 'MEX' : ''}"/>
										<c:forEach items="${listaNacionalidad}" var="option">
											<c:set var="valid" value="${response.paisNaciminetoCodigo == option.idCatalogoDetalle ? 'selected' : ''}"/>
											
											<c:if test="${option.codigo == auxExtra}">
												<option codigo="${option.codigo}" value="${option.idCatalogoDetalle}" ${valid}>${option.valor}</option>
											</c:if>
											
										</c:forEach>
									
									</select>
									<label for="mpldmPaisDeNacimiento">
										<liferay-ui:message key="Paso4Portlet.paisNacimiento" />
									</label>
								</div>
							</div>
				
							<div class="col">
								<div class="md-form">
									<input type="text" name="mpldmNacionalidad" id="mpldmNacionalidad" class="form-control ${infReqCom}" maxlength="30" value="${response.nacionalidad}">
									<label for="mpldmNacionalidad">
										<liferay-ui:message key="Paso4Portlet.mpldmNacionalidad" />
									</label>
								</div>
							</div>
							<div class="divFisica">
								<div class="col">
									<div id="chkResideMex" class="md-form check-valid valCheck">
										<label for="chkResideMex" class="active">
											<liferay-ui:message key="Paso4Portlet.mpldmResideMexico" />
										</label>
										<div class="form-check form-check-inline">
											<input type="checkbox" class="form-check-input" id="chekRMSi" value="1">
											<label class="form-check-label" for="chekRMSi">Si</label>
										</div>
				
										<!-- Material inline 2 -->
										<div class="form-check form-check-inline">
											<input type="checkbox" class="form-check-input" id="chekRMNo" value="2">
											<label class="form-check-label" for="chekRMNo">No</label>
										</div>
									</div>
								</div>
							</div>
							<div class="col">
								<div class="md-form">
									<input type="tel" name="mpldmTelCel" id="mpldmTelCel" class="form-control ${infReqCom}" maxlength="30" value="${response.datosMoral.telefono}">
									<label for="mpldmTelCel">
										<liferay-ui:message key="Paso4Portlet.mpldmTelCel" />
									</label>
								</div>
							</div>
						</div>
				
						<div class="row">
				
							<div class="col-md-6">
								<div class="md-form">
									<input type="email" name="mpldmEmail" id="mpldmEmail" class="form-control emailVal ${infReqCom}" value="${response.datosMoral.email}">
									<label for="mpldmEmail">
										<liferay-ui:message key="Paso4Portlet.mpldmEmail" />
									</label>
								</div>
							</div>
							<div class="col-md-6">
								<div class="md-form">
									<input type="text" name="mpldmNoSerieCertificadoFea" id="mpldmNoSerieCertificadoFea" class="form-control" maxlength="30" value="${response.datosMoral.numFEA}">
									<label for="mpldmNoSerieCertificadoFea">
										<liferay-ui:message key="Paso4Portlet.mpldmNoSerieCertificadoFea" />
									</label>
								</div>
							</div>
						</div>
				
						<div class="row">
							<div class="col-md-12">
								<div class="divFisica">
									<div class="col-md-4">
										<div class="md-form">
											<input type="text" name="mpldmTipoIdentificacion" id="mpldmTipoIdentificacion" class="form-control ${infReqCom}" maxlength="30">
											<label for="mpldmTipoIdentificacion">
												<liferay-ui:message key="Paso4Portlet.mpldmTipoIdentificacion" />
											</label>
										</div>
									</div>
									<div class="col-md-4">
										<div class="md-form">
											<input type="text" name="mpldmNumIdentificacion" id="mpldmNumIdentificacion" class="form-control ${infReqCom}" maxlength="50">
											<label for="mpldmNumIdentificacion">
												<liferay-ui:message key="Paso4Portlet.mpldmNumIdentificacion" />
											</label>
										</div>
									</div>
									<div class="col-md-4">
										<div class="md-form">
											<input type="text" name="mpldmCURP" id="mpldmCURP" class="form-control valCurp" maxlength="18" style="text-transform: uppercase">
											<label for="mpldmCURP">
												<liferay-ui:message key="Paso4Portlet.mpldmCURP" />
											</label>
										</div>
									</div>
								</div>
								<div class="divMoral">
									<div class="col-md-3">
										<div class="md-form form-group">
											<select name="mpldmSelOPG" id="mpldmSelOPG" class="mdb-select form-control-sel ${infReqComS}">
												<option value="-1" selected><liferay-ui:message key="Paso4Portlet.selectOpDefoult" /></option>
												<c:forEach items="${listaGiroVulne}" var="option">
													<c:set var="valid" value="${response.idGiroMercantil == option.idCatalogoDetalle ? 'selected' : ''}"/>
													<option codigo="${option.codigo}" value="${option.idCatalogoDetalle}" ${valid}>${option.valor}</option>
												</c:forEach>
											</select>
											<label for="mpldmSelOPG">
												<liferay-ui:message key="Paso4Portlet.mpldmInfoAdicionalCliente1_1" />
											</label>
										</div>
									</div>
									<div class="col-md-3">
										<div class="md-form">
											<input type="text" name="mpldmOtraOpOPG" id="mpldmOtraOpOPG" class="form-control" disabled>
											<label for="mpldmOtraOpOPG">
												<liferay-ui:message key="Paso4Portlet.mpldmInfoAdicionalCliente1" />
											</label>
										</div>
									</div>
									<div class="col-md-3">
										<div class="md-form">
											<input type="text" name="mpldmFolMerca" id="mpldmFolMerca" class="form-control" value="${response.datosMoral.numMercantil}">
											<label for="mpldmFolMerca">
												<liferay-ui:message key="Paso4Portlet.mpldmFolioMercantil" />
											</label>
										</div>
									</div>
									<div class="col-md-3">
										<div id="chkFideico" class="md-form check-valid valCheck">
											<label for="chkFideico" class="active"> <liferay-ui:message key="Paso4Portlet.mpldmFideicomiso" /> </label>
											<div class="form-check form-check-inline">
												<c:set var="check" value="${response.datosMoral.esFideicomiso == 1 ? 'checked' : ''}"/>
												<input type="checkbox" class="form-check-input" id="chekFideSi" value="1" ${check}>
												<label class="form-check-label" for="chekFideSi">Si</label>
											</div>
				
											<!-- Material inline 2 -->
											<div class="form-check form-check-inline">
												<c:set var="check" value="${response.datosMoral.esFideicomiso == 2 ? 'checked' : ''}"/>
												<input type="checkbox" class="form-check-input" id="chekFideNo" value="2" ${check}>
												<label class="form-check-label" for="chekFideNo">No</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<div class="card">
					<div class="card-body">
				
						<!-- Title -->
						<h4 class="card-title">
							<liferay-ui:message key="Paso4Portlet.mpldmInfoAdicionalCliente" />
						</h4>
						<hr>
				
				
						<div class="row">
							<div class="col-md-12">
								<div class="divFisica">
									<div class="col-md-6">
										<div class="md-form form-group">
											<select name="mpldmSelOPG" id="mpldmSelOPG2" class="mdb-select form-control-sel ">
												<option value="-1" selected><liferay-ui:message key="Paso4Portlet.selectOpDefoult" /></option>
												<c:forEach items="${listaGiroVulne}" var="option">
													<option codigo="${option.codigo}" value="${option.idCatalogoDetalle}">${option.valor}</option>
												</c:forEach>
											</select>
											<label for="mpldmSelOPG2">
												<liferay-ui:message key="Paso4Portlet.mpldmInfoAdicionalCliente1" />
											</label>
										</div>
									</div>
									<div class="col-md-6">
										<div class="md-form">
											<input type="text" name="mpldmOtraOpOPG" id="mpldmOtraOpOPG2" class="form-control" disabled>
											<label for="mpldmOtraOpOPG2">
												<liferay-ui:message key="Paso4Portlet.mpldmInfoAdicionalCliente1" />
											</label>
										</div>
									</div>
								</div>
								<div class="divMoral">
									<div class="col-md-4">
										<div class="md-form">
											<input type="text" name="mpldmNomApoLeg" id="mpldmNomApoLeg" class="form-control ${infReqCom}" value="${response.datosMoral.nombreApoderado}">
											<label for="mpldmNomApoLeg"> Nombre </label>
										</div>
									</div>
									<div class="col-md-4">
										<div class="md-form">
											<input type="text" name="mpldmNomApoLeg" id="mpldmApApoLeg" class="form-control ${infReqCom}" value="${response.datosMoral.APApoderado}">
											<label for="mpldmNomApoLeg"> Apellido paterno </label>
										</div>
									</div>
									<div class="col-md-4">
										<div class="md-form">
											<input type="text" name="mpldmNomApoLeg" id="mpldmAmApoLeg" class="form-control ${infReqCom}" value="${response.datosMoral.AMApoderado}">
											<label for="mpldmNomApoLeg"> Apellido materno </label>
										</div>
									</div>
								</div>
							</div>
						</div>
				
						<br />
				
						<div id="divInformacionAdicionalCliente">
				
							<div class="row">
								<div class="col-md-4">
									<liferay-ui:message key="Paso4Portlet.mpldmInfoAdicionalCliente2" />
								</div>
								<div id="chekPEP" class="col-md-4 check-valid valCheck">
									<div class="form-check form-check-inline">
										<c:set var="check" value="${response.p_datosPep.pep == 1 ? 'checked' : ''}"/>
										<input type="checkbox" class="form-check-input" id="chkPepSi" value="1" ${check}>
										<label class="form-check-label" for="chkPepSi">Si</label>
									</div>
				
									<!-- Material inline 2 -->
									<div class="form-check form-check-inline">
										<c:set var="check" value="${response.p_datosPep.pep == 2 ? 'checked' : ''}"/>
										<input type="checkbox" class="form-check-input" id="chkPepNo" value="2" ${check}>
										<label class="form-check-label" for="chkPepNo">No</label>
									</div>
								</div>
								<div class="col-md-4">
									<div class="md-form form-group">
										<select name="mpldmCargoPuesto" id="mpldmCargoPuesto" class="mdb-select form-control-sel">
											<option value="-1"><liferay-ui:message key="Paso4Portlet.selectOpDefoult" /></option>
											<c:forEach items="${listCargo}" var="option">
												<c:set var="valid" value="${response.p_datosPep.puesto == option.idCatalogoDetalle ? 'selected' : ''}"/>
												<option value="${option.idCatalogoDetalle}" ${valid}>${option.valor}</option>
											</c:forEach>
										</select>
										<label for="mpldmCargoPuesto">
											<liferay-ui:message key="Paso4Portlet.mpldmCargoPuesto" />
										</label>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-12">
									<div class="md-form">
										<input type="text" name="mpldmInstentidad" id="mpldmInstentidad" class="form-control">
										<label for="mpldmInstentidad">
											<liferay-ui:message key="Paso4Portlet.mpldmInstentidad" />
										</label>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- JSP PASO 4 FIN -->
				
				<br />
				<div id="divInfoSiempreVisible">
					<div class="row infoGeneralModal text-justify">
						<div class="col-md-12 textoDeclaracion">${response.textoDeclaracion}</div>
					</div>
					<div class="row infoGeneralModal">
						<div class="col-md-12">
							<div class="form-inline divRdoTpClient">
								<div class="form-check">
									<input class="form-check-input form-control" name="chkBxLeido" type="checkbox" id="chkBxLeido">
									<label class="form-check-label" for="chkBxLeido">
										<liferay-ui:message key="Paso4Portlet.mpldmHeLeido" />
									</label>
								</div>
							</div>
						</div>
					</div>
					<div class="row infoGeneralModal textoPep text-justify">
						<div class="col-md-12"> ${response.textoPep}</div>
					</div>
				</div>
		
			</form>
			
			<div id="btnsEmision" hidden>
						<button class="btn btn-blue waves-effect waves-light" id="btnRegresarPaso3" >
							<liferay-ui:message key="Paso4Portlet.aReg" />
						</button>
						<button class="btn btn-pink waves-effect waves-light float-right" id="btnContEmision" >
							<liferay-ui:message key="Paso4Portlet.mpldmBtnEmitir" />
						</button>
					</div>
			<div id="btnsEmisionArt492" hidden>
				<button class="btn btn-blue waves-effect waves-light" id="btnRegresarRevision">
					<liferay-ui:message key="Paso4Portlet.mpldmBtnVerifica" />
				</button>
				<button class="btn btn-pink waves-effect waves-light float-right" id="btngetDocEmi492">
					<liferay-ui:message key="Paso4Portlet.mpldmBtnSolicitaVoBo" />
				</button>
			</div>
			
		</div>
		
	</section>

</section>

<a id='dwnldLnk' style="display: none;" />
<form id="divInfoAuxiliar" hidden="true">
	<input type="hidden" id="txtJSSearchPersonaUrl" value="${searchPersonURL}">
	<input type="hidden" id="tipoPersonaH" value="${response.datosCliente.tipoPer}">
	<input type="hidden" id="txtgetListaDocumentosVoBo492" value="${getListaDocumentosVoBo492Url}">
	<input type="hidden" id="txtJSGetEmisionTot" value="${getEmisionTot}">
	
	<input type="hidden" id="txtJSGetDireccionEmision" value="${getDireccionEmision}">
	<input type="hidden" id="txtJSGetDomicilioPersonasUrl" value="${getDomicilioPersonasUrl}">
	<input type="hidden" id="txtJSGetDocsEmision" value="${getDocsEmision}">
	<input type="hidden" id="txtEmailUser" value="${userMail}">
	<input id="txtIdPerfilUser" type="text" name="txtIdPerfil" class="form-control" hidden="true" value="${ idPerfilUser }">
</form>
<script src="<%=request.getContextPath()%>/js/util.js?v=${versionC}"></script>
<script src="<%=request.getContextPath()%>/js/i18n.js?v=${versionC}"></script>
<script src="<%=request.getContextPath()%>/js/objetos.js?v=${versionC}"></script>
<script src="<%=request.getContextPath()%>/js/suscripcion.js?v=${versionC}"></script>
<script src="<%=request.getContextPath()%>/js/Paso4.js?v=${versionC}"></script>

<script>
	var getDocumentosExistentesUrl = '${getDocumentosExistentesUrl}';
	var CambiarClienteURL = '${CambiarClienteURL}';
	var redirigeURL = '${redirigeURL}';
	quienEsQuienStr = ${responseQuienQuien};
	personasBloqueadasStr = ${responsePersonasBloqueadasCNSF};
	infCotiJson = ${infoCotJson};
	varAuxiliares.viculoPersona = ${response.viculoPersona};
	varAuxiliares.idPersona = ${response.datosCliente.idPersona};
	varAuxiliares.tipoPersona = ${response.datosCliente.tipoPer};
	varAuxiliares.codigo = "${response.datosCliente.codigo}";
	var lgVoBo = '${lgVoBo}';
	var listVo = "";
	var datosP1 = '${datosP1}';
	
</script>

<script src="<%=request.getContextPath()%>/js/main.js?v=${versionC}"></script>