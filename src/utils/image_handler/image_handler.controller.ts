import { BadRequestException, Controller, Get, Param, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { ReadStream, createReadStream } from "fs";
import { join } from "path";
import { FindOneRequestDecorator } from "src/modules/request_items/decorator/find-one-request.decorator";
import { RequestItemsRepository } from "src/modules/request_items/repository/request_items.repository";

@Controller('images')
export class ImageController {
    constructor(
        private requestItemRepository: RequestItemsRepository
    ){}

    @Get(':imagePath')
    getImage(@Param("imagePath") imgPath: string, @Res() res: Response) {
        const imagePath: string = join(process.cwd(), 'uploads/images', imgPath);
        const imageStream: ReadStream = createReadStream(imagePath);

        imageStream.on('open', () => {
            imageStream.pipe(res);
        });

        imageStream.on('error', () => {
            res.status(404).send({
                statusCode: res.statusCode,
                message: "Image not found"
            })
        });        
    }

    @Get("find-one")
    @FindOneRequestDecorator()
    public async findOne(@Query('request_item_id') id: number){
        const data = this.requestItemRepository.findById(id);
        if(!data) throw new BadRequestException("Id not found");
    
        return {
            [this.findOne.name]: data
        }
    }
}