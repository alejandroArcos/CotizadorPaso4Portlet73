/**
 * Valida si es persona fisica o moral
 * 
 * @param {int}
 *            val
 * @type {int} val
 * @returns {int} tipo de persona --> fisica o moral
 */
function isFisica_Moral(val) {
    var tpPerP4 = 0;
    if ((val == 2) || (val == 218)) {
        tpPerP4 = persona.moral;
        $('.divFisica').hide();
        $('.divMoral').show();
        $("#divNombre").addClass("col-md-6");
        
        $.each($("#mpldmRegimen option"), function(key, value){
            if($(value).attr('otro') == 'FISICA') {
            	$(value).remove();
            } 
        });

    } else {
        tpPerP4 = persona.fisica;
        $('.divFisica').show();
        $('.divMoral').hide();
        $("#divNombre").addClass("col-md-3");
        
        $.each($("#mpldmRegimen option"), function(key, value){
            if($(value).attr('otro') == 'MORAL') {
            	$(value).remove();
            } 
        });
    }
    
    /*
    $('#mpldmRegimen').material_select('destroy');
    $('#mpldmRegimen').material_select();
    */
    
    return tpPerP4;
}


function coloniaFija(cpData) {
    $('#mpldmColonia option').remove();
    $('#mpldmColonia').append(
        '<option value="' + cpData.idCp + '" idCP=' + cpData.idCp + ' codigoCP=' +
        cpData.cp + ' >' + cpData.colonia + '</option>');
    llenaInputSelect('#mpldmColonia', cpData.idCp, true);
}

function llenaTxtInfoBasica(campo, valor) {
    if ($(campo).is(":visible")) {
        if (valIsNullOrEmpty(valor)) {
            $(campo).addClass("infoRequerida");
        } else {
            llenaInputTextOB(campo, valor, true);
        }
    }
}

function validaFEchaBasica(dataEmision) {
    var fecha = "";
    if (varAuxiliares.tipoPersona == persona.fisica) {
        fecha = dataEmision.datosFisica.fechaNacimineto;
    } else {
        fecha = dataEmision.datosMoral.fechaConstitucion;
    }
    if (!valIsNullOrEmpty(fecha)) {
        llenaInputDate("#mpldFecha", fecha, true);
    }
}

function llenaSelInfoBasica(campo, valor) {
    if ($(campo).siblings("input.select-dropdown").is(":visible")) {
        if (valIsNullOrEmpty(valor)) {
            $(campo).addClass("infoRequeridaSel");
        } else {
            llenaInputSelect(campo, valor, true);
        }
    }
}

$("#mpldmCodigoPostal").blur(function() {
    showLoader();
    var cp = $(this).val();
    limpiaCamposCP();
    if (cp.length > 0 && cp.length < 5) {
        $(this).focus();
        showMessageError('.navbar', 'Por favor verifique el código postal a 5 dígitos', 0);
    } else if (cp.length == 5) {
        llenaCamposCP(cp, 0, false);
    } else if (cp.length == 0) {
        limpiaCamposCP();
    }
    hideLoader();
});


$('#mpldmImportarDomicilioUbicacion').change(function() {
    if ($('#mpldmImportarDomicilioUbicacion').val() == -1) {
        limpiaCpDataPaso4();
    } else {
        showLoader();
        $.post($('#txtJSGetDireccionEmision').val(), {
            ubicacion: $(this).val(),
            cotizacion: infCotiJson.cotizacion,
            version: infCotiJson.version
        }).done(function(data) {
            sessionExtend();
            var r = jQuery.parseJSON(data);
            llenaTxtInfoBasica('#mpldmCalle', r.calle);
            llenaTxtInfoBasica('#mpldmNumeroInterior', r.numero);
            llenaTxtInfoBasica('#mpldmCodigoPostal', r.cpData.cp);
            llenaCamposCP(r.cpData.cp, r.cpData.colonia, false);

            hideLoader();
        }).fail(function() {
            showMessageError('.navbar', 'Error al consultar la información', 0);
            hideLoader();
        });
    }
});

