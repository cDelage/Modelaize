import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ProjectIndex, Project } from "../../../electron/types/Project.type";
import { DataRelation } from "../../../electron/types/Model.type";
import { Edge } from "reactflow";
import { RelationInformations } from "../../../electron/types/RelationInformations.type";

export function useCreateProject() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: createProject, isPending: isCreatingProject } = useMutation({
    mutationFn: window.project.createProject,
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate(`/${id}`);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  return { createProject, isCreatingProject };
}

export function useGetAllProjects() {
  const { data: allProjectsIndex, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: window.project.getAllProjects,
  });

  return {
    allProjectsIndex,
    isLoadingProjects,
  };
}

export function useUpdateProjectIndex() {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { mutate: updateProjectIndex, isPending: isUpdatingProjectIndex } =
    useMutation({
      mutationFn: (projectIndex: ProjectIndex) =>
        window.project.updateProjectIndex({
          ...projectIndex,
          needSave: undefined,
        }),
      onError: (err) => {
        console.error(err);
      },
      onSuccess: (result) => {
        if (result) {
          queryClient.invalidateQueries({ queryKey: ["projects"] });
          queryClient.invalidateQueries({ queryKey: ["project", result._id] });
          if (result.isRemoved && result._id === projectId) {
            navigate(`/`);
          }
        }
      },
    });

  return {
    updateProjectIndex,
    isUpdatingProjectIndex,
  };
}

export function useGetProjectById(id: string) {
  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project", id],
    queryFn: () => window.project.getProjectById(id),
  });

  return { project, isLoadingProject };
}

export function useGetChatHistoryByProjectId(id: string) {
  const {
    data: chatHistoric,
    isLoading: isLoadingHistory,
    error,
  } = useQuery({
    queryKey: ["project-history", id],
    queryFn: () => window.project.getChatHistoricByProjectId(id),
  });

  return { chatHistoric, isLoadingHistory, error };
}

export function useUpdateProjectModel() {
  const queryClient = useQueryClient();

  const { mutate: updateProjectModel, isPending: isUpdatingProjectModel } =
    useMutation({
      mutationFn: window.project.updateProjectModel,
      onError: (err) => {
        console.error(err);
      },
      onSuccess: (projectUpdated) => {
        if (projectUpdated) {
          queryClient.refetchQueries({
            queryKey: ["project", projectUpdated.id],
          });
        }
      },
    });

  return { updateProjectModel, isUpdatingProjectModel };
}

export function useUpdateProjectLocally() {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const { project } = useGetProjectById(projectId as string);

  const updateProjectLocally = useCallback(
    (projectToSave: Project) => {
      if (project) {
        queryClient.setQueryData(["project", project._id], projectToSave);
      }
    },
    [project, queryClient]
  );

  return { updateProjectLocally };
}

export function useActiveEntityTable() {
  const { projectId } = useParams();
  const { project } = useGetProjectById(projectId as string);
  const [searchParams] = useSearchParams();
  const activeTable = searchParams.get("activeTable");
  const entity = project?.model.entities.find(
    (entity) => entity.id === activeTable
  );

  const getRelation = useCallback(
    (fieldId: string): Edge<DataRelation> | undefined => {
      if (project) {
        const {
          model: { relations },
        } = project;
        return relations.find((relation) => relation.targetHandle === fieldId);
      }
      return undefined;
    },
    [project]
  );

  const fieldsAndRelations = useMemo(() => {
    if (entity) {
      return entity.data.fields.map((field) => {
        const relation = getRelation(field.fieldId as string);
        if (relation) {
          const parentEntity = project?.model.entities.find(
            (entity) => entity.id === relation.source
          );
          return {
            field,
            parentEntity: parentEntity?.data.entityName,
            parentPk: parentEntity?.data.fields.find(
              (field) => field.primaryKey
            )?.name,
          };
        } else {
          return { field, parentEntity: undefined, parentPk: undefined };
        }
      });
    } else {
      return [];
    }
  }, [project, entity]);

  return { entity, fieldsAndRelations };
}

export function useGetRelationWithEntities(): RelationInformations[] {
  const { projectId } = useParams();
  const { project } = useGetProjectById(projectId as string);

  if (project) {
    const {
      model: { relations, entities },
    } = project;
    return relations.map((relation) => {
      const parentEntity = entities.find(
        (entity) => entity.id === relation.source
      )?.data;
      const childrenEntity = entities.find(
        (entity) => entity.id === relation.target
      )?.data;
      const parentField = parentEntity?.fields.find((field) =>
        relation.sourceHandle?.startsWith(field.fieldId as string)
      );
      const childrenField = childrenEntity?.fields.find(
        (field) => field.fieldId === relation.targetHandle
      );
      return {
        relation,
        parentEntity,
        parentField,
        childrenEntity,
        childrenField,
      };
    });
  }

  return [];
}

export function useGenerateApplicationDescription() {
  const {
    mutate: generateApplicationDescription,
    isPending: isGenerateApplicationDescription,
  } = useMutation({
    mutationFn: window.project.generateApplicationDescription,
    onError: (err) => {
      console.error(err);
    },
  });

  return { generateApplicationDescription, isGenerateApplicationDescription };
}

export function useRequestUpdate() {
  const queryClient = useQueryClient();
  const { mutate: requestUpdate, isPending: isGeneratingNewVersion } =
    useMutation({
      mutationFn: window.project.updateProjectCurrentVersion,
      onError: (err) => {
        console.error(err);
      },
      onSuccess: (id) => {
        queryClient.invalidateQueries({
          queryKey: ["project", id],
        });
        queryClient.invalidateQueries({
          queryKey: ["project-history", id],
        });
      },
    });
  return { requestUpdate, isGeneratingNewVersion };
}


export function useReapplyVersion(){
  const queryClient = useQueryClient();
  const { mutate: reapplyVersion, isPending: isReapplyingVersion } =
    useMutation({
      mutationFn: window.project.reapplyVersion,
      onError: (err) => {
        console.error(err);
      },
      onSuccess: (id) => {
        queryClient.invalidateQueries({
          queryKey: ["project", id],
        });
        queryClient.invalidateQueries({
          queryKey: ["project-history", id],
        });
      },
    });
  return { reapplyVersion, isReapplyingVersion };
  
}