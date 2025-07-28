// Starknet imports
use starknet::ContractAddress;
use core::num::traits::zero::Zero;

// Constants
const SECONDS_PER_DAY: u64 = 86400;
const MAX_PROJECT_NAME_LENGTH: u32 = 64;
const MAX_PROJECT_DESCRIPTION_LENGTH: u32 = 256;

/// Project model for tracking user-created projects and their metadata
#[derive(Copy, Drop, Serde, Introspect, Debug)]
#[dojo::model]
pub struct Project {
    #[key]
    pub id: u32,
    pub owner: ContractAddress,
    pub models_count: u32,
    pub systems_count: u32,
    pub created_at: u64,
    pub name: felt252,
    pub description: felt252,
    pub is_active: bool,
}

// Trait Implementations
#[generate_trait]
pub impl ProjectImpl of ProjectTrait {
    // Creates a new project instance
    fn new(
        id: u32,
        owner: ContractAddress,
        created_at: u64,
        name: felt252,
        description: felt252,
    ) -> Project {
        Project {
            id,
            owner,
            models_count: 0,
            systems_count: 0,
            created_at,
            name,
            description,
            is_active: true,
        }
    }

    // Increments the models count for this project
    fn add_model(ref self: Project) {
        self.models_count += 1;
    }

    // Increments the systems count for this project
    fn add_system(ref self: Project) {
        self.systems_count += 1;
    }

    // Decrements the models count for this project
    fn remove_model(ref self: Project) {
        if self.models_count > 0 {
            self.models_count -= 1;
        }
    }

    // Decrements the systems count for this project
    fn remove_system(ref self: Project) {
        if self.systems_count > 0 {
            self.systems_count -= 1;
        }
    }

    // Updates project metadata (name and description)
    fn update_metadata(ref self: Project, name: felt252, description: felt252) {
        self.name = name;
        self.description = description;
    }

    // Deactivates the project
    fn deactivate(ref self: Project) {
        self.is_active = false;
    }

    // Reactivates the project
    fn activate(ref self: Project) {
        self.is_active = true;
    }

    // Calculates the number of days since project creation
    fn get_days_since_creation(self: @Project, current_timestamp: u64) -> u64 {
        let creation_time = *self.created_at;
        // Validate timestamp ordering - FIXED: Shorter error message
        assert(current_timestamp >= creation_time, 'Invalid timestamp');
        let days_diff = (current_timestamp - creation_time) / SECONDS_PER_DAY;
        days_diff
    }

    // Gets the total number of components (models + systems)
    fn get_total_components(self: @Project) -> u32 {
        *self.models_count + *self.systems_count
    }

    // Checks if project is considered empty (no components)
    fn is_empty(self: @Project) -> bool {
        *self.models_count == 0 && *self.systems_count == 0
    }

    // Checks if project is owned by the specified address
    fn is_owned_by(self: @Project, address: ContractAddress) -> bool {
        *self.owner == address
    }

    // Checks if project is considered mature (created more than X days ago)
    fn is_mature_project(self: @Project, current_timestamp: u64, maturity_threshold_days: u64) -> bool {
        let days_since_creation = self.get_days_since_creation(current_timestamp);
        days_since_creation >= maturity_threshold_days
    }
}

// Assertion trait for project validation
#[generate_trait]
pub impl ProjectAssert of AssertTrait {
    // Asserts that the project exists (is not zero)
    #[inline(always)]
    fn assert_exists(self: Project) {
        assert(self.is_non_zero(), 'Project: Does not exist');
    }

    // Asserts that the project does not exist (is zero)
    #[inline(always)]
    fn assert_not_exists(self: Project) {
        assert(self.is_zero(), 'Project: Already exists');
    }

    // Asserts that the address owns the project
    #[inline(always)]
    fn assert_owner(self: Project, address: ContractAddress) {
        assert(self.is_owned_by(address), 'Project: Not the owner');
    }

    // Asserts that the project is active
    #[inline(always)]
    fn assert_active(self: Project) {
        assert(self.is_active, 'Project: Not active');
    }
}

// Zero pattern implementation for Project
pub impl ZeroableProjectTrait of Zero<Project> {
    // Returns a zero/empty project instance
    #[inline(always)]
    fn zero() -> Project {
        Project {
            id: 0,
            owner: starknet::contract_address_const::<0x0>(),
            models_count: 0,
            systems_count: 0,
            created_at: 0,
            name: 0,
            description: 0,
            is_active: false,
        }
    }

    // Checks if the project is zero/empty
    #[inline(always)]
    fn is_zero(self: @Project) -> bool {
        *self.id == 0 && *self.owner == starknet::contract_address_const::<0x0>()
    }

    // Checks if the project is not zero/empty
    #[inline(always)]
    fn is_non_zero(self: @Project) -> bool {
        !self.is_zero()
    }
}

