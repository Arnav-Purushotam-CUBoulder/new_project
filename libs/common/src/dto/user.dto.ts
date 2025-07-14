export interface UserDto {
    //here if you go to the user schema file, you can see that there are only password, email
    //there is no _id, it is implicit and it is of the type _id (an object)
    //but when sent over a wire it is of type string, therefore we have to specify string here
    _id: string,
    password: string,
    email: string,
    // userName: string,
}