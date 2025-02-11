package Ia.edulink.Practica.service.Impl;

import Ia.edulink.Practica.model.Person;
import Ia.edulink.Practica.repository.PersonRepository;
import Ia.edulink.Practica.service.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class PersonServiceImpl implements PersonService { 

    @Autowired
    private PersonRepository personRepository; 

    @Override
    public Flux<Person> obtenerTodosLosPersons() {
        return personRepository.findAll();
    }

    @Override
    public Mono<Person> obtenerPersonPorId(Long id) {
        return personRepository.findById(id);
    }

    @Override
    public Mono<Person> guardarPerson(Person person) {
        return personRepository.save(person);
    }

    @Override
    public Mono<Void> eliminarPerson(Long id) {
        return personRepository.deleteById(id);
    }

    @Override
    public Mono<Person> reactivarPerson(Long id) {
        return personRepository.findById(id)
                .flatMap(existingPerson -> {
                    existingPerson.setStatus("activo"); 
                    return personRepository.save(existingPerson);
                });
    }

    @Override
    public Flux<Person> obtenerPersonasActivas() {
        return personRepository.findByStatus("activo"); 
    }

    @Override
    public Flux<Person> obtenerPersonasInactivas() {
        return personRepository.findByStatus("inactivo"); 
    }
}
