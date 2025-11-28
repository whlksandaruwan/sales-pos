import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleEnum } from '../auth/roles.enum';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Post()
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  create(@Body() body: { name: string }) {
    return this.service.create(body.name);
  }

  @Put(':id')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  update(@Param('id') id: string, @Body() body: { name: string }) {
    return this.service.update(Number(id), body.name);
  }

  @Delete(':id')
  @Roles(RoleEnum.Admin)
  delete(@Param('id') id: string) {
    return this.service.delete(Number(id));
  }
}

