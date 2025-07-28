pub mod systems {
    pub mod projects;
    pub mod actions;
}

pub mod models {
    pub mod user;
    pub mod project;
}

#[cfg(test)]
pub mod tests {
    mod test_world;
    mod test_utils;
    mod test_projects;
}
