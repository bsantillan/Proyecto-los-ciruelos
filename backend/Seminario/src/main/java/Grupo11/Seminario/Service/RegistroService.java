package Grupo11.Seminario.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Grupo11.Seminario.Entities.Jugador;
import Grupo11.Seminario.Entities.Telefono;
import Grupo11.Seminario.Entities.Enum.Categoria;
import Grupo11.Seminario.Repository.IEmpleadoRepository;
import Grupo11.Seminario.Repository.IJugadorRepository;
import Grupo11.Seminario.Repository.IUsuarioRepository;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class RegistroService {

    @Autowired
    IJugadorRepository i_jugador_repository;
    @Autowired
    IUsuarioRepository i_usuario_repository;
    @Autowired
    IEmpleadoRepository i_empleado_repository;

    // Se guarda el jugador en la BD
    public void guardar_jugador(Jugador jugador){
        i_jugador_repository.save(jugador);
    }


    public Boolean verificar_duenio(Integer id_empleado){
        return i_empleado_repository.findById(id_empleado).get().getDuenio();
    }

    public Boolean verificar_email(String email){
        if (i_usuario_repository.findByEmail(email).isEmpty()){
            return true;
        }
        return false;
    }

    public Categoria verificar_categoria(String categoria_jugador){
        for (Categoria categoria : Categoria.values()){
            if (categoria.name().equalsIgnoreCase(categoria_jugador)){
                return categoria;
            }
        }
        return null;
    }

    public List<Telefono> establecer_telefonos(List<Telefono> telefonosDTO){
        // Crea y establece la lista de teléfonos
            return telefonosDTO.stream().map(telefonoDTO->
            {
                Telefono telefono = new Telefono();
                telefono.setCodigo(telefonoDTO.getCodigo());
                telefono.setNumero(telefonoDTO.getNumero());
                return telefono;
            }
            ).collect(Collectors.toList());

    }
}
