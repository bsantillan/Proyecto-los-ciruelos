package Grupo11.Seminario.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import lombok.Data;
import lombok.NoArgsConstructor;

// Se determina el nombre de la clase en la BD
@Entity(name = "Usuario")
@Data
@NoArgsConstructor
// Estrategia de herencia para generar una tabla por cada clase
@Inheritance(strategy = InheritanceType.JOINED)

public class Usuario {
    
    // Se define el ID como autoincremental
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, name = "nombre", length = 25)
    private String nombre;

    @Column(nullable = false, name = "apellido", length = 30)
    private String apellido;

    @Column(nullable = false, name = "email", length = 50)
    private String email;

}
