$(document).ready(function () {
    getUsers();

    $(document).on("click", ".btn-edit", e => editModalShow(e));

    $(document).on("click", ".btn-delete", e => deleteModalShow(e));

    newUserTab.click(e => newUserTabForm(e));

    submitPost.click(e => newPost(e));

    submitEdit.click(e => editPost(e));

    submitDelete.click(e => deletePost(e));

});
const url = 'http://localhost:8080/rest/admin/users';

const editModal = $("#edit_modal");
const deleteModal = $("#delete_modal");

const submitEdit = $("#submit_edit");
const submitDelete = $("#submit_delete");
const submitPost = $("#submit_post");

const userTableBody = $("#users_table tbody");
const newUserTab = $(".new_user");
const userTableTab = $("#user_table-tab");

const newUserForm = $("#new_user_form")
const formEdit = $("#form_edit");
const formDelete = $("#form_delete");

// GET to http://localhost:8080/rest/admin/users
async function getUsers() {
    // Get JSON-formatted data from the server
    let resp = await fetch(url);
    let tagsBody = "";
    let values = await resp.json();
    values.map(user => tagsBody += addRowToUserTable(user));
    userTableBody.html(tagsBody);
}

// PUT to http://localhost:8080/rest/admin/users
async function editPost(event) {
    event.preventDefault();
    const errorMethod = $("#edit_method_error");
    const userId = $("#edit_id").val();
    const user = {
        id: userId,
        firstName: $("#edit_first_name").val(),
        lastName: $("#edit_last_name").val(),
        age: $("#edit_age").val(),
        email: $("#edit_email").val(),
        password: $("#edit_password").val(),
        roleNames: $("#edit_roles").val()
    }

    if (formValidation(user, "edit") === false) {
        return false;
    }
    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });
    if (!res.ok) {
        if (res.status === 406) {
            errorMethod.show();
            errorMethod[0].innerHTML = "User with this email already exists";
        }
        return false;
    } else {
        errorMethod.hide()
    }

    editModal.modal("hide");
    alterUserTableAfterUpdate(user);
}

// POST to http://localhost:8080/rest/admin/users
async function newPost(event) {
    event.preventDefault();
    const errorMethod = $("#new_user_method_error");
    const user = {
        firstName: $("#new_user_first_name").val(),
        lastName: $("#new_user_last_name").val(),
        age: $("#new_user_age").val(),
        email: $("#new_user_email").val(),
        password: $("#new_user_password").val(),
        roleNames: $("#new_user_roles").val()
    }

    if (formValidation(user, "new_user") === false) {
        return false;
    }
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });
    let newUser = await res.json();
    console.log(newUser);
    if (!res.ok) {
        if (res.status === 406) {
            errorMethod.show();
            errorMethod[0].innerHTML = "User with this email already exists";
        }
        return false;
    } else {
        errorMethod.hide()
    }
    userTableTab.tab('show');
    userTableBody.append(addRowToUserTable(newUser));

}

// DELETE to http://localhost:8080/rest/admin/users/{id}
async function deletePost(event) {
    event.preventDefault();

    const userId = $("#delete_id").val();

    await fetch(url + "/" + userId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    });
    deleteModal.modal("hide");
    deleteTableRow(userId);


}



