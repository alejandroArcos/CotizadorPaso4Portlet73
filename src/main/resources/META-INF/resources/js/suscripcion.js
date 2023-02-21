$('#dc_subgiro').change(function() {
    if ($('#txtEsSuscriptor').val().trim() == '0') {
        if ($('option:selected', this).attr('suscripcion') == '1') {
            $('#modalGiroSubgiro').modal({
                show: true,
                backdrop: 'static',
                keyboard: false
            });
        } else {
            $('#txtAceptoGiro').val('0');
            $('#txtYaAcepto').val('');
        }
    }
});

$('#btnSuscripGiroSi').click(function() {
    $('#txtAceptoGiro').val('1');
    $('#modalGiroSubgiro').modal('hide');
});

$('#btnSuscripGiroNo').click(function() {
    $('#dc_subgiro option[value=-1]').prop('selected', true);
    selectDestroy($('#dc_subgiro'), false);
    $('#txtAceptoGiro').val('0');
    $('#modalGiroSubgiro').modal('hide');
    $('#txtYaAcepto').val('');
});

function validaSubgiroSuscriptor() {
    var esSuscriptor = $('#txtEsSuscriptor').val();
    var esGiroSuscriptor = $('#txtAceptoGiro').val();
    if (esSuscriptor == '0' && esGiroSuscriptor == '1') {
        $('.calc_fin table').hide();
        $('#paso2_next').hide();
        $('#btnsuscontinuar2').removeAttr('hidden');
    }
}

function bloqueaMontoSuscriptor(msj, continua) {
    $('#suscripMontoExedeTxt').text(msj);
    $('#modalSuscripMontoExede').modal({
        show: true,
        backdrop: 'static',
        keyboard: false
    });
    $('.calc_fin table').hide();
    $('#paso2_next').hide();
    $('#btnsuscontinuar2').hide();
    if (!continua) {
        $('#btnSuscripMontoSi').parent().hide();
        $('#btnSuscripMontoNo').text('Entendido');
    }
    hideLoader();
}

function bloqueaMontoSuscriptorEnd(msj, continua) {
    $('#suscripMontoExedeTxt').text(msj);
    $('#modalSuscripMontoExede').modal({
        show: true,
        backdrop: 'static',
        keyboard: false
    });
    $('.calc_fin table').hide();
    $('#paso2_next2').hide();
    $('#btnsuscontinuar').hide();
    $('#btnsuscontinuar2').hide();
    if (!continua) {
        $('#btnSuscripMontoSi').parent().hide();
        $('#btnSuscripMontoSiEnd').parent().hide();
        $('#btnSuscripMontoNo').text('Entendido');
    }
    hideLoader();
}

$('#btnSuscripMontoSi').click(function() {
    $('#btnsuscontinuar2').removeAttr('hidden');
    $('#btnsuscontinuar2').show();
    $('#modalSuscripMontoExede').modal('hide');
    $('#txtYaAcepto').val('1');
});

$('#btnSuscripMontoSiEnd').click(function() {
    $('#btnsuscontinuar2_2').removeAttr('hidden');
    $('#btnsuscontinuar2_2').show();
    $('#modalSuscripMontoExede').modal('hide');
    $('#txtYaAcepto').val('1');
});

$('#btnsuscontinuar2, #btnsuscontinuar2_2').click(function(e) {
    if ($('#txtYaAcepto').val() != '1') {
        paso2Valid(false, e, 1);
    }
    if ($('#txtErrorAntesGP2').val() == '0') {
        $('#fileModal').modal({
            show: true,
            backdrop: 'static',
            keyboard: false
        });
    }

});

$('#comentariosDosSuscrip').on('keyup', function(event) {
    $(event.target).val(function(index, value) {
        var aux = value.replace(/[^A-Za-z0-9\-_,.$\s]/g, '').replace(/\n/g, ". ");
        return aux;
    });
});

$('#btnSuscripEnvSus').click(function() {
    showLoader();
    $('#comentariosDosSuscrip').trigger('keyup');
    $('#txtAuxEnvDoc').val('0');
    adjuntaArchivos();
});

