use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct PositionCount {
    #[key]
    pub identity: ContractAddress,
    pub position: Span<(u8, u128)>,
} 