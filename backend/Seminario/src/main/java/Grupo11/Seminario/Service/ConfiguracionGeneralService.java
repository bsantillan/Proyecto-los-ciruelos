package Grupo11.Seminario.Service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Grupo11.Seminario.Entities.Configuracion_General;
import Grupo11.Seminario.Entities.Dia_Apertura;
import Grupo11.Seminario.Repository.IConfiguracionGeneral;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class ConfiguracionGeneralService {
    
    @Autowired
    IConfiguracionGeneral i_configuracion_general;

    Configuracion_General configuracion_general;

    @PostConstruct
    public void init() {
        // Se setea la configuracion con la configuracion de la BD 
        // sino existe se crea con valores por default
        this.configuracion_general = i_configuracion_general.findById(1).orElseGet(() -> {
            Configuracion_General config = new Configuracion_General();

            // Se setean todos los precios
            config.setDescuento_socio(0.0f);
            config.setMonto_paletas(0.0f);
            config.setMonto_pelotas(0.0f);
            config.setMonto_reserva(0.0f);
            config.setPorcentaje_seña(0.0f);
            
            // Se setean todas las horas
            LocalTime hora_inicio_pico = LocalTime.of(12, 0);
            LocalTime hora_fin_pico = LocalTime.of(16, 0);
            config.setHorario_inicio_pico(hora_inicio_pico);
            config.setHorario_fin_pico(hora_fin_pico);

            // Se setea la duracion maxima del turno
            config.setDuracion_maxima_turno(3);

            // Se setan los dias de apertura
            List<Dia_Apertura> dia_aperturas = new ArrayList<>(1);
            config.setDias_apertura(dia_aperturas);

            // Se guarda la configuracion general
            return i_configuracion_general.save(config);
        });
    }

}
