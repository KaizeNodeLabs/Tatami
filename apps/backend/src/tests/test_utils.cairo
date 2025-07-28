#[cfg(test)]
pub mod test_utils {
    use starknet::{ContractAddress, testing};
    use dojo::world::{
        WorldStorage, WorldStorageTrait, IWorldDispatcherTrait,
    };
    use dojo_cairo_test::{
        spawn_test_world,
        NamespaceDef, ContractDef, ContractDefTrait,
        TestResource, WorldStorageTestTrait,
    };

    pub use dojo_starter::systems::{
        projects::{projects, IProjectsDispatcher, IProjectsDispatcherTrait},
    };
    use dojo_starter::{models};

    // contracts owner
    pub fn OWNER() -> ContractAddress { starknet::contract_address_const::<0x111>() }
    // additional test accounts
    pub fn OTHER() -> ContractAddress { starknet::contract_address_const::<0x222>() }
    pub fn IMPERSONATOR() -> ContractAddress { starknet::contract_address_const::<0x333>() }

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

    //
    // Spawn a tatami test world, including all resources
    //
    pub fn spawn_world() -> WorldStorage {
        // Initialize test environment
        let ndef = namespace_def();

        // Register the resources.
        let mut world: WorldStorage = spawn_test_world([ndef].span());

        // Ensures permissions and initializations are synced.
        world.sync_perms_and_inits(contract_defs());

        // grant ownership to the contracts
        world.dispatcher.grant_owner(selector_from_tag!("dojo_starter-projects"), OWNER());

        // setup initial block
        testing::set_block_number(1);
        testing::set_block_timestamp(1000);

        // impersonate the owner
        impersonate(OWNER());

        // return the world
        (world)
    }

    //
    // Tatami dispatchers
    //
    pub fn projects_dispatcher(world: WorldStorage) -> IProjectsDispatcher {
        let (contract_address, _) = world.dns(@"projects").unwrap();
        (IProjectsDispatcher{contract_address})
    }

    //
    // Test helpers
    //

    // set_contract_address : to define the address of the calling contract,
    // set_account_contract_address : to define the address of the account used for the current transaction.
    pub fn impersonate(address: ContractAddress) {
        testing::set_contract_address(address);             // starknet::get_execution_info().contract_address
        testing::set_account_contract_address(address);     // starknet::get_execution_info().tx_info.account_contract_address
    }
    pub fn get_impersonator() -> ContractAddress {
        (starknet::get_execution_info().tx_info.account_contract_address)
    }

}
