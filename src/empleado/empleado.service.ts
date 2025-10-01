import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from '../entities/empleado.entity';
import { Rol } from '../entities/rol.entity';
import { CreateEmpleadoDto } from '../common/dto/create-empleado.dto';
import { UpdateEmpleadoDto } from '../common/dto/update-empleado.dto';

@Injectable()
export class EmpleadoService {
  constructor(
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async create(data: CreateEmpleadoDto): Promise<Empleado> {
    const rol = await this.rolRepository.findOne({ where: { idRol: data.idRol } });
    if (!rol) throw new BadRequestException('Rol no encontrado');
    const empleado = this.empleadoRepository.create({
      nombre: data.nombre,
      apellido: data.apellido,
      rol: rol,
    });
    return await this.empleadoRepository.save(empleado);
  }

  async findAll(): Promise<Empleado[]> {
    return await this.empleadoRepository.find({ relations: ['rol', 'usuario', 'ventas'] });
  }

  async findOne(id: number): Promise<Empleado> {
    const empleado = await this.empleadoRepository.findOne({ where: { idEmpleado: id }, relations: ['rol', 'usuario', 'ventas'] });
    if (!empleado) throw new NotFoundException('Empleado no encontrado');
    return empleado;
  }

  async update(id: number, data: UpdateEmpleadoDto): Promise<Empleado> {
    const empleado = await this.findOne(id);
    if (data.nombre) empleado.nombre = data.nombre;
    if (data.apellido) empleado.apellido = data.apellido;
    if (data.idRol) {
      const rol = await this.rolRepository.findOne({ where: { idRol: data.idRol } });
      if (!rol) throw new BadRequestException('Rol no encontrado');
      empleado.rol = rol;
    }
    return await this.empleadoRepository.save(empleado);
  }

  async remove(id: number): Promise<void> {
    const empleado = await this.findOne(id);
    await this.empleadoRepository.remove(empleado);
  }
}