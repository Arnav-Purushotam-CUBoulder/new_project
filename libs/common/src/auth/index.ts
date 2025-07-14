//in libs/common you put in all the common code
//i.e. all the code that is used accross all the microservices
//such as for example a common jwtAuthGuard that will protect routes within our'
//microservices (except auth), which will initiate an RPC call to the auth service to
//determine whether a user is authorised or not, if authorised, the user is returned

export * from './jwt-auth.guard';
