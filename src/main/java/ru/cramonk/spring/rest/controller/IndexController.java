package ru.cramonk.spring.rest.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import ru.cramonk.spring.rest.dto.UserDto;
import ru.cramonk.spring.rest.entity.User;
import ru.cramonk.spring.rest.service.UserService;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.util.stream.Collectors;

@Controller
public class IndexController {

    private final UserService userService;

    public IndexController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(value = "/")
    public String getIndex( Principal principal, Model model) {
        User byUsername = userService.findByUsername(principal.getName());
        UserDto user = UserDto.toDto(byUsername);
        model.addAttribute("user", user);

        model.addAttribute("users", userService.findAll().stream()
                .map(UserDto::toDto).collect(Collectors.toList()));

        return "index";
    }

    @GetMapping("/logout")
    public String logout(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            request.getSession().invalidate();
        }
        return "redirect:/login";
    }
}