async function adjuntaArchivos() {

    var url = new URL(window.location.href);
    var data = new FormData();
    var auxiliarDoc = '{';

    $.each($('#docAgenSusc')[0].files, function(i, file) {
        data.append('file-' + i, file);
        var nomAux = file.name.split('.');
        if (i == 0) {
            auxiliarDoc += '\"file-' + i + '\" : {';
        } else {
            auxiliarDoc += ', \"file-' + i + '\" : {';
        }
        auxiliarDoc += '\"nom\" : \"' + nomAux[0] + '\",';
        auxiliarDoc += '\"ext\" : \"' + nomAux[1] + '\"}';
    });
    auxiliarDoc += '}';

    data.append('isRevire', $('#txtAuxEnvDoc').val());
    data.append('auxiliarDoc', auxiliarDoc);
    data.append('comentarios', $('#comentariosDosSuscrip').val());
    data.append('folio', infCotiJson.folio); /*data.append('folio', $('#idFolioCot').val());*/
    data.append('cotizacion', infCotiJson.cotizacion); /*data.append('cotizacion', cotizacionG);*/
    data.append('version', infCotiJson.version); /*data.append('version', versionG);*/
    data.append('modo', infCotiJson.modo); /*data.append('modo', $('#idModo').val());*/
    data.append('url', url.origin + url.pathname);
    data.append('url2', url.origin);
    data.append('totArchivos', $('#docAgenSusc')[0].files.length);

    $.ajax({
        url: $('#txtSendMailAgenteSuscriptor').val(),
        data: data,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function(data) {
            if (data != "") {
                var response = jQuery.parseJSON(data);
                if (response.codigo > 0) {
                    $('#fileModal').modal('hide');
                    hideLoader();
                    showMessageError('.navbar', response.error, 0);
                } else {
                    window.location.href = url.origin + url.pathname;
                }
            } else {
                window.location.href = url.origin + url.pathname;
            }
        }
    });
}

$('#fileModal #docAgenSusc').change(function(evt) {
    cargaDocumentos(evt, '#fileModal', '');
});


$('#fileModalP4 .docAgenSusc').on('change', function(evt) {
    cargaDocumentos(evt, '#fileModalP4', $(this).attr('iddoc'));
    /*
    $(this).parent().addClass('btn-green');
    $(this).parent().removeClass('btn-blue');
    */
});

function cargaDocumentos(evt, padre, btn) {
    var listMimetypeValid = ["application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/pdf"
    ];

    var iddoc = $(btn).attr('iddoc');
    var maxSize = 5;
    var files = evt.target.files; /* FileList object */
    var nomInvalidos = "";
    const dt = new DataTransfer();
    $(padre + ' #infDocSuc' + iddoc).val('');
    $.each(files, function(key, file) {

        var pesoArchivo = file.size / 1024 / 1024; /*peso en megas*/

        var agregarArchivo = true;
        if (listMimetypeValid.indexOf(file.type) < 0) {
            agregarArchivo = false;
            nomInvalidos += (nomInvalidos == "") ? file.name : ",<br>" + file.name;
            nomInvalidos += "- Tipo de archivo no admitido";
        }
        if (pesoArchivo > maxSize) {
            agregarArchivo = false;
            nomInvalidos += (nomInvalidos == "") ? file.name : ",<br>" + file.name;
            nomInvalidos += " - El archivo que quiere cargar pesa más de 5 MB, favor de reducir la resolución o cargar otro más ligero"
        }

        if (agregarArchivo) {
            dt.items.add(file);
            var nombres = $(padre + ' #infDocSuc' + iddoc).val();
            nombres += (nombres == '') ? file.name : ", " + file.name;
            $(padre + ' #infDocSuc' + iddoc).val(nombres);
            if ( valIsNullOrEmpty(btn) ){
            	$(padre + ' input[type="file"]').parent().addClass('btn-green');
            	$(padre + ' input[type="file"]').parent().removeClass('btn-blue');
            	$(padre + ' input[type="file"]').parent().removeClass('btn-purple');
            	$(padre + ' input[type="file"]').parent().removeClass('btn-red');            	            	
            }else{
            	$('input[iddoc='+btn+']').parent().addClass('btn-green');
            	$('input[iddoc='+btn+']').parent().removeClass('btn-blue');
            	$('input[iddoc='+btn+']').parent().removeClass('btn-purple');
            	$('input[iddoc='+btn+']').parent().removeClass('btn-red');            	
            }
        } else {
        	if ( valIsNullOrEmpty(btn) ){
        		$(padre + ' input[type="file"]').parent().addClass('btn-purple');
        		$(padre + ' input[type="file"]').parent().removeClass('btn-blue');
        		$(padre + ' input[type="file"]').parent().removeClass('btn-green');
        		$(padre + ' input[type="file"]').parent().removeClass('btn-red');
        		
        		$(padre + ' input[type="file"]').val('');            	
            }else{
            	$('input[iddoc='+btn+']').parent().addClass('btn-purple');
            	$('input[iddoc='+btn+']').parent().removeClass('btn-blue');
                $('input[iddoc='+btn+']').parent().removeClass('btn-green');
                $('input[iddoc='+btn+']').parent().removeClass('btn-red');
            	
            	$('input[iddoc='+btn+']').val('');
            }
            $(btn).parent().addClass('btn-purple');
            $(btn).parent().removeClass('btn-blue');
            $(btn).parent().removeClass('btn-green');
            $(btn).parent().removeClass('btn-red');
            $(btn).val('');
        }
    });
    $(padre + ' #docAgenSusc' + iddoc).files = dt.files;
    if (nomInvalidos != "") {
        showMessageError(padre + ' .modal-header', "Archivo(s) invalido(s): " + nomInvalidos, 0);

    }
}

