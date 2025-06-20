import bcrypt from "bcryptjs";


const password="@Rajnish007"

bcrypt.hash(password,10).then((hash)=>{
    console.log("Hashed Password: ", hash);
})