package Ia.edulink.Practica.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Table("person")
public class Person {

    @Id
    private Long id;

    private String name;

    @Column("last_name")
    private String lastName;

    @Column("email")
    private String email;

    @Column("dateOfBirth")
    private LocalDate dateOfBirth;

    @Builder.Default
    @Column("status")
    private String status = "A"; // Estado por defecto como 'A' (activo)
}
