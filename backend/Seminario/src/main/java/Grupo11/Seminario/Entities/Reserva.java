package Grupo11.Seminario.Entities;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Reserva {
    
    // Se define el ID como autoincremental
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, name = "fecha")
    private LocalDate fecha;

    @Column(nullable = false, name = "hora")
    private LocalTime hora;

    @Column(nullable = false, name = "precio")
    private Float precio;

    @Column(nullable = false, name = "cantidad_pelotas")
    private Integer cantidad_pelotas;

    @Column(nullable = false, name = "cantidad_paletas")
    private Integer cantidad_paletas;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(nullable = false, name = "turno_id")
    private Turno turno;

    @ManyToOne()
    @JoinColumn(nullable = false, name = "jugador_id")
    private Jugador jugador;

    @ManyToOne()
    @JoinColumn(nullable = true, name = "empleado_id")
    private Empleado empleado;
}
