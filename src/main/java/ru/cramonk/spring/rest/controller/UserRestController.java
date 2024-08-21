package ru.cramonk.spring.rest.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.cramonk.spring.rest.dto.UserDto;
import ru.cramonk.spring.rest.entity.User;
import ru.cramonk.spring.rest.error_handle.UserNotFoundException;
import ru.cramonk.spring.rest.service.UserService;

import java.security.Principal;

@RestController
@RequestMapping("/rest/user")
public class UserRestController {

    private final UserService userService;

    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<UserDto> getUser(Principal principal) {
        User user = userService.findByUsername(principal.getName());
        if (user == null) {
            throw new UserNotFoundException("User was not found");
        } else {
            return ResponseEntity.ok(UserDto.toDto(user));
        }
    }
}
