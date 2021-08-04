import { OneToMany } from "typeorm";
import { ProjectEntity } from "../../../../core/infra";
import { Project } from "../../domain/models";

export default class ProjectRepository {
  async getProjects(): Promise<Project[]> {
    const projects = await ProjectEntity.find();

    return projects.map((project) => {
      return {
        uid: project.uid,
        name: project.name,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        userUid: project.userUid,
      } as Project;
    });
  }

  async getProject(uid: string): Promise<Project | undefined> {
    const project = await ProjectEntity.findOne(uid, { relations: ["tasks"] });

    if (!project) return undefined;

    return {
      uid: project.uid,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      userUid: project.userUid,
      tasks: project.tasks?.map((task) => {
        return {
          uid: task.uid,
          name: task.name,
          projectUid: task.projectUid,
        };
      }),
    };
  }

  async create(params: Project): Promise<Project> {
    const { name, description, startDate, endDate, userUid } = params;

    const project = await ProjectEntity.create({
      name,
      description,
      startDate,
      endDate,
      userUid,
    }).save();

    return Object.assign({}, params, project);
  }

  async update(uid: string, params: Project): Promise<Project | undefined> {
    const { name, description, startDate, endDate, userUid } = params;

    //It works https://typeorm.io/#/
    // const project = await ProjectEntity.findOne(uid);

    // if (!project) return undefined;

    // project.name = name;
    // project.description = description;
    // project.startDate = startDate;
    // project.endDate = endDate;
    // project.userUid = userUid;

    // await project!.save();

    const project = await ProjectEntity.update(uid, {
      name,
      description,
      startDate,
      endDate,
      userUid,
    });

    return Object.assign({}, params, project);
  }

  async delete(uid: string): Promise<Project> {
    //const { uid } = params;
    //const exist = await ProjectEntity.findOne(uid);

    const project = await ProjectEntity.delete(uid);

    return Object.assign(project);
  }
}
