import {
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { DbService } from './db.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery, // Importar ApiQuery para la documentación de Swagger
} from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly dbService: DbService) {}

  @Get()
  async getAllTasks() {
    const tasks = await this.dbService.query('SELECT * FROM Tasks');
    return tasks;
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva tarea' })
  @ApiQuery({ name: 'name', type: String, description: 'Nombre de la tarea' })
  @ApiQuery({
    name: 'description',
    type: String,
    description: 'Descripción de la tarea',
  })
  async createTask(
    @Query('name') name: string,
    @Query('description') description: string,
  ) {
    try {
      await this.dbService.query(
        `INSERT INTO Tasks (Name, Description) VALUES ('${name}', '${description}')`,
      );
      return { message: 'Tarea creada exitosamente' };
    } catch (error) {
      // Manejar el error aquí
      console.error('Error al crear tarea:', error);
      throw new InternalServerErrorException('Error al crear tarea');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una tarea existente por ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID de la tarea a actualizar',
  })
  @ApiQuery({
    name: 'name',
    type: String,
    description: 'Nuevo nombre de la tarea',
    required: false,
  })
  @ApiQuery({
    name: 'description',
    type: String,
    description: 'Nueva descripción de la tarea',
    required: false,
  })
  async updateTask(
    @Param('id') id: number,
    @Query('name') name: string,
    @Query('description') description: string,
  ) {
    try {
      await this.dbService.query(
        `UPDATE Tasks SET Name = '${name}', Description = '${description}' WHERE Id = ${id}`,
      );
      return { message: 'Tarea actualizada exitosamente' };
    } catch (error) {
      // Manejar el error aquí
      console.error('Error al actualizar tarea:', error);
      throw new InternalServerErrorException('Error al actualizar tarea');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarea por ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'ID de la tarea a eliminar',
  })
  async deleteTask(@Param('id') id: number) {
    await this.dbService.query(`DELETE FROM Tasks WHERE Id = ${id}`);
    return { message: 'Tarea eliminada exitosamente' };
  }
}
