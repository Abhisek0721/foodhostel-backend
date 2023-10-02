import { SessionData } from 'express-session';

interface ISession {
    user?: {
        userId: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
    };
    sentOTP?: {
        firstName: string;
        lastName: string,
        phoneNumber: string;
        password: string;
        generatedOTP: string;
    };
    forgotPassword?: {
        phoneNumber: string;
        generatedOTP: string;
        verified: boolean;
    }
}

export default ISession;