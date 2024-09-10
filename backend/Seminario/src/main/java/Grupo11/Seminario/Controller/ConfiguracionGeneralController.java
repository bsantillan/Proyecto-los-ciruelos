package Grupo11.Seminario.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Grupo11.Seminario.Entities.Configuracion_General;
import Grupo11.Seminario.Service.ConfiguracionGeneralService;

@RestController
@RequestMapping(path = "/private/configuracion_general")
public class ConfiguracionGeneralController {

    @Autowired
    private ConfiguracionGeneralService configuracion_general_service;

    @GetMapping("/obtener_configuracion")
    public Configuracion_General obtener_configuracion_general() {
        return configuracion_general_service.getConfiguracionGeneral();
    }

    @PutMapping("/actualizar_configuracion")
    public ResponseEntity<Configuracion_General> actualizar_configuracion_general(@RequestBody Configuracion_General nueva_configuracion) {
        return ResponseEntity.ok().body(configuracion_general_service.actualizarConfiguracion(nueva_configuracion));
    }
}