function validaCotizacionExpirada() {
    if ($("#txtCotizacionExpiro").val() > "0") {
        $('#modalCotizacionExpirada').modal({
            show: true,
            backdrop: 'static',
            keyboard: false
        });
    }
}

$('#btncotExpiroSi').click(function() {
    var url = new URL(window.location.href);
    window.location.href = url.origin + url.pathname;
});

/**
 * Campos bloqueados de sucripcion
 */
function bloqueaCaposSuscripcion() {
    if ($('#txtbloqueaCamposSuscripcion').val() == "1") {
        habilita_deshabilita_Input("paso1", true);
        habilita_deshabilita_Input("paso2", true);
        $('#btn-add-tab').hide();
        $('#save_tot').hide();
        $('#paso1_back').hide();
        $('#btnsuscontinuar2').hide();
        $('#paso2_next').hide();
    }
}

function habilita_deshabilita_Input(contenedor, accion) {
    $('#' + contenedor + ' :input').prop("disabled", accion);
}

$('#paso2_suscripcion_next').click(function() {
    auxLlenaCaratula();
});

$('#btnEnvCotiSusAgente').click(function() {
    showLoader();
    var url = new URL(window.location.href);

    $.post($('#txtSendMailSuscriptorAgente').val(), {
        cotizacion: infCotiJson.cotizacion,
        /*cotizacion: cotizacionG,*/
        version: infCotiJson.version,
        /*version: versionG,*/
        folio: infCotiJson.folio,
        /*folio: $('#idFolioCot').val(),*/
        url: url.origin + url.pathname,
        email: $('#txtEmailAgente').val()
    }).done(function() {

        window.location.href = url.origin + url.pathname;
    });
});

$('#btnNoAcepPropuesta').click(function() {
    $('#modalRechazarProp').modal('show');
});

$('#btnEnvRecha').click(function(e) {
    showLoader();
    e.preventDefault();
    var errores = false;
    errores = (noSelect($('#mdlRechOp')) ? true : errores);
    errores = (valIsNullOrEmpty($('#comentariosRechazarProp').val().trim()) ? true : errores);
    if (errores) {
        showMessageError('#modalRechazarProp .modal-header', 'Los campos son obligatorios', 0);
        hideLoader();
    } else {
        showLoader();
        var url = new URL(window.location.href);
        var motivo = $('#modalRechazarProp .modal-body select').val();
        $.post($('#txtRechazaCotizacionURL').val(), {
            cotizacion: infCotiJson.cotizacion,
            /*cotizacion: cotizacionG,*/
            version: infCotiJson.version,
            /*version: versionG,*/
            motivoRechazo: motivo,
            motivo: $('#comentariosRechazarProp').val()
        }).done(function() {

            window.location.href = url.origin + url.pathname;
        });
    }
});

$('#btnRecotizar').click(function() {
    $('#btnSuscripEnvSus2').removeAttr('hidden');
    $('#btnSuscripEnvSus').prop('hidden', true);
    $('#fileModal').modal('show');
});

$('#btnSuscripEnvSus2').click(function() {
    showLoader();
    $('#comentariosDosSuscrip').trigger('keyup');

    if ($('#docAgenSusc')[0].files.length == 0 && $('#comentariosDosSuscrip').val().trim().length == 0) {
        showMessageError('#fileModal .modal-header', 'Agregar documentos y/o comentarios', 0);
        hideLoader();
    } else {
        $('#txtAuxEnvDoc').val('1');
        adjuntaArchivos();
    }
});

function generafactura492() {
    if ($('#txtLeg492').val() == 'factura') {
        showLoader();
        auxLlenaCaratula();
    }
}

function validaPrimaMax492() {
    var isExtr = (
        ($("#mpldmPaisDeNacimiento").val() == "-1") ||
        ($("#mpldmPaisDeNacimiento option:selected").attr("codigo") == "MEX")) ? 0 : 1;
    var resiMex = $("#chkResideMex #chekRMSi").is(":checked") ? 1 : 0;
    if (varAuxiliares.tipoPersona == persona.moral) {
        resiMex = isExtr;
    }
    var ispep = marcarPep();
    $.post($('#txtgetListaDocumentosVoBo492').val(), {
        cotizacion: infCotiJson.cotizacion,
        version: infCotiJson.version,
        pep: ispep,
        extranjero: isExtr,
        resideMex: resiMex,
        lgVoBo : lgVoBo,
        listVo : listVo
    }).done(function(data) {
        sessionExtend();
        var response = jQuery.parseJSON(data);
        if (response.code == 0) {
            if (response.totalRow > 0) {
                generamodalFile492(data);
            } else {
                $('#btnsEmision').removeAttr('hidden');
                $('#btnsEmision').show();
                $('#btnsEmisionArt492').hide();
            }
        } else {
            $('#btnsEmision').attr('hidden', 'hidden');
            $('#btnsEmision492').attr('hidden', 'hidden');
            $('#chkBxLeido').trigger("click");
            $('#chkBxLeido').prop('checked', false);
            showMessageError('.navbar', 'Error al consultar la información', 0);
            hideLoader();
        }
    }).fail(function() {
        showMessageError('.navbar', 'Error al consultar la información', 0);

    });
}

