package Grupo11.Seminario.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Grupo11.Seminario.DTO.JugadorDTO;
import Grupo11.Seminario.Entities.Jugador;
import Grupo11.Seminario.Service.RegistroService;

@RestController
@RequestMapping(path = "/public/registro")
public class RegistroPublicoController {
    
    @Autowired
    RegistroService registro_service;

    // Controlador publico para registrarse como jugador en la aplicacion
    @PostMapping(path = "/jugador")
    public ResponseEntity<?> registro_jugador(@RequestBody JugadorDTO jugadorDTO){
        
        // Verifica que el mail no este registrado
        if (registro_service.verificar_email(jugadorDTO.getEmail())){
            System.out.print("Entra");
            Jugador jugador = new Jugador();
            jugador.setEmail(jugadorDTO.getEmail());
            jugador.setNombre(jugadorDTO.getNombre());
            jugador.setApellido(jugadorDTO.getApellido());
            jugador.setCategoria(registro_service.verificar_categoria(jugadorDTO.getCategoria()));

            jugador.setTelefonos(jugadorDTO.getTelefonos());

            registro_service.guardar_jugador(jugador);

            JugadorDTO jugadorDTO_front = new JugadorDTO
                (jugador.getEmail(), jugador.getNombre(), jugador.getApellido(), 
                jugador.getCategoria().toString(), jugador.getTelefonos()
                );

            // Le devolvemos los datos del jugador al FrontEnd
            return ResponseEntity.ok(jugadorDTO_front);
        }
        return ResponseEntity.badRequest().body("El mail ya esta registrado");
    }
}
