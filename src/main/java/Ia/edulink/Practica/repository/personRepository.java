import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import Ia.edulink.Practica.model.person;

public interface personRepository extends ReactiveCrudRepository<person, Long> {
}
