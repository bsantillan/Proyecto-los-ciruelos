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
    private Integer id_empleado;

    public ReservaDTO
    (Float precio, 
    Integer numero_cancha, Integer cantidad_pelotas, Integer cantidad_paletas, Integer id_empleado, 
    LocalDate fecha, LocalTime horario_inicio, LocalTime horario_fin){
        this.precio=precio;
        this.numero_cancha=numero_cancha;
        this.cantidad_pelotas=cantidad_pelotas;
        this.cantidad_paletas=cantidad_paletas;
        this.fecha=fecha;
        this.horario_inicio=horario_inicio;
        this.horario_fin=horario_fin;
        this.id_empleado=id_empleado;
    }
}
