// Starknet import
use starknet::ContractAddress;
use core::num::traits::zero::Zero;


// Event definition for user creation
#[derive(Copy, Drop, Serde)]
#[dojo::event]
pub struct UserCreated {
    #[key]
    pub user_id: ContractAddress,
    pub address: ContractAddress,
    pub timestamp: u64,
}

// Model
#[derive(Copy, Drop, Serde, IntrospectPacked, Debug)]
#[dojo::model]
pub struct User {
    #[key]
    pub address: ContractAddress,
    pub last_activity_timestamp: u64,
    pub projects_created: u32,
    pub creation_timestamp: u64,
    pub is_active: bool,
}

// Traits Implementations
#[generate_trait]
pub impl UserImpl of UserTrait {
    fn new(
        address: ContractAddress,
        last_activity_timestamp: u64,
        projects_created: u32,
        creation_timestamp: u64,
        is_active: bool,
    ) -> User {
        User {
            address,
            last_activity_timestamp,
            projects_created,
            creation_timestamp,
            is_active,
        }
    }

    fn update_activity(ref self: User, current_timestamp: u64) {
        self.last_activity_timestamp = current_timestamp;
        self.is_active = true;
    }

    fn increment_projects_created(ref self: User) {
        self.projects_created += 1;
    }

    fn deactivate(ref self: User) {
        self.is_active = false;
    }

    fn activate(ref self: User) {
        self.is_active = true;
    }

    fn get_days_since_creation(self: @User, current_timestamp: u64) -> u64 {
        let creation_time = *self.creation_timestamp;
        let days_diff = (current_timestamp - creation_time) / 86400; // 86400 seconds in a day
        days_diff
    }

    fn get_days_since_last_activity(self: @User, current_timestamp: u64) -> u64 {
        let last_activity = *self.last_activity_timestamp;
        let days_diff = (current_timestamp - last_activity) / 86400; // 86400 seconds in a day
        days_diff
    }
}

#[generate_trait]
pub impl UserAssert of AssertTrait {
    #[inline(always)]
    fn assert_exists(self: User) {
        assert(self.is_non_zero(), 'User: Does not exist');
    }

    #[inline(always)]
    fn assert_not_exists(self: User) {
        assert(self.is_zero(), 'User: Already exist');
    }
}

pub impl ZeroableUserTrait of Zero<User> {
    #[inline(always)]
    fn zero() -> User {
        User {
            address: starknet::contract_address_const::<0x0>(),
            last_activity_timestamp: 0,
            projects_created: 0,
            creation_timestamp: 0,
            is_active: false,
        }
    }

    #[inline(always)]
    fn is_zero(self: @User) -> bool {
       *self.address == starknet::contract_address_const::<0x0>()
    }

    #[inline(always)]
    fn is_non_zero(self: @User) -> bool {
        !self.is_zero()
    }
}

// Tests
#[cfg(test)]
mod tests {
    use super::{User, ZeroableUserTrait, UserImpl, UserTrait};
    use starknet::{ContractAddress, contract_address_const};

