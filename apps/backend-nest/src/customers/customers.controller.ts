import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleEnum } from '../auth/roles.enum';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Post()
  @Roles(RoleEnum.Admin, RoleEnum.Manager, RoleEnum.Cashier)
  create(@Body() dto: CreateCustomerDto) {
    return this.customersService.create(dto);
  }

  @Get()
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  findAll() {
    return this.customersService.findAll();
  }

  @Get('product-refs')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  productRefs() {
    return this.customersService.productRefs();
  }

  @Get(':id')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(Number(id));
  }

  @Patch(':id')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.customersService.update(Number(id), dto);
  }

  @Post(':id/settle-credit')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  settleCredit(@Param('id') id: string, @Query('amount') amount: string) {
    return this.customersService.settleCredit(
      Number(id),
      Number(amount || 0),
    );
  }

  @Get(':id/sales')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  salesHistory(@Param('id') id: string) {
    return this.customersService.salesHistory(Number(id));
  }
}


