package ru.cramonk.spring.rest.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.cramonk.spring.rest.dto.UserDto;
import ru.cramonk.spring.rest.entity.User;
import ru.cramonk.spring.rest.error_handle.DuplicateEmailException;
import ru.cramonk.spring.rest.error_handle.UserNotFoundException;
import ru.cramonk.spring.rest.service.UserService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/rest/admin/users")
public class AdminRestController {

    private final UserService userService;

    public AdminRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getUsers() {
        List<UserDto> users = userService.findAll().stream()
                .map(UserDto::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable("id") Long id) {
        User user = userService.findId(id);
        if (user == null) {
            throw new UserNotFoundException(String.format("User with id %s was not found", id));
        } else {
            return ResponseEntity.ok(UserDto.toDto(user));
        }
    }

    @PostMapping
    public ResponseEntity<UserDto> create(@RequestBody UserDto user) {
        User saveUser = UserDto.fromDto(user);
        User fromDb = userService.findByUsername(saveUser.getUsername());
        if (fromDb != null) {
            throw new DuplicateEmailException(String.format("User with email %s already exists", saveUser.getEmail()));
        }
        userService.save(saveUser);
        return ResponseEntity.ok(UserDto.toDto(saveUser));
    }

    @PutMapping
    public ResponseEntity<UserDto> update(@RequestBody UserDto user) {
        User saveUser = UserDto.fromDto(user);
        User fromDb = userService.findByUsername(saveUser.getUsername());
        if ((fromDb != null) && (fromDb.getId().compareTo(saveUser.getId()) != 0)) {
            throw new DuplicateEmailException(String.format("User with email %s already exists", saveUser.getEmail()));
        }
        userService.save(saveUser);
        return ResponseEntity.ok(UserDto.toDto(saveUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
        User user = userService.findId(id);
        if (user == null) {
            throw new UserNotFoundException(String.format("User with id %s was not found", id));
        } else {
            userService.deleteById(id);
            return ResponseEntity.ok(String.format("User with id %s was deleted", id));
        }
    }
}
