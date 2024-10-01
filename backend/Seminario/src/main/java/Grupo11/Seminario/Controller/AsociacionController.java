package Grupo11.Seminario.Controller;

import java.time.LocalDate;
import java.time.LocalTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import Grupo11.Seminario.DTO.AsociacionDTO;
import Grupo11.Seminario.DTO.PagoMercadoPagoDTO;
import Grupo11.Seminario.Entities.Asociacion;
import Grupo11.Seminario.Entities.ConfiguracionGeneral;
import Grupo11.Seminario.Entities.Cuenta;
import Grupo11.Seminario.Entities.Empleado;
import Grupo11.Seminario.Entities.Jugador;
import Grupo11.Seminario.Entities.Pago;
import Grupo11.Seminario.Service.AsociacionService;
import Grupo11.Seminario.Service.ConfiguracionGeneralService;
import Grupo11.Seminario.Service.PagoService;

@RestController
@RequestMapping(path = "/private")
public class AsociacionController {

    @Autowired
    AsociacionService asociacion_service;
    @Autowired
    PagoService pago_service;
    @Autowired
    ConfiguracionGeneralService configuracion_general_service;
    
    @PutMapping(path = "/asociar_jugador/{id_duenio}")
    public ResponseEntity<?> asociar_jugador(@PathVariable Integer id_duenio, @RequestBody AsociacionDTO asociacionDTO) throws JsonMappingException, JsonProcessingException{
        
        // Se busca si existe el empleado
        if (asociacion_service.existe_empleado(id_duenio)){

            // Se verifica que sea un dueño
            if (asociacion_service.verificar_duenio(id_duenio)) {

                if (asociacion_service.existe_jugador(asociacionDTO.getId_jugador())) {
                    // Se verifica que el jugador no este asociado
                    if (asociacion_service.verificar_asociacion(asociacionDTO.getId_jugador())) {
                        ResponseEntity<String> response = pago_service.buscar_pago(asociacionDTO.getId_pago());

                        // Se valida que este realizado el pago
                        if (pago_service.validar_pago(response)) {
                            Jugador jugador = asociacion_service.buscar_jugador(asociacionDTO.getId_jugador());
                            jugador.setSocio(true);

                            Empleado duenio = asociacion_service.buscar_empleado(id_duenio);
                            ConfiguracionGeneral configuracion_general = configuracion_general_service.get_configuracion_general();
                            PagoMercadoPagoDTO pago_mpDTO = pago_service.pagar(response);
    
                            Cuenta cuenta = new Cuenta();
                            cuenta.setEmail(pago_mpDTO.getEmail_pagador());
                            cuenta.setApellido(pago_mpDTO.getApellido_pagador());
                            cuenta.setNombre(pago_mpDTO.getNombre_pagador());
                            cuenta.setTipo_identificacion(pago_mpDTO.getTipo_identificacion());
                            cuenta.setNumero_identificacion(pago_mpDTO.getNumero_identificacion());
    
                            Pago pago = new Pago();
                            pago.setFecha(pago_mpDTO.getFecha());
                            pago.setHora(pago_mpDTO.getHora());
                            pago.setMetodo(pago_mpDTO.getMetodo_pago());
                            pago.setMotivo(pago_mpDTO.getMotivo());
                            pago.setEstado(pago_mpDTO.getEstado());
                            pago.setCuenta(cuenta);
                            pago.setMonto(configuracion_general.getMonto_asociacion());
                            pago.setDescuento(0f);
    
                            Asociacion asociacion = new Asociacion();
                            asociacion.setFecha(LocalDate.now());
                            asociacion.setHora(LocalTime.now());
                            asociacion.setPrecio(configuracion_general.getMonto_asociacion());
    
                            asociacion.setJugador(jugador);
                            asociacion.setDuenio(duenio);
                            asociacion.setPago(pago);
    
                            asociacion_service.guardar_asociacion(asociacion);
                            return ResponseEntity.ok().body("Asociacion Exitosa");
                        }   
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontro el pago");
                    }
                    return ResponseEntity.badRequest().body("El jugador ya es un socio");
                }
                return ResponseEntity.badRequest().body("No existe el jugador");
            } 
            return ResponseEntity.badRequest().body("No tiene permisos para esta accion");  
        }
        return ResponseEntity.badRequest().body("No existe el empleado");
    }

}