function editModalShow(event) {
    let id = event.target.id.replace("edit", "");
    let tags = "";
    $.getJSON(url + "/" + id, user => {
        tags += `<div class="row">
                            <span style="display:none; color: red" id="edit_method_error"></span><br>
                            <label for="edit_id" class="form-label fw-bold">Id</label>
                            <input type="text" th:name="id" value="${user.id}" class="form-control  h-50" disabled id="edit_id" placeholder="${user.id}">
                      </div>
                      <div class="row">
                            <label for="edit_first_name" class="form-label fw-bold">First name</label>
                            <input  type="text" th:name="firstName" value="${user.firstName}" class="form-control h-50" id="edit_first_name" placeholder="First name" required>
                            <span style="display:none; color: red" id="edit_first_name_error"></span><br>
                      </div>
                      <div class="row">
                            <label for="edit_last_name" class="form-label fw-bold">Last name</label>
                            <input required type="text" th:name="lastName" value="${user.lastName}" class="form-control h-50" id="edit_last_name" placeholder="Last name">
                            <span id="edit_last_name_error" style="display:none; color: red"></span><br>
                      </div>
                      <div class="row">
                            <label for="edit_age" class="form-label fw-bold">Age</label>
                            <input required type="number" th:name="age" value="${user.age}" class="form-control h-50" id="edit_age" placeholder="Age">
                            <span id="edit_age_error" style="display:none; color: red"></span><br>
                      </div>
                      <div class="row">
                            <label for="edit_email" class="form-label fw-bold">Email</label>
                            <input required type="email" th:name="email" value="${user.email}" class="form-control h-50" id="edit_email" placeholder="Email">
                            <span id="edit_email_error" style="display:none; color: red"></span><br>
                      </div>
                      <div class="row">
                            <label for="edit_password" class="form-label fw-bold">Password</label>
                            <input required type="password" th:name="password"  value="" class="form-control h-50" id="edit_password" placeholder="Password">
                            <span id="edit_password_error" style="display:none; color: red"></span><br>
                      </div>
                      <div class="row">
                            <label for="edit_roles" class="form-label fw-bold">Role</label>
                            <select name ="${user.roleNames}" size="2" id="edit_roles" required multiple>
                                <option  value="${user.allRoles[0]}" th:name="${user.allRoles[0]}">${user.allRoles[0]}</option>
                                <option  value="${user.allRoles[1]}" th:name="${user.allRoles[1]}">${user.allRoles[1]}</option>
                            </select>
                            <span id="edit_roles_error" style="display:none; color: red"></span><br>
                      </div>`
        formEdit.html(tags);
        editModal.modal('show');
    });

}

function deleteModalShow(event) {
    let id = event.target.id.replace("delete", "");
    let tags = "";
    $.getJSON(url + "/" + id, user => {
        tags += `<div class="row">
                        <label for="delete_id" class="form-label fw-bold">Id</label>
                        <input type="text" th:name="id" value="${user.id}" class="form-control  h-50" disabled id="delete_id" placeholder="${user.id}">
                  </div>
                  <div class="row">
                        <label for="delete_first_name" class="form-label fw-bold">First name</label>
                        <input  type="text" th:name="firstName" value="${user.firstName}" class="form-control h-50" disabled id="delete_first_name" placeholder="First name" required>
                  </div>
                  <div class="row">
                        <label for="delete_last_name" class="form-label fw-bold">Last name</label>
                        <input required type="text" th:name="lastName" value="${user.lastName}" class="form-control h-50" disabled id="delete_last_name" placeholder="Last name">
                  </div>
                  <div class="row">
                        <label for="delete_age" class="form-label fw-bold">Age</label>
                        <input required type="number" th:name="age" value="${user.age}" class="form-control h-50" disabled id="delete_age" placeholder="Age">
                  </div>
                  <div class="row">
                        <label for="delete_email" class="form-label fw-bold">Email</label>
                        <input required type="email" th:name="email" value="${user.email}" class="form-control h-50" disabled id="delete_email" placeholder="Email">
                  </div>
                  <div class="row">
                        <label for="delete_password" class="form-label fw-bold">Password</label>
                        <input required type="password" th:name="password"  value="" class="form-control h-50" disabled id="delete_password" placeholder="Password">
                  </div>
                  <div class="row">
                        <label for="delete_roles" class="form-label fw-bold disabled">Role</label>
                        <select disabled style="background-color: #e1e1e1" name ="${user.roleNames}" size="2" id="delete_roles" >
                            <option disabled value="${user.allRoles[0]}" th:name="${user.allRoles[0]}">${user.allRoles[0]}</option>
                            <option disabled value="${user.allRoles[1]}" th:name="${user.allRoles[1]}">${user.allRoles[1]}</option>
                        </select>
                  </div>`
        formDelete.html(tags);
        deleteModal.modal('show');
    });

}