function marcarPep() {
    tratarPep = 0;
    tratarPep = (varAuxiliares.isPep) ? 1 : tratarPep;
    tratarPep = ($("#chekFideSi").is(":checked")) ? 1 : tratarPep;
    tratarPep = ($("#chkPepSi").is(":checked")) ? 1 : tratarPep;

    tratarPep = giroRiesgo("#mpldmSelOPG") ? 1 : tratarPep;
    tratarPep = giroRiesgo("#mpldmSelOPG2") ? 1 : tratarPep;

    tratarPep = ($("#chekRMNo").is(":checked")) ? 1 : tratarPep;
    if (!(($("#mpldmPaisDeNacimiento").val() == "-1") ||
            ($("#mpldmPaisDeNacimiento option:selected").attr("codigo") == "MEX"))) {
        tratarPep = 1;
    }
    if (tratarPep == 1) {
    	listaVoBo();
    }
    return tratarPep;
}

function listaVoBo() {
	listVo = "";
	listVo += (varAuxiliares.isPep) ? "Coincidencia Q es Q, " : "";
	listVo += ($("#chekFideSi").is(":checked")) ? "Es Fideicomiso, " : "";
	listVo += ($("#chkPepSi").is(":checked")) ? "Selecciono Pep, " : "";

	listVo += giroRiesgo("#mpldmSelOPG") ? "Selecciono " + $("#mpldmSelOPG option:selected").text() + ", " : "";
	listVo += giroRiesgo("#mpldmSelOPG2") ? "Selecciono " + $("#mpldmSelOPG2 option:selected").text() + ", " : "";

	listVo += ($("#chekRMNo").is(":checked")) ? "No reside en México, " : "";
    if (!(($("#mpldmPaisDeNacimiento").val() == "-1") ||
            ($("#mpldmPaisDeNacimiento option:selected").attr("codigo") == "MEX"))) {
    	listVo += "Pais de Nacimiento/Constitucion " + $("#mpldmPaisDeNacimiento option:selected").text();
    }
}


function giroRiesgo(campo) {
    if ($(campo).val() == "-1") {
        return false;
    }
    if ($(campo + " option:selected").attr("codigo") == "OT") {
        return false;
    }
    return true;
}

function generamodalFile492(archivos) {
    var response = JSON.parse(archivos);
    var totObligatorios = totalDocObligatorios(response.lista);
    $("#fileModalP4 #totDocART492").text(
        "Se requieren " + response.totalRow + " archivos, " + totObligatorios + " archivos son obligatorios");
    for (i = 0; i < response.totalRow; i++) {
        var divdoc = $("#fileModalP4 #divFile").clone(true, true);
        divdoc.attr('id', 'divFile-' + i);
        divdoc.find('#docAgenSusc').attr('obligatorio', response.lista[i].esObligatorio);
        divdoc.find('#docAgenSusc').attr("prefijo", response.lista[i].nomenclatura);
        divdoc.find('#docAgenSusc').attr("iddoc", response.lista[i].idDocumento);
        divdoc.find('#docAgenSusc').attr("idCatalogoDetalle", response.lista[i].idCatalogoDetalle);
        divdoc.find('#docAgenSusc').attr('id', response.lista[i].nomenclatura + 'docAgenSusc');
        divdoc.find('#infDocSuc').attr("placeholder", response.lista[i].nombre);
        divdoc.find('#titArchivo').text(response.lista[i].nombre);
        divdoc.find('#infDocSuc').attr('id', response.lista[i].nomenclatura + 'infDocSuc');
        if (response.lista[i].esObligatorio == 1) {
            divdoc.find('#iconRequerido').removeAttr('hidden');
            divdoc.find('#divBtnCargar').addClass("border border-danger");
        }
        if (response.lista[i].yaExiste == 1) {
            divdoc.find('#btnVerExis').attr("iddoc", response.lista[i].idDocumento);
            divdoc.find('#btnVerExis').attr("idCatalogoDetalle", response.lista[i].idCatalogoDetalle);
            divdoc.find('#btnVerExis').removeAttr('hidden');

            divdoc.find('#divBtnCargar').removeClass("col-md-12");
            divdoc.find('#divBtnCargar').addClass("col-md-6");
        }
        divdoc.find('#btnVerExis').attr('id', 'btnVerExis' + response.lista[i].idDocumento);
        divdoc.appendTo('#conjuntoFile');
        divdoc.removeAttr('hidden');
    }
    $('#fileModalP4 #divFile-' + (response.totalRow - 1)).after('</div">');
    $("#fileModalP4 #divFile").remove();

    $('#btnsEmision').hide();
    $('#btnsEmisionArt492').removeAttr('hidden');
    $('#btnsEmisionArt492').show();
}