function limpiaCpDataPaso4() {
    llenaInputText("#mpldmCodigoPostal", "", false);
    llenaInputText("#mpldmCalle", "", false);
    llenaInputText("#mpldmNumeroInterior", "", false);
    llenaInputText("#mpldmDelegacionMunicipio", "", false);
    llenaInputText("#mpldmEstado", "", false);
    llenaInputText("#mpldmPais", "", false);
}


function llenaCamposPerFisica(info) {
    llenaInputText('#mpldmTipoIdentificacion', info.datosFisica.tipoIdentificacion, false);
    llenaInputText('#mpldmNumIdentificacion', info.datosFisica.numIdFiscal, false);
    $("#chkResideMex :checkbox[value=" + info.datosFisica.resideMexico + "]").prop("checked", true);
    llenaInputText('#mpldmCURP', info.datosFisica.curp, false);
}

function llenaCamposPerMoral(info) {
    llenaInputText('#mpldmFolMerca', info.datosMoral.numMercantil, false);
    $("#chkFideico :checkbox[value=" + info.datosMoral.esFideicomiso + "]").prop("checked", true);
    llenaInputText('#mpldmNomApoLeg', info.datosMoral.nombreApoderado, false);
    llenaInputText('#mpldmApApoLeg', info.datosMoral.APApoderado, false);
    llenaInputText('#mpldmAmApoLeg', info.datosMoral.AMApoderado, false);
}

/* #region codigo postal */
$("#frmPaso4").on("input", ".cpValid2", function() {
    this.value = this.value.replace(/\D/g, '');
});

function limpiaCamposCP() {
    llenaInputText("#mpldmDelegacionMunicipio", "", false);
    llenaInputText("#mpldmEstado", "", false);
    llenaInputText("#mpldmPais", "", false);
    $('#mpldmColonia option:not(:first)').remove();
}

function llenaCamposCP(cp, valueSelect, desactivado) {
    showLoader();
    $.post($('#txtJSGetDomicilioPersonasUrl').val(), {
        cp: cp
    }).done(
        function(data) {
            sessionExtend();
            try {
                var response = jQuery.parseJSON(data);
                llenaInputText("#mpldmDelegacionMunicipio", response.listaMunicipio[0].descripcion, desactivado);
                $('#mpldmDelegacionMunicipio').attr("idMunicipio", response.listaMunicipio[0].codigo);
                llenaInputText("#mpldmEstado", response.listaEstado[0].descripcion, desactivado);
                $('#mpldmDelegacionMunicipio').attr("idEdo", response.listaEstado[0].codigo);
                llenaInputText("#mpldmPais", response.listaPais[0].descripcion, desactivado);
                $('#mpldmDelegacionMunicipio').attr("idPais", response.listaPais[0].codigo);

                $.each(response.listaColonia, function(key, registro) {
                    $('#mpldmColonia').append(
                        '<option value="' + registro.id + '" idCP=' + registro.id + ' codigoCP=' +
                        registro.codigo + ' >' + registro.descripcion + '</option>');
                });
                llenaInputSelect('#mpldmColonia', valueSelect, desactivado);
                /*selectDestroyBySelector('#mpldmColonia', desactivado);*/
                hideLoader();
            } catch (error) {
                showMessageError('.navbar', 'Error al consultar la información', 0);
                hideLoader();
            }
        });
}
/* #endregion codigo postal */

/* #region funciones genericas */

function llenaInputText(campo, valor, desactivado) {
    $(campo).val(valor);
    $(campo).prop("disabled", desactivado);
    $(campo).siblings("label").addClass('active');
}

function llenaInputTextOB(campo, valor, desactivado) {
    $(campo).val(valor);
    $(campo).prop("disabled", desactivado);
    $(campo).siblings("label").addClass('active');
    if (desactivado) {
        $(campo).addClass("bqOri");
    }
}

function llenaInputDate(campo, valor, desactivado) {
    var pick_ = $(campo).pickadate('picker');
    pick_.set('select', stringToDate(valor));
    $(campo).prop("disabled", desactivado);
    if (desactivado) {
        $(campo).addClass("bqOri");
    }
}

