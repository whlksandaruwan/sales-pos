import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StockService } from './stock.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleEnum } from '../auth/roles.enum';

@ApiTags('Stock')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('stock')
export class StockController {
  constructor(private service: StockService) {}

  @Get('product/:productId')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  getByProduct(@Param('productId') productId: string) {
    return this.service.getByProduct(Number(productId));
  }

  @Post('adjust')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  async adjust(
    @Req() req: any,
    @Body() body: { productId: number; storeId: number; quantity: number },
  ) {
    const user = req.user as { id: number };
    return this.service.adjust(
      body.productId,
      body.storeId,
      body.quantity,
      user.id,
    );
  }

  @Post('set')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  async set(
    @Req() req: any,
    @Body() body: { productId: number; storeId: number; quantity: number },
  ) {
    const user = req.user as { id: number };
    return this.service.set(
      body.productId,
      body.storeId,
      body.quantity,
      user.id,
    );
  }
}

