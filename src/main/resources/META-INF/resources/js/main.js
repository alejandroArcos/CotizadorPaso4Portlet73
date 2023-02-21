$(document).ready(function() {
    validaErrorCotizacion();

    var hoy = new Date();
    $('.datepicker2').pickadate({

        onOpen: function() {
            eliminaErrores();
        },

        format: 'yyyy-mm-dd',
        formatSubmit: 'yyyy-mm-dd',
        selectYears: 80,
        max: [hoy.getFullYear(), hoy.getMonth(), hoy.getDate()]
    });

    isFisica_Moral($('#tipoPersonaH').val());

    disableTxtCInfon();

    xmlQuienEsQuien();
	validaPersonasBloqueadasCNSF();
    validaCotizacionExpirada();
    compruebaBqOri();
    validaModo();
    setBase64();
});

function validaErrorCotizacion() {
    console.log("modo cotizacion: " + infCotiJson.modo);
    if (infCotiJson.modo == modo.ERROR.toString()) {
        console.log("REDIRECCIONAR AL PASO 1");
        infCotiJson.modo = modo.EDICION;
        regresaPaso1();
    }
}

function regresaPaso1() {
    showLoader();
    actualizainfoCot();
    var strInfCotiJson = JSON.stringify(infCotiJson);
    console.log("infCotiJson: ");
    console.log(strInfCotiJson);
    $.post(redirigeURL, {
        /*infoCot : JSON.stringify( infoCotJson ),*/
        infoCot: JSON.stringify(infCotiJson),
        paso: seleccionaVentana()
    }).done(function(data) {
        var response = JSON.parse(data);
        if (response.code == 0) {
            window.location.href = response.msg;
        } else {
            showMessageError('.navbar', response.msg, 0);
            hideLoader();
        }
    });
}

function xmlQuienEsQuien() {
    console.log("quienEsQuienStr: " + quienEsQuienStr);
    /*var response = jQuery.parseJSON(quienEsQuienStr);*/
    if (quienEsQuienStr.code == 5) {
        showMessageError('.navbar', quienEsQuienStr.msg, 0);
        error = true;
    } else {
        if (quienEsQuienStr.code == 0) {
            error = false;
            var infAux = "Se encontraron coinsidencias en Quien es Quien:";
            var entre = false;
            $.each(quienEsQuienStr.listaXML, function(i, xmlString) {
                var xml = $(xmlString.XML);
                var personas = parseInt(xml.find("num_registros").text());
                if (personas > 0) {
                    entre = true;
                    return false;
                }
            });
            if (entre) {
                varAuxiliares.isPep = true;
                $("#modalQesQ").modal("show");
            } else {
                varAuxiliares.isPep = false;
                console.log("Sin coinsidencias de QsQ");
            }
        } else {
            error = true;
            showMessageError('.navbar', "Error de conexión", 0);
        }
    }

}

function validaPersonasBloqueadasCNSF(){
	
	console.log("Lista personas bloqueadas: " + personasBloqueadasStr.ListaPersonasBloquedas);
	
	if(personasBloqueadasStr.code == 1) {
		if(personasBloqueadasStr.ListaPersonasBloquedas.length > 0) {
			varAuxiliares.isPep = true;
			$("#modalQesQ").modal("show");
		}
		else {
			console.log("Sin coinsidencias de CNSF");
		}
	}
	else {
		error = true;
		showMessageError('.navbar', personasBloqueadasStr.msg, 0);
	}
}

/**Funciones genericas**/
function eliminaErrores() {
    $(".alert-danger").remove();
    $('.invalid').removeClass('invalid');
}

function llenaInputSelectBySelector(campo, valor, desactivado) {
    $(campo + ' option[value=' + valor + ']').prop('selected', true);
    if ($(campo + ' option[value=' + valor + ']').length == 0) {
        desactivado = false;
    }
    if (desactivado) {
        $(campo).addClass("bqOri");
    }
    selectDestroyBySelector(campo, desactivado);
}

function selectDestroyBySelector(objeto, enabled) {
    $(objeto).prop("disabled", enabled);
    $(objeto).material_select('destroy');
    $(objeto).material_select();
}

function disableTxtCInfon() {
    $.each($('#frmPaso4 .infoMinRequerida input:text'), function(key, value) {
        if (!valIsNullOrEmpty($(this).val())) {
            $(this).attr('disabled', 'true');
        }
    });
}

function disableSelectCInfo() {
    $.each($('#frmPaso4 .infoMinRequerida select.infReqS'), function(key, value) {
        if ($(this).val() != -1) {
            selectDestroyBySelector('#' + $(this).attr('id'), true);
        }
        console.log("value: " + value);
    });
}
$("#frmPaso4 select").change(function() {
    eliminaErrores();
});

function valIsNullOrEmpty(value) {
    if (value === undefined) {
        return true;
    }
    value = value.trim();
    return (value == null || value == "null" || value === "");
}

function goToPage(page) {
    showLoader();
    actualizainfoCot();
    $.post(redirigeURL, {
        infoCot: JSON.stringify(infCotiJson),
        paso: page
    }).done(function(data) {
        var response = JSON.parse(data);
        if (response.code == 0) {
            window.location.href = response.msg;
        } else {
            showMessageError('.navbar', response.msg, 0);
            hideLoader();
        }
    });
}

function goToHome() {
    showLoader();
    var url = new URL(window.location.href);
    var aux = url.pathname.replace("/paso4", seleccionaVentana());
    var urlHome = window.location.origin + '/group/portal-agentes' + seleccionaVentana();
    window.location.href = url.origin + aux;
}

function seleccionaVentana() {
    if (infCotiJson.tipoCotizacion == tipoCotizacion.EMPRESARIAL) {
        return enlace.EMPRESARIAL;
    }
    return enlace.FAMILIAR;
}

function actualizainfoCot() {
    switch (infCotiJson.modo) {
        case modo.NUEVA:
            infCotiJson.modo = modo.EDICION;
            break;
        case modo.COPIA:
            infCotiJson.modo = modo.EDICION;
            break;
        case modo.ALTA_ENDOSO:
            infCotiJson.modo = modo.EDITAR_ALTA_ENDOSO;
            break;
        case modo.BAJA_ENDOSO:
            infCotiJson.modo = modo.EDITAR_BAJA_ENDOSO;
            break;
        default:
            break;
    }
}

function compruebaBqOri() {
    $.each($('.bqOri'), function(key, val) {
        if ($(val).val() == '') {
            $(val).removeClass('bqOri');
        }
    });
}

function validaModo() {
	
	var bloqCam = false;
	if(valIsNullOrEmpty(datosP1)){
		bloqCam = true;
	}else{
		axinfp1 = JSON.parse(datosP1);
		if(axinfp1.subEstado =! "CPS"){
			bloqCam = true;
		}
	}

    switch (infCotiJson.modo) {
        case (modo.CONSULTA && bloqCam):
        	$("#paso4 input, textarea, select").not("#mpldmRegimen").attr("disabled", true);
            break;
        case modo.RENOVACION_AUTOMATICA:
        	$("#titPoliza").text("Renovación de Póliza " + infCotiJson.poliza);
        	break;
        	case modo.CONSULTAR_RENOVACION_AUTOMATICA:
                $("#paso4 input, textarea, select").attr("disabled", true);
                break;
        default:

            break;
    }
}
/**Funciones genericas**/