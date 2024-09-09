package Grupo11.Seminario.DTO;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Data;

@Data
public class ReservaDTO {
    private Float precio;
    private Integer cantidad_pelotas;
    private Integer cantidad_paletas;
    private LocalDate fecha;
    private LocalTime horario_inicio;
    private LocalTime horario_fin;
    private Integer numero_cancha;
}
