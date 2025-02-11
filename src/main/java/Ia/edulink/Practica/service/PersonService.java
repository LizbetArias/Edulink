package Ia.edulink.Practica.service;

import Ia.edulink.Practica.model.Person; // Cambia a "Person" con mayúscula
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface PersonService { // Cambia a "PersonService" con mayúscula
    Flux<Person> obtenerTodosLosPersons();
    Mono<Person> obtenerPersonPorId(Long id);
    Mono<Person> guardarPerson(Person person);
    Mono<Void> eliminarPerson(Long id);
    Mono<Person> reactivarPerson(Long id);
    Flux<Person> obtenerPersonasActivas();
    Flux<Person> obtenerPersonasInactivas();
}
