package Ia.edulink.Practica.model;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.Date;

@Getter
@Entity
public class person {
    // Getters y Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private String last_name;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "date_of_birth")
    private Date dateOfBirth;

    // Getter para el nuevo atributo
    @Column(name = "status")
    private String status; // Nueva columna "status"

    // Constructor con todos los atributos
    public person(long id, String name, String last_name, String email, Date dateOfBirth, String status) {
        this.id = id;
        this.name = name;
        this.last_name = last_name;
        this.email = email;
        this.dateOfBirth = dateOfBirth;
        this.status = status; // Inicialización del nuevo atributo
    }

    // Constructor por defecto
    public person() {
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public void setStatus(String status) {
        this.status = status; // Setter para el nuevo atributo
    }
}
