import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { AuthGuard } from "src/common/guards/auth-guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "../common/decorators/role-decarator";
import { UserRole } from "../common/constants/role-constants";
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

@ApiTags('Product')
@ApiBearerAuth("JWT-auth")
@ApiForbiddenResponse({ description: 'Forbidden.'})
@ApiUnauthorizedResponse({ description: 'Unauthorized.'})
@UseGuards(AuthGuard, RolesGuard)
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiCreatedResponse({description: 'user data'})
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @ApiOkResponse({description: "users list"})
  @Roles(UserRole.USER, UserRole.ADMIN)
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @ApiOkResponse()
  @ApiNotFoundResponse({description: "Product not found"})
  @Roles(UserRole.USER, UserRole.ADMIN)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productService.findOne(+id);
  }

  @ApiOkResponse({description: "Updated"})
  @ApiNotFoundResponse({description: "Product not found"})
  @Roles(UserRole.ADMIN)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @ApiOkResponse({description: "Deleted"})
  @ApiNotFoundResponse({description: "Product not found"})
  @Roles(UserRole.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.productService.remove(+id);
  }
}
