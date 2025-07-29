
// define the interface
#[starknet::interface]
pub trait IActions<T> {
    fn spawn(ref self: T);
}

// dojo decorator
#[dojo::contract]
pub mod actions {
    use super::{IActions};

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn spawn(ref self: ContractState) {
        }
    }


    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// Use the default namespace "dojo_starter". This function is handy since the ByteArray
        /// can't be const.
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"dojo_starter")
        }
    }
}
