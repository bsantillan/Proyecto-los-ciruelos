package Grupo11.Seminario.Controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Grupo11.Seminario.Service.ConsultaUsuarioService;

@RestController
@RequestMapping(path = "/private/consultar")
public class ConsultaUsuarioController {

    @Autowired
    private ConsultaUsuarioService consultaUsuarioService;

    // Endpoint para buscar usuarios y devolver DTOs
    @GetMapping("/usuarios/buscar")
    public ResponseEntity<List<Object>> buscar_usuarios(
        @RequestParam Optional<String> nombre,
        @RequestParam Optional<String> apellido,
        @RequestParam Optional<String> email
    ) {
        List<Object> usuarios = consultaUsuarioService.buscar_usuarios(nombre, apellido, email);
        return ResponseEntity.ok(usuarios);
    }
}