    #[test]
    #[available_gas(1000000)]
    fn test_user_new_constructor() {
        // Use contract_address_const to create a mock address
        let mock_address: ContractAddress = contract_address_const::<0x123>();
        let current_timestamp: u64 = 1640995200; // Example timestamp
        
        // Test the new constructor
        let user = UserTrait::new(
            mock_address,
            current_timestamp,  // last_activity_timestamp
            5,                  // projects_created
            current_timestamp,  // creation_timestamp
            true,               // is_active
        );

        assert_eq!(
            user.address, 
            mock_address, 
            "User address should match the initialized address"
        );
        assert_eq!(user.last_activity_timestamp, current_timestamp, "Last activity timestamp should match");
        assert_eq!(user.projects_created, 5, "Projects created should be initialized to 5");
        assert_eq!(user.creation_timestamp, current_timestamp, "Creation timestamp should match");
        assert_eq!(user.is_active, true, "User should be active");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_user_initialization() {
        // Use contract_address_const to create a mock address
        let mock_address: ContractAddress = contract_address_const::<0x123>();
        let timestamp: u64 = 1640995200;

        let user = User {
            address: mock_address,
            last_activity_timestamp: timestamp,
            projects_created: 0,
            creation_timestamp: timestamp,
            is_active: true,
        };

        assert_eq!(
            user.address, 
            mock_address, 
            "User address should match the initialized address"
        );
        assert_eq!(
            user.projects_created, 
            0, 
            "Initial projects created should be 0"
        );
        assert_eq!(
            user.is_active, 
            true, 
            "User should be active"
        );
    }

    #[test]
    #[available_gas(1000000)]
    fn test_user_zero_values() {
        let user: User = ZeroableUserTrait::zero();

        assert_eq!(
            user.address, 
            starknet::contract_address_const::<0x0>(), 
            "User address should match the zero address"
        );
        assert_eq!(
            user.projects_created, 
            0, 
            "Zero user projects created should be 0"
        );
        assert_eq!(
            user.is_active, 
            false, 
            "Zero user should be inactive"
        );
    }

    #[test]
    #[available_gas(1000000)]
    fn test_user_update_activity() {
        let mock_address: ContractAddress = contract_address_const::<0x123>();
        let initial_timestamp: u64 = 1640995200;
        let new_timestamp: u64 = 1641081600; // 1 day later
        
        // Use the constructor instead of direct initialization
        let mut user = UserTrait::new(
            mock_address,
            initial_timestamp,  // last_activity_timestamp
            0,                  // projects_created
            initial_timestamp,  // creation_timestamp
            false,              // is_active
        );

        user.update_activity(new_timestamp);
        assert_eq!(
            user.last_activity_timestamp, 
            new_timestamp, 
            "Last activity timestamp should be updated"
        );
        assert_eq!(
            user.is_active, 
            true, 
            "User should be active after updating activity"
        );
    }

    #[test]
    #[available_gas(1000000)]
    fn test_user_increment_projects_created() {
        let mock_address: ContractAddress = contract_address_const::<0x123>();
        let timestamp: u64 = 1640995200;
        
        // Use the constructor instead of direct initialization
        let mut user = UserTrait::new(
            mock_address,
            timestamp,  // last_activity_timestamp
            0,          // projects_created
            timestamp,  // creation_timestamp
            true,       // is_active
        );

        user.increment_projects_created();
        assert_eq!(
            user.projects_created, 
            1, 
            "User should have 1 project after incrementing"
        );

        user.increment_projects_created();
        assert_eq!(
            user.projects_created, 
            2, 
            "User should have 2 projects after incrementing again"
        );
    }

    #[test]
    #[available_gas(1000000)]
    fn test_user_activation_deactivation() {
        let mock_address: ContractAddress = contract_address_const::<0x123>();
        let timestamp: u64 = 1640995200;
        
        // Use the constructor instead of direct initialization
        let mut user = UserTrait::new(
            mock_address,
            timestamp,  // last_activity_timestamp
            0,          // projects_created
            timestamp,  // creation_timestamp
            true,       // is_active
        );

        user.deactivate();
        assert_eq!(
            user.is_active, 
            false, 
            "User should be inactive after deactivation"
        );

        user.activate();
        assert_eq!(
            user.is_active, 
            true, 
            "User should be active after activation"
        );
    }

    #[test]
    #[available_gas(1000000)]
    fn test_user_get_days_since_creation() {
        let mock_address: ContractAddress = contract_address_const::<0x123>();
        let creation_timestamp: u64 = 1640995200; // Jan 1, 2022
        let current_timestamp: u64 = 1643673600;  // Feb 1, 2022 (31 days later)
        
        let user = UserTrait::new(
            mock_address,
            creation_timestamp,  // last_activity_timestamp
            0,                   // projects_created
            creation_timestamp,  // creation_timestamp
            true,                // is_active
        );

        let days_since_creation = user.get_days_since_creation(current_timestamp);
        assert_eq!(
            days_since_creation, 
            31, 
            "Should be 31 days since creation"
        );
    }

    #[test]
    #[available_gas(1000000)]
    fn test_user_get_days_since_last_activity() {
        let mock_address: ContractAddress = contract_address_const::<0x123>();
        let last_activity: u64 = 1640995200; // Jan 1, 2022
        let current_timestamp: u64 = 1643673600; // Feb 1, 2022 (31 days later)
        
        let user = UserTrait::new(
            mock_address,
            last_activity,       // last_activity_timestamp
            0,                   // projects_created
            last_activity,       // creation_timestamp
            true,                // is_active
        );

        let days_since_activity = user.get_days_since_last_activity(current_timestamp);
        assert_eq!(
            days_since_activity, 
            31, 
            "Should be 31 days since last activity"
        );
    }

    #[test]
    #[available_gas(1000000)]
    fn test_user_complex_scenario() {
        let mock_address: ContractAddress = contract_address_const::<0x789>();
        let creation_timestamp: u64 = 1640995200; // Jan 1, 2022
        let activity_timestamp: u64 = 1643673600; // Feb 1, 2022
        
        // Initialize user with some starting values
        let mut user = UserTrait::new(
            mock_address,
            creation_timestamp,  // last_activity_timestamp
            2,                   // projects_created
            creation_timestamp,  // creation_timestamp
            true,                // is_active
        );
        
        // Simulate user activity
        user.update_activity(activity_timestamp);  // Update last activity
        user.increment_projects_created();          // Create a new project
        user.increment_projects_created();          // Create another project
        
        // Verify final state
        assert_eq!(user.last_activity_timestamp, activity_timestamp, "Last activity should be updated");
        assert_eq!(user.projects_created, 4, "User should have 4 projects total");
        assert_eq!(user.is_active, true, "User should be active");
        assert_eq!(user.creation_timestamp, creation_timestamp, "Creation timestamp should remain unchanged");
        
        // Test deactivation
        user.deactivate();
        assert_eq!(user.is_active, false, "User should be inactive after deactivation");
    }
}
