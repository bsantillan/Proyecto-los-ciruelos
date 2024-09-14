package Grupo11.Seminario.DTO;

import java.util.List;

import Grupo11.Seminario.Entities.Jugador;
import Grupo11.Seminario.Entities.Telefono;
import lombok.Data;

@Data
public class JugadorDTO {
    private String email;
    private String nombre;
    private String apellido;
    private String categoria;
    private Boolean socio;
    private Boolean profesor;
    private List<Telefono> telefonos;

    // Constructor con argumentos
    public JugadorDTO(
    String email, String nombre, String apellido, String categoria, Boolean socio, Boolean profesor, List<Telefono> telefonos) 
    {
        this.email = email;
        this.nombre = nombre;
        this.apellido = apellido;
        this.categoria = categoria;
        this.socio = socio;
        this.profesor = profesor;
        this.telefonos = telefonos;
    }
    
    // Método estático para convertir de Jugador (entidad) a JugadorDTO
    public static JugadorDTO fromEntity(Jugador jugador) {
        return new JugadorDTO(
            jugador.getEmail(),
            jugador.getNombre(),
            jugador.getApellido(),
            jugador.getCategoria().toString(), // Convertimos el enum a String
            jugador.getSocio(),
            jugador.getProfesor(),
            jugador.getTelefonos()
        );
    }
}
