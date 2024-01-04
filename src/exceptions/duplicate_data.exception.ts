import { HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";

export class DuplicateDataException extends HttpException{
    constructor(message?: string, status?: HttpStatus.BAD_REQUEST){
        super(message || "Duplicate data error.", status)
    }

    getResponse(): string | object {
        return this.message;
    }
}