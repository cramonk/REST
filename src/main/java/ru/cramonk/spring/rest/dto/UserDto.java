package ru.cramonk.spring.rest.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.cramonk.spring.rest.entity.Role;
import ru.cramonk.spring.rest.entity.User;
import ru.cramonk.spring.rest.service.RoleService;

import java.util.List;
import java.util.stream.Collectors;

@Component
@Setter
@Getter
public class UserDto {

    private static RoleService roleService;

    private Long id;

    private String email;

    private String password;

    private String firstName;

    private String lastName;

    private Integer age;

    private List<String> roleNames;

    private List<String> allRoles;



    public static UserDto toDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setEmail(user.getEmail());
        userDto.setPassword(user.getPassword());
        userDto.setAge(user.getAge());
        userDto.setRoleNames(user.getRoles().stream()
                .map(Role::getName)
                .map(s->s.replace("ROLE_", ""))
                .collect(Collectors.toList()));
        userDto.setAllRoles(roleService.findAll().stream()
                .map(Role::getName)
                .map(s->s.replace("ROLE_", ""))
                .collect(Collectors.toList()));
        return userDto;
    }

    public static User fromDto (UserDto userDto) {
        User user = new User();
        user.setId(userDto.getId());
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        user.setAge(userDto.getAge());
        List<Role> roles = userDto.getRoleNames().stream()
                .map(s -> "ROLE_" + s)
                .peek(System.out::println)
                .map(s -> roleService.findRoleByName(s))
                .collect(Collectors.toList());
        user.setRoles(roles);
        return user;
    }

    @Autowired
    public void setRoleService(RoleService roleService) {
        UserDto.roleService = roleService;
    }

}
