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
            List<Dia_Apertura> dia_aperturas = new ArrayList<>();

            Dia_Apertura dia_apertura = new Dia_Apertura();
            LocalTime hora_inicio = LocalTime.of(12, 0);
            LocalTime hora_fin = LocalTime.of(16, 0);

            dia_apertura.setDia("Lunes");
            dia_apertura.setHorario_inicio(hora_inicio);
            dia_apertura.setHorario_fin(hora_fin);

            dia_aperturas.add(dia_apertura);

            dia_apertura.setHorario_inicio(hora_fin_pico);
            config.setDias_apertura(dia_aperturas);

            // Se guarda la configuracion general
            return i_configuracion_general.save(config);
        });
    }

    public Configuracion_General getConfiguracionGeneral() {
        return this.configuracion_general;
    }

    public Configuracion_General actualizarConfiguracion(Configuracion_General nueva_configuracion) {
        // Se setean todos los precios
        this.configuracion_general.setDescuento_socio(nueva_configuracion.getDescuento_socio());
        this.configuracion_general.setMonto_paletas(nueva_configuracion.getMonto_paletas());
        this.configuracion_general.setMonto_pelotas(nueva_configuracion.getMonto_pelotas());
        this.configuracion_general.setMonto_reserva(nueva_configuracion.getMonto_reserva());
        this.configuracion_general.setPorcentaje_seña(nueva_configuracion.getPorcentaje_seña());
            
        // Se setean todas las horas
        this.configuracion_general.setHorario_inicio_pico(nueva_configuracion.getHorario_inicio_pico());
        this.configuracion_general.setHorario_fin_pico(nueva_configuracion.getHorario_fin_pico());

        // Se setea la duracion maxima del turno
        this.configuracion_general.setDuracion_maxima_turno(nueva_configuracion.getDuracion_maxima_turno());

        // Eliminar los días de apertura existentes
        if (this.configuracion_general.getDias_apertura() != null) {
            this.configuracion_general.getDias_apertura().clear();
        }

        // Agregar los nuevos días de apertura
        List<Dia_Apertura> dias_apertura_nuevos = nueva_configuracion.getDias_apertura();
        if (dias_apertura_nuevos != null) {
            this.configuracion_general.setDias_apertura(dias_apertura_nuevos);
        }

        // Se guarda la configuracion general
        i_configuracion_general.save(this.configuracion_general);
        this.configuracion_general = i_configuracion_general.findById(1).get();

        return this.configuracion_general;
    }
}