function totalDocObligatorios(obj) {
    var tot = 0;
    $.each(obj, function(i, k) {
        if (k.esObligatorio == 1) {
            tot++;
        }
    });
    return tot;
}

$('#btnDocArt492').click(function() {
    var indexModalFilep4 = $("#fileModalP4").css("zIndex");
    $("#fileModalP4").css("zIndex", 1);
    showLoader();
    genEmision(1);
    enviaDocArt492(indexModalFilep4);
});

function enviaDocArt492(indexModalFilep4) {
    var data = new FormData();
    var auxiliarDoc = '{';
    var docCompletos = true;
    var totArchivos = 0;

    if (validaDocObligatorios()) {

        $.each($('.docAgenSusc'), function(k, f) {
            var file = f.files[0];
            if (f.files.length > 0) {
                data.append("file-" + totArchivos, file);
                var nomAux = file.name.split('.');
                if (totArchivos == 0) {
                    auxiliarDoc += '\"file-' + totArchivos + '\" : {';
                } else {
                    auxiliarDoc += ', \"file-' + totArchivos + '\" : {';
                }
                auxiliarDoc += '\"nom\" : \"' + $(f).attr("prefijo") + nomAux[0] + '\",';
                auxiliarDoc += '\"iddoc\" : \"' + $(f).attr("iddoc") + '\",';
                auxiliarDoc += '\"idcatdet\" : \"' + $(f).attr("idcatalogodetalle") + '\",';
                auxiliarDoc += '\"ext\" : \"' + nomAux[1] + '\"}';
                $(f).parent().addClass('btn-green');
                $(f).parent().removeClass('btn-blue');
                totArchivos++;
            } else {
                $(f).parent().addClass('btn-orange');
                $(f).parent().removeClass('btn-blue');
                docCompletos = false;
            }
        });

        auxiliarDoc += '}';

        console.log("totArchivos : " + totArchivos);
        var url = new URL(window.location.href);

        data.append('auxiliarDoc', auxiliarDoc);
        data.append('comentarios', $('#comentariosDocArt349').val());
        data.append('folio', infCotiJson.folio); /*data.append('folio', $('#idFolioCot').val());*/
        data.append('cotizacion', infCotiJson.cotizacion); /*data.append('cotizacion', cotizacionG);*/
        data.append('version', infCotiJson.version); /*data.append('version', versionG);*/
        data.append('modo', infCotiJson.modo); /*data.append('modo', $('#idModo').val());*/
        data.append('url', url.origin + url.pathname);
        data.append('url2', url.origin);
        data.append('totArchivos', totArchivos);
        data.append('idPerfil', $('#txtIdPerfilUser').val());

        $.ajax({
            url: $('#txtSendDocumentosArt492Url').val(),
            data: data,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function() {
                $("#fileModalP4").css("zIndex", indexModalFilep4);
                showMessageSuccess('#fileModalP4 .modal-header', 'proceso terminado con éxito', 0);
                $('#fileModal').modal('hide');

                goToHome();
            },
            fail: function() {
                showMessageError('#fileModalP4 .modal-header', 'Error al enviar la información ', 0);
            }
        });
    } else {
        $("#fileModalP4").css("zIndex", indexModalFilep4);
        showMessageError('#fileModalP4 .modal-header', 'Falta documento(s) obligatorios ', 0);
        hideLoader();
    }

}

function validaDocObligatorios() {
    var completos = true;
    $.each($('.docAgenSusc'), function(k, f) {
        if ($(f).attr("obligatorio") == "1") {
            if (f.files.length == 0) {
                $(f).parent().addClass('btn-red');
                $(f).parent().removeClass('btn-blue');
                completos = false;
            }
        }
    });
    return completos;
}

$('#btnFacturaSuscrip').click(function() {
    var idFac = ($('#chkfactauto').is(':checked')) ? 1 : 0;
    $('#txtBtnEmiteFactu').val(idFac);
    showLoader();

    $.post(getEmisionArt492Url, {
        cotizacion: infCotiJson.cotizacion,
        /*cotizacion: cotizacionG,*/
        version: infCotiJson.version,
        /*version: versionG,*/
        factura: idFac
    }).done(function(data) {
        var response = jQuery.parseJSON(data);
        console.log('aquiiii');
        console.log(response);
        if (response.code == 0) {
            llenaInfoModalPoliza(response);
            $('#modalGenerarPoliza').modal({
                show: true
            });
        } else if (response.code == 4) {
            llenaInfoModalPoliza(response);
            $('#modalGenerarPoliza').modal({
                show: true
            });
            showMessageError('#modalGenerarPoliza', (response.msg), 0);
        } else {
            showMessageError('.navbar', (response.msg), 0);
        }
    }).always(function() {
        hideLoader();
    });
});

