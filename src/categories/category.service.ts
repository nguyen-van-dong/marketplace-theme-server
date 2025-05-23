import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}

  findAll() {
    return this.repo.find();
  }

  create(name: string) {
    const category = this.repo.create({ name });
    return this.repo.save(category);
  }

  findById(id: string) {
    return this.repo.findOneBy({ id });
  }
}