async function newUserTabForm(event) {
    let id = event.target.id.replace("new_user-tab", "");
    let tags = "";
    let allRoles;
    await $.getJSON(url + "/" + id, json => {
        allRoles = json.allRoles;
    });

    tags += `<div class="row">
                            <span style="display:none; color: red" id="new_user_method_error"></span><br>
                            <label for="new_user_first_name" class="form-label fw-bold">First name</label>
                            <input  type="text" th:name="firstName" value="" class="form-control h-50" id="new_user_first_name" placeholder="First name" required>
                            <span style="display:none; color: red" id="new_user_first_name_error"></span><br>
                      </div>
                      <div class="row">
                            <label for="new_user_last_name" class="form-label fw-bold">Last name</label>
                            <input required type="text" th:name="lastName" value="" class="form-control h-50" id="new_user_last_name" placeholder="Last name">
                            <span id="new_user_last_name_error" style="display:none; color: red"></span><br>
                      </div>
                      <div class="row">
                            <label for="new_user_age" class="form-label fw-bold">Age</label>
                            <input required type="number" th:name="age" value="" class="form-control h-50" id="new_user_age" placeholder="Age">
                            <span id="new_user_age_error" style="display:none; color: red"></span><br>
                      </div>
                      <div class="row">
                            <label for="new_user_email" class="form-label fw-bold">Email</label>
                            <input required type="email" th:name="email" value="" class="form-control h-50" id="new_user_email" placeholder="Email">
                            <span id="new_user_email_error" style="display:none; color: red"></span><br>
                      </div>
                      <div class="row">
                            <label for="new_user_password" class="form-label fw-bold">Password</label>
                            <input required type="password" th:name="password"  value="" class="form-control h-50" id="new_user_password" placeholder="Password">
                            <span id="new_user_password_error" style="display:none; color: red"></span><br>
                      </div>
                      <div class="row">
                            <label for="new_user_roles" class="form-label fw-bold">Role</label>
                            <select name ="" size="2" id="new_user_roles" required multiple>
                                <option  value="${allRoles[0]}" th:name="${allRoles[0]}">${allRoles[0]}</option>
                                <option  value="${allRoles[1]}" th:name="${allRoles[1]}">${allRoles[1]}</option>
                            </select>
                            <span id="new_user_roles_error" style="display:none; color: red"></span><br>
                      </div>`;
    newUserForm.html(tags);
}

function alterUserTableAfterUpdate(user) {
    const select = "#user_row" + user.id;
    const newRow = addRowToUserTable(user);
    $(select).replaceWith(newRow);
}

function deleteTableRow(id) {
    const select = "#user_row" + id;
    $(select).remove();
}

function addRowToUserTable(user) {
    return `<tr id="user_row${user.id}">
                <td>${user.id}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>
                <td>${user.email}</td>
                <td>${user.roleNames.toString().replace(",", " ")}</td>
                <td><input type="button" class=" btn-edit rounded" value="Edit" id="edit${user.id}" /></td>
                <td><input type="button" class="btn-danger btn-delete rounded" value="Delete" id="delete${user.id}"/></td>
            </tr>`;
}

function formValidation(user, formName) {
    let re = /\S+@\S+\.\S+/;
    let isValid = true;
    const errorFirstNameField = $("#"+formName+"_first_name_error");
    const errorLastNameField = $("#"+formName+"_last_name_error");
    const errorAgeField = $("#"+formName+"_age_error");
    const errorEmailField = $("#"+formName+"_email_error");
    const errorPasswordField = $("#"+formName+"_password_error");
    const errorRolesField = $("#"+formName+"_roles_error");
    if (user.firstName.length <= 2) {
        errorFirstNameField.show();
        errorFirstNameField[0].innerHTML = "First name must at least 3 characters length";
        isValid = false;
    } else {
        errorFirstNameField.hide();
    }
    if (user.lastName.length <= 2) {
        errorLastNameField.show();
        errorLastNameField[0].innerHTML = "Last name must at least 3 characters length";
        isValid = false;
    } else {
        errorLastNameField.hide();
    }
    if ((user.age <= 0) || (user.age >= 150)) {
        errorAgeField.show();
        errorAgeField[0].innerHTML = "Enter correct age";
        isValid = false;
    } else {
        errorAgeField.hide();
    }
    if (re.test(user.email) === false) {
        errorEmailField.show();
        errorEmailField[0].innerHTML = "Enter correct email";
        isValid = false;
    } else {
        errorEmailField.hide();
    }
    if (user.password.length <= 5) {
        errorPasswordField.show();
        errorPasswordField[0].innerHTML = "Password must at least 5 characters length";
        isValid = false;
    } else {
        errorPasswordField.hide();
    }
    if (user.roleNames.length === 0) {
        errorRolesField.show();
        errorRolesField[0].innerHTML = "Choose at least 1 role";
        isValid = false;
    } else {
        errorRolesField.hide();
    }
    return isValid;
}