function agregaRequeridospaso4(tipoPer, nacionalidad) {
    var personaFisica = 1;
    var personaMoral = 2;
    var mexicano = "J07";
    validaEdicion('#mpldmNombreApoderado');
    if (nacionalidad != mexicano) {
        validaEdicion('#mpldmNoIdentificacionFiscal');
    }
    validaEdicion('#mpldmPaisDeNacimiento');
    validaEdicion('#mpldmNacionalidad');
    if (tipoPer == personaMoral) {
        validaEdicion('#mpldmNoFolioMercantil');
    }
    validaEdicion('#mpldmTelCel');
    if (tipoPer == personaFisica) {
        validaEdicion('#mpldmTipoIdentificacion');
        validaEdicion('#mpldmNoIdentificacionFiscal');
    }

}

function quitaRequeridos() {
    $('.frmPaso4 .alert-danger').remove();
    $('#mpldmNombreApoderado').removeClass("infoRequerida invalid");
    $('#mpldmNoIdentificacionFiscal').removeClass("infoRequerida invalid");
    $('#mpldmPaisDeNacimiento').removeClass("infoRequerida invalid");
    $('#mpldmNacionalidad').removeClass("infoRequerida invalid");
    $('#mpldmNoFolioMercantil').removeClass("infoRequerida invalid");
    $('#mpldmTelCel').removeClass("infoRequerida invalid");
    $('#mpldmTipoIdentificacion').removeClass("infoRequerida invalid");
    $('#mpldmNoIdentificacionFiscal').removeClass("infoRequerida invalid");
}

function validaEdicion(campo) {
    if ($(campo).is(':visible')) {
        if ($(campo).is(':disabled')) {
            if (valIsNullOrEmpty($(campo))) {
                $(campo).removeAttr('disabled');
            }
        }
        $(campo).addClass("infoRequerida");
    }
}

$('#btnVerificarCotiza').click(function() {
    verificarCotizacion();
});

$('#btnRegresarRevision').click(function() {
    verificarCotizacion();
});

function verificarCotizacion() {
    goToPage(seleccionaVentana());

}

$('#btngetDocEmi492').click(function(e) {
    e.preventDefault();
    llenaEmisionData();

    $.ajax({
        url: $('#txtJSGetEmisionTot').val(),
        global: false,
        type: 'POST',
        data: {
            infEmi: JSON.stringify(emisionDataRequest),
            art492emi: 1
        },
        async: false,
        success: function(data) {
            var response = jQuery.parseJSON(data);
            console.log(response);

            if (response.code == 0) {
                $("#fileModalP4").modal("show");
                console.log(emisionDataRequest);
            } else {
                if (response.code == 5) {
                    $("#chkBxLeido").trigger("click");
                    if (varAuxiliares.viculoPersona == 179) {
                        $("#mpldmRFC").attr("disabled", false);
                        $("#mpldmRFC").focus();
                    } else {
                        $("#modalRFCEXisttClientt").modal("show");
                    }
                }
                showMessageError('.navbar', (response.msg), 0);
                hideLoader();
            }
        }
    });
});

