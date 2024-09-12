package Grupo11.Seminario.Controller;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Grupo11.Seminario.DTO.ReservaDTO;
import Grupo11.Seminario.Entities.Cancha;
import Grupo11.Seminario.Entities.Empleado;
import Grupo11.Seminario.Entities.Reserva;
import Grupo11.Seminario.Entities.Turno;
import Grupo11.Seminario.Service.RegistroService;
import Grupo11.Seminario.Service.ReservaService;

@RestController
@RequestMapping(path = "/private/reservas")
public class ReservaController {

    @Autowired
    ReservaService reserva_service;
    @Autowired
    RegistroService registro_service;
    
    @PostMapping(path = "/reservar_turno/{id_jugador}")
    public ResponseEntity<?> reservar_turno
    (@RequestBody ReservaDTO reservaDTO, @PathVariable Integer id_jugador){
        
        // Se verifica que el numero de cancha exista
        if (reserva_service.verificar_numero_cancha(reservaDTO.getNumero_cancha())){

            // Se verifica que exista el jugador con dicho Id
            if (registro_service.existe_jugador(id_jugador)){

                // Se busca la cancha
                Cancha cancha = reserva_service.buscar_cancha(reservaDTO.getNumero_cancha());

                // Se crea el Turno
                Turno turno = new Turno();
                turno.setCancha(cancha);
                turno.setFecha(reservaDTO.getFecha());
                turno.setHorario_inicio(reservaDTO.getHorario_inicio());
                turno.setHorario_fin(reservaDTO.getHorario_fin());

                // Se crea la Reserva
                Reserva reserva = new Reserva();
                reserva.setTurno(turno);
                reserva.setPrecio(reservaDTO.getPrecio());
                reserva.setFecha(LocalDate.now());
                reserva.setHora(LocalTime.now());
                reserva.setCantidad_paletas(reservaDTO.getCantidad_paletas());
                reserva.setCantidad_pelotas(reservaDTO.getCantidad_pelotas());

                // Se setea el Jugador
                reserva.setJugador(registro_service.buscar_jugador(id_jugador));

                // Se verifica que la reserva la hizo un empleado
                if (reservaDTO.getId_empleado() != null){
                    // Se verifica que exista el empleado con dicho Id
                    if (registro_service.existe_empleado(reservaDTO.getId_empleado())){
                        Empleado empleado = registro_service.buscar_empleado(reservaDTO.getId_empleado());
                        reserva.setEmpleado(empleado);
                    }else{
                        return ResponseEntity.badRequest().body("No se encontro el empleado");
                    }
                }
                // Se guarda la Reserva y el Turno
                reserva_service.guardar_reserva(reserva);
                return ResponseEntity.ok().body(reservaDTO);
            }
            return ResponseEntity.badRequest().body("No se encontro el jugador");
        }
        return ResponseEntity.badRequest().body("No se encontro la cancha con ese numero");
    }
}
