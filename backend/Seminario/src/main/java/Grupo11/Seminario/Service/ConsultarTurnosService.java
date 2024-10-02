package Grupo11.Seminario.Service;

import java.util.List;
import java.time.Duration;
import java.time.LocalTime;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Grupo11.Seminario.DTO.TurnoDTO;
import Grupo11.Seminario.Entities.Cancha;
import Grupo11.Seminario.Entities.ConfiguracionGeneral;
import Grupo11.Seminario.Entities.Turno;
import Grupo11.Seminario.Repository.ICanchaRepository;
import Grupo11.Seminario.Repository.IDiaAperturaRepository;
import Grupo11.Seminario.Repository.ITurnoRepository;

@Service
@Transactional
public class ConsultarTurnosService {
    
    @Autowired
    ITurnoRepository i_turno_repository;
    @Autowired 
    ICanchaRepository i_cancha_repository;
    @Autowired
    IDiaAperturaRepository i_dia_apertura_repository;
    @Autowired
    ConfiguracionGeneralService configuracion_general_service;

    public List<TurnoDTO> obtener_turnos_ocupados(){
        List<TurnoDTO> turnosDTO = new ArrayList<>();
        List<Cancha> canchas = (List<Cancha>) i_cancha_repository.findAll();
        ConfiguracionGeneral configuracion_general = configuracion_general_service.get_configuracion_general();

        // Iteramos por cada cancha
        for (Cancha cancha: canchas){
            // Obtenemos los turnos por cada cancha, ordenados por fecha y por horario de inicio
            List<Turno> turnos_por_cancha = i_turno_repository.findByCanchaOrderByFechaAscHorarioInicioAsc(cancha);
            
            // Revisar los espacios entre turnos ocupados
            for (int i = 0; i < turnos_por_cancha.size(); i++) {
                Turno turno_actual = turnos_por_cancha.get(i);
                turnosDTO.add(new TurnoDTO(
                cancha.getId(),
                turno_actual.getFecha(),
                turno_actual.getHorarioInicio(),
                turno_actual.getHorario_fin()
                ));

                // Ver si hay un espacio entre este turno y el siguiente
                if (i < turnos_por_cancha.size() - 1) {
                    Turno siguiente_turno = turnos_por_cancha.get(i+1);
                    LocalTime fin_turno_actual = turno_actual.getHorario_fin();
                    LocalTime inicio_siguiente_turno = siguiente_turno.getHorarioInicio();

                    // Diferencia en minutos entre los dos turnos
                    long minutos_entre_turnos = Duration.between(fin_turno_actual, inicio_siguiente_turno).toMinutes();

                    if ( minutos_entre_turnos>0 & minutos_entre_turnos<configuracion_general.getDuracion_minima_turno()) {
                        turnosDTO.add(new TurnoDTO(
                            cancha.getId(),
                            turno_actual.getFecha(),
                            fin_turno_actual,
                            inicio_siguiente_turno
                        ));
                    }
                }
            }
        }
        return turnosDTO;
    }
}
