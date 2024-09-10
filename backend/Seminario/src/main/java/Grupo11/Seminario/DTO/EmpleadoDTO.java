package Grupo11.Seminario.DTO;

import java.util.List;

import Grupo11.Seminario.Entities.Telefono;
import lombok.Data;

@Data
public class EmpleadoDTO {
    private String email;
    private String nombre;
    private String apellido;
    private Boolean duenio;
    private List<Telefono> telefonos;

    public EmpleadoDTO(
    String email, String nombre, String apellido, Boolean duenio,List<Telefono> telefonos) 
    {
        this.email = email;
        this.nombre = nombre;
        this.apellido = apellido;
        this.duenio = duenio;
        this.telefonos = telefonos;
    }    
}
