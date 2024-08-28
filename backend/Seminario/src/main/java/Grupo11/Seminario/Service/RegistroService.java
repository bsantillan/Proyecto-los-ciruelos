package Grupo11.Seminario.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Grupo11.Seminario.Entities.Jugador;
import Grupo11.Seminario.Entities.Enum.Categoria;
import Grupo11.Seminario.Repository.IUsuarioRepository;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class RegistroService {

    @Autowired
    IUsuarioRepository i_usuario_repository;

    
}
