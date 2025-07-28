mod tests {
    use dojo::model::{ModelStorage};
    use dojo::world::{WorldStorage};
    use dojo_starter::tests::test_utils::{
        spawn_world, projects_dispatcher,
        IProjectsDispatcher, IProjectsDispatcherTrait,
    };
    use dojo_starter::models::{
        project::{Project},
    };

    #[test]
    fn test_create_project() {
        let world: WorldStorage = spawn_world();
        let projects: IProjectsDispatcher = projects_dispatcher(world);

        let project_id: u32 = 123;
        let project_name: felt252 = 'Test Project';
        let project_description: felt252 = 'This is a test project';
        projects.create_project(project_id, project_name, project_description);

        let project: Project = world.read_model(project_id);
        assert_eq!(project.id, project_id, "project id is wrong");
        assert_eq!(project.name, project_name, "project name is wrong");
        assert_eq!(project.description, project_description, "project description is wrong");
    }
}
