package ru.cramonk.spring.rest.service;

import org.springframework.stereotype.Service;
import ru.cramonk.spring.rest.entity.Role;
import ru.cramonk.spring.rest.repositories.RoleRepository;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService{

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public Role findRoleByName(String role) {
        return roleRepository.findByName(role);
    }

    @Override
    public List<Role> findAll() {
        return roleRepository.findAll();
    }
}
