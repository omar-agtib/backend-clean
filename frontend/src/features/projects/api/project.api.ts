import { http } from "../../../lib/http";

export type Project = {
  _id: string;
  name: string;
  description?: string;
  status?: string;
  owner?: string;
};

export type CreateProjectDto = {
  name: string;
  description?: string;
};

export async function getMyProjects() {
  const { data } = await http.get<Project[]>("/projects");
  return data;
}

export async function createProjectApi(dto: CreateProjectDto) {
  const { data } = await http.post<Project>("/projects", dto);
  return data;
}
