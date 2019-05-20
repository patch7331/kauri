use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub enum DistanceUnit {
    Millimetres,
    Centimetres,
    Metres,
    Inches,
    Points,
    Picas,
    Pixels,
}
