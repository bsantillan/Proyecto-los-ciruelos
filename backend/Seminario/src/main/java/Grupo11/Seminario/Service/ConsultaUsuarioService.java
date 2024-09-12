package Grupo11.Seminario.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Grupo11.Seminario.DTO.UsuarioDTO;
import Grupo11.Seminario.Entities.Usuario;
import Grupo11.Seminario.Repository.IUsuarioRepository;

@Service
public class ConsultaUsuarioService {

    @Autowired
    private IUsuarioRepository usuarioRepository;

    // Método para buscar usuarios con filtros y devolver una lista de UsuarioDTO
    public List<UsuarioDTO> buscar_usuarios(Optional<String> nombre, Optional<String> apellido, Optional<String> email) {
        List<Usuario> usuarios;

        // Si solo se busca por email
        if (email.isPresent()) {
            return usuarioRepository.findByEmail(email.get())
                .map(usuario -> List.of(UsuarioDTO.fromEntity(usuario))) // Convertir el Usuario a UsuarioDTO
                .orElseGet(List::of); // Si no encuentra, retorna una lista vacía
        }

        // Si se busca por nombre y apellido
        if (nombre.isPresent() && apellido.isPresent()) {
            usuarios = usuarioRepository.findByNombreContainingIgnoreCaseAndApellidoContainingIgnoreCase(nombre.get(), apellido.get());
        }
        // Si se busca solo por nombre
        else if (nombre.isPresent()) {
            usuarios = usuarioRepository.findByNombreContainingIgnoreCase(nombre.get());
        }
        // Si se busca solo por apellido
        else if (apellido.isPresent()) {
            usuarios = usuarioRepository.findByApellidoContainingIgnoreCase(apellido.get());
        } else {
            // Si no hay criterios, retorna todos los usuarios
            usuarios = (List<Usuario>) usuarioRepository.findAll();
        }

        // Convertir la lista de entidades Usuario a una lista de UsuarioDTO
        return usuarios.stream()
            .map(UsuarioDTO::fromEntity)
            .collect(Collectors.toList());
    }
}
