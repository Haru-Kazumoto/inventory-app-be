import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as passport from "passport";

const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;
const PREFIX_API = `api/v${process.env.APP_VERSION}`;

export default {
    corsOption: {
        origin: "",
        credential: true
    },
    cookieOptions: {
        name: process.env.COOKIE_NAME,
        secret: process.env.COOKIE_SECRET_KEY,
        maxAge: COOKIE_MAX_AGE,
        resave: false,
        saveUninitialized: false,
        store:{
            cleanupLimit: 2,
            ttl: 86400,
        }
    },
    globalPrefix: PREFIX_API
};

export function passportConfig(app: INestApplication){
    app.use(passport.initialize());
    app.use(passport.session());
}

export function pipesRegistrar(app: INestApplication){
    app.useGlobalPipes(new ValidationPipe({transform: true}));
}