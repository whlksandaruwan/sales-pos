import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrintStickerDto } from './dto/print-sticker.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { RoleEnum } from '../auth/roles.enum';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async getAll(@Query('q') q?: string) {
    return this.productsService.findAll(q);
  }

  @Get('by-barcode/:code')
  async getByBarcode(@Param('code') code: string) {
    return this.productsService.findByBarcode(code);
  }

  @Post()
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Post('bulk')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  async bulkCreate(@Body() dtos: CreateProductDto[]) {
    return this.productsService.bulkCreate(dtos);
  }

  @Put(':id')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(Number(id), dto);
  }

  @Delete(':id')
  @Roles(RoleEnum.Admin)
  async delete(@Param('id') id: string) {
    return this.productsService.delete(Number(id));
  }

  @Post('print-sticker')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  async printSticker(@Body() dto: PrintStickerDto) {
    // For now, just echo back; printing is handled by local print agent directly
    return { success: true, productIds: dto.productIds };
  }
}


