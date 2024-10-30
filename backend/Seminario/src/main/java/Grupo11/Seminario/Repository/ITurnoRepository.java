package Grupo11.Seminario.Repository;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;

import Grupo11.Seminario.Entities.Cancha;
import Grupo11.Seminario.Entities.Turno;

@Repository
public interface ITurnoRepository extends CrudRepository<Turno,Integer> {
    
    public List<Turno> findByCanchaOrderByFechaAscHorarioInicioAsc(Cancha cancha);

    // Método para encontrar turnos de una cancha desde la fecha actual en adelante
    public List<Turno> findByCanchaAndFechaGreaterThanEqualOrderByFechaAscHorarioInicioAsc(Cancha cancha, LocalDate fecha);
}
