package ru.cramonk.spring.rest.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import ru.cramonk.spring.rest.entity.User;

import java.util.List;

public interface UserService extends UserDetailsService {

    void save(User user);
    void update(User user);
    User findByUsername(String username);
    User findId(Long id);
    List<User> findAll();
    void deleteById(Long id);

}
