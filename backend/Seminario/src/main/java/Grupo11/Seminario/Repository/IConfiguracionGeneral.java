package Grupo11.Seminario.Repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import Grupo11.Seminario.Entities.Configuracion_General;

@Repository
public interface IConfiguracionGeneral extends CrudRepository<Configuracion_General,Integer>{

}
