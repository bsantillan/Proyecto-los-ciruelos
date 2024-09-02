package Grupo11.Seminario.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Grupo11.Seminario.DTO.EmpleadoDTO;
import Grupo11.Seminario.Entities.Empleado;
import Grupo11.Seminario.Service.RegistroService;



@RestController
@RequestMapping("/private/registro")
public class RegistroPrivadoController {
    
    @Autowired
    RegistroService registro_service;

    // Controlador privado para registrar a un empleado en la aplicacion
    @PostMapping(path = "/empleado/{id_duenio}")
    public ResponseEntity<?> registro_empleado(@PathVariable Integer id_duenio, @RequestBody EmpleadoDTO empleadoDTO){
        
        if (registro_service.existe_duenio(id_duenio)){
        
            // Verificar que el que hace la peticion sea Duenio
            if (registro_service.verificar_duenio(id_duenio)){
                // Verifica que el mail no este registrado
                if (registro_service.verificar_email(empleadoDTO.getEmail())){
                    System.out.print("Entra");
                    Empleado empleado = new Empleado();
                    empleado.setEmail(empleadoDTO.getEmail());
                    empleado.setNombre(empleadoDTO.getNombre());
                    empleado.setApellido(empleadoDTO.getApellido());

                    empleado.setTelefonos(empleadoDTO.getTelefonos());
                    empleado.setDuenio(empleadoDTO.getDuenio());

                    registro_service.guardar_empleado(empleado);

                    EmpleadoDTO empleadoDTO_frontend = new EmpleadoDTO
                        (empleado.getEmail(), empleado.getNombre(), empleado.getApellido(), 
                        empleado.getDuenio(), empleado.getTelefonos()
                        );

                    // Le devolvemos los datos del empleado o duenio al FrontEnd
                    return ResponseEntity.ok(empleadoDTO_frontend);
                }
                return ResponseEntity.badRequest().body("El mail ya esta registrado");
            }
            return ResponseEntity.badRequest().body("No tiene permisos para crear un empleado");
        }
        return ResponseEntity.badRequest().body("No esta registrado el dueño");
    }
}
