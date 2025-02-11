package Ia.edulink.Practica.controller;

import Ia.edulink.Practica.model.person; // Asegúrate de que la clase se llame "Person" con mayúscula
import Ia.edulink.Practica.service.personService;
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
public class personController {
    private final personService personService;

    private static final Logger logger = LoggerFactory.getLogger(personController.class);

    @Autowired
    public personController(personService personService) {
        this.personService = personService;
    }

    @GetMapping("")
    public Flux<person> obtenerTodosLosPerson() {
        return personService.obtenerTodosLosPersons();
    }

    @GetMapping("/listar/{id}")
    public Mono<ResponseEntity<person>> obtenerPersonPorId(@PathVariable Long id) {
        return personService.obtenerPersonPorId(id)
                .map(person -> ResponseEntity.ok().body(person))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping("/crear")
    public Mono<ResponseEntity<person>> guardarPerson(@RequestBody person person) {
        return personService.guardarPerson(person)
                .map(createdPerson -> ResponseEntity.status(HttpStatus.CREATED).body(createdPerson));
    }

    @PutMapping("/actualizar/{id}")
    public Mono<ResponseEntity<person>> actualizarPerson(@PathVariable Long id, @RequestBody person person) {
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
    public Flux<person> obtenerPersonasActivas() {
        return personService.obtenerPersonasActivas();
    }

    @GetMapping("/inactivos")
    public Flux<person> obtenerPersonasInactivas() {
        return personService.obtenerPersonasInactivas();
    }
}