function llenaEmisionData() {
    emisionDataRequest.p_cotizacion = parseInt(infCotiJson.cotizacion); /*emisionDataRequest.p_cotizacion = parseInt(cotizacionG);*/
    emisionDataRequest.p_version = parseInt(infCotiJson.version); /*emisionDataRequest.p_version = parseInt(versionG);*/
    emisionDataRequest.p_viculoPersona = parseInt(varAuxiliares.viculoPersona);
    emisionDataRequest.p_calle = $('#mpldmCalle').val();
    emisionDataRequest.p_numero = $('#mpldmNumeroInterior').val();
    emisionDataRequest.paisNaciminetoCodigo = $('#mpldmPaisDeNacimiento').val();
    emisionDataRequest.paisNacimineto = $('#mpldmPaisDeNacimiento').val() == -1 ? '' : $("#mpldmPaisDeNacimiento option:selected").text();
    emisionDataRequest.idGiroMercantil = $("#mpldmSelOPG").val();
    emisionDataRequest.p_datoscliente.idPersona = parseInt(varAuxiliares.idPersona);
    emisionDataRequest.p_datoscliente.tipoPer = (varAuxiliares.tipoPersona == persona.moral) ? 218 : 217;
    emisionDataRequest.p_datoscliente.rfc = $('#mpldmRFC').val();
    emisionDataRequest.p_datoscliente.nombre = $('#mpldmNombre').val();
    emisionDataRequest.p_datoscliente.appPaterno =
        varAuxiliares.tipoPersona == persona.fisica2 ?
        $('#mpldmApPater').val() : $("#mpldmDenominacion  option:selected").text();
    emisionDataRequest.p_datoscliente.appMaterno = $('#mpldmApMat').val();
    emisionDataRequest.p_datoscliente.nombreCompleto =
        emisionDataRequest.p_datoscliente.nombre + " " +
        emisionDataRequest.p_datoscliente.appPaterno + " " +
        emisionDataRequest.p_datoscliente.appMaterno;
    emisionDataRequest.p_datoscliente.idDenominacion =
        $("#mpldmDenominacion  option:selected").val();
    emisionDataRequest.p_datoscliente.codigo = varAuxiliares.codigo;
    emisionDataRequest.p_datoscliente.regimen = $("#mpldmRegimen option:selected").val();
    emisionDataRequest.p_cpData.idCp = parseInt($("#mpldmColonia  option:selected").val());
    emisionDataRequest.p_cpData.cp = $("#mpldmCodigoPostal").val();
    emisionDataRequest.p_cpData.colonia = $("#mpldmColonia  option:selected").text();
    emisionDataRequest.p_cpData.delegacion = $("#mpldmDelegacionMunicipio").attr("idmunicipio");
    emisionDataRequest.p_cpData.estado = $("#mpldmDelegacionMunicipio").attr("idedo");
    emisionDataRequest.p_cpData.pais = $("#mpldmDelegacionMunicipio").attr("idpais");
    emisionDataRequest.p_datosfisica.fechaNacimineto = $("#mpldFecha").val();
    emisionDataRequest.p_datosfisica.tipoIdentificacion = $("#mpldmTipoIdentificacion").val();
    emisionDataRequest.p_datosfisica.numIdFiscal = $("#mpldmNumIdentificacion").val();
    emisionDataRequest.p_datosfisica.resideMexico = parseInt($("#chkResideMex .form-check-input:checked").val());
    emisionDataRequest.p_datosfisica.curp = $("#mpldmCURP").val();
    emisionDataRequest.p_datosfisica.email = $("#mpldmEmail").val();
    emisionDataRequest.p_datosMoral.fechaConstitucion = $("#mpldFecha").val();
    emisionDataRequest.p_datosMoral.nombreApoderado = $("#mpldmNomApoLeg").val();
    emisionDataRequest.p_datosMoral.APApoderado = $("#mpldmApApoLeg").val();
    emisionDataRequest.p_datosMoral.AMApoderado = $("#mpldmAmApoLeg").val();
    emisionDataRequest.p_datosMoral.nombreCompletoApoderado =
        $("#mpldmNomApoLeg").val() + " " + $("#mpldmApApoLeg").val() + " " + $("#mpldmAmApoLeg").val();
    emisionDataRequest.p_datosMoral.esFideicomiso = parseInt($("#chkFideico .form-check-input:checked").val());
    emisionDataRequest.p_datosMoral.nacionalidad = $('#mpldmNacionalidad').val();
    emisionDataRequest.p_datosMoral.telefono = $('#mpldmTelCel').val();
    emisionDataRequest.p_datosMoral.numFEA = $('#mpldmNoSerieCertificadoFea').val();
    emisionDataRequest.p_datosMoral.numMercantil = $('#mpldmFolMerca').val();
    emisionDataRequest.p_datosMoral.email = $('#mpldmEmail').val();
    emisionDataRequest.p_datosPep.pep = parseInt($("#chekPEP .form-check-input:checked").val());
    emisionDataRequest.p_datosPep.ocupacion = $("#mpldmOtraOpOPG").is(":visible") ?
        $("#mpldmOtraOpOPG").val() : $("#mpldmOtraOpOPG2").val();
    emisionDataRequest.p_datosPep.institucion = $("#mpldmInstentidad").val();
    emisionDataRequest.p_datosPep.puesto = parseInt($("#mpldmCargoPuesto").val());

    /*este es un caso especial, adecuacion por parte de TMX, mantis 1961*/
    if (varAuxiliares.tipoPersona == persona.moral) {
        if (($("#mpldmPaisDeNacimiento").val() == "-1") ||
            ($("#mpldmPaisDeNacimiento option:selected").attr("codigo") == "MEX")) {
            emisionDataRequest.p_datosfisica.resideMexico = 1;
        } else {
            emisionDataRequest.p_datosfisica.resideMexico = 2;
        }
    }
}

