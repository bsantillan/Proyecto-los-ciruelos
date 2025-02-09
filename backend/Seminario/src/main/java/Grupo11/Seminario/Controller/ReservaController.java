package Grupo11.Seminario.Controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import Grupo11.Seminario.DTO.PagoMercadoPagoDTO;
import Grupo11.Seminario.DTO.ReservaDTO;
import Grupo11.Seminario.DTO.TurnoDTO;
import Grupo11.Seminario.Entities.Cancha;
import Grupo11.Seminario.Entities.Cuenta;
import Grupo11.Seminario.Entities.Empleado;
import Grupo11.Seminario.Entities.Jugador;
import Grupo11.Seminario.Entities.Pago;
import Grupo11.Seminario.Entities.Reserva;
import Grupo11.Seminario.Entities.Turno;
import Grupo11.Seminario.Entities.Enum.EstadoReserva;
import Grupo11.Seminario.Entities.Enum.EstadoTurno;
import Grupo11.Seminario.Service.ReservaService;
import Grupo11.Seminario.Service.TurnoService;
import Grupo11.Seminario.Service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(path = "/private")
public class ReservaController {

    @Autowired
    ReservaService reserva_service;
    @Autowired
    UsuarioService usuarioService;
    @Autowired
    TurnoService turnoService;

    @PutMapping(path = "/bloquear/turno")
    ResponseEntity<String> bloquear_turno(HttpServletRequest request, @RequestBody TurnoDTO turnoDTO){
        String email = (String) request.getAttribute("email");
        Integer id_accionar = usuarioService.buscar_usuario(email).get().getId();

        Turno turno = new Turno();
        turno.setCancha(reserva_service.buscar_cancha(turnoDTO.getId_cancha()));
        turno.setFecha(turnoDTO.getFecha());
        turno.setHorarioInicio(turnoDTO.getHorario_inicio_ocupado());
        turno.setHorario_fin(turnoDTO.getHorario_fin_ocupado());
        turno.setEstado(EstadoTurno.Bloqueado);
        turno.setHorarioBloqueo(LocalTime.now());
        turnoService.guardar_turno(turno);
        return ResponseEntity.ok("Se bloqueo el turno");
    }
    
    @PostMapping(path = "/reservas/reservar_turno")
    public ResponseEntity<?> reservar_turno
    (HttpServletRequest request, @RequestBody ReservaDTO reservaDTO) throws JsonMappingException, JsonProcessingException{
        
        Integer id_jugador=0;
        Integer id_empleado=0;

        String email = (String) request.getAttribute("email");
    
        Integer id_accionar = usuarioService.buscar_usuario(email).get().getId();

        // Se verifica que el numero de cancha exista
        if (reserva_service.verificar_numero_cancha(reservaDTO.getNumero_cancha())){

            // Se verifica que exista el jugador con dicho Id
            if (reserva_service.existe_jugador(id_accionar) | reserva_service.existe_empleado(id_accionar)){

                // Se crea la Reserva
                Reserva reserva = new Reserva();

                if (reserva_service.existe_jugador(id_accionar)) {
                    id_jugador = id_accionar;
                    id_empleado = null;

                    Jugador jugador = reserva_service.buscar_jugador(id_jugador);
                    reserva.setJugador(jugador);

                }else{
                    id_empleado = id_accionar;
                    id_jugador = reservaDTO.getId_reservador();

                    Empleado empleado = reserva_service.buscar_empleado(id_empleado);
                    reserva.setEmpleado(empleado);

                    if (id_jugador!=null){
                        // Se verifica que exista el jugador con dicho Id
                        if (reserva_service.existe_jugador(id_jugador)){
                            Jugador jugador = reserva_service.buscar_jugador(id_jugador);
                            reserva.setJugador(jugador);
                        }else{
                            return ResponseEntity.badRequest().body("No se encontro el jugador");
                        }
                    }else{
                        return ResponseEntity.badRequest().body("No ingreso el id del jugador de la reserva");
                    }
                }
                ResponseEntity<String> reponse = reserva_service.buscar_pago(reservaDTO.getId_mp());
                if (reponse.getStatusCode() == HttpStatus.OK) {
                    // Se busca la cancha
                    Cancha cancha = reserva_service.buscar_cancha(reservaDTO.getNumero_cancha());

                    // Se crea el Turno
                    Turno turno = new Turno();
                    turno.setCancha(cancha);
                    turno.setFecha(reservaDTO.getFecha());
                    turno.setHorarioInicio(reservaDTO.getHorario_inicio());
                    turno.setHorario_fin(reservaDTO.getHorario_fin());
                    turno.setEstado(EstadoTurno.Reservado);

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
            return ResponseEntity.badRequest().body("No se encontro el jugador o al empleado");
        }
        return ResponseEntity.badRequest().body("No se encontro la cancha con ese numero");
    }
}