function llenaInputSelect(campo, valor, desactivado) {
    $(campo + ' option[value=' + valor + ']').prop('selected', true);
    if ($(campo + ' option[value=' + valor + ']').length == 0) {
        desactivado = false;
    }
    if (desactivado) {
        $(campo).addClass("bqOri");
    }
    selectDestroyBySelector(campo, desactivado);
}

$("#frmPaso4 .card .card-body input").click(function() {
    eliminaErrores();
    $('.form-check-input.is-invalid').removeClass('is-invalid');
});
/* #endregion funciones genericas */

/* #region cambia objeto */
$("#frmPaso4 .card-body .valCheck :checkbox").change(function() {
    if ($(this).is(":checked")) {
        $(this).closest(".valCheck").find("input:checkbox").not(this).prop("checked", false);
    } else {
        $(this).closest(".valCheck").find("input:checkbox").not(this).prop("checked", true);
    }
});

$("#mpldmSelOPG").change(function() {
    if ($("#mpldmSelOPG option:selected").attr("codigo") == "OT") {
        /* otra opcion */
        $("#mpldmOtraOpOPG").prop("disabled", false);
        $("#mpldmOtraOpOPG").focus();
        $("#mpldmOtraOpOPG").addClass("infReq");
    } else {
        $("#mpldmOtraOpOPG").prop("disabled", true);
        $("#mpldmOtraOpOPG").removeClass("infReq");
    }
});

$("#mpldmSelOPG2").change(function() {
    if ($("#mpldmSelOPG2 option:selected").attr("codigo") == "OT") {
        /* otra opcion */
        $("#mpldmOtraOpOPG2").prop("disabled", false);
        $("#mpldmOtraOpOPG2").focus();
        $("#mpldmOtraOpOPG2").addClass("infReq");
    } else {
        $("#mpldmOtraOpOPG2").prop("disabled", true);
        $("#mpldmOtraOpOPG2").removeClass("infReq");
    }
});

$("#chekPEP .form-check-input").change(function() {
    validaReqPep();
});

function validaReqPep() {
    $("#mpldmCargoPuesto").removeClass("infReqS");
    if (isPepSelected()) {
        $("#mpldmCargoPuesto").addClass("infReqS");
    }
}

function isPepSelected() {
    if ($("#chkPepSi").is(":checked")) {
        return true;
    }
    return false;
}

/* #endregion cambia objeto */


/* #region curp*/
function validarCurp(campo) {
    if (!valIsNullOrEmpty($(campo).val())) {
        if ($(campo).val().length < 18) {
            showMessageError('.navbar', 'La longitud debe ser 18 carácteres', 0);
            return false;
        } else {
            if (curpValida($(campo).val().toUpperCase())) {
                showMessageSuccess('.navbar', 'CURP con formato correcto', 0);
                return true;
            } else {
                showMessageError('.navbar', 'El formato de CURP no es valido', 0);
            }
        }
        $(campo).addClass('invalid');
        $(campo).parent().append(
            "<div class=\"alert alert-danger\" role=\"alert\"> <span class=\"glyphicon glyphicon-ban-circle\"></span>" +
            " " + $('#txtFormatoCurp').val() + "</div>");
        return false;
    }
    return true;
}

function curpValida(curp) {
    var re = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0\d|1[0-2])(?:[0-2]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
        validado = curp
        .match(re);

    if (!validado) /* Coincide con el formato general? */
        return false;

    /* Validar que coincida el dígito verificador */
    function digitoVerificador(curp17) {
        /* Fuente https://consultas.curp.gob.mx/CurpSP/ */
        var diccionario = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",
            lngSuma = 0.0,
            lngDigito = 0.0;
        for (var i = 0; i < 17; i++)
            lngSuma = lngSuma + diccionario.indexOf(curp17.charAt(i)) * (18 - i);
        lngDigito = 10 - lngSuma % 10;
        if (lngDigito == 10)
            return 0;
        return lngDigito;
    }
    if (validado[2] != digitoVerificador(validado[1]))
        return false;

    return true; /* Validado */
}
/* #endregion curp */

