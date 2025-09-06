// Users system for managing user creation and soft deletion in Dojo
use starknet::ContractAddress;
use dojo::world::IWorldDispatcher;
use dojo::world::WorldDispatcherTrait;
use dojo::model::ModelTrait;
use crate::models::user::{User, UserTrait, UserCreated};

#[dojo::system]
pub struct Users;

#[dojo::system]
impl Users {
    #[dojo::action]
    pub fn create_user(
        ref self: Users,
        world: IWorldDispatcher,
        address: ContractAddress,
        creation_timestamp: u64,
    ) {
        let user = User::new(address, creation_timestamp, 0, creation_timestamp, true);
        world.set::<User>(user);
        
        // Emit UserCreated event
        world.emit_event(@UserCreated {
            user_id: address,
            address: address,
            timestamp: creation_timestamp,
        });
    }

    #[dojo::action]
    pub fn delete_user(
        ref self: Users,
        world: IWorldDispatcher,
        address: ContractAddress,
    ) {
        let mut user = world.get::<User>(address);
        user.is_active = false;
        world.set::<User>(user);
    }
}
