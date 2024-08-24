package Grupo11.Seminario.DTO;

import java.util.List;

import Grupo11.Seminario.Entities.Telefono;
import lombok.Data;

@Data
public class JugadorDTO {
    private String email;
    private String nombre;
    private String apellido;
    private String categoria;
    private List<Telefono> telefonos;

    public JugadorDTO(
    String email, String nombre, String apellido, String categoria, List<Telefono> telefonos) 
    {
        this.email = email;
        this.nombre = nombre;
        this.apellido = apellido;
        this.categoria = categoria;
        this.telefonos = telefonos;
    }
    
}
