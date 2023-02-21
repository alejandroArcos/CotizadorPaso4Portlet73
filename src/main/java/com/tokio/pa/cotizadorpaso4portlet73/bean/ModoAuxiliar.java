/**
 * 
 */
package com.tokio.pa.cotizadorpaso4portlet73.bean;

/**
 * @author jonathanfviverosmoreno
 *
 */
public enum ModoAuxiliar {
	esCotizacion (1),
	esEndoso (2),
	esRenovacion (3);
	
private int mov;
	
	private ModoAuxiliar(int mov){
		this.mov = mov;
	}
	
	public int getModoCotizacion(){
		return mov;
	}
}
