mod tests {
    use super::super::systems::users::Users;
    use super::super::models::user::{User, UserTrait};
    use dojo::world::WorldDispatcher;
    use starknet::ContractAddress;

    #[test]
    fn test_create_user() {
        let world = WorldDispatcher::default();
        let users = Users {};
        let address = ContractAddress::from(1234);
        let creation_timestamp = 1000u64;
        users.create_user(world, address, creation_timestamp);
        let user = world.get::<User>(address);
        assert(user.address == address, 'Address mismatch');
        assert(user.creation_timestamp == creation_timestamp, 'Timestamp mismatch');
        assert(user.is_active, 'User should be active');
    }

    #[test]
    fn test_delete_user() {
        let world = WorldDispatcher::default();
        let users = Users {};
        let address = ContractAddress::from(5678);
        let creation_timestamp = 2000u64;
        users.create_user(world, address, creation_timestamp);
        users.delete_user(world, address);
        let user = world.get::<User>(address);
        assert(!user.is_active, 'User should be soft deleted');
    }
}
