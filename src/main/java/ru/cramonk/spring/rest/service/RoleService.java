package ru.cramonk.spring.rest.service;

import ru.cramonk.spring.rest.entity.Role;

import java.util.List;

public interface RoleService {
    Role findRoleByName(String role);
    List<Role> findAll();
}
