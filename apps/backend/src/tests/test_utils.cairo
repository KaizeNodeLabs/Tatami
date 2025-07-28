#[cfg(test)]
mod test_utils {
    use dojo::world::{WorldStorage, WorldStorageTrait};
    use dojo_cairo_test::{
        spawn_test_world,
        NamespaceDef, ContractDef, ContractDefTrait,
        TestResource, WorldStorageTestTrait,
    };

    pub use dojo_starter::systems::{
        projects::{projects, IProjectsDispatcher, IProjectsDispatcherTrait},
    };
    use dojo_starter::{models};

    fn namespace_def() -> NamespaceDef {
        let ndef = NamespaceDef {
            namespace: "dojo_starter",
            resources: [
                TestResource::Model(models::project::m_Project::TEST_CLASS_HASH),
                TestResource::Model(models::user::m_User::TEST_CLASS_HASH),
                TestResource::Contract(projects::TEST_CLASS_HASH),
            ].span(),
        };
        (ndef)
    }

    fn contract_defs() -> Span<ContractDef> {
        [
            ContractDefTrait::new(@"dojo_starter", @"projects")
                .with_writer_of([dojo::utils::bytearray_hash(@"dojo_starter")].span())
        ].span()
    }

    pub fn spawn_world() -> WorldStorage {
        // Initialize test environment
        let ndef = namespace_def();

        // Register the resources.
        let mut world: WorldStorage = spawn_test_world([ndef].span());

        // Ensures permissions and initializations are synced.
        world.sync_perms_and_inits(contract_defs());

        // return the world
        (world)
    }

    pub fn projects_dispatcher(world: WorldStorage) -> IProjectsDispatcher {
        let (contract_address, _) = world.dns(@"projects").unwrap();
        (IProjectsDispatcher{contract_address})
    }
}
