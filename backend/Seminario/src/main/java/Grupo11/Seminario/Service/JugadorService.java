package Grupo11.Seminario.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Grupo11.Seminario.Entities.Jugador;
import Grupo11.Seminario.Repository.IJugadorRepository;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class JugadorService {
    
    @Autowired
    private IJugadorRepository i_jugador_repository;

    // Asignar rol de profesor a un jugador
    public boolean asignar_rol_profesor(Integer id) {
        Jugador jugador = i_jugador_repository.findById(id).orElse(null);
        if (jugador != null) {
            jugador.setProfesor(true);  // Asigna el rol de profesor
            i_jugador_repository.save(jugador);  // Actualiza la base de datos
            return true;
        }
        return false;
    }
}