/* #region  continuar chekbox */
$("#chkBxLeido").click(function() {
    eliminaErrores();
    showLoader();
    validaReqPep();

    eliminaRequeridos();
    solicitaRequeridosPB();

    var errores = false;
    if ($(this).is(':checked')) {
        errores = validaCheks() ? true : errores;
        errores = validaInputText() ? true : errores;
        errores = validaInputSelect() ? true : errores;

        if (errores) {
            $(this).prop("checked", false);
            $("#frmPaso4 input").prop("disabled", false);
            $(".bqOri").prop("disabled", true);

            if (valIsNullOrEmpty($("#mpldmRFC").val())) {
                $("#mpldmRFC").prop("disabled", false);
            }

            showMessageError('.navbar', 'Hacen falta campos obligatorios', 0);
            hideLoader();
        } else {
            $("#frmPaso4 input").not(this).prop("disabled", true);
            validaPrimaMax492();
            hideLoader();
        }
    } else {
        $("#frmPaso4 input").prop("disabled", false);
        $(".bqOri").prop("disabled", true);
        $('#btnsEmision').hide();
        $('#btnsEmisionArt492').hide();
        hideLoader();
    }
});

function validaCheks() {
    var error = false;
    $.each($("#frmPaso4 .card-body .valCheck"), function(i, divCheck) {
        if ($(divCheck).is(":visible")) {
            var seleccionado = false;
            $.each($(divCheck).find(".form-check-input"), function(j, check) {
                if ($(check).is(":checked")) {
                    seleccionado = true;
                    return false;
                }
            });
            if (!seleccionado) {
                $(divCheck).find(".form-check-input").addClass('is-invalid');
                $(divCheck).append(
                    "<div class=\"alert alert-danger\" role=\"alert\"> <span class=\"glyphicon glyphicon-ban-circle\"></span>" +
                    " " + es.msj.campoRequerido + "</div>");
                error = true;
            }
        }
    });
    return error;
}

function validaInputText() {
    var error = false;
    $.each($(".infReq"), function(i, inp) {
        if ($(inp).is(":visible")) {
            if (valIsNullOrEmpty($(inp).val())) {
                $(inp).addClass('invalid');
                $(inp).parent().append(
                    "<div class=\"alert alert-danger\" role=\"alert\"> <span class=\"glyphicon glyphicon-ban-circle\"></span>" +
                    " " + es.msj.campoRequerido + "</div>");
                error = true;
            }
        }
    });
    return error;
}


function validaInputSelect() {
    var error = false;
    $.each($(":input.infReqS"), function(i, inp) {
        /*var inpHermano = $("#mpldmCargoPuesto").siblings(":input.select-dropdown");*/
        var inpHermano = $(inp).siblings(":input.select-dropdown");
        if ($(inpHermano).is(":visible")) {
            if ($(this).val() == "-1") {
                $(inpHermano).addClass('invalid');
                $(inp).parent().append(
                    "<div class=\"alert alert-danger\" role=\"alert\"> <span class=\"glyphicon glyphicon-ban-circle\"></span>" +
                    " " + es.msj.campoRequerido + "</div>");
                error = true;
            }
        }
    });
    return error;
}

/* #endregion continuar chekbox*/

/* #region emision proceso normal */
$("#btnContEmision").click(function(e) {
    e.preventDefault();
    showLoader();
    llenaEmisionData();
    genEmision(0);
});

function generaModalEmision(emi) {
    llenaInfoModalPoliza(emi);
    $('#modalGenerarPoliza').modal({
        show: true
    });
    if (emi.code == 4) {
        showMessageError('#modalGenerarPoliza', (emi.msg), 0);
    }
    hideLoader();
}