function genEmision(tipEmi) {
    console.log(emisionDataRequest);
    var asyn = (tipEmi == 1) ? false : true;
    $.ajax({
        url: $('#txtJSGetEmisionTot').val(),
        global: false,
        type: 'POST',
        data: {
            infEmi: JSON.stringify(emisionDataRequest),
            art492emi: tipEmi
        },
        async: asyn,
        success: function(data) {
            var response = jQuery.parseJSON(data);
            console.log(response);
            if (tipEmi == 0) {
                if (response.code == 0 || response.code == 4) {
                    generaModalEmision(response);
                } else {
                    if (response.code == 5) {
                        $("#chkBxLeido").trigger("click");
                        if (varAuxiliares.viculoPersona == 179) {
                            $("#mpldmRFC").attr("disabled", false);
                            $("#mpldmRFC").focus();
                        } else {
                            $("#modalRFCEXisttClientt").modal("show");
                        }
                    }
                    showMessageError('.navbar', (response.msg), 0);
                    hideLoader();
                }
            }
        }
    });

}



function camposRequeridosComunes() {
    $("#mpldmPaisDeNacimiento").addClass("infReqS");
    $("#mpldmNacionalidad").addClass("infReq");
    $("#mpldmTelCel").addClass("infReq");
    $("#mpldmEmail").addClass("infReq");
}

function camposRequeridosFisica() {
    $("#mpldmTipoIdentificacion").addClass("infReq");
    $("#mpldmSelOPG2").addClass("infReqS");
}

function camposRequeridosMoral() {
    $("#mpldmSelOPG").addClass("infReqS");
    $("#mpldmNomApoLeg").addClass("infReq");
    $("#mpldmApApoLeg").addClass("infReq");
    $("#mpldmAmApoLeg").addClass("infReq");
}

function eliminaRequeridos() {
    if (varAuxiliares.tipUmbral == tipoUmbral.bajo) {
        $("#mpldmPaisDeNacimiento").removeClass("infReqS");
        $("#mpldmNacionalidad").removeClass("infReq");
        $("#mpldmTelCel").removeClass("infReq");
        $("#mpldmEmail").removeClass("infReq");
        $("#mpldmTipoIdentificacion").removeClass("infReq");
        $("#mpldmSelOPG2").removeClass("infReqS");
        $("#mpldmSelOPG").removeClass("infReqS");
        $("#mpldmNomApoLeg").removeClass("infReq");
        $("#mpldmApApoLeg").removeClass("infReq");
        $("#mpldmAmApoLeg").removeClass("infReq");
    }
}

function solicitaRequeridosPB() {
    if (marcarPep() == 1) {
        if (varAuxiliares.tipUmbral == tipoUmbral.bajo) {
            camposRequeridosComunes();
            if (varAuxiliares.tipoPersona == persona.fisica) {
                camposRequeridosFisica();
            } else {
                camposRequeridosMoral();
            }
        }
    }
}

function getDocEmiExis(btnDoc) {
    showLoader();
    var idDocumento = $(btnDoc).attr("iddoc");
    var idCatalogoDetalle = $(btnDoc).attr("idCatalogoDetalle");
    $.ajax({
        url: getDocumentosExistentesUrl,
        type: 'POST',
        data: {
            cotizacion: infCotiJson.cotizacion,
            /*cotizacion: cotizacionG,*/
            version: infCotiJson.version,
            /*version: versionG,*/
            folio: infCotiJson.folio,
            /*folio: $('#txtFolioCopiaP1').val(),*/
            idDoc: idDocumento,
            idCatDet: idCatalogoDetalle
        },
        success: function(data) {

            var archivo = JSON.parse(data);

            if (archivo.code == undefined) {
                if (detectIEEdge()) {
                    fileAux = 'data:application/octet-stream;base64,' + archivo.documento;
                    var dlnk = document.getElementById('dwnldLnk');
                    dlnk.href = fileAux;
                    dlnk.download = archivo.nombre + '.' + archivo.extension;
                    location.href = document.getElementById("dwnldLnk").href;
                    /*dlnk.click();*/
                } else {
                    /*
                     * downloadDocument('archivo base 64' , 'nombre.extension' );
                     */
                    downloadDocument(archivo.documento, archivo.nombre + '.' + archivo.extension);
                }

                hideLoader();

            } else {
                showMessageError("#fileModalP4 .modal-header", archivo.msg, 0);
            }

        }
    }).always(function() {
        hideLoader();
    });
}


function downloadBlob(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    } else {
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}

function downloadDocument(strBase64, filename) {
    var url = "data:application/octet-stream;base64," + strBase64;
    var documento = null;
    /*.then(res => res.blob())*/
    fetch(url)
        .then(function(res) { return res.blob() })
        .then(function(blob) {
            downloadBlob(blob, filename);
        });
}


function detectIEEdge() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        /* IE 10 or older => return version number*/
        console.log(parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10));
        return true;
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        /* IE 11 => return version number*/
        var rv = ua.indexOf('rv:');
        console.log(parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10));
        return true;
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        /* Edge => return version number*/
        console.log(parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10));
        return true;
    }

    /* other browser*/
    return false;
}