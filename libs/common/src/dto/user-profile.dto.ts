export interface UserProfileDto {
    //here if you go to the user schema file, you can see that there are only password, email
    //there is no _id, it is implicit and it is of the type _id (an object)
    //but when sent over a wire it is of type string, therefore we have to specify string here
    _id: string,
    firstName: string,
    lastName: string,
    dob: string,
    gender: string,
    phone: number
    email: string,
   
}