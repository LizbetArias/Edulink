package Ia.edulink.Practica.repository;

import Ia.edulink.Practica.model.Person;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface PersonRepository extends R2dbcRepository<Person, Long> {
    Flux<Person> findByStatus(String status); // Buscar personas por estado (A/I)
}
