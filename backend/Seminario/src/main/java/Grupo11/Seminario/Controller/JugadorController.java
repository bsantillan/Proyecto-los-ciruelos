package Grupo11.Seminario.Controller;

import Grupo11.Seminario.Entities.Jugador;
import Grupo11.Seminario.Service.JugadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/private/jugadores")
public class JugadorController {

    @Autowired
    private JugadorService jugadorService;

    // Asigna el rol de profesor a un jugador
    @PutMapping("/asignar_profesor/{id}")
    public ResponseEntity<String> asignarRolProfesor(@PathVariable Integer id) {
        boolean exito = jugadorService.asignar_rol_profesor(id);
        if (exito) {
            return ResponseEntity.ok("Rol de profesor asignado exitosamente al jugador.");
        } else {
            return ResponseEntity.badRequest().body("Error al asignar el rol de profesor.");
        }
    }
}

