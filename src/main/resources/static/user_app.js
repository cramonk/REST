$(document).ready(function () {
    getCurrentUserInfo();
});

const url = 'http://localhost:8080/rest/user';

const userTableBody = $(".user_table_body");

async function getCurrentUserInfo() {
    let resp = await fetch(url);
    let tagsBody = "";
    let user = await resp.json();
    tagsBody += `<tr>
                <td>${user.id}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>
                <td>${user.email}</td>
                <td>${user.roleNames.toString().replace(",", " ")}</td>
            </tr>`;
    userTableBody.html(tagsBody);
}