// Unit Tests
#[cfg(test)]
mod tests {
    use super::{Project, ZeroableProjectTrait, ProjectImpl, ProjectTrait, ProjectAssert, AssertTrait};
    use starknet::{ContractAddress, contract_address_const};

    // Test helper function to create a mock address
    fn mock_address() -> ContractAddress {
        contract_address_const::<0x123>()
    }

    #[test]
    #[available_gas(1000000)]
    fn test_project_new_constructor() {
        let project_id: u32 = 1;
        let owner_address = mock_address();
        let creation_timestamp: u64 = 1640995200; // Example timestamp
        let project_name: felt252 = 'TestProject';
        let project_desc: felt252 = 'Test description';
        
        let project = ProjectTrait::new(
            project_id,
            owner_address,
            creation_timestamp,
            project_name,
            project_desc,
        );

        assert_eq!(project.id, project_id, "Project ID should match");
        assert_eq!(project.owner, owner_address, "Owner should match");
        assert_eq!(project.models_count, 0, "Initial models count should be 0");
        assert_eq!(project.systems_count, 0, "Initial systems count should be 0");
        assert_eq!(project.created_at, creation_timestamp, "Creation timestamp should match");
        assert_eq!(project.name, project_name, "Project name should match");
        assert_eq!(project.description, project_desc, "Project description should match");
        assert_eq!(project.is_active, true, "Project should be active by default");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_project_zero_values() {
        let project: Project = ZeroableProjectTrait::zero();

        assert_eq!(project.id, 0, "Zero project ID should be 0");
        assert_eq!(
            project.owner, 
            starknet::contract_address_const::<0x0>(), 
            "Zero project owner should be zero address"
        );
        assert_eq!(project.models_count, 0, "Zero project models count should be 0");
        assert_eq!(project.systems_count, 0, "Zero project systems count should be 0");
        assert_eq!(project.created_at, 0, "Zero project creation timestamp should be 0");
        assert_eq!(project.name, 0, "Zero project name should be 0");
        assert_eq!(project.description, 0, "Zero project description should be 0");
        assert_eq!(project.is_active, false, "Zero project should be inactive");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_project_is_zero_detection() {
        let zero_project = ZeroableProjectTrait::zero();
        let non_zero_project = ProjectTrait::new(1, mock_address(), 1640995200, 'Test', 'Description');

        assert_eq!(zero_project.is_zero(), true, "Zero project should be detected as zero");
        assert_eq!(zero_project.is_non_zero(), false, "Zero project should not be non-zero");
        assert_eq!(non_zero_project.is_zero(), false, "Non-zero project should not be zero");
        assert_eq!(non_zero_project.is_non_zero(), true, "Non-zero project should be non-zero");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_project_add_components() {
        let mut project = ProjectTrait::new(1, mock_address(), 1640995200, 'Test', 'Description');

        // Test adding models
        project.add_model();
        assert_eq!(project.models_count, 1, "Models count should be 1");
        
        project.add_model();
        assert_eq!(project.models_count, 2, "Models count should be 2");

        // Test adding systems
        project.add_system();
        assert_eq!(project.systems_count, 1, "Systems count should be 1");
        
        project.add_system();
        project.add_system();
        assert_eq!(project.systems_count, 3, "Systems count should be 3");

        // Test total components
        assert_eq!(project.get_total_components(), 5, "Total should be 5");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_project_remove_components() {
        let mut project = ProjectTrait::new(1, mock_address(), 1640995200, 'Test', 'Description');
        
        // Add some components first
        project.add_model();
        project.add_model();
        project.add_system();
        project.add_system();
        project.add_system();

        // Test removing models
        project.remove_model();
        assert_eq!(project.models_count, 1, "Models count should be 1");

        // Test removing systems
        project.remove_system();
        project.remove_system();
        assert_eq!(project.systems_count, 1, "Systems count should be 1");

        // Test underflow protection
        project.remove_model(); // Should bring models_count to 0
        project.remove_model(); // Should not underflow
        assert_eq!(project.models_count, 0, "Should not underflow");

        project.remove_system(); // Should bring systems_count to 0
        project.remove_system(); // Should not underflow
        assert_eq!(project.systems_count, 0, "Should not underflow");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_project_update_metadata() {
        let mut project = ProjectTrait::new(1, mock_address(), 1640995200, 'OldName', 'OldDescription');
        
        let new_name: felt252 = 'NewProjectName';
        let new_description: felt252 = 'NewDescription';

        project.update_metadata(new_name, new_description);

        assert_eq!(project.name, new_name, "Name should be updated");
        assert_eq!(project.description, new_description, "Description should be updated");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_project_activation_deactivation() {
        let mut project = ProjectTrait::new(1, mock_address(), 1640995200, 'Test', 'Description');

        // Project should be active by default
        assert_eq!(project.is_active, true, "Should be active by default");

        // Test deactivation
        project.deactivate();
        assert_eq!(project.is_active, false, "Should be inactive");

        // Test reactivation
        project.activate();
        assert_eq!(project.is_active, true, "Should be active");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_project_get_days_since_creation() {
        let creation_timestamp: u64 = 1640995200; // Jan 1, 2022
        let current_timestamp: u64 = 1643673600;  // Feb 1, 2022 (31 days later)
        
        let project = ProjectTrait::new(1, mock_address(), creation_timestamp, 'Test', 'Description');

        let days_since_creation = project.get_days_since_creation(current_timestamp);
        assert_eq!(days_since_creation, 31, "Should be 31 days");
    }

    #[test]
    #[available_gas(1000000)]
    fn test_project_utility_methods() {
        let owner_address = mock_address();
        // FIXED: Remove unused variable
        let mut project = ProjectTrait::new(1, owner_address, 1640995200, 'Test', 'Description');

        // Test ownership check
        assert_eq!(project.is_owned_by(owner_address), true, "Should recognize owner");

        // Test empty project check
        assert_eq!(project.is_empty(), true, "Should be empty initially");
        
        project.add_model();
        assert_eq!(project.is_empty(), false, "Should not be empty");

        // Test maturity check
        let current_timestamp = 1640995200 + (86400 * 10); // 10 days later
        assert_eq!(
            project.is_mature_project(current_timestamp, 5), 
            true, 
            "Should be mature"
        );
        assert_eq!(
            project.is_mature_project(current_timestamp, 15), 
            false, 
            "Should not be mature"
        );
    }

    #[test]
    #[available_gas(1000000)]
    fn test_project_assertions() {
        let owner_address = mock_address();
        let project = ProjectTrait::new(1, owner_address, 1640995200, 'Test', 'Description');
        let zero_project = ZeroableProjectTrait::zero();

        // Test existence assertions
        project.assert_exists(); // Should not panic
        zero_project.assert_not_exists(); // Should not panic

        // Test owner assertion
        project.assert_owner(owner_address); // Should not panic

        // Test active assertion
        project.assert_active(); // Should not panic
    }

    #[test]
    #[available_gas(1000000)]
    fn test_project_complex_scenario() {
        let owner_address = mock_address();
        let creation_timestamp: u64 = 1640995200; // Jan 1, 2022
        let current_timestamp: u64 = 1643673600;  // Feb 1, 2022 (31 days later)
        
        // Create project
        let mut project = ProjectTrait::new(
            42,
            owner_address,
            creation_timestamp,
            'DemoProject',
            'DemoDescription',
        );
        
        // Simulate development activity
        project.add_model();        // Add User model
        project.add_model();        // Add Project model
        project.add_system();       // Add CreateUser system
        project.add_system();       // Add CreateProject system
        project.add_system();       // Add UpdateProject system
        
        // Update project metadata
        project.update_metadata('DemoProjectV2', 'UpdatedDescription');
        
        // Verify final state
        assert_eq!(project.id, 42, "ID should remain unchanged");
        assert_eq!(project.owner, owner_address, "Owner should remain unchanged");
        assert_eq!(project.models_count, 2, "Should have 2 models");
        assert_eq!(project.systems_count, 3, "Should have 3 systems");
        assert_eq!(project.get_total_components(), 5, "Should have 5 total");
        assert_eq!(project.name, 'DemoProjectV2', "Name should be updated");
        assert_eq!(project.description, 'UpdatedDescription', "Description updated");
        assert_eq!(project.is_active, true, "Should remain active");
        assert_eq!(project.is_empty(), false, "Should not be empty");
        
        // Test time-based calculations
        let days_since_creation = project.get_days_since_creation(current_timestamp);
        assert_eq!(days_since_creation, 31, "Should be 31 days");
        
        // Test maturity
        assert_eq!(
            project.is_mature_project(current_timestamp, 30), 
            true, 
            "Should be mature"
        );
        
        // Test ownership
        assert_eq!(project.is_owned_by(owner_address), true, "Should be owned by creator");
        
        // Test deactivation
        project.deactivate();
        assert_eq!(project.is_active, false, "Should be deactivated");
    }

    #[test]
    #[should_panic(expected: ('Invalid timestamp',))]
    #[available_gas(1000000)]
    fn test_project_invalid_timestamp_validation() {
        let creation_timestamp: u64 = 1643673600; // Feb 1, 2022
        let invalid_timestamp: u64 = 1640995200;  // Jan 1, 2022 (earlier than creation)
        
        let project = ProjectTrait::new(1, mock_address(), creation_timestamp, 'Test', 'Description');
        
        // This should panic due to invalid timestamp
        project.get_days_since_creation(invalid_timestamp);
    }
}