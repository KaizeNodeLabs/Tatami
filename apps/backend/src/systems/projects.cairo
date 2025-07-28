
// define the interface
#[starknet::interface]
pub trait IProjects<T> {
    fn create_project(ref self: T,
        id: u32,
        name: felt252,
        description: felt252,
    );
    fn delete_project(ref self: T,
        id: u32,
    );
}

// dojo contract
#[dojo::contract]
pub mod projects {
    use super::{IProjects};
    use starknet::{ContractAddress};
    use dojo::model::{ModelStorage};
    use dojo_starter::models::project::{Project, ProjectTrait, ProjectAssert};

    #[abi(embed_v0)]
    impl ProjectsImpl of IProjects<ContractState> {
        fn create_project(ref self: ContractState,
            id: u32,
            name: felt252,
            description: felt252,
        ) {
            let mut world = self.world_default();
            let owner: ContractAddress = starknet::get_caller_address();
            let created_at: u64 = starknet::get_block_timestamp();
            let project: Project = ProjectTrait::new(
                id,
                owner,
                created_at,
                name,
                description,
            );
            world.write_model(@project);
        }

        fn delete_project(ref self: ContractState,
            id: u32,
        ) {
            let mut world = self.world_default();
            // read project model
            let mut project: Project = world.read_model(id);
            // check if caller is owner
            let caller: ContractAddress = starknet::get_caller_address();
            project.assert_owner(caller);
            // delete project
            project.delete();
            world.write_model(@project);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"dojo_starter")
        }
    }
}