function llenaInfoModalPoliza(json) {
    $('.listaCorreos li').remove();
    $('#txtModalPolizaNumeroPoliza').text(validaKeyJson(json, 'numeroPoliza'));
    $('#txtModalPolizaCertificado').text(validaKeyJson(json, 'certificado'));
    $('#txtModalPolizaAsegurado').text(validaKeyJson(json, 'asegurado'));
    $('#txtModalPolizaAgente').val(validaKeyJson(json, 'agente'));

    $('#txtModalPolizaVigenciaDe').text(stringToDate(validaKeyJson(json, 'vigencia.inicio')));
    $('#txtModalPolizaVigenciaAl').text(stringToDate(validaKeyJson(json, 'vigencia.fin')));
    $('#divDescargarArchivos').html();

    $('#txtModalPolizaTotalUbicaciones').text(validaKeyJson(json, 'totalUbicaciones'));
    $('#txtModalPolizaMoneda').text(validaKeyJson(json, 'moneda'));
    $('#txtModalPolizaMoneda').text(validaKeyJson(json, 'moneda'));
    $('#txtModalPolizaFormaPago').text(validaKeyJson(json, 'formaPago'));
    $('#txtModalPolizaPrimaNeta').text(validaKeyJson(json, 'primaNeta'));
    $('#txtModalPolizaRecargoPago').text(validaKeyJson(json, 'recargo'));
    $('#txtModalPolizaGastosExpedicion').text(validaKeyJson(json, 'gastos'));
    $('#txtModalPolizaIva').text(validaKeyJson(json, 'iva'));
    $('#txtModalPolizaTotal').text(validaKeyJson(json, 'total'));
    $('#tablaArchivosPoliza tbody').empty();
    if (!valIsNullOrEmpty($('#txtEmailUser').val())) {
        $('.modal .listaCorreos')
            .append(
                $('<li email="' +
                	Base64.decode( $('#txtEmailUser').val() ) +
                    '" ><button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                    Base64.decode( $('#txtEmailUser').val() ) + '</li>'));
    }

    if (valIsNullOrEmpty(validaKeyJson(json, 'archivos'))) {
        $('.selectCheckImput').prop('checked', false);
        $('.selectCheckImput').prop("disabled", true);
        $('#btnDescargarArchivos').prop("disabled", true);
        $('#polizaBtnEnviar').prop("disabled", true);
    } else {
        $('.selectCheckImput').prop('checked', true);
        $('.selectCheckImput').prop("disabled", false);
        $('#btnDescargarArchivos').prop("disabled", false);
        validaBtnEnviar();
        $.each(json.archivos, function(i, a) {
            var chekbox = '<div class="form-check"> ' + '<input class="form-check-inpu chekArchivos" name="' + a.nombre +
                "-" + a.extension + '" idCarpeta="' + a.idCarpeta + '" idDocumento="' + a.idDocumento +
                '" idCatalogoDetalle="' + a.idCatalogoDetalle + '" type="checkbox" id="' + a.nombre + "-" +
                a.extension + '" checked>' + '<label for="' + a.nombre + "-" + a.extension + '"></label>' +
                '</div>';

            $('#tablaArchivosPoliza tbody').append(
                $('<tr> <td> ' + chekbox + ' </td> <td>  ' + a.nombre + "." + a.extension + ' </td> <td >  ' +
                    a.tipo + ' </td> </tr>'));

            $('#divDescargarArchivos').append($('<a id="' + a.nombre + a.extension + '" />'));

        });
    }
}

function validaKeyJson(json, cadena) {
    var infoJson = '';
    var res = cadena.split(".");
    var ant = null;
    json['name']
    $.each(res, function(key, val) {
        if (key == 0) {
            infoJson = (val in json) ? eval('json.' + val) : "";
            ant = eval('json.' + val);
        } else {
            if (valIsNullOrEmpty(ant)) {
                infoJson = "";
            } else {
                infoJson = (val in ant) ? eval('ant.' + val) : "";
                ant = eval('ant.' + val);
            }
        }
    });
    return infoJson;
}

function validaBtnEnviar() {
    if ($('.listaCorreos li').length > 0) {
        $('#polizaBtnEnviar').prop("disabled", false);
        $('.msjActivarBtnEnviar').prop('hidden', true);
    } else {
        $('#polizaBtnEnviar').prop("disabled", true);
        $('.msjActivarBtnEnviar').prop('hidden', false);
    }
}

$("#modalPolizaEnviarCorreo").keyup(function(e) {
    if (valIsNullOrEmpty($(this).val())) {
        $('#btnAgregaCorreoPoliza').prop("disabled", true);
    } else {
        $('#btnAgregaCorreoPoliza').prop("disabled", false);
        eliminaErrorEmailEmision();
    }
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) {
        $('#btnAgregaCorreoPoliza').trigger('click');
    }
});

$('#btnAgregaCorreoPoliza').click(function(e) {
    var correo = $('#modalPolizaEnviarCorreo').val();
    var error = chekEmail($('#modalPolizaEnviarCorreo'));
    if ((!error) && (!valIsNullOrEmpty(correo))) {
        $('.modal .listaCorreos').append(
            $('<li email="' + correo +
                '"><button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                correo + '</li>'));
        $('#modalPolizaEnviarCorreo').val('');
        $('#listaCorreos').scrollTo('li:last');
        $('#btnAgregaCorreoPoliza').prop("disabled", true);
    }
    validaBtnEnviar();
    if (!almenosUnArchivoSeleccionado()) {
        $('#polizaBtnEnviar').prop("disabled", true);
    }
});

function validaBtnEnviar() {
    if ($('.listaCorreos li').length > 0) {
        $('#polizaBtnEnviar').prop("disabled", false);
        $('.msjActivarBtnEnviar').prop('hidden', true);
    } else {
        $('#polizaBtnEnviar').prop("disabled", true);
        $('.msjActivarBtnEnviar').prop('hidden', false);
    }
}

function almenosUnArchivoSeleccionado() {
    var seleccionado = false;
    $.each($('.modal .bodyArchivos .chekArchivos'), function(i, chek) {
        if ($(chek).is(':checked')) {
            seleccionado = true;
            return false;
        }
    });
    return seleccionado;
}

function todosArchivoSeleccionado() {
    var seleccionado = true;
    $.each($('.modal .bodyArchivos .chekArchivos'), function(i, chek) {
        if (!$(chek).is(':checked')) {
            seleccionado = false;
            return false;
        }
    });
    return seleccionado;
}

function eliminaErrorEmailEmision() {
    $("#modalPolizaEnviarCorreo").removeClass('invalid');
    $("#modalPolizaEnviarCorreo").siblings('.alert-danger').remove();
}

function chekEmail(campos) {
    var errores = false;
    $.each(campos, function(index, value) {
        if (!valIsNullOrEmpty($(value).val())) {
            if (!validateEmail($(value).val())) {
                errores = true;
                $(value).addClass('invalid');
                $(value).parent().append(
                    "<div class=\"alert alert-danger\" role=\"alert\"> <span class=\"glyphicon glyphicon-ban-circle\"></span>" +
                    " " + $('#txtFormatoEmail').val() + "</div>");
            }
        }
    });
    return errores;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

$('.modal .listaCorreos').on('click', '.close', function(e) {
    $(this).parent().remove();
    validaBtnEnviar();
});

$("#modalPolizaEnviarCorreo").focusin(function(e) {
    eliminaErrorEmailEmision();
});

$('.selectCheckImput').change(function() {
    var cheketFull = false;
    if ($(this).is(':checked')) {
        cheketFull = true;
        $('#btnDescargarArchivos').prop("disabled", false);
        $('#polizaBtnEnviar').prop("disabled", false);
        validaBtnEnviar();
    } else {
        cheketFull = false;
        $('#btnDescargarArchivos').prop("disabled", true);
        $('#polizaBtnEnviar').prop("disabled", true);
    }
    var y = $('.modal .bodyArchivos input[type=checkbox]');
    $.each(y, function(i, chek) {
        $(chek).prop('checked', cheketFull);
    });
});

$('.modal .bodyArchivos').on('change', '.chekArchivos', function(e) {
    var algunoSelect = almenosUnArchivoSeleccionado();
    var todosSelect = todosArchivoSeleccionado();
    if (!algunoSelect) {
        $('.selectCheckImput').prop('checked', false);
        $('#btnDescargarArchivos').prop("disabled", true);
        $('#polizaBtnEnviar').prop("disabled", true);
    } else {
        $('#btnDescargarArchivos').prop("disabled", false);
        $('#polizaBtnEnviar').prop("disabled", false);
        validaBtnEnviar();
    }
    if (todosSelect) {
        $('.selectCheckImput').prop('checked', true);
        $('#btnDescargarArchivos').prop("disabled", false);
        $('#polizaBtnEnviar').prop("disabled", false);
        validaBtnEnviar();
    } else {
        $('.selectCheckImput').prop('checked', false);
    }
});

$('#modalGenerarPoliza').on('hidden.bs.modal', function() {
    window.scrollTo(0, 0);
    $('#inpPantallaActual').text('1');
    goToHome();
    /*goToPage(seleccionaVentana());*/
    /*var url = new URL(window.location.href);
    window.location.href = url.origin + url.pathname;*/
});

$('#btnDescargarArchivos').click(function(e) {
    showLoader();
    recuperaDocumentosEmision(null);
});

$('#polizaBtnEnviar').click(function(e) {
    showLoader();
    var emailsList = $('#listaCorreos li');
    var emailsTot = "";
    $.each(emailsList, function(i, emlis) {
        if (i > 0) {
            emailsTot += ",";
        }
        emailsTot += $(emlis).attr('email');
    });
    recuperaDocumentosEmision(emailsTot);
});

function jsonDocumentosEmision() {
    var cheks = $('#modalGenerarPoliza .bodyArchivos input[type=checkbox]');
    var listaDocumentos = '';
    if ($('.selectCheckImput').is(':checked')) {
        $.each(cheks, function(i, chek) {
            var ids = $(chek).attr('id');
            if (i > 0) {
                listaDocumentos += ",";
            }
            listaDocumentos += '{"idCarpeta" : ' + $(chek).attr('idCarpeta') + ', "idDocumento" : ' +
                $(chek).attr('idDocumento') + ', "idCatalogoDetalle" : ' +
                $(chek).attr('idCatalogoDetalle') + ', "documento" : "", "nombre" : "", "extension" : "" }';
        });
    } else {
        $.each(cheks, function(i, chek) {
            if ($(chek).is(':checked')) {
                var ids = $(chek).attr('id');
                if (!valIsNullOrEmpty(listaDocumentos)) {
                    listaDocumentos += ",";
                }
                listaDocumentos += '{"idCarpeta" : ' + $(chek).attr('idCarpeta') + ', "idDocumento" : ' +
                    $(chek).attr('idDocumento') + ', "idCatalogoDetalle" : ' +
                    $(chek).attr('idCatalogoDetalle') +
                    ', "documento" : "", "nombre" : "", "extension" : "" }';
            }
        });
    }
    return listaDocumentos;
}

function recuperaDocumentosEmision(emails) {
    $.post($('#txtJSGetDocsEmision').val(), {
        infoDocs: jsonDocumentosEmision(),
        listaEmails: emails,
        cliente: $('#txtModalPolizaAsegurado').text(),
        poliza: $('#txtModalPolizaNumeroPoliza').text(),
        totUbica: $('#txtModalPolizaTotalUbicaciones').text(),
        moneda: $('#txtModalPolizaMoneda').text(),
        certificado: $('#txtModalPolizaCertificado').text(),
        vigencia: $('#txtModalPolizaVigenciaAl').text() + ' al ' + $('#txtModalPolizaVigenciaAl').text(),
        formaPago: $('#txtModalPolizaFormaPago').text(),
        primaNeta: '$' + $('#txtModalPolizaPrimaNeta').text(),
        recargo: '$' + $('#txtModalPolizaRecargoPago').text(),
        gasto: '$' + $('#txtModalPolizaGastosExpedicion').text(),
        iva: '$' + $('#txtModalPolizaIva').text(),
        prima: '$' + $('#txtModalPolizaTotal').text(),
        folio: infCotiJson.folio,
        agente: $('#txtModalPolizaAgente').val(),
        renovacion : (infCotiJson.modo == modo.RENOVACION_AUTOMATICA) ? 1 : 0
    }).done(function(data) {
        sessionExtend();
        var respuestaJson = JSON.parse(data);
        if (respuestaJson.code >= 0) {
            if (emails == null) {
                $.each(respuestaJson.archivos, function(i, archivo) {


                    if (detectIEEdge()) {
                        fileAux = 'data:application/octet-stream;base64,' + archivo.documento;
                        var dlnk = document.getElementById('dwnldLnk');
                        dlnk.href = fileAux;
                        dlnk.download = archivo.nombre + '.' + archivo.extension;
                        location.href = document.getElementById("dwnldLnk").href;

                    } else {

                        downloadDocument(archivo.documento, archivo.nombre + '.' + archivo.extension);
                    }

                });
            } else {
                showMessageSuccess('#modalGenerarPoliza', "Correo(s) enviado(s)", 0);
            }
        } else {
            showMessageError('#modalGenerarPoliza', respuestaJson.msg, 0);
        }
    }).fail(function() {
        showMessageError('#modalGenerarPoliza', "Error al consultar la informacion", 0);
    }).always(function() {
        hideLoader();
    });
}

$('#btnRegresarPaso3').click(function(e) {
    e.preventDefault();
    goToPage(enlace.PASO3);

});


$("#frmPaso4 .card-body .form-check-input").click(function() {
    console.log($(this).prop("id"));
    var divContenedor = $(this).closest(".check-valid");
    console.log($(divContenedor).prop("id"));
    console.log($(divContenedor).find(".form-check-input"));
    if ($(this).is(':checked')) {
        $(divContenedor).find(".form-check-input").not(this).prop('checked', false);
    } else {
        $(divContenedor).find(".form-check-input").not(this).prop('checked', true);
    }
});
/* #endregion emision proceso normal */

/**
 * -----------------ojoooooooo
 * validar que no se bloque rfc vacio
 */
$(".frmPaso4 #mpldmRFC").blur(function() {
    var rfc = $(this).val().trim();
    showLoader();
    if (rfc.length > 0) {

        if (rfcGenerico.indexOf(rfc) < 0) {
            $.post($('#txtJSSearchPersonaUrl').val(), {
                term: $(this).val(),
                tipo: 3
            }).done(
                function(data) {
                    hideLoader();
                    if (!valIsNullOrEmpty(data)) {
                        var response = JSON.parse(data);
                        if (response.length > 0) {
                            $("#modalRFCExistente #mdlRfcP4Inf").text(
                                response[0].nombre + " " + response[0].appPaterno + " " +
                                response[0].appMaterno);
                            $("#modalRFCExistente #mdlRfcBtnSi").attr("codigo", response[0].codigo);

                            $('#modalRFCExistente').modal({
                                show: true,
                                backdrop: 'static',
                                keyboard: false
                            });
                        }
                    }

                });
        } else {
            hideLoader();
            showMessageSuccess('.navbar', 'RFC Generico', 0);
        }
    } else {
        hideLoader();
        showMessageError('.navbar', 'RFC Vacio', 0);
    }
});


var rfcGenerico = ["XAXX010101000", "XEXX010101000"];


$("#modalRFCExistente #mdlRfcBtnSi").click(function() {
    showLoader();
    $.post(CambiarClienteURL, {
        cotizacion: $('#txtCotizacion').val(),
        version: $('#txtVersion').val(),
        codCliente: $(this).attr("codigo")
    }).done(function(data) {
        console.log(data);
        var response = JSON.parse(data);
        if (response.code == 0) {
            $(".frmPaso4 .form-check-input").prop('checked', false);
            $('#btnSolEmision').trigger("click");
            $('#modalRFCExistente').modal('hide');

        } else {
            showMessageError('.navbar', response.msg, 0);
        }
    });

});

$("#modalRFCExistente #mdlRfcBtnNo").click(function() {
    $("#mpldmRFC").val('');
    $("#mpldmRFC").focus();
    $('#modalRFCExistente').modal('hide');

});

function setBase64(){
	Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};
}