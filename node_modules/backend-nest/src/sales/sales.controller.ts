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
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { RefundSaleDto } from './dto/refund-sale.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleEnum } from '../auth/roles.enum';

@ApiTags('Sales')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sales')
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Post()
  @Roles(RoleEnum.Admin, RoleEnum.Manager, RoleEnum.Cashier)
  async create(@Req() req: any, @Body() dto: CreateSaleDto) {
    const user = req.user as { id: number };
    const storeId = 1; // In a full implementation, derive from terminal or user
    const sale = await this.salesService.create(user.id, storeId, dto);
    // In a full implementation, emit Socket.IO event and send print job
    return sale;
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.salesService.findOne(Number(id));
  }

  @Post(':id/refund')
  @Roles(RoleEnum.Admin, RoleEnum.Manager, RoleEnum.Cashier)
  async refund(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: RefundSaleDto,
  ) {
    const user = req.user as { id: number };
    const storeId = 1;
    return this.salesService.refund(
      Number(id),
      user.id,
      storeId,
      dto.items,
    );
  }
}


