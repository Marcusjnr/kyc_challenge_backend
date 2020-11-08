const functions = require('firebase-functions');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const { successResponse, errorResponse } = require('../utils/responses');
const sesClient = require('../utils/ses-client');

class AuthenticationController{
    static async signUpUser(req, res){
        let verificationCode = AuthenticationController.randomNumberGenerator(1000, 9999);
        try {
            await db.collection('users').add({
                firstname: req.body.first_name,
                lastname: req.body.last_name,
                username: req.body.username,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 8),
                confirmationcode: verificationCode.toString(),
                emailvalidated: false,
                level: '0'
            });

            await sesClient.sendEmail(req.body.email, 'Confirmation Code', verificationCode.toString(), req, res, '"shootfish.xyz" <noreply@bshop.shootfish.xyz>');

            return successResponse(true, {
                firstname: req.body.first_name,
                lastname: req.body.last_name,
                username: req.body.username,
                email: req.body.email,
                email_verification: false,
                level: '0'
            }, 'Sign Up Successful', res);

        }catch (e) {
            return errorResponse(
                false,
                'Something went wrong',
                500,
                res

            );
        }

    }

    static async loginUser(req, res){
        try{
            let userData;
            const userRef = db.collection('users');
            const snapshot = await userRef.where('email', '==', req.body.email).limit(1).get();
            if (snapshot.empty) {

                return errorResponse(
                    false,
                    'User does not exist',
                    401,
                    res,

                );
            }

            snapshot.forEach(doc =>{
                    userData = doc.data();
                });

            let passwordIsValid = bcrypt.compareSync(req.body.password, userData.password);
            let emailValidated = userData. emailvalidated;

            if(passwordIsValid){
                return successResponse(
                    true,
                    {
                        user: userData,
                        validated: emailValidated
                    },
                    'Login Successful',
                    res);
            }

            return errorResponse(
                false,
                'Email or password incorrect',
                401,
                res

            );


        }catch (e) {
            return errorResponse(
                false,
                'Something went wrong',
                500,
                res

            );
        }
    }

    static randomNumberGenerator(min, max) {
        return Math.floor(
            Math.random() * (max - min + 1) + min,
        );
    }

    static async validateEmail(req, res){
        let tokenFromDb;
        let userData;
        let docId;
        const userRef = db.collection('users');
        const snapshot = await userRef.where('email', '==', req.body.email).limit(1).get();

        snapshot.forEach(doc =>{
            userData = doc.data();
            docId = doc.id;
        });

        tokenFromDb = userData.confirmationcode;

        if(req.body.token === tokenFromDb){
            await db.collection("users").doc(docId).update({
                emailvalidated: true
            });
            return successResponse(
                true,
                {
                    emailvalidated: true
                },
                'Email Validated Successfully',
                res
            )
        }

        return errorResponse(
            false,
            'Token does not match',
            401,
            res

        );

    }

    static async updateLevel(req, res){
        try {
            let docId;
            const userRef = db.collection('users');
            const snapshot = await userRef.where('email', '==', req.body.email).limit(1).get();

            snapshot.forEach(doc =>{
                docId = doc.id;
            });

            await db.collection("users").doc(docId).update({
                level: req.body.level
            });

            if(req.body.level === '2'){
                await sesClient.sendEmail(req.body.email, 'Account Upgraded', 'You have upgraded your account to level 2', req, res, '"shootfish.xyz" <noreply@bshop.shootfish.xyz>');
            }
            return successResponse(
                true,
                {
                    userlevel: 'updated'
                },
                'User Level updated',
                res)
        }catch (e) {
            return errorResponse(
                false,
                'Something went wrong',
                500,
                res

            );
        }
    }

}

module.exports = {
  signUpUser: AuthenticationController.signUpUser,
    loginUser: AuthenticationController.loginUser,
    updateLevel: AuthenticationController.updateLevel,
    validateEmail: AuthenticationController.validateEmail
};
