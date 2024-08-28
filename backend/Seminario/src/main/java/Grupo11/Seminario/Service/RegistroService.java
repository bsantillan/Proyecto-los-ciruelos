package Grupo11.Seminario.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Grupo11.Seminario.Entities.Jugador;
import Grupo11.Seminario.Entities.Enum.Categoria;
import Grupo11.Seminario.Repository.IJugadorRepository;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class RegistroService {

    @Autowired
    IJugadorRepository i_jugador_repository;

    // Se guarda el jugador en la BD
    public void guardar_jugador(Jugador jugador){
        i_jugador_repository.save(jugador);
    }

    
}
