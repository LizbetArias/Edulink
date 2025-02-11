package Ia.edulink.Practica.controller;

import Ia.edulink.Practica.model.Person; // Cambiado a "Person" con mayúscula
import Ia.edulink.Practica.service.PersonService; // Cambiado a "PersonService" con mayúscula
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/person")
public class PersonController { // Cambiado a "PersonController" con mayúscula

    private final PersonService personService; // Cambiado a "PersonService" con mayúscula

    private static final Logger logger = LoggerFactory.getLogger(PersonController.class); // Cambiado a "PersonController" con mayúscula

    @Autowired
    public PersonController(PersonService personService) { // Cambiado a "PersonService" con mayúscula
        this.personService = personService;
    }

    @GetMapping("/ListarTodo")
    public Flux<Person> obtenerTodosLosPersons() { // Cambiado a "Person" con mayúscula
        return personService.obtenerTodosLosPersons();
    }

    @GetMapping("/listar/{id}")
    public Mono<ResponseEntity<Person>> obtenerPersonPorId(@PathVariable Long id) { // Cambiado a "Person" con mayúscula
        return personService.obtenerPersonPorId(id)
                .map(person -> ResponseEntity.ok().body(person))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping("/crear")
    public Mono<ResponseEntity<Person>> guardarPerson(@RequestBody Person person) { // Cambiado a "Person" con mayúscula
        return personService.guardarPerson(person)
                .map(createdPerson -> ResponseEntity.status(HttpStatus.CREATED).body(createdPerson));
    }

    @PutMapping("/actualizar/{id}")
    public Mono<ResponseEntity<Person>> actualizarPerson(@PathVariable Long id, @RequestBody Person person) { // Cambiado a "Person" con mayúscula
        person.setId(id);
        return personService.guardarPerson(person)
                .map(updatedPerson -> ResponseEntity.ok().body(updatedPerson));
    }

    @DeleteMapping("/eliminar/{id}")
    public Mono<ResponseEntity<Void>> eliminarPerson(@PathVariable Long id) {
        return personService.eliminarPerson(id)
                .then(Mono.just(ResponseEntity.noContent().build()));
    }

    @PutMapping("/reactivar/{id}")
    public Mono<ResponseEntity<Void>> reactivarPerson(@PathVariable Long id) {
        return personService.reactivarPerson(id)
                .map(updatedPerson -> ResponseEntity.noContent().build());
    }

    @GetMapping("/activos")
    public Flux<Person> obtenerPersonasActivas() { // Cambiado a "Person" con mayúscula
        return personService.obtenerPersonasActivas();
    }

    @GetMapping("/inactivos")
    public Flux<Person> obtenerPersonasInactivas() { // Cambiado a "Person" con mayúscula
        return personService.obtenerPersonasInactivas();
    }
}
