import { authHeader } from "./auth-header";

export const userService = {
  login,
  logout,
  infoUser,
//   register,
//   getAll,
};

// @TODO move to ENV
const baseUrl = 'https://api.shirtplaces.com'

function login(email, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  };

  return fetch(`${baseUrl}/seller/auth`, requestOptions)
    .then(handleResponse)
    .then((user) => {
      return user;
    });
}

function infoUser() {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  return fetch(`${baseUrl}/seller/auth`, requestOptions)
    .then(handleResponse)
    .then((user) => {
      return user;
    });
}

function logout() {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  };
  return fetch(`${baseUrl}/seller/auth`, requestOptions)
    .then(handleResponse)
    .then((user) => {
      // login successful if there's a jwt token in the response
      // if (user.token) {
      //     // store user details and jwt token in local storage to keep user logged in between page refreshes
      //     localStorage.setItem('user', JSON.stringify(user));
      // }
      return user;
    });
}

// function register(user) {
//   const requestOptions = {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(user),
//   };
//   return fetch(`/users/register`, requestOptions).then(handleResponse);
// }

// function getAll() {
//   const requestOptions = {
//     method: "GET",
//     headers: authHeader(),
//   };
//   return fetch(`/users`, requestOptions).then(handleResponse);
// }

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        location.reload(true);
      }
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
}
