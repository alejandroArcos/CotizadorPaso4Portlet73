/**
 * 
 */
package com.tokio.pa.cotizadorpaso4portlet73.bean;

/**
 * @author jonathanfviverosmoreno
 *
 */
public class LogVoBo {
	int p_cotizacion;
	int p_version;
	String p_usuario;
	int p_idpersona;
	String p_tipoVOBO;
	String p_resultadoQeQ;
	String p_estatus;
	
	public int getP_cotizacion() {
		return p_cotizacion;
	}
	public void setP_cotizacion(int p_cotizacion) {
		this.p_cotizacion = p_cotizacion;
	}
	public int getP_version() {
		return p_version;
	}
	public void setP_version(int p_version) {
		this.p_version = p_version;
	}
	public String getP_usuario() {
		return p_usuario;
	}
	public void setP_usuario(String p_usuario) {
		this.p_usuario = p_usuario;
	}
	public int getP_idpersona() {
		return p_idpersona;
	}
	public void setP_idpersona(int p_idpersona) {
		this.p_idpersona = p_idpersona;
	}
	public String getP_tipoVOBO() {
		return p_tipoVOBO;
	}
	public void setP_tipoVOBO(String p_tipoVOBO) {
		this.p_tipoVOBO = p_tipoVOBO;
	}
	public String getP_resultadoQeQ() {
		return p_resultadoQeQ;
	}
	public void setP_resultadoQeQ(String p_resultadoQeQ) {
		this.p_resultadoQeQ = p_resultadoQeQ;
	}
	public String getP_estatus() {
		return p_estatus;
	}
	public void setP_estatus(String p_estatus) {
		this.p_estatus = p_estatus;
	}
	@Override
	public String toString() {
		return "LogVoBo [p_cotizacion=" + p_cotizacion + ", p_version=" + p_version + ", p_usuario="
				+ p_usuario + ", p_idpersona=" + p_idpersona + ", p_tipoVOBO=" + p_tipoVOBO
				+ ", p_resultadoQeQ=" + p_resultadoQeQ + ", p_estatus=" + p_estatus + "]";
	}
	
	
}


