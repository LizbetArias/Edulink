package Ia.edulink.Practica.service;

import Ia.edulink.Practica.model.person; // Asegúrate de que la clase se llame "Person" con mayúscula
import Ia.edulink.Practica.repository.personRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class personService {

    @Autowired
    private personRepository personRepository;

    // Método para obtener todos los registros de Person
    public Flux<person> obtenerTodosLosPersons() {
        return personRepository.findAll();
    }

    // Método para obtener una Person por su ID
    public Mono<person> obtenerPersonPorId(Long id) {
        return personRepository.findById(id);
    }

    // Método para guardar una nueva Person
    public Mono<person> guardarPerson(person person) {
        return personRepository.save(person);
    }

    // Método para eliminar una Person por su ID
    public Mono<Void> eliminarPerson(Long id) {
        return personRepository.deleteById(id);
    }

    // Método para reactivar una Person (puedes implementar la lógica según tu modelo)
    public Mono<person> reactivarPerson(Long id) {
        return personRepository.findById(id)
                .flatMap(existingPerson -> {
                    // Lógica para reactivar la persona
                    existingPerson.setStatus("activo"); // Asumiendo un campo "status"
                    return personRepository.save(existingPerson);
                });
    }

    // Método para obtener personas activas
    public Flux<person> obtenerPersonasActivas() {
        return personRepository.findByStatus("activo"); // Asumiendo que tienes un método en el repositorio
    }

    // Método para obtener personas inactivas
    public Flux<person> obtenerPersonasInactivas() {
        return personRepository.findByStatus("inactivo"); // Asumiendo que tienes un método en el repositorio
    }
}
