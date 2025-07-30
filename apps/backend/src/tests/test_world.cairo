#[cfg(test)]
mod tests {
    use dojo_cairo_test::WorldStorageTestTrait;
    use dojo_cairo_test::{
        spawn_test_world, NamespaceDef, TestResource, ContractDef,
    };

    use dojo_starter::models::position::{Position, m_Position};
    use dojo_starter::models::moves::{Moves, m_Moves};
    use dojo_starter::models::direction::Direction;
    use dojo_starter::models::vec2::Vec2;

    #[test]
    fn test_world_test_set() {
        // Initialize test environment
        let caller = starknet::contract_address_const::<0x0>();
        // Register the resources.
        let mut world = spawn_test_world([NamespaceDef {
            namespace: "dojo_starter",
            resources: [
                TestResource::Model(m_Position::TEST_CLASS_HASH),
                TestResource::Model(m_Moves::TEST_CLASS_HASH),
            ]
                .span(),
        }]
            .span());

        // Test initial position
        let mut position: Position = world.read_model(caller);
        assert(position.vec.x == 0 && position.vec.y == 0, 'initial position wrong');

        // Test write_model_test - create new position with updated values
        let new_position = Position {
            player: caller,
            vec: Vec2 { x: 122, y: 88 },
        };

        world.write_model_test(@new_position);

        let mut position: Position = world.read_model(caller);
        assert(position.vec.y == 88, 'write_value_from_id failed');

        // Test model deletion
        world.erase_model(@position);
        let position: Position = world.read_model(caller);
        assert(position.vec.x == 0 && position.vec.y == 0, 'erase_model failed');
    }
}
