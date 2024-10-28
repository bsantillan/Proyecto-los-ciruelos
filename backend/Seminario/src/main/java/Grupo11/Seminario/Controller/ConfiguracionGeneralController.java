package Grupo11.Seminario.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import Grupo11.Seminario.Entities.ConfiguracionGeneral;
import Grupo11.Seminario.Service.ConfiguracionGeneralService;
import Grupo11.Seminario.Service.RegistroService;

@RestController
@RequestMapping(path = "/configuracion_general")
public class ConfiguracionGeneralController {

    @Autowired
    private ConfiguracionGeneralService configuracion_general_service;
    @Autowired
    private RegistroService registro_service;

    @GetMapping("/public/consultar_configuracion")
    public ResponseEntity<?> consultar_configuracion_general() {
        return ResponseEntity.ok().body(configuracion_general_service.get_configuracion_general());
    }

    @PutMapping("/private/actualizar_configuracion/{id_duenio}")
    public ResponseEntity<?> actualizar_configuracion_general(@PathVariable Integer id_duenio, @RequestBody ConfiguracionGeneral nueva_configuracion) {
        
        // Se verifica que exista el empleado con dicho Id
        if (registro_service.existe_empleado(id_duenio)){
            
            // Se verifica que el empleado sea un dueño
            if (registro_service.verificar_duenio(id_duenio)){
                return ResponseEntity.ok().body(configuracion_general_service.actualizar_configuracion_general(nueva_configuracion));
            }
            return ResponseEntity.badRequest().body("No tiene permisos para actualizar la configuracion general");
        }
        return ResponseEntity.badRequest().body("No esta registrado el empleado o no es un empleado");
    }
}

