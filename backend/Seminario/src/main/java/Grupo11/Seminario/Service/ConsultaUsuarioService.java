package Grupo11.Seminario.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import Grupo11.Seminario.Entities.Usuario;
import Grupo11.Seminario.Repository.IUsuarioRepository;

@Service
public class ConsultaUsuarioService {

    @Autowired
    private IUsuarioRepository usuarioRepository;

    // Método para buscar usuarios con filtros
    public List<Usuario> buscar_usuarios(Optional<String> nombre, Optional<String> apellido, Optional<String> email) {
        // Si solo se busca por email
        if (email.isPresent()) {
            return usuarioRepository.findByEmail(email.get())
                .map(List::of) // Si encuentra el usuario, lo retorna como lista
                .orElseGet(List::of); // Si no encuentra, retorna una lista vacía
        }

        // Si se busca por nombre y apellido
        if (nombre.isPresent() && apellido.isPresent()) {
            return usuarioRepository.findByNombreContainingIgnoreCaseAndApellidoContainingIgnoreCase(nombre.get(), apellido.get());
        }

        // Si se busca solo por nombre
        if (nombre.isPresent()) {
            return usuarioRepository.findByNombreContainingIgnoreCase(nombre.get());
        }

        // Si se busca solo por apellido
        if (apellido.isPresent()) {
            return usuarioRepository.findByApellidoContainingIgnoreCase(apellido.get());
        }

        // Si no hay criterios, retorna todos los usuarios
        return (List<Usuario>) usuarioRepository.findAll();
    }
}
