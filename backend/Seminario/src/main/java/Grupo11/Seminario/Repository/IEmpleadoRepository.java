package Grupo11.Seminario.Repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import Grupo11.Seminario.Entities.Empleado;

@Repository
public interface IEmpleadoRepository extends CrudRepository<Empleado,Integer>{
    
}
