import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as passport from "passport";
import { ExcludeNullInterceptor } from "src/interceptors/exclude-null.interceptor";
import { TimeoutInterceptor } from "src/interceptors/timeout.interceptor";
import { TransformInterceptor } from "src/interceptors/transform.interceptor";

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

export function globalPipesRegistrar(app: INestApplication){
    app.useGlobalPipes(new ValidationPipe({transform: true}));
}

export function globalInterceptorRegistrar(app: INestApplication){
    app.useGlobalInterceptors(
        new TimeoutInterceptor(),
        new ExcludeNullInterceptor(),
        new TransformInterceptor()
    );
}

export function setupSwagger(app: INestApplication): void {
    const options = new DocumentBuilder()
        .setTitle("Inventory API Documentation")
        .setDescription("Inventory API's documentation")
        .setVersion('1.0.0')
        .addServer(`${process.env.APP_URL}`,'Local environtment')
        .addCookieAuth('auth-session',{
            type: "apiKey",
            in: "cookie",
            name: process.env.COOKIE_NAME
        }, "session")
        .addTag("Auth","Authentication ability", {url:"/api/v1/auth", description: "Authentication endpoint"})
        .addTag("User","User Management Endpoint", {url: "/api/v1/user", description: "User endpoint"})
        .addTag("Role","Role Management Endpoint", {url: "/api/v1/role", description: "Role endpoint"})
        .addTag("Item","Item management Endpoint", {url: "/api/v1/item", description: "Item endpoint"})
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
}