package Grupo11.Seminario.Repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import Grupo11.Seminario.Entities.Jugador;

@Repository
public interface IJugadorRepository extends CrudRepository<Jugador,Integer>{
    
}
