package Grupo11.Seminario.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Grupo11.Seminario.Entities.Reserva;
import Grupo11.Seminario.Repository.ICanchaRepository;
import Grupo11.Seminario.Repository.IReservaRepository;

@Service
@Transactional
public class ReservaService {
    
    @Autowired
    ICanchaRepository i_cancha_repository;
    @Autowired 
    IReservaRepository i_reserva_repository;

    public void guardar_reserva(Reserva reserva){
        i_reserva_repository.save(reserva);
    }

}
