import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RefsService } from './refs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleEnum } from '../auth/roles.enum';
import { CreateRefDto } from './dto/create-ref.dto';
import { CreateRefDeliveryDto } from './dto/create-ref-delivery.dto';

@ApiTags('Refs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('refs')
export class RefsController {
  constructor(private readonly refsService: RefsService) {}

  @Post()
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  createRef(@Body() dto: CreateRefDto) {
    return this.refsService.createRef(dto);
  }

  @Get()
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  listRefs() {
    return this.refsService.listRefs();
  }

  @Post(':id/deliveries')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  addDelivery(
    @Param('id') id: string,
    @Body() dto: CreateRefDeliveryDto,
  ) {
    return this.refsService.addDelivery(Number(id), dto);
  }

  @Get(':id/deliveries')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  listDeliveriesForRef(@Param('id') id: string) {
    return this.refsService.listDeliveriesForRef(Number(id));
  }

  @Get('deliveries/all')
  @Roles(RoleEnum.Admin, RoleEnum.Manager)
  listAllDeliveries() {
    return this.refsService.listAllDeliveries();
  }
}


