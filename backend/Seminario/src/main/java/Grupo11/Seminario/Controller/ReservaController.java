package Grupo11.Seminario.Controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import Grupo11.Seminario.DTO.PagoMercadoPagoDTO;
import Grupo11.Seminario.DTO.ReservaDTO;
import Grupo11.Seminario.Entities.Cancha;
import Grupo11.Seminario.Entities.Cuenta;
import Grupo11.Seminario.Entities.Empleado;
import Grupo11.Seminario.Entities.Pago;
import Grupo11.Seminario.Entities.Reserva;
import Grupo11.Seminario.Entities.Turno;
import Grupo11.Seminario.Entities.Enum.EstadoReserva;
import Grupo11.Seminario.Service.ReservaService;

@RestController
@RequestMapping(path = "/private/reservas")
public class ReservaController {

    @Autowired
    ReservaService reserva_service;
    
    @PostMapping(path = "/reservar_turno/{id_jugador}")
    public ResponseEntity<?> reservar_turno
    (@RequestBody ReservaDTO reservaDTO, @PathVariable Integer id_jugador) throws JsonMappingException, JsonProcessingException{
        
        // Se verifica que el numero de cancha exista
        if (reserva_service.verificar_numero_cancha(reservaDTO.getNumero_cancha())){

            // Se verifica que exista el jugador con dicho Id
            if (reserva_service.existe_jugador(id_jugador)){
                // Se crea la Reserva
                Reserva reserva = new Reserva();

                // Se verifica que la reserva la hizo un empleado
                if (reservaDTO.getId_empleado() != null){
                    // Se verifica que exista el empleado con dicho Id
                    if (reserva_service.existe_empleado(reservaDTO.getId_empleado())){
                        Empleado empleado = reserva_service.buscar_empleado(reservaDTO.getId_empleado());
                        reserva.setEmpleado(empleado);
                    }else{
                        return ResponseEntity.badRequest().body("No se encontro el empleado");
                    }
                }
                ResponseEntity<String> reponse = reserva_service.buscar_pago(reservaDTO.getId_mp());
                if (reserva_service.validar_pago(reponse)) {
                    // Se busca la cancha
                    Cancha cancha = reserva_service.buscar_cancha(reservaDTO.getNumero_cancha());

                    // Se crea el Turno
                    Turno turno = new Turno();
                    turno.setCancha(cancha);
                    turno.setFecha(reservaDTO.getFecha());
                    turno.setHorarioInicio(reservaDTO.getHorario_inicio());
                    turno.setHorario_fin(reservaDTO.getHorario_fin());

                    // Se setea el Jugador
                    reserva.setJugador(reserva_service.buscar_jugador(id_jugador));

                    reserva.setTurno(turno);
                    reserva.setFecha(LocalDate.now());
                    reserva.setHora(LocalTime.now());
                    reserva.setCantidad_paletas(reservaDTO.getCantidad_paletas());
                    reserva.setCantidad_pelotas(reservaDTO.getCantidad_pelotas());
                    reserva.setPrecio(reserva_service.calcular_precio_reserva(
                        reserva.getCantidad_pelotas(), 
                        reserva.getCantidad_paletas(), 
                        reserva_service.calcular_medias_horas(reservaDTO.getHorario_inicio(), reservaDTO.getHorario_fin())));
                    PagoMercadoPagoDTO pago_mercado_pagoDTO =reserva_service.pagar(reponse);
                    Pago pago = new Pago();
                    pago.setFecha(pago_mercado_pagoDTO.getFecha());
                    pago.setHora(pago_mercado_pagoDTO.getHora());
                    pago.setMetodo(pago_mercado_pagoDTO.getMetodo_pago());
                    pago.setMotivo(pago_mercado_pagoDTO.getMotivo());

                    pago.setDescuento(reserva_service.descuento(reserva.getJugador().getSocio()) * reserva.getPrecio());
                    if (reservaDTO.getSenia()) {
                        pago.setMonto((reserva_service.calcular_monto_pago(reserva.getPrecio() - pago.getDescuento())));
                        reserva.setEstado(EstadoReserva.Seniada);
                    }else{
                        pago.setMonto(reserva.getPrecio() - pago.getDescuento());
                        reserva.setEstado(EstadoReserva.Pagada);
                    }

                    Cuenta cuenta = new Cuenta();
                    cuenta.setNombre(pago_mercado_pagoDTO.getNombre_pagador());
                    cuenta.setApellido(pago_mercado_pagoDTO.getApellido_pagador());
                    cuenta.setEmail(pago_mercado_pagoDTO.getEmail_pagador());
                    cuenta.setTipo_identificacion(pago_mercado_pagoDTO.getTipo_identificacion());
                    cuenta.setNumero_identificacion(pago_mercado_pagoDTO.getNumero_identificacion());

                    pago.setCuenta(cuenta);
                    pago.setEstado(pago_mercado_pagoDTO.getEstado());
                    
                    List <Pago> pagos = new ArrayList<>();
                    pagos.add(pago);

                    reserva.setPagos(pagos);
                    

                    // Se guarda la Reserva y el Turno
                    reserva_service.guardar_reserva(reserva);
                    
                    return ResponseEntity.ok().body(reservaDTO);
                }
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontro el pago");
            }
            return ResponseEntity.badRequest().body("No se encontro el jugador");
        }
        return ResponseEntity.badRequest().body("No se encontro la cancha con ese numero");
    }
}
