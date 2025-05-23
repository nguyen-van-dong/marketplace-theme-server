import { Body, Controller, Get, Post } from "@nestjs/common";
import { CategoryService } from "./category.service";

@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body('name') name: string) {
    return this.service.create(name);
  }
}
