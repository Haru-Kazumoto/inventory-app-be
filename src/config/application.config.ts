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
        origin: "http://localhost:5173",
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
        // new ExcludeNullInterceptor(),
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
        .addTag("Auth","Authentication ability", {url:`${PREFIX_API}/auth`, description: "Authentication endpoint"})
        .addTag("User","User Management Endpoint", {url:`${PREFIX_API}/user`, description: "User endpoint"})
        .addTag("Item","Item management Endpoint", {url:`${PREFIX_API}/item`, description: "Item endpoint"})
        .addTag("Notification","Notification Management Endpoint", {url:`${PREFIX_API}/notification`, description: "Notification endpoint"})
        .addTag("AuditLog","Audit Log Management Endpoint", {url:`${PREFIX_API}/audit-logs`, description: "Audit Log endpoint",})
        .addTag("ExitLogs","Exit Logs managemnent endpoint")
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
}