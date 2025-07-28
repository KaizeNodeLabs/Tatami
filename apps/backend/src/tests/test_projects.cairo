mod tests {
    use dojo::model::{ModelStorage};
    use dojo::world::{WorldStorage};
    use dojo_starter::tests::test_utils::test_utils::{
        spawn_world,
        projects_dispatcher, impersonate,
        OWNER, IMPERSONATOR,
        IProjectsDispatcher, IProjectsDispatcherTrait,
    };
    use dojo_starter::models::{
        project::{Project, ProjectTrait},
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
        assert!(project.is_active, "project should be active");
        assert_eq!(project.id, project_id, "project id is wrong");
        assert_eq!(project.name, project_name, "project name is wrong");
        assert_eq!(project.description, project_description, "project description is wrong");
        assert_gt!(project.created_at, 0, "project should have a creation timestamp");
    }

    #[test]
    fn test_delete_project() {
        let world: WorldStorage = spawn_world();
        let projects: IProjectsDispatcher = projects_dispatcher(world);

        let project_id: u32 = 123;

        // non-existing project
        let project: Project = world.read_model(project_id);
        assert!(!project.exists(), "project should not exist (not created yet)");

        // create project
        impersonate(OWNER());
        projects.create_project(project_id, 'Test Project', 'This is a test project');
        let project: Project = world.read_model(project_id);
        assert!(project.exists(), "project should exist (just created)");

        // delete project
        impersonate(OWNER());
        projects.delete_project(project_id);
        let project: Project = world.read_model(project_id);
        assert!(!project.exists(), "project should not exist (deleted)");
    }

    #[test]
    #[should_panic(expected:('Project: Not the owner', 'ENTRYPOINT_FAILED'))]
    fn test_delete_project_not_owner() {
        let world: WorldStorage = spawn_world();
        let projects: IProjectsDispatcher = projects_dispatcher(world);

        let project_id: u32 = 123;

        // create a project
        impersonate(OWNER());
        projects.create_project(project_id, 'Test Project', 'This is a test project');

        // delete project (should fail)
        impersonate(IMPERSONATOR());
        projects.delete_project(project_id);
    }}
