import { HttpException, HttpStatus } from "@nestjs/common";

export class BadCredentialException extends HttpException{
    constructor(message?: string, status?: HttpStatus.UNAUTHORIZED){
        super(message || "Invalid credentials", status)
    }

    getResponse(): string | object {
        return this.message;
    }
}