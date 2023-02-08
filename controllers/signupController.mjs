import { stringToHash } from "bcrypt-inzi";
import { userModel } from "../model.mjs";







export const signupController = async (request, response) => {

    let body = request.body
    body.email = body.email.toLowerCase();



    await userModel.findOne({ email: body.email }, (err, user) => {
        if (!err) {
            console.log("user ===> ", user);

            if (user) {
                console.log("user exist already ===>", user);

                response.status(400).send({
                    message: "this email is already exist please try a different one.",
                });
                return;
            } else {
                stringToHash(body.password).then((hashedPassword) => {
                    userModel.create(
                        {
                            firstName: body.firstName,
                            lastName: body.lastName,
                            email: body.email,
                            password: hashedPassword,
                        },
                        (err, user) => {
                            if (!err) {
                                console.log("user created ==> ", user);

                                response.status(201).send({
                                    message: "user created successfully",
                                    data: user,
                                });
                            } else {
                                console.log("server error: ", err);
                                response.status(500).send({
                                    message: "server error",
                                    error: err,
                                });
                            }
                        }
                    );
                });
            }
        } else {
            console.log("error ===> ", err);
            response.status(500).send({
                message: "server error",
                error: err,
            });
            return;
        }
    });
}