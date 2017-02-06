import { Http, BaseRequestOptions, Request, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import * as uuid from 'uuid';

import { BackendHttp } from '../../_app-services';

import {
  IUserObject,
  IUserAndPasswordObject,
  Role,
  ICredentialsObject
} from 'jsmoney-server-api';


let fakeUserData: IUserAndPasswordObject[] = [
  {
    user: {
      id: uuid.v4(),
      version: 0,
      username: 'admin',
      firstName: '...',
      lastName: '...',
      email: 'admin@domain.com',
      role: Role.administrator
    },
    password: 'Password'
  },
  {
    user: {
      id: uuid.v4(),
      version: 0,
      username: 'user',
      firstName: '...',
      lastName: '...',
      email: 'user@domain.com',
      role: Role.user
    },
    password: 'Password'
  }
];

export class ErrorResponse extends Response implements Error {
    name: any
    message: any
}


export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: BackendHttp,
    useFactory: (backend: MockBackend, options: BaseRequestOptions) => {
        // array in local storage for registered users

        if (! localStorage.getItem('users')) {
          localStorage.setItem('users', JSON.stringify(fakeUserData));
        }
        let users: IUserAndPasswordObject[] = JSON.parse(localStorage.getItem('users'));

        // configure fake backend
        backend.connections.subscribe((connection: MockConnection) => {
            // wrap in timeout to simulate server api call
            setTimeout(() => {

                console.log('Fake backend, got request ' + JSON.stringify(connection.request, null, 4));
                // authenticate
                if (connection.request.url.endsWith('/authenticate') && connection.request.method === RequestMethod.Post) {
                    // get parameters from post request
                    let params: ICredentialsObject = JSON.parse(connection.request.getBody());

                    console.log('Fake backend authenticate called, credentials = ' + JSON.stringify(params, null, 4))
                    
                    // find if any user matches login credentials
                    let filteredUsers: IUserAndPasswordObject[] = users.filter(ud => {
                        return ud.user.username === params.username && ud.password === params.password;
                    });

                    if (filteredUsers.length) {
                        // if login details are valid return 200 OK with user details and fake jwt token
                        let user: IUserObject = filteredUsers[0].user;
                        connection.mockRespond(new Response(new ResponseOptions(
                          {
                            status: 200,
                            body: {
                                data: {
                                  user: user,
                                  token: makeToken(user)
                                }
                            }
                          }
                        )));
                    } else {
                        // else return 403 Forbidden
                        return returnError(connection, 403, 'Username or password is incorrect');
                    }
                }

                // get users
                if (connection.request.url.endsWith('/users') && connection.request.method === RequestMethod.Get) {
                    // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                    let auth = checkAuthorization(connection.request, Role.administrator);
                    if (auth === AuthStatus.noauth) {
                      // return 401 not authorised if token is null or invalid
                      return returnError(connection, 401, 'Not logged in or not authorized');
                    } else if (auth === AuthStatus.nouser) {
                      // Internal error
                      return returnError(connection, 500, 'No user returned internally');
                    }

                    // OK and authorized
                    let result: IUserObject[] = users.map(ud => ud.user);
                    connection.mockRespond(new Response(new ResponseOptions(
                      {
                        status: 200,
                        body:
                          {
                            data: {
                              users: result
                            }
                          }
                      }
                    )));

                }

                // get user by id
                if (connection.request.url.match(/\/users\/\d+$/) && connection.request.method === RequestMethod.Get) {
                    // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                    let auth = checkAuthorization(connection.request, Role.administrator);
                    if (auth === AuthStatus.noauth) {
                      // return 401 not authorised if token is null or invalid
                      return returnError(connection, 401, 'Not logged in or not authorized');
                    } else if (auth === AuthStatus.nouser) {
                      // Internal error
                      return returnError(connection, 500, 'No user returned internally');
                    }

                    // OK and authorized
                    // find user by id in users array
                    let urlParts = connection.request.url.split('/');
                    let id: string = urlParts[urlParts.length - 1];
                    let matchedUsers: IUserObject[] = users.map(ud => ud.user).filter(user => { return user.id === id; });
                    let user: IUserObject = matchedUsers.length ? matchedUsers[0] : null;

                    // respond 200 OK with user
                    connection.mockRespond(new Response(new ResponseOptions(
                      {
                        status: 200,
                        body:
                          {
                            data: {
                              user: user
                            }
                          }
                      }
                    )));
                }

                // create user
                if (connection.request.url.endsWith('/users') && connection.request.method === RequestMethod.Post) {
                    let auth = checkAuthorization(connection.request, Role.administrator);
                    if (auth === AuthStatus.noauth) {
                      // return 401 not authorised if token is null or invalid
                      return returnError(connection, 401, 'Not logged in or not authorized');
                    } else if (auth === AuthStatus.nouser) {
                      // Internal error
                      return returnError(connection, 500, 'No user returned internally');
                    }

                    // OK and authorized
                    // get new user object from post body
                    let newUser: IUserAndPasswordObject  = <IUserAndPasswordObject>JSON.parse(connection.request.getBody());

                    // validation
                    let duplicateUser: number = users.filter(ud => { return ud.user.username === newUser.user.username; }).length;
                    if (duplicateUser) {
                        return returnError(connection, 409, 'Username "' + newUser.user.username + '" is already taken');
                    }

                    // save new user
                    users.push(newUser);
                    localStorage.setItem('users', JSON.stringify(users));

                    // respond 201 OK + newUser data
                    connection.mockRespond(new Response(new ResponseOptions(
                      {
                        status: 201,
                        body:
                          {
                            data: {
                              user: newUser
                            }
                          }
                      }
                    )));
                }

                // delete user
                if (connection.request.url.match(/\/users\/\d+$/) && connection.request.method === RequestMethod.Delete) {
                    // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                    let auth = checkAuthorization(connection.request, Role.administrator);
                    if (auth === AuthStatus.noauth) {
                      // return 401 not authorised if token is null or invalid
                      return returnError(connection, 401, 'Not logged in or not authorized');
                    } else if (auth === AuthStatus.nouser) {
                      // Internal error
                      return returnError(connection, 500, 'No user returned internally');
                    }

                    // OK and authorized
                    // find user by id in users array
                    let urlParts = connection.request.url.split('/');
                    let id: string = urlParts[urlParts.length - 1];
                    for (let i = 0; i < users.length; i++) {
                        let user: IUserObject = users[i].user;
                        if (user.id === id) {
                            // delete user
                            users.splice(i, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }

                    // respond 200 OK
                    connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
                }
            }, 500);

        });

        return new Http(backend, options);
    },
    deps: [MockBackend, BaseRequestOptions]
};

function returnError(conn: MockConnection, sts: number, inf: string): void {
  conn.mockRespond(new ErrorResponse(new ResponseOptions(
    {
      status: sts,
      body: {
        info: inf
      }
    }
  )));
}

type FakeToken = {
  user: IUserObject,
  key: string
};

function makeToken(user: IUserObject): string {
  let token: FakeToken = { user: user, key: 'fake-token' };
  return JSON.stringify(token);
}

function decodeToken(encodedToken: string): IUserObject {
  let ud: FakeToken = JSON.parse(encodedToken);
  if (ud && ud.key && ud.key === 'fake-token') {
    return ud.user;
  } else {
    return undefined;
  }
}

enum AuthStatus {
  ok,
  nouser,
  noauth
}

function checkAuthorization(request: Request, role: Role): AuthStatus {
  let hdr: string = request.headers.get('Authorization');
  if (hdr) {
    let hdrData: string[] = hdr.match(/^([Jj][Ww][Tt])\s+(.*)$/);
    if (hdrData.length === 3) {
      let user: IUserObject = decodeToken(hdrData[2]);
      if (user && user.role >= role) {
        return AuthStatus.ok;
      } else {
        return AuthStatus.noauth;
      }
    }
  } else {
    return AuthStatus.nouser;
  }

}
