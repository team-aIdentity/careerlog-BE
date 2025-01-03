import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entity/project.entity';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async findOneWithUser(projectId: number, userId: number) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId, user: { id: userId } },
      relations: ['user', 'user.profile'],
    });
    return project;
  }

  /*
    method for resume
  */
  async updateVisibility(userId: number, body: any) {
    const project = await this.findOneWithUser(body.projectId, userId);
    project.isInclude = body.isInclude;
    await this.projectRepository.save(project);
    return project;
  }

  async getAllResume(userId: number) {
    const projects = await this.projectRepository.find({
      where: { user: { id: userId }, isInclude: true },
    });
    return projects;
  }

  /*
    method for share link
  */
  async updateShareLinkVisibility(userId: number, body: any) {
    const project = await this.findOneWithUser(body.projectId, userId);
    project.isPublic = body.isPublic;
    await this.projectRepository.save(project);
    return project;
  }

  async getAllShareLink(userId: number) {
    const projects = await this.projectRepository.find({
      where: { user: { id: userId }, isPublic: true },
    });
    return projects;
  }

  async findAll(userId: number, take: number, page: number) {
    const [projects, total] = await this.projectRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['user', 'user.profile'],
      take,
      skip: (page - 1) * take,
    });

    return {
      data: projects,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  async findOne(id: number, userId: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user', 'user.profile'],
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async create(
    createProjectDto: CreateProjectDto,
    userId: number,
  ): Promise<Project> {
    const project = this.projectRepository.create({
      ...createProjectDto,
      user: { id: userId },
    });
    return await this.projectRepository.save(project);
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
    userId: number,
  ): Promise<Project> {
    const project = await this.findOne(id, userId);
    Object.assign(project, updateProjectDto);
    return await this.projectRepository.save(project);
  }

  async delete(id: number, userId: number): Promise<any> {
    const project = await this.findOne(id, userId);
    await this.projectRepository.remove(project);
    return { message: 'Project deleted successfully', project };
  }
}
